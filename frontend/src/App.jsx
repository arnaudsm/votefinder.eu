import data from "./data";
import { useState, useMemo, useContext, createContext } from "react";
import "./index.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Button,
  Stack,
  ThemeProvider,
  Tab,
  Tabs,
  Modal,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  HowToVote,
  EmojiEvents,
  Info,
  Add,
  Delete,
  Email,
  GitHub,
  ExpandMore,
  Share,
  PictureAsPdf,
  X,
  Instagram,
  Article,
  QuestionAnswer,
} from "@mui/icons-material";
import LogoSharing from "./icons/logo_url.svg";
import LogoURL from "./icons/logo_url_2.svg";
import Pour from "./icons/pour.svg";
import EuLogo from "./icons/eu.svg";
import Contre from "./icons/contre.svg";
import Trophy from "./icons/trophy.svg";
import { CardSwiper } from "react-card-swiper";
import ConfettiExplosion from "react-confetti-explosion";
import { calculateResults, calculateVote } from "./rank";
import { theme } from "./theme";
import html2canvas from "html2canvas";

const minVotes = 5;
const recommendedVotes = 30;
const projectURL = "https://github.com/arnaudsm/votefinder.eu";

const shuffle = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

const vote_ids = shuffle(Object.keys(data.votes));

const formatDate = (txt) => {
  if (!txt) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
    }).format(new Date(txt));
  } catch (error) {
    console.log(error);
  }
  return txt;
};

const getProcType = (proc_id) => {
  if (!proc_id) return "";
  const code = proc_id.slice(-4).slice(0, 3);
  return data.procedureTypes[code] || "";
};

