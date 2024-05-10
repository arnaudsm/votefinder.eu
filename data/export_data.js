import fs from "fs";
import zlib from "zlib";
import readline from "readline";

/*
Certaines données hardcodées ici viennent de
https://data.europarl.europa.eu/en/developer-corner/opendata-api
*/

const getVotes = async () => {
  const output = {};

  let voteStats = readline.createInterface({
    input: fs.createReadStream("vote_stats.json.gz").pipe(zlib.createGunzip()),
  });
  const all_votes = {};
  for await (const line of voteStats) {
    const vote = JSON.parse(line);
    all_votes[vote.vote_id] = vote;
  }

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

    if (!all_votes[vote_id]) throw new Error("vote_id introuvable");
    output[vote_id] = {
      ...all_votes[vote_id],
      title,
      subtitle_1: subtitle_1.slice(2),
      subtitle_2: subtitle_2.slice(2),
      url,
    };
  }
  return output;
};

const votes = await getVotes();

const lists = {
  "new-0": {
    label: "Besoin d’Europe",
    leader: "Valérie Hayer",
  },
  "new-1": {
    label: "Rassemblement national",
    leader: "Jordan Bardella",
  },
  "new-2": {
    label: "Europe Écologie",
    leader: "Marie Toussaint",
  },
  "new-3": {
    label: "Les Républicains",
    leader: "François-Xavier Bellamy",
  },
  "new-4": {
    label: "La France insoumise",
    leader: "Manon Aubry",
  },
  "new-5": {
    label: "Réveiller l'Europe",
    leader: "Raphaël Glucksmann",
  },
  "new-6": {
    label: "Europe Territoires Écologie",
    leader: "Guillaume Lacroix",
  },
  "new-7": {
    label: "La gauche unie pour le monde du travail",
    leader: "Léon Deffontaines",
  },
  "new-8": {
    label: "Changer l'Europe",
    leader: "Pierre Larrouturou",
  },
  "new-9": {
    label: "La France fière",
    leader: "Marion Maréchal",
  },
};

// Plusieurs partis peuvent concourir sous la même liste
// Attention, les partis changent souvent de nom avec les années
const org_to_list = {
  6442: "new-0", // Renaissance                        -> Besoin d’Europe
  5582: "new-6", // Régions et Peuples Solidaires      -> Europe Territoires Écologie
  6413: "new-9", // Reconquête!                        -> La France fière
  5494: "new-1", // Rassemblement national             -> Rassemblement national
  5714: "new-5", // Place publique                     -> Réveiller l'Europe
  5227: "new-5", // Parti socialiste                   -> Réveiller l'Europe
  5474: "new-6", // Parti Radical                      -> Europe Territoires Écologie
  5585: "new-8", // Nouvelle Donne                     -> Changer l'Europe
  5427: "new-0", // Mouvement Démocrate                -> Besoin d’Europe
  5502: "new-0", // Liste Renaissance                  -> Besoin d’Europe
  6441: "new-0", // LISTE L'EUROPE ENSEMBLE            -> Besoin d’Europe
  5441: "new-3", // Les Républicains                   -> Les Républicains
  5468: "new-0", // La République en marche            -> Besoin d’Europe
  5523: "new-4", // La France Insoumise                -> La France insoumise
  6430: "new-0", // Horizons                           -> Besoin d’Europe
  6049: "new-7", // Gauche républicaine et socialiste  -> La gauche unie pour le monde du travail
  5225: "new-2", // Europe Écologie                    -> Europe Écologie
};

const groups = {
  5148: "Conservateurs et Réformistes Européens",
  5153: "Parti Populaire Européen",
  5154: "Socialistes et Démocrates",
  5155: "Verts/Alliance Libre Européenne",
  5588: "Identité et Démocratie",
  5704: "Renew Europe",
  6259: "The Left",
};

