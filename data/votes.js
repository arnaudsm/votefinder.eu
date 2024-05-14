import fs from "fs";
import zlib from "zlib";
import readline from "readline";
import { deputes } from "./lists.js";

export async function* iterateVotes() {
  const reader = readline.createInterface({
    input: fs.createReadStream("votes.json.gz").pipe(zlib.createGunzip()),
  });
  for await (const line of reader) {
    const vote = JSON.parse(line);
    yield vote;
  }
}

export const getVotes = async () => {
  const output = {};
  const all_votes = {};
  for await (const vote of iterateVotes()) all_votes[vote.vote_id] = vote;

  for (const file of fs.readdirSync("votes")) {
    const vote_id = file.split(".")[0];
    if (!vote_id) throw new ErrorEvent("Missing vote_id");
    const data = JSON.parse(fs.readFileSync(`votes/${file}`, "utf-8"));

    if (data.extra) throw new Error("Ligne de trop dans " + file);
    if (
      [data.title, data.subtitle_1, data.subtitle_2, data.summary_url].some(
        (x) => x != x.trim()
      )
    )
      throw new Error("Espaces en trop dans " + file);

    if (
      [data.title, data.subtitle_1, data.subtitle_2, data.summary_url].some(
        (x) => !x
      )
    )
      throw new Error("Champ manquant dans " + file);

    if (data.title.length < 25)
      throw new Error("Titre trop court dans " + file);
    if (data.title.length > 150)
      throw new Error("Titre trop long dans " + file);

    if (data.subtitle_1.length < 25)
      throw new Error("subtitle_1 trop court dans " + file);
    if (data.subtitle_1.length > 250)
      throw new Error("subtitle_1 trop long dans " + file);

    if (data.subtitle_2.length < 25)
      throw new Error("subtitle_2 trop court dans " + file);
    if (data.subtitle_2.length > 250)
      throw new Error("subtitle_2 trop long dans " + file);

    const vote = all_votes[vote_id];
    if (!vote) throw new Error("vote introuvable");

    // Exporter les votes français uniquement
    vote.votes["0"] =
      vote.votes["0"].filter((mep_id) => mep_id in deputes) || [];
    vote.votes["-"] =
      vote.votes["-"].filter((mep_id) => mep_id in deputes) || [];
    vote.votes["+"] =
      vote.votes["+"].filter((mep_id) => mep_id in deputes) || [];

    const votes = vote.votes;
    const getApproval = (meps) =>
      Math.floor(
        (100 *
          votes["+"]?.filter((x) => !meps || meps.has(x.toString())).length) /
          (votes["0"]?.filter((x) => !meps || meps.has(x.toString())).length +
            votes["+"]?.filter((x) => !meps || meps.has(x.toString())).length +
            votes["-"]?.filter((x) => !meps || meps.has(x.toString())).length)
      );

    if (getApproval() > 96) console.log(file, getApproval());
    const date = vote.date.slice(0, 10);
    delete data["vote_id"];

    output[vote_id] = { ...data, votes, date };
  }
  return output;
};
