// Source : https://data.europarl.europa.eu/en/developer-corner/opendata-api
export const lists = {
  "new-0": {
    label: "Besoin d’Europe",
    leader: "Valérie Hayer",
    program_url: "https://besoindeurope.fr/projet",
  },
  "new-1": {
    label: "Rassemblement national",
    leader: "Jordan Bardella",
    program_url: "https://rassemblementnational.fr/programmeidpa",
  },
  "new-2": {
    label: "Europe Écologie",
    leader: "Marie Toussaint",
    program_url: "https://ecologie2024.eu/manifesto",
  },
  "new-3": {
    label: "Les Républicains",
    leader: "François-Xavier Bellamy",
    program_url: "https://republicains.fr/programme-2024/",
  },
  "new-4": {
    label: "La France insoumise",
    leader: "Manon Aubry",
    program_url:
      "https://lafranceinsoumise.fr/europeennes-2024/programme-de-lunion-populaire/",
  },
  "new-5": {
    label: "Réveiller l'Europe",
    leader: "Raphaël Glucksmann",
    program_url:
      "https://place-publique.eu/elections-europeennes-2024-reveiller-leurope-avec-raphael-glucksmann/",
  },
  "new-6": {
    label: "Europe Territoires Écologie",
    leader: "Guillaume Lacroix",
    program_url: "https://europeterritoiresecologie.fr/programme",
  },
  "new-7": {
    label: "La Gauche Unie",
    leader: "Léon Deffontaines",
    program_url: "https://www.deffontaines2024.fr/programme",
  },
  "new-8": {
    label: "Changer l'Europe",
    leader: "Pierre Larrouturou",
    program_url: "https://changerleurope.com/le-programme/",
  },
  "new-9": {
    label: "La France fière",
    leader: "Marion Maréchal",
    program_url: "https://votezmarion.fr/",
  },
  "new-10": {
    label: "Non à l’Europe capitaliste ",
    leader: "Olivier Terrien",
    non_sortant: true,
    program_url:
      "https://www.sitecommunistes.org/images/articles/2024/profession%20de%20foi.pdf",
  },
  "new-11": {
    label:
      "Non à l'UE et à l'OTAN, communistes pour la paix et le progrès social",
    leader: "Charles Hoareau",
    non_sortant: true,
    program_url: "",
  },
  "new-12": {
    label: "Lutte ouvrière",
    leader: "Nathalie Arthaud",
    non_sortant: true,
    program_url: "",
  },
  "new-13": {
    label: "Pour un monde sans frontières ni patrons, urgence révolution !",
    leader: "Selma Labib",
    non_sortant: true,
    program_url: "",
  },
  "new-14": {
    label: "Pour le pain, la paix, la liberté !",
    leader: "Camille Adoue",
    non_sortant: true,
    program_url: "",
  },
  "new-15": {
    label: "Free Palestine",
    leader: "Nagib Azergui",
    non_sortant: true,
    program_url: "",
  },
  "new-16": {
    label: "PACE",
    leader: "Audric Alexandre",
    non_sortant: true,
    program_url: "",
  },
  "new-17": {
    label: "Nous le peuple",
    leader: "Georges Kuzmanovic",
    non_sortant: true,
    program_url: "",
  },
  "new-18": {
    label: "Équinoxe",
    leader: "Marine Cholley",
    non_sortant: true,
    program_url: "",
  },
  "new-19": {
    label: "Union pour une Europe arc-en-ciel",
    leader: "Thierry-Paul Valette",
    non_sortant: true,
    program_url: "",
  },
  "new-20": {
    label: "Europe Souveraine",
    leader: "Antonin Duarte",
    non_sortant: true,
    program_url: "",
  },
  "new-21": {
    label: "Écologie au centre",
    leader: "Jean-Marc Governatori",
    non_sortant: true,
    program_url: "",
  },
  "new-22": {
    label: "Écologie positive et Territoires",
    leader: "Yann Wehrling",
    non_sortant: true,
    program_url: "",
  },
  "new-23": {
    label: "L’Alliance rurale",
    leader: "Jean Lassalle",
    non_sortant: true,
    program_url: "",
  },
  "new-24": {
    label: "Parti fédéraliste",
    leader: "Yves Gernigon",
    non_sortant: true,
    program_url: "",
  },
  "new-25": {
    label: "Asselineau-Frexit",
    leader: "François Asselineau",
    non_sortant: true,
    program_url: "",
  },
  "new-26": {
    label: "Les Patriotes",
    leader: "Florian Philippot",
    non_sortant: true,
    program_url: "",
  },
  "new-27": {
    label: "Une France royale au coeur de l'Europe",
    leader: "Inconnu",
    non_sortant: true,
    program_url: "",
  },
  "new-28": {
    label: "Forteresse Europe",
    leader: "Pierre-Marie Bonneau",
    non_sortant: true,
    program_url: "",
  },
  "new-29": {
    label: "France Libre",
    leader: "Francis Lalanne",
    non_sortant: true,
    program_url: "",
  },
  "new-30": {
    label: "Parti animaliste",
    leader: "Hélène Thouy",
    non_sortant: true,
    program_url: "",
  },
  "new-31": {
    label: "Parti pirate",
    leader: "Caroline Zorn",
    non_sortant: true,
    program_url: "",
  },
  "new-32": {
    label: "Espéranto langue commune",
    leader: "Laure Patas d'Illiers",
    non_sortant: true,
    program_url: "",
  },
  "new-33": {
    label: "Défendre les enfants",
    leader: "Gaël Coste-Meunier",
    non_sortant: true,
    program_url: "",
  },
};
// Plusieurs partis peuvent concourir sous la même liste
// Attention, les partis changent souvent de nom avec les années
export const org_to_list = {
  6442: "new-0", // Renaissance                        -> Besoin d’Europe
  5582: "new-6", // Régions et Peuples Solidaires      -> Europe Territoires Écologie
  6413: "new-9", // Reconquête!                        -> La France fière
  5494: "new-1", // Rassemblement national             -> Rassemblement national
  5714: "new-5", // Place publique                     -> Réveiller l'Europe
  5227: "new-5", // Parti socialiste                   -> Réveiller l'Europe
  5474: "new-0", // Parti Radical                      -> Besoin d’Europe
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

export const groups = {
  5148: {
    label: "Conservateurs et Réformistes Européens",
    url: "https://fr.wikipedia.org/wiki/Conservateurs_et_r%C3%A9formistes_europ%C3%A9ens",
  },
  5153: {
    label: "Parti Populaire Européen",
    url: "https://fr.wikipedia.org/wiki/Parti_populaire_europ%C3%A9en",
  },
  5154: {
    label: "Socialistes et Démocrates",
    url: "https://fr.wikipedia.org/wiki/Alliance_progressiste_des_socialistes_et_d%C3%A9mocrates_au_Parlement_europ%C3%A9en",
  },
  5155: {
    label: "Verts/Alliance Libre Européenne",
    url: "https://fr.wikipedia.org/wiki/Groupe_des_Verts/Alliance_libre_europ%C3%A9enne",
  },
  5588: {
    label: "Identité et Démocratie",
    url: "https://fr.wikipedia.org/wiki/Identit%C3%A9_et_d%C3%A9mocratie",
  },
  5704: {
    label: "Renew Europe",
    url: "https://fr.wikipedia.org/wiki/Renew_Europe",
  },
  6259: {
    label: "The Left",
    url: "https://fr.wikipedia.org/wiki/Groupe_de_la_Gauche_au_Parlement_europ%C3%A9en",
  },
};

/* 
Députés français sortants (ep-9)

o: Organisation=parti 
g: Groupe politique européen
l: Nom du député
*/

export const deputes = {
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

export const procedureTypes = {
  ACI: "Procédure d’accord interinstitutionnel",
  APP: "Procédure de consentement",
  AVC: "Procédure d’avis conforme du PE",
  BUD: "Procédure budgétaire",
  BUI: "Initiative budgétaire",
  CNS: "Procédure de consultation",
  COD: "Procédure législative",
  COS: "Procédure sur un document de stratégie",
  DCE: "Déclaration écrite",
  DEA: "Actes délégués",
  DEC: "Procédure de décharge",
  GBD: "Procédure de gestion budgétaire",
  IMM: "Immunité des députés",
  INI: "Procédure d’initiative",
  INL: "Procédure d’initiative législative",
  INS: "Procédure institutionnelle",
  NLE: "Lois non législatives",
  REG: "Règlement du Parlement",
  RPS: "Actes d’exécution",
  RSO: "Organisation du Parlement",
  RSP: "Résolution",
};
