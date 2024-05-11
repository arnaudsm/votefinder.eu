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
} from "@mui/icons-material";
import Logo from "./icons/logo.svg";
import Pour from "./icons/pour.svg";
import EuLogo from "./icons/eu.svg";
import Contre from "./icons/contre.svg";
import Trophy from "./icons/trophy.svg";
import { CardSwiper } from "react-card-swiper";
import ConfettiExplosion from "react-confetti-explosion";
import { calculateResults, calculateVote } from "./rank";
import { theme } from "./theme";

const minVotes = 5;
const recommendedVotes = 20;
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
      <Button
        startIcon={<Add />}
        className="more-info"
        color="lightBlue"
        variant="contained"
        disableElevation
        target="_blank"
        href={vote.url}
      >
        PLUS D’INFOS
      </Button>
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
    vote_ids.filter((vote_id) => !context.choices[vote_id]),
  );
  const handleDismiss = (el, meta, id, action, operation) => {
    if (operation !== "swipe") return;
    context.choose({ vote_id: id, type: action == "like" ? "+" : "-" });
  };
  const handleEnter = (el, meta, id) => setId(id);
  const data = unseen_vote_ids.map((vote_id) => ({
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
          data={data}
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
      <Logo className="logo" />
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
            <h2>Juge les textes votés au Parlement Européen ✉️</h2>
          </div>
          <div className="bottom">
            <h2>Et découvre quelle liste vote comme toi ✌️</h2>
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
              Commencer
            </Button>
          </div>
        </div>
        <div className="footer">
          VoteFinder est un projet bénévole, <br />
          <a href={projectURL} target="_blank">
            open-source
          </a>
          , et sans tracking.
        </div>
      </div>
    </>
  );
};

const VoteCard = ({ vote_id }) => {
  const vote = data.votes[vote_id];
  const tab = resultTabs[0];
  const context = useContext(Context);
  if (!vote) return <></>;

  return (
    <>
      <div className="top">
        <ul>
          <li>{vote.subtitle_1}</li>
          <li>{vote.subtitle_2}</li>
        </ul>
      </div>

      <ToggleButtonGroup
        value={context.choices[vote_id]}
        exclusive
        fullWidth={true}
        onChange={(event) =>
          context.choose({ vote_id, type: event.target.value })
        }
      >
        <ToggleButton value="+">Pour</ToggleButton>
        <ToggleButton value="-">Contre</ToggleButton>
        <ToggleButton value="0">Passer</ToggleButton>
      </ToggleButtonGroup>
      <div className="results">
        {Object.entries(calculateVote(vote.votes)).map(([id, results]) => (
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
                <h4>{tab.labelAccess(id)}</h4>
                <h5>{tab?.subtitleAccess && tab?.subtitleAccess(id)}</h5>
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
      <Button
        startIcon={<Add />}
        className="more-info"
        color="lightBlue"
        variant="contained"
        disableElevation
        target="_blank"
        href={vote.url}
      >
        PLUS D’INFOS
      </Button>
    </>
  );
};

const ResultsParVote = () => {
  const context = useContext(Context);

  return (
    <div className="ResultsParVote">
      {Object.keys(context.choices)
        .filter((vote_id) => vote_id in data.votes)
        .map((vote_id) => (
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
              <VoteCard vote_id={vote_id} />
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
};

const LigneResultat = ({ id, tab, approval }) => (
  <div className="result">
    <img src={tab.imgAccess(id)} alt={tab.labelAccess(id)} />
    <div className="progress">
      <div
        className="bar"
        style={{ width: `${Math.floor(approval * 100)}%` }}
      ></div>
      <div className="name">
        <h4>{tab.labelAccess(id)}</h4>
        <h5>{tab?.subtitleAccess && tab?.subtitleAccess(id)}</h5>
      </div>
      <div className="score">{`${Math.floor(approval * 100)}%`}</div>
    </div>
  </div>
);

const resultTabs = [
  {
    label: "Listes",
    text: "Pourcentage d’accord avec les nouvelles listes",
    resultAccess: (result) => result.lists,
    imgAccess: (id) => `/lists/${id}.jpg`,
    labelAccess: (id) => data.lists[id].label,
    subtitleAccess: (id) => data.lists[id].leader,
  },
  {
    label: "Groupes",
    text: "Pourcentage d’accord avec les groupes européens",
    resultAccess: (result) => result.groups,
    imgAccess: (id) => `/orgs/${id}.svg`,
    labelAccess: (id) => data.groups[id],
  },
  {
    label: "Députés",
    text: "Pourcentage d’accord avec les député sortants",
    resultAccess: (result) => result.deputes,
    imgAccess: (id) => `/deputes/${id}.jpg`,
    labelAccess: (id) => data.deputes[id].l,
  },
];

const Resultats = ({ visible }) => {
  const [tab, setTab] = useState(0);
  const context = useContext(Context);
  const results = useMemo(
    () => calculateResults(context.choices),
    [context.choices],
  );

  const handleChange = (event, newValue) => setTab(newValue);

  return (
    <div className={`Resultats ${visible ? "" : "hide"}`}>
      <h2>🏆 Mes Résultats</h2>
      <Tabs value={tab} onChange={handleChange} variant="fullWidth">
        {resultTabs.map((type) => (
          <Tab label={type.label} key={type.label} />
        ))}
        <Tab label="Votes" />
      </Tabs>
      {tab == 3 ? (
        <ResultsParVote />
      ) : Object.keys(context.choices).length < minVotes ? (
        <div className="list">
          Réponds à plus de {minVotes} questions pour voir tes résultats!
        </div>
      ) : (
        <div className="list">
          <div className="explanation">{resultTabs[tab].text}</div>
          {resultTabs[tab].resultAccess(results).map(([id, approval]) => (
            <LigneResultat
              key={id}
              id={id}
              approval={approval}
              tab={resultTabs[tab]}
            />
          ))}

          <Button
            className="reset"
            startIcon={<Delete />}
            color="primary"
            variant="contained"
            onClick={() => {
              if (!confirm("Voulez vous supprimer toutes vos données locales?"))
                return;
              context.setChoices({});
              context.acceptWelcome(false);
              context.setTab(0);
            }}
            disableElevation
          >
            réinitialiser mes votes
          </Button>
        </div>
      )}
    </div>
  );
};

const About = ({ visible }) => (
  <div className={`About ${visible ? "" : "hide"}`}>
    <div className="Card">
      <h2>À Propos</h2>
      <p>
        VoteFinder est un projet bénévole, <br />
        open-source, et sans tracking.
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
      {/* <Button
        startIcon={<Newspaper />}
        color="primary"
        variant="contained"
        size="large"
        disableElevation
      >
        communiqué de presse
      </Button> */}
      <p>
        Vous voulez corriger une erreur ou rajouter un texte de loi? Rejoignez
        notre GitHub !
      </p>
      <Button
        startIcon={<GitHub />}
        color="primary"
        variant="contained"
        size="large"
        disableElevation
        href={projectURL}
        target="_blank"
      >
        contribuer au projet
      </Button>

      <h2>L’Équipe</h2>
      <div>
        <div>Arnaud de Saint Méloir</div>
        <div>Yeliz Inci</div>
        <div>Arnaud-Yoh Massenet</div>
        <div>Rémi Dupont</div>
      </div>
    </div>
  </div>
);

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
        <h2>Tu as voté assez de lois pour découvrir tes résultats !</h2>
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

function App() {
  const [tab, setTab] = useState(0);
  const [resultPopup, setResultPopup] = useState(false);
  const [choices, setChoices] = useState(() => {
    const json = localStorage.getItem("votes");
    if (!json) return {};
    return JSON.parse(json);
  });
  const [started, setStarted] = useState(
    localStorage.getItem("started") == "y",
  );
  const choose = ({ vote_id, type }) => {
    setChoices((prevChoices) => {
      const newChoices = { ...prevChoices, [vote_id]: type };
      localStorage.setItem("votes", JSON.stringify(newChoices));
      if (Object.keys(newChoices).length == recommendedVotes)
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
        <ResultsModal />
        {started && <BottomNav state={[tab, setTab]} />}
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;
