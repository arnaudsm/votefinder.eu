import fs from "fs";
import zlib from "zlib";
import readline from "readline";

export async function* iterateVotes() {
  const reader = readline.createInterface({
    input: fs.createReadStream("vote_stats.json.gz").pipe(zlib.createGunzip()),
  });
  for await (const line of reader) {
    const vote = JSON.parse(line);
    yield vote;
  }
}
