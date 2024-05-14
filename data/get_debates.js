import fs from "fs";
import { parse } from "node-html-parser";
import "dotenv/config";
import { pRateLimit } from "p-ratelimit";
import { getVotes } from "./votes.js";

const limit = pRateLimit({
  interval: 10000,
  rate: 10,
  concurrency: 20,
});

const getPage = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  return parse(html);
};

const vote_folder = "debates";

const scrape = async (vote) => {
  try {
    if (!vote) return;

    const file = `${vote_folder}/${vote.vote_id}.json`;
    if (fs.existsSync(file)) return console.log(`ALREADY EXISTS`);
    const [id, year] = vote.doc_id.split("-").at(-1).split("/");
    const prefix = vote.doc_id.startsWith("A9-")
      ? "A-9"
      : vote.doc_id.startsWith("B9")
      ? "B-9"
      : vote.doc_id.startsWith("RC-B9-")
      ? "RC-9"
      : null;
    const doc_id = `${prefix}-${year}-${id}`;
    const url = `https://www.europarl.europa.eu/doceo/document/${doc_id}_FR.html`;
    console.log(url);
    process.stdout.write(".");
    const document = await getPage(url);

    let debat_url = Array.from(
      Array.from(document.querySelectorAll(".doceo-ring-steps-step-label"))
        .find((x) => x?.innerText?.trim() == "Débats :")
        ?.parentNode.querySelectorAll("a") || []
    )
      .reverse()
      .find((x) => x?.innerText?.trim().startsWith("CRE"))
      ?.getAttribute("href");

    let explications_url = Array.from(document.querySelectorAll("a"))
      .reverse()
      .find((x) => x?.innerText?.trim() == "Explications de votes")
      ?.getAttribute("href");
    if (explications_url)
      explications_url = `https://www-europarl-europa-eu.translate.goog${explications_url}?_x_tr_sl=auto&_x_tr_tl=fr&_x_tr_hl=fr&_x_tr_pto=wapp`;
    if (debat_url)
      debat_url = `https://www-europarl-europa-eu.translate.goog${debat_url}?_x_tr_sl=auto&_x_tr_tl=fr&_x_tr_hl=fr&_x_tr_pto=wapp`;

    fs.writeFileSync(file, JSON.stringify({ explications_url, debat_url }));
    process.stdout.write("=");
  } catch (error) {
    console.log(error);
  }
};

const votes = await getVotes();

await Promise.all(
  Object.values(votes).map((vote) => limit(() => scrape(vote)))
);