/* 
o: Organisation=parti 
g: Groupe politique européen
l: Nom du député
*/
const deputes = {
  5565: { o: ["5441"], g: ["5153"], l: "Brice HORTEFEUX" },
  24505: { o: ["6049"], g: ["6259"], l: "Emmanuel MAUREL" },
  24594: { o: ["5441"], g: ["5153"], l: "Anne SANDER" },
  30482: { o: ["5523"], g: ["6259"], l: "Younous OMARJEE" },
  72779: { o: ["5441"], g: ["5153"], l: "Nadine MORANO" },
  94649: { o: ["5494"], g: ["5588"], l: "Catherine GRISET" },
  96711: { o: ["5502"], g: ["5704"], l: "Pascal CANFIN" },
  96740: { o: ["5225"], g: ["5155"], l: "Yannick JADOT" },
  96743: { o: ["5225"], g: ["5155"], l: "Michèle RIVASI" },
  96747: { o: ["5441"], g: ["5153"], l: "Arnaud DANJEAN" },
  96750: { o: ["5582"], g: ["5155"], l: "François ALFONSI" },
  96868: { o: ["5225"], g: ["5155"], l: "Karima DELLI" },
  96952: { o: ["5227"], g: ["5154"], l: "Sylvie GUILLAUME" },
  97236: { o: ["5225"], g: ["5155", "5155"], l: "Marie TOUSSAINT" },
  113892: { o: ["5227"], g: ["5154"], l: "Eric ANDRIEU" },
  124693: { o: ["5502"], g: ["5704", "5154"], l: "Pascal DURAND" },
  124738: { o: ["5494"], g: ["5588"], l: "Gilles LEBRETON" },
  124760: { o: ["5494", "6413"], g: ["5148", "5588"], l: "Nicolas BAY" },
  124765: { o: ["5494"], g: ["5588"], l: "Joëlle MÉLIN" },
  124770: { o: ["5494"], g: ["5588"], l: "Jean-François JALKH" },
  124771: { o: ["5494"], g: ["5588"], l: "Dominique BILDE" },
  131580: { o: ["5494"], g: ["5588"], l: "Jordan BARDELLA" },
  135511: { o: ["6442", "5468"], g: ["5704", "5704"], l: "Valérie HAYER" },
  182995: { o: ["5494"], g: ["5588"], l: "Annika BRUNA" },
  189065: { o: ["5494"], g: ["5588"], l: "France JAMET" },
  190774: { o: ["5441"], g: ["5153"], l: "Geoffroy DIDIER" },
  197494: { o: ["5468", "5502"], g: ["5704"], l: "Nathalie LOISEAU" },
  197499: { o: ["5468"], g: ["5704"], l: "Chrysoula ZACHAROPOULOU" },
  197500: { o: ["5225"], g: ["5155"], l: "Mounir SATOURI" },
  197502: { o: ["5427"], g: ["5704"], l: "Marie-Pierre VEDRENNE" },
  197503: { o: ["5225"], g: ["5155"], l: "David CORMAND" },
  197504: { o: ["6441", "5502"], g: ["5704"], l: "Jérémy DECERLE" },
  197505: { o: ["5502", "5427"], g: ["5704"], l: "Catherine CHABAUD" },
  197506: { o: ["5225"], g: ["5155"], l: "Caroline ROOSE" },
  197508: { o: ["5468"], g: ["5704", "5704"], l: "Stéphane SÉJOURNÉ" },
  197511: { o: ["5225", "6442"], g: ["5155", "5704"], l: "Salima YENBOU" },
  197512: { o: ["5225"], g: ["5155"], l: "Benoît BITEAU" },
  197521: { o: ["5523"], g: ["6259"], l: "Manuel BOMPARD" },
  197527: { o: ["5523"], g: ["6259"], l: "Anne-Sophie PELLETIER" },
  197529: { o: ["5523"], g: ["6259"], l: "Leila CHAIBI" },
  197531: {
    o: ["5225"],
    g: ["5155", "5155"],
    l: "Gwendoline DELBOS-CORFIELD",
  },
  197533: { o: ["5523"], g: ["6259"], l: "Manon AUBRY" },
  197534: { o: ["5441"], g: ["5153"], l: "François-Xavier BELLAMY" },
  197535: { o: ["5441"], g: ["5153"], l: "Agnès EVREN" },
  197543: { o: ["5502"], g: ["5704"], l: "Bernard GUETTA" },
  197547: { o: ["5502"], g: ["5704"], l: "Irène TOLLERET" },
  197551: { o: ["5468"], g: ["5704"], l: "Stéphane BIJOUX" },
  197557: { o: ["5427"], g: ["5704"], l: "Christophe GRUDLER" },
  197574: { o: ["5225"], g: ["5155"], l: "Damien CARÊME" },
  197576: { o: ["5427"], g: ["5704", "5704"], l: "Sylvie BRUNET" },
  197577: { o: ["6430"], g: ["5704"], l: "Gilles BOYER" },
  197581: { o: ["5502"], g: ["5704"], l: "Stéphanie YON-COURTIN" },
  197585: { o: ["5468"], g: ["5704"], l: "Pierre KARLESKIND" },
  197589: { o: ["5427"], g: ["5704"], l: "Laurence FARRENG" },
  197593: { o: ["5502"], g: ["5704"], l: "Véronique TRILLET-LENOIR" },
  197597: { o: ["5494"], g: ["5588"], l: "Hélène LAPORTE" },
  197615: { o: ["6413", "5494"], g: ["5588"], l: "Jérôme RIVIÈRE" },
  197623: { o: ["5494"], g: ["5588"], l: "Thierry MARIANI" },
  197626: { o: ["5494"], g: ["5588"], l: "Herve JUVIN" },
  197627: { o: ["5494"], g: ["5588"], l: "Virginie JORON" },
  197628: { o: ["5494"], g: ["5588"], l: "Jean-Paul GARRAUD" },
  197629: { o: ["5494", "6413"], g: ["5588"], l: "Maxette PIRBAKAS" },
  197680: { o: ["5494"], g: ["5588"], l: "Aurélia BEIGNEUX" },
  197683: { o: ["5494", "6413"], g: ["5588"], l: "Gilbert COLLARD" },
  197686: { o: ["5494"], g: ["5588"], l: "Julie LECHANTEUX" },
  197687: { o: ["5494"], g: ["5588"], l: "Philippe OLIVIER" },
  197690: { o: ["5494"], g: ["5588"], l: "André ROUGÉ" },
  197691: { o: ["5494"], g: ["5588"], l: "Mathilde ANDROUËT" },
  197694: { o: ["5714"], g: ["5154"], l: "Raphaël GLUCKSMANN" },
  197697: { o: ["5714"], g: ["5154"], l: "Aurore LALUCQ" },
  197698: { o: ["5585"], g: ["5154"], l: "Pierre LARROUTUROU" },
  204416: { o: ["5502"], g: ["5704"], l: "Ilana CICUREL" },
  204418: { o: ["5227"], g: ["5154"], l: "Nora MEBAREK" },
  204419: { o: ["5502"], g: ["5704"], l: "Sandro GOZI" },
  204420: { o: ["5225"], g: ["5155"], l: "Claude GRUFFAT" },
  204421: { o: ["5494"], g: ["5588"], l: "Jean-Lin LACAPELLE" },
  234344: { o: ["5427"], g: ["5704"], l: "Max ORVILLE" },
  236050: { o: ["5494"], g: ["5588"], l: "Marie DAUCHY" },
  236051: { o: ["5494"], g: ["5588"], l: "Eric MINARDI" },
  236052: { o: ["5494"], g: ["5588"], l: "Patricia CHAGNON" },
  236053: { o: ["5523"], g: ["6259"], l: "Marina MESURE" },
  245018: { o: ["5227"], g: ["5154"], l: "Christophe CLERGEAU" },
  247122: { o: ["5474"], g: ["5704"], l: "Catherine AMALRIC" },
  249284: { o: ["5441"], g: ["5153"], l: "Laurence SAILLIET" },
  249285: { o: ["5582"], g: ["5155"], l: "Lydie MASSARD" },
  250918: { o: ["5225"], g: ["5155"], l: "François THIOLLET" },
  251859: { o: ["6442"], g: ["5704"], l: "Guy LAVOCAT" },
};

const dataset = {
  votes,
  groups,
  lists,
  org_to_list,
  deputes,
};

fs.writeFileSync("../frontend/src/data.json", JSON.stringify(dataset));
console.log("✅ Données exportées");
