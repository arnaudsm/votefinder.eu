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
    const [title, subtitle_1, subtitle_2, url, extra] = fs
      .readFileSync(`votes/${file}`, "utf-8")
      .split("\n");

    if (extra) throw new Error("Ligne de trop dans " + file);

    if ([title, subtitle_1, subtitle_2, url].some((x) => x != x.trim()))
      throw new Error("Espaces en trop dans " + file);

    if ([title, subtitle_1, subtitle_2, url].some((x) => !x))
      throw new Error("Champ manquant dans " + file);

    if (title.length < 25) throw new Error("Titre trop court dans " + file);
    if (title.length > 150) throw new Error("Titre trop long dans " + file);

    if (subtitle_1.length < 25)
      throw new Error("subtitle_1 trop court dans " + file);
    if (subtitle_1.length > 250)
      throw new Error("subtitle_1 trop long dans " + file);

    if (subtitle_2.length < 25)
      throw new Error("subtitle_2 trop court dans " + file);
    if (subtitle_2.length > 250)
      throw new Error("subtitle_2 trop long dans " + file);

    if (subtitle_1.slice(0, 2) != "- ")
      throw new Error("subtitle_1 manque un tiret dans" + file);

    if (subtitle_2.slice(0, 2) != "- ")
      throw new Error("subtitle_2 manque un tiret dans" + file);

    const vote = all_votes[vote_id];
    if (!vote) throw new Error("vote introuvable");

    if (
      vote.votes["0"].filter((mep_id) => mep_id in deputes).length == 0 &&
      vote.votes["-"].filter((mep_id) => mep_id in deputes).length == 0
    )
      throw new Error("Unanimité dans " + file);

    output[vote_id] = {
      ...vote,
      title,
      subtitle_1: subtitle_1.slice(2),
      subtitle_2: subtitle_2.slice(2),
      url,
    };
  }
  return output;
};
