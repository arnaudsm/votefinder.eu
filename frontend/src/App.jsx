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
  createTheme,
  Stack,
  ThemeProvider,
  Tab,
  Tabs,
  Modal,
} from "@mui/material";
import {
  HowToVote,
  EmojiEvents,
  Info,
  Add,
  Delete,
  Email,
  GitHub,
} from "@mui/icons-material";
import Logo from "./icons/logo.svg";
import Pour from "./icons/pour.svg";
import EuLogo from "./icons/eu.svg";
import Contre from "./icons/contre.svg";
import Trophy from "./icons/trophy.svg";
import { CardSwiper } from "react-card-swiper";
import ConfettiExplosion from "react-confetti-explosion";

const minVotes = 5;
const recommendedVotes = 20;

const shuffle = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

const vote_ids = shuffle(Object.keys(data.votes));

const projectURL = "https://github.com/arnaudsm/votefinder.eu";

const theme = createTheme({
  root: {
    color: "#3E3E3E",
  },
  palette: {
    primary: {
      main: "#0052B4",
    },
    secondary: {
      main: "#FFFFFF",
    },
    lightBlue: {
      main: "#6697D2",
    },
    lightRed: {
      main: "#E78B8B",
    },
  },
  shadows: [
    "0px 0px 0px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 2px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 6px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 8px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
    "0px 0px 12px 0px rgba(0, 0, 0, 0.15)",
  ],
  shape: {
    borderRadius: 14,
  },
});

const Content = ({ vote_id }) => {
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
    content: <Content vote_id={vote_id} />,
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

const calculateResults = (choices) => {
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
      output.push([key, x[key]["+"] / (x[key]["-"] + x[key]["+"])]);
    }
    return output.sort((a, b) => b[1] - a[1]);
  };
  return {
    lists: rank(lists),
    deputes: rank(deputes),
    groups: rank(groups),
  };
};

const Resultats = ({ visible }) => {
  const [tab, setTab] = useState(0);
  const context = useContext(Context);
  // todo usememo
  const results = useMemo(
    () => calculateResults(context.choices),
    [context.choices],
  );
  console.log(results);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  const tabs = [
    {
      label: "Partis",
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

  return (
    <div className={`Resultats ${visible ? "" : "hide"}`}>
      <h2>🏆 Mes Résultats</h2>
      <Tabs value={tab} onChange={handleChange} variant="fullWidth">
        {tabs.map((type) => (
          <Tab label={type.label} key={type.label} />
        ))}
      </Tabs>
      {Object.keys(context.choices).length < minVotes ? (
        <div className="list">
          Réponds à plus de {minVotes} questions pour voir tes résultats!
        </div>
      ) : (
        <div className="list">
          <div className="explanation">{tabs[tab].text}</div>
          {tabs[tab].resultAccess(results).map(([id, approval]) => (
            <div className="result" key={id}>
              <img
                src={tabs[tab].imgAccess(id)}
                alt={tabs[tab].labelAccess(id)}
              />
              <div className="progress">
                <div
                  className="bar"
                  style={{ width: `${Math.floor(approval * 100)}%` }}
                ></div>
                <div className="name">
                  <h4>{tabs[tab].labelAccess(id)}</h4>
                  <h5>
                    {tabs[tab]?.subtitleAccess && tabs[tab]?.subtitleAccess(id)}
                  </h5>
                </div>
                <div className="score">{`${Math.floor(approval * 100)}%`}</div>
              </div>
            </div>
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
