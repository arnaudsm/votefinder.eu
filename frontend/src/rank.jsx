import data from "./data";

export const calculateResults = (choices) => {
  let groups = Object.fromEntries(
    Object.keys(data.groups).map((group) => [group, { "+": 0, "-": 0 }]),
  );
  let deputes = Object.fromEntries(
    Object.keys(data.deputes).map((group) => [group, { "+": 0, "-": 0 }]),
  );
  let lists = Object.fromEntries(
    Object.keys(data.lists).map((group) => [group, { "+": 0, "-": 0 }]),
  );

  const apply = (depute_id, choice) => {
    if (!(depute_id in deputes)) return;
    for (const group_id of data.deputes[depute_id].g)
      groups[group_id][choice ? "+" : "-"] += 1;
    lists[data.org_to_list[data.deputes[depute_id].o[0]]][choice ? "+" : "-"] +=
      1;
    deputes[depute_id][choice ? "+" : "-"] += 1;
  };

  for (const [vote_id, choice] of Object.entries(choices)) {
    if (choice == "+") {
      for (const depute_id of data.votes[vote_id].votes?.["0"] || [])
        apply(depute_id, false);
      for (const depute_id of data.votes[vote_id].votes?.["-"] || [])
        apply(depute_id, false);
      for (const depute_id of data.votes[vote_id].votes?.["+"] || [])
        apply(depute_id, true);
    } else if (choice == "-") {
      for (const depute_id of data.votes[vote_id].votes?.["-"] || [])
        apply(depute_id, true);
      for (const depute_id of data.votes[vote_id].votes?.["+"] || [])
        apply(depute_id, false);
    }
  }
  const rank = (x) => {
    let output = [];
    for (const key of Object.keys(x)) {
      output.push([key, x[key]["+"] / (x[key]["-"] + x[key]["+"]) || 0]);
    }
    return output.sort((a, b) => b[1] - a[1]);
  };
  return {
    lists: rank(lists),
    deputes: rank(deputes),
    groups: rank(groups),
  };
};

export const calculateVote = (votes) => {
  let lists = Object.fromEntries(
    Object.keys(data.lists).map((group) => [group, { "+": 0, "-": 0, 0: 0 }]),
  );
  const apply = (depute_id, choice) => {
    if (!(depute_id in data.deputes)) return;
    lists[data.org_to_list[data.deputes[depute_id].o[0]]][choice] += 1;
  };
  for (const choice of ["+", "-", "0"]) {
    for (const depute_id of votes[choice]) {
      apply(depute_id, choice);
    }
  }
  return Object.fromEntries(
    Object.entries(lists).map(([id, results]) => [
      id,
      {
        ...results,
        "+%": results["+"] / (results["+"] + results["-"] + results["0"]),
        "-%": results["-"] / (results["+"] + results["-"] + results["0"]),
      },
    ]),
  );
};
