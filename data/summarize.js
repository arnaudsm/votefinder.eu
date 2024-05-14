import fs from "fs";
import { parse } from "node-html-parser";
import he from "he";
import "dotenv/config";
import Replicate from "replicate";
import { pRateLimit } from "p-ratelimit";
import { iterateVotes } from "./votes.js";

// Résumer un texte de loi avec LLAMA 3 70B

const limit = pRateLimit({
  interval: 10000,
  rate: 10,
  concurrency: 20,
});

const replicate = new Replicate({});

const prompt = `----------------
Résumes en francais le contenu de cette loi du parlement européen. 
Sois précis et pas trop général. Utilises des mots faciles à comprendre. 
Fais des phrases de moins de 30 mots.
Pas de phrases consensuelles, parles d'actions concrètes. Sois synthétique, ne mentionne pas le parlement ou le type de texte. 

Résumes le texte dans le format JSON suivant:
{
    "titre": "",
    "sous_titre_1": "",
    "sous_titre_2": ""
}

Si la loi parle de budget ou comptabilité, écris juste un objet vide en format JSON:
{}

Ecris dans le même style que ces exemples :
{
    "titre": "Condamner l'aggression Russe en Ukraine",
    "sous_titre_1": "Apporter de l'aide humanitaire aux civils",
    "sous_titre_2": "Geler les actifs des oligarques russes"
}
{
    "titre": "Assouplir la réglementation du glyphosate",
    "sous_titre_1": "Autoriser le pesticide jusqu'en 2026",
    "sous_titre_2": "Mais obliger la transparence des pesticides chimiques"
}
{
    "titre": "Financer les énergies renouvelables",
    "sous_titre_1": "Accorder 2.3 milliards aux solaire et éolien",
    "sous_titre_2": ""
}
{
    "titre": "Établir un droit constitutionnel à l'avortement en Europe ",
    "sous_titre_1": "Protéger les droits sexuels et reproductifs",
    "sous_titre_2": "Etablir un accès universel à l'avortement légal et sûr"
}
`;

const getPage = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  return parse(html);
};

const vote_folder = "votes";

const scrapeProc = async (proc_id) => {
  try {
    const vote = await getText(proc_id);
    if (!vote) return console.log(`TEXTE INTROUVABLE POUR ${proc_id}`);
    const file = `${vote_folder}/${vote.vote_id}.json`;
    if (fs.existsSync(file)) return console.log(`ALREADY EXISTS ${proc_id}`);
    const ai_summary = await summarize(
      `${vote.text_title}\n\n\n${vote.text_full}`
    );
    fs.writeFileSync(
      file,
      JSON.stringify({
        ai_summary,
        ...vote,
      })
    );
    process.stdout.write("=");
  } catch (error) {
    console.log(error);
  }
};

const cleanText = (x) =>
  x
    ? he
        .decode(x)
        .replace(/\s{3,}/g, " ")
        .trim()
    : null;

const getText = async (proc_id) => {
  const proc_url = getProcUrl(proc_id);
  process.stdout.write("1");
  const procedurePage = await getPage(proc_url);
  const parseSummaryFunc = (text) =>
    text
      ? "https://oeil.secure.europarl.europa.eu" +
        text.replace("location.href='", "").slice(0, -1)
      : null;

  const row = Array.from(
    procedurePage.querySelectorAll("#key_events-data .ep-table-row")
  )
    .map((x) => ({
      decison_url: x.querySelector(".externalDocument")?.getAttribute("href"),
      text_url: parseSummaryFunc(
        x?.querySelector("#summary")?.getAttribute("onclick")
      ),
    }))
    .reverse()
    .find((row) => row.text_url && row.decison_url);
  if (!row) return;

  process.stdout.write("2");
  const textPage = await getPage(row.text_url);
  let text_title = cleanText(
    textPage.querySelector("#website-body .ep-a_heading").innerText
  );
  let text_full = cleanText(
    Array.from(textPage.querySelectorAll("#website-body .ep-m_product"))[1]
      .innerText.replaceAll("\n\n", "\r")
      .replaceAll("\n", " ")
      .replaceAll("\r", "\n\n")
  );

  process.stdout.write("3");
  const decision_page = await getPage(row.decison_url);
  const doc_id = Array.from(decision_page.querySelectorAll(".ring_step_title"))
    ?.find((x) => x?.innerText == "Textes déposés :")
    ?.parentNode?.querySelector("a")?.innerText;

  const vote = doc2vote[doc_id] || doc2vote[doc_id.replace("RC-", "")];
  if (!vote) return;
  return {
    ...vote,
    proc_url,
    text_url: row.text_url,
    decision_url: row.decison_url,
    text_title,
    text_full,
  };
};

const summarize = async (full_text) => {
  const req = await replicate.run("meta/meta-llama-3-70b-instruct", {
    input: { prompt: `${full_text}\n\n${prompt}` },
  });
  const raw = req.join("");
  const summary = JSON.parse(raw.slice(raw.indexOf("{"), raw.indexOf("}") + 1));
  if (
    Object.keys(summary).toString() != "titre,sous_titre_1,sous_titre_2" &&
    Object.keys(summary).length !== 0
  )
    throw new Error("Bad summary format");
  return summary;
};

const getProcUrl = (epref) =>
  `https://oeil.secure.europarl.europa.eu/oeil/popups/ficheprocedure.do?reference=${epref}&l=fr`;

const votes_todo = [];
const procedures_todo = [];

const procedures = new Set(procedures_todo);
const doc2vote = {};
for await (const row of iterateVotes()) {
  doc2vote[row.doc_id] = row;
  if (!votes_todo.includes(row.vote_id)) continue;
  procedures.add(row.proc_id);
}

await Promise.all(
  [...procedures].map((proc_id) => limit(() => scrapeProc(proc_id)))
);
