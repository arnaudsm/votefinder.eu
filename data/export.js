import fs from "fs";
import { getVotes } from "./votes.js";
import {
  lists,
  org_to_list,
  groups,
  deputes,
  procedureTypes,
} from "./lists.js";

const dataset = {
  votes: await getVotes(),
  groups,
  lists,
  org_to_list,
  deputes,
  procedureTypes,
};

fs.writeFileSync("../frontend/src/data.json", JSON.stringify(dataset));
console.log("✅ Données exportées");