const Card = ({ vote_id }) => {
  const vote = data.votes[vote_id];

  return (
    <div className="Card">
      <div className="top">
        <h2>{vote.title}</h2>
        <ul>
          <li>{vote.subtitle_1}</li>
          <li>{vote.subtitle_2}</li>
        </ul>
      </div>
      <div className="bottom">
        <div className="meta">
          {formatDate(vote.date)} - {getProcType(vote.proc_id)}
        </div>
        <div className="actions">
          {(vote.debat_url || vote.explications_url) && (
            <Button
              startIcon={<QuestionAnswer />}
              className="more-info"
              color="lightBlue"
              variant="contained"
              disableElevation
              target="_blank"
              href={vote.debat_url || vote.explications_url}
            >
              Débat
            </Button>
          )}
          {vote.summary_url && (
            <Button
              startIcon={<Article />}
              className="more-info"
              color="lightBlue"
              variant="contained"
              disableElevation
              target="_blank"
              href={vote.summary_url}
            >
              Résumé
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

function BottomNav({ state: [tab, setTab] }) {
  return (
    <BottomNavigation
      className="BottomNav"
      showLabels
      value={tab}
      onChange={(event, newValue) => setTab(newValue)}
    >
      {[
        { key: "votes", label: "Votes", icon: <HowToVote /> },
        { key: "resultats", label: "Résultats", icon: <EmojiEvents /> },
        { key: "a-propos", label: "À Propos", icon: <Info /> },
      ].map(({ label, icon, key }) => (
        <BottomNavigationAction label={label} icon={icon} key={key} />
      ))}
    </BottomNavigation>
  );
}

const NoVotesLeft = () => {
  const context = useContext(Context);

  return (
    <div className="NoVotesLeft">
      <div> Félicitations, vous avez voté toutes les lois !</div>
      <Button
        className="welcome-start"
        variant="contained"
        disableElevation
        size="large"
        onClick={() => {
          context.setTab(1);
          context.setResultPopup(false);
        }}
      >
        voir mes résultats
      </Button>
    </div>
  );
};

const Votes = ({ visible }) => {
  const context = useContext(Context);
  const [id, setId] = useState();
  const [unseen_vote_ids] = useState(
    vote_ids
      .filter((vote_id) => !context.choices[vote_id])
      .sort(
        (a, b) =>
          Number(data.votes?.[a]?.pinned || false) -
          Number(data.votes?.[b]?.pinned || false),
      ),
  );
  const handleDismiss = (el, meta, id, action, operation) => {
    if (operation !== "swipe") return;
    context.choose({ vote_id: id, type: action == "like" ? "+" : "-" });
  };
  const handleEnter = (el, meta, id) => setId(id);
  const cardData = unseen_vote_ids.map((vote_id) => ({
    id: vote_id,
    content: <Card vote_id={vote_id} />,
  }));
  const progress = Math.floor(
    (Object.keys(context.choices).length / recommendedVotes) * 100,
  );
  return (
    <div className={`Votes ${visible ? "" : "hide"}`}>
      {progress < 100 && (
        <div className="progress">
          <div className="bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      <Stack className="Stack">
        <CardSwiper
          data={cardData}
          onEnter={handleEnter}
          onFinish={() => null}
          onDismiss={handleDismiss}
          dislikeButton={<div />}
          likeButton={<div />}
          withActionButtons
          withRibbons
          likeRibbonText="POUR"
          dislikeRibbonText="CONTRE"
          ribbonColors={{
            bgLike: "#63B85D",
            bgDislike: "#DD5A5A",
            textColor: "white",
          }}
          emptyState={<NoVotesLeft />}
        />
      </Stack>
      <div className="actions">
        <Button
          variant="contained"
          disableElevation
          color="secondary"
          className="contre"
          onClick={() => {
            context.choose({ vote_id: id, type: "-" });
            document
              .getElementById("swipe-card__dislike-action-button")
              ?.click();
          }}
        >
          <Contre />
          Contre
        </Button>
        <Button
          variant="contained"
          disableElevation
          color="secondary"
          className="passer"
          onClick={() => {
            context.choose({ vote_id: id, type: "0" });
            document
              .getElementById("swipe-card__dislike-action-button")
              ?.click();
          }}
        >
          Passer
        </Button>
        <Button
          variant="contained"
          disableElevation
          color="secondary"
          className="pour"
          onClick={() => {
            context.choose({ vote_id: id, type: "+" });
            document.getElementById("swipe-card__like-action-button")?.click();
          }}
        >
          <Pour />
          Pour
        </Button>
      </div>
    </div>
  );
};

const Navbar = () => (
  <AppBar position="static" color="inherit" className="Navbar">
    <Toolbar color="white">
      <a href="https://votefinder.eu">
        <LogoURL className="logo" />
      </a>
    </Toolbar>
  </AppBar>
);

const Welcome = () => {
  const context = useContext(Context);

  return (
    <>
      <div className="Welcome">
        <div className="Card">
          <div className="top">
            <EuLogo />
            <h2>Votez les textes du Parlement Européen ✉️</h2>
          </div>
          <div className="bottom">
            <h2>Et découvrez quel parti a voté comme vous✌️</h2>
            <Button
              className="welcome-start"
              color="lightRed"
              variant="contained"
              disableElevation
              onClick={() => {
                localStorage.setItem("started", "y");
                context.setStarted(true);
              }}
            >
              Test européennes 🇪🇺
            </Button>
            <Button
              className="welcome-start euro"
              color="lightRed"
              variant="contained"
              disableElevation
              href="https://votefinder.fr/"
            >
              Test Législatives 🇫🇷
            </Button>
          </div>
        </div>

        <div className="footer">
          Textes issus de la 9<sup>ème</sup> législature (2019-2024).
          <br />
          Résumés non-exhaustifs, lisez les Débats pour plus de contexte !
          <br />
          <br />
          VoteFinder est un projet bénévole,{" "}
          <a href={projectURL} target="_blank">
            open-source
          </a>
          , et sans tracking.
        </div>
      </div>
    </>
  );
};

const ResultsParVoteEach = ({ vote_id }) => {
  const vote = data.votes[vote_id];
  const context = useContext(Context);
  if (!vote) return <></>;

  return (
    <>
      <div className="top">
        <p>
          {formatDate(vote.date)} - {getProcType(vote.proc_id)}
        </p>
        <ul>
          <li>{vote.subtitle_1}</li>
          <li>{vote.subtitle_2}</li>
        </ul>
      </div>
      <div className="results">
        {Object.entries(calculateVote(vote.votes))
          .filter(([, results]) => !Number.isNaN(results["-%"]))
          .map(([id, results]) => (
            <div className="result" key={id}>
              <div className="progress">
                <div
                  className="bar pour"
                  style={{
                    width: `${Math.floor(results["+%"] * 100)}%`,
                  }}
                ></div>
                <div
                  className="bar contre"
                  style={{
                    width: `${Math.floor(results["-%"] * 100)}%`,
                    marginLeft: `${Math.floor(results["+%"] * 100)}%`,
                  }}
                ></div>
                <div className="name">
                  <h4>{data.lists[id].label}</h4>
                  <h5>{data.lists[id].leader}</h5>
                </div>
                <div className="score">
                  {`${Math.floor(results["+"])} pour`}
                  <br />
                  {`${Math.floor(results["-"])} contre`}
                  <br />
                  {`${Math.floor(results["0"])} abs`}
                </div>
              </div>
            </div>
          ))}
      </div>
      <h2 className="mon-opinion">Mon Opinion</h2>
      <ToggleButtonGroup
        value={context.choices[vote_id]}
        exclusive
        fullWidth={true}
        onChange={(event) =>
          context.choose({ vote_id, type: event.target.value, noPopup: true })
        }
      >
        <ToggleButton value="-">👎 Contre</ToggleButton>
        <ToggleButton value="0">Passer</ToggleButton>
        <ToggleButton value="+">👍 Pour</ToggleButton>
      </ToggleButtonGroup>

      <Button
        startIcon={<Add />}
        className="more-info"
        color="lightBlue"
        variant="contained"
        disableElevation
        target="_blank"
        href={vote.summary_url}
      >
        PLUS D’INFOS
      </Button>
    </>
  );
};

const ResultsParVote = () => {
  const context = useContext(Context);
  const choices = Object.keys(context.choices).filter(
    (vote_id) => vote_id in data.votes,
  );
  return (
    <div className="ResultsParVote">
      {choices.map((vote_id) => (
        <Accordion
          slotProps={{ transition: { unmountOnExit: true } }}
          key={vote_id}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {data.votes[vote_id].title}
          </AccordionSummary>
          <AccordionDetails>
            <ResultsParVoteEach vote_id={vote_id} />
          </AccordionDetails>
        </Accordion>
      ))}
      {choices.length == 0 && (
        <div className="list">
          Répondez à plus de {minVotes} questions pour voir vos résultats!
        </div>
      )}
    </div>
  );
};

const share = async () => {
  try {
    await new Promise((r) => setTimeout(r, 800));
    const canvas = await html2canvas(document.querySelector(".SharePopup"));
    canvas.toBlob(async (blob) => {
      const files = [new File([blob], "image.png", { type: blob.type })];
      const shareData = {
        text: "https://votefinder.eu",
        title: "Mes meilleurs candidats aux Européennes d'après VoteFinder.eu",
        files,
      };
      if (navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.warn("Sharing not supported", shareData);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const ResultListe = ({ id, approval }) => {
  // const [open, setOpen] = useState(false);
  // TODO : Votes par liste

  return (
    <a
      className="liste-result"
      href={data.lists[id].program_url}
      key={id}
      target="_blank"
    >
      <div className="top">
        <img src={`/lists/${id}.jpg`} alt={data.lists[id].label} />
        <div className="progress">
          <div
            className="bar"
            style={{ width: `${Math.floor(approval * 100)}%` }}
          ></div>
          <div className="name">
            <h4>{data.lists[id].label}</h4>
            <h5>{data.lists[id].leader}</h5>
          </div>
          <div className="score">
            {data.lists[id].etranger ? "* " : ""}
            {data.lists[id].no_data
              ? "Non Sortant"
              : `${Math.floor(approval * 100)}%`}
          </div>
        </div>
      </div>
    </a>
  );
};
const ResultsListes = ({ results }) => (
  <div className="list">
    <div className="explanation">
      Pourcentage d’accord avec les listes 2024.
      <br />
      <sub>
        * : extrapolé sur les députés étrangers par manque de député francais
      </sub>
    </div>
    {results.lists.map(([id, approval]) => (
      <ResultListe id={id} approval={approval} key={id} />
    ))}
  </div>
);

const ResultsGroupes = ({ results }) => {
  return (
    <div className="list">
      <div className="explanation">
        Pourcentage d’accord avec les groupes européens (députés français
        uniquement)
      </div>
      {results.groups.map(([id, approval]) => (
        <a
          className="result"
          href={data.groups[id].url}
          key={id}
          target="_blank"
        >
          <img src={`/orgs/${id}.svg`} alt={data.groups[id].label} />
          <div className="progress">
            <div
              className="bar"
              style={{ width: `${Math.floor(approval * 100)}%` }}
            ></div>
            <div className="name">
              <h4>{data.groups[id].label}</h4>
              <h5>{data.groups[id].leader}</h5>
            </div>
            <div className="score">{`${Math.floor(approval * 100)}%`}</div>
          </div>
        </a>
      ))}
    </div>
  );
};

const ResultsDeputes = ({ results }) => {
  return (
    <div className="list">
      <div className="explanation">
        Pourcentage d’accord avec les député français sortants
      </div>
      {results.deputes
        .filter(([id]) => !data.deputes[id]?.hide)
        .map(([id, approval]) => (
          <a
            className="result"
            href={`https://www.europarl.europa.eu/meps/fr/${id}`}
            key={id}
            target="_blank"
          >
            <img src={`/deputes/${id}.jpg`} alt={data.deputes[id]?.l} />
            <div className="progress">
              <div
                className="bar"
                style={{ width: `${Math.floor(approval * 100)}%` }}
              ></div>
              <div className="name">
                <h4>{data.deputes[id]?.l}</h4>
              </div>
              <div className="score">{`${Math.floor(approval * 100)}%`}</div>
            </div>
          </a>
        ))}
    </div>
  );
};

const Resultats = ({ visible }) => {
  const [tab, setTab] = useState(0);
  const context = useContext(Context);
  const results = useMemo(
    () => calculateResults(context.choices),
    [context.choices],
  );
  const minVotesReached = Object.keys(context.choices).length >= minVotes;
  const handleChange = (event, newValue) => setTab(newValue);

  return (
    <div className={`Resultats ${visible ? "" : "hide"}`}>
      <div className="header">
        <h2>🏆 Mes Résultats</h2>

        {minVotesReached && navigator.canShare && (
          <Button
            startIcon={<Share />}
            color="primary"
            variant="contained"
            onClick={async () => {
              context.setShowShare(true);
              await share();
              context.setShowShare(false);
            }}
            disabled={context.showShare}
            disableElevation
          >
            Partager
          </Button>
        )}
      </div>
      <Tabs value={tab} onChange={handleChange} variant="fullWidth">
        <Tab label="Listes" />
        <Tab label="Groupes" />
        <Tab label="Députés" />
        <Tab label="Votes" />
      </Tabs>
      {!minVotesReached ? (
        <div className="list">
          Réponds à plus de {minVotes} questions pour voir tes résultats!
        </div>
      ) : tab == 0 ? (
        <ResultsListes results={results} />
      ) : tab == 1 ? (
        <ResultsGroupes results={results} />
      ) : tab == 2 ? (
        <ResultsDeputes results={results} />
      ) : tab == 3 ? (
        <ResultsParVote />
      ) : null}
    </div>
  );
};

const About = ({ visible }) => {
  const context = useContext(Context);

  return (
    <div className={`About ${visible ? "" : "hide"}`}>
      <div className="Card">
        <h2>À Propos</h2>
        <p>
          VoteFinder est un projet bénévole, <br />
          open-source, et sans tracking.
        </p>

        <Button
          startIcon={<PictureAsPdf />}
          color="primary"
          variant="contained"
          size="large"
          href="Communique-de-Presse-VoteFinder.eu.pdf"
          disableElevation
        >
          communiqué de presse
        </Button>
        <p>
          Vous voulez corriger une erreur ou rajouter un texte de loi ?<br />
          Contactez-nous ou proposez une modification sur GitHub !
        </p>
        <Button
          startIcon={<Email />}
          color="primary"
          variant="contained"
          size="large"
          href="mailto:contact@votefinder.eu"
          disableElevation
        >
          nous contacter
        </Button>
        <Button
          startIcon={<GitHub />}
          color="primary"
          variant="contained"
          size="large"
          disableElevation
          href={projectURL}
          target="_blank"
        >
          contribuer sur github
        </Button>
        <Button
          color="primary"
          variant="contained"
          size="large"
          href="https://votefinder.fr"
        >
          VoteFinder Législatives
        </Button>

        <h2>Paramètres</h2>
        <Button
          className="reset"
          startIcon={<Delete />}
          color="primary"
          variant="contained"
          onClick={() => {
            if (!confirm("Voulez vous supprimer toutes vos données locales?"))
              return;
            context.setChoices({});
            localStorage.setItem("votes", JSON.stringify({}));
            context.acceptWelcome(false);
            context.setTab(0);
          }}
          disableElevation
        >
          réinitialiser mes votes
        </Button>

        <h2>Réseaux Sociaux</h2>
        <div className="socials">
          <Button
            color="primary"
            variant="contained"
            href="https://twitter.com/VoteFinder_eu"
            startIcon={<X />}
          >
            / Twitter
          </Button>
          <Button
            color="primary"
            variant="contained"
            href="https://www.instagram.com/votefinder.eu"
            startIcon={<Instagram />}
          >
            instagram
          </Button>
          <Button
            color="primary"
            variant="contained"
            href="https://www.tiktok.com/@votefinder.eu"
          >
            TikTok
          </Button>
        </div>

        <h2>L’Équipe</h2>
        <div className="equipe">
          <div style={{ width: "80%" }}>
            <h4>Arnaud de Saint Méloir</h4>
            <h5>Créateur/Ingénieur</h5>
          </div>
          <div>
            <h4>Arnaud-Yoh Massenet</h4>
            <h5>Data Scientist</h5>
          </div>
          <div>
            <h4>Rémi Dupont</h4>
            <h5>Data Scientist</h5>
          </div>
          <div>
            <h4>Anna Logacheva</h4>
            <h5>Communication</h5>
          </div>
          <div>
            <h4>Hortense de Saint Méloir</h4>
            <h5>Spécialiste Politique Agricole</h5>
          </div>
          <div>
            <h4>Yeliz Inci</h4>
            <h5>Spécialiste Droits Humains</h5>
          </div>
          <div>
            <h4>Theo Barry</h4>
            <h5>Analyste</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

const Context = createContext({});

const ResultsModal = () => {
  const context = useContext(Context);
  return (
    <Modal
      open={context.resultPopup}
      onClose={() => context.setResultPopup(false)}
      className="ResultsModal"
    >
      <div className="content">
        <h2>Vous avez voté assez de lois pour découvrir vos résultats !</h2>
        <ConfettiExplosion zIndex="1400" />
        <Trophy />
        <div className="actions">
          <Button
            className="welcome-start"
            variant="white"
            disableElevation
            size="large"
            onClick={() => {
              context.setResultPopup(false);
            }}
          >
            Continuer à voter
          </Button>
          <Button
            className="welcome-start"
            color="lightRed"
            variant="contained"
            disableElevation
            size="large"
            onClick={() => {
              context.setTab(1);
              context.setResultPopup(false);
            }}
          >
            Mes résultats
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const SharePopup = () => {
  const context = useContext(Context);
  const results = useMemo(
    () => calculateResults(context.choices),
    [context.choices],
  );
  return (
    <div className="SharePopup">
      <h1>Les partis qui votent comme moi aux Européennes 🇪🇺</h1>
      <div className="list">
        <div className="explanation">Pourcentage de votes d’accord</div>
        {results.lists.slice(0, 4).map(([id, approval]) => (
          <a
            className="result"
            href={data.lists[id].program_url}
            key={id}
            target="_blank"
          >
            <img src={`/lists/${id}.jpg`} alt={data.lists[id].label} />
            <div className="progress">
              <div
                className="bar"
                style={{ width: `${Math.floor(approval * 100)}%` }}
              ></div>
              <div className="name">
                <h4>{data.lists[id].label}</h4>
                <h5>{data.lists[id].leader}</h5>
              </div>
              <div className="score">{`${Math.floor(approval * 100)}%`}</div>
            </div>
          </a>
        ))}
      </div>
      <LogoSharing className="logo" />
    </div>
  );
};

function App() {
  const [tab, setTab] = useState(0);
  const [resultPopup, setResultPopup] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [choices, setChoices] = useState(() => {
    const json = localStorage.getItem("votes");
    if (!json) return {};
    return JSON.parse(json);
  });
  const [started, setStarted] = useState(
    localStorage.getItem("started") == "y",
  );
  const choose = ({ vote_id, type, noPopup }) => {
    setChoices((prevChoices) => {
      const newChoices = { ...prevChoices, [vote_id]: type };
      localStorage.setItem("votes", JSON.stringify(newChoices));
      if (Object.keys(newChoices).length == recommendedVotes && !noPopup)
        setResultPopup(true);
      return newChoices;
    });
  };
  const acceptWelcome = (value) => {
    setStarted(value);
    localStorage.setItem("started", value ? "y" : "");
  };

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider
        value={{
          tab,
          setTab,
          choices,
          choose,
          setChoices,
          setStarted,
          acceptWelcome,
          resultPopup,
          setResultPopup,
          showShare,
          setShowShare,
        }}
      >
        <Navbar />
        {/* Switch with CSS to keep the state and rendering */}
        <div className="content">
          {started ? (
            <>
              <Votes visible={tab == 0} />
              <Resultats visible={tab == 1} />
              <About visible={tab == 2} />
            </>
          ) : (
            <Welcome />
          )}
        </div>
        {showShare && <SharePopup />}
        <ResultsModal />
        {started && <BottomNav state={[tab, setTab]} />}
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;
