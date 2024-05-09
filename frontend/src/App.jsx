import { useState, useEffect, useMemo } from "react";
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
  Paper,
  ThemeProvider,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import {
  HowToVote,
  EmojiEvents,
  Info,
  Add,
  Delete,
  Email,
  Newspaper,
  GitHub,
} from "@mui/icons-material";
import Logo from "./icons/logo.svg";
import Pour from "./icons/pour.svg";
import EuLogo from "./icons/eu.svg";
import Contre from "./icons/contre.svg";
import { CardSwiper } from "react-card-swiper";
import data from "./data";

const shuffle = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

const votes = shuffle(Object.values(data.votes));

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

const Content = () => (
  <div className="Card">
    <div className="top">
      <h2>{"Réduire l'écart de salaire entre les femmes et les hommes"}</h2>
      <ul>
        <li>
          {
            "Fixer des objectifs pour réduire l'écart de rémunération d'ici 2025"
          }
        </li>
        <li>
          {
            "Introduire des mesures de transparence des salaires et protéger les droits des travailleurs à temps partiel"
          }
        </li>
      </ul>
    </div>
    <Button
      startIcon={<Add />}
      className="more-info"
      color="lightBlue"
      variant="contained"
      disableElevation
    >
      PLUS D’INFOS
    </Button>
  </div>
);

function BottomNav({ state: [tab, setTab] }) {
  return (
    <BottomNavigation
      className="BottomNav"
      showLabels
      value={tab}
      onChange={(event, newValue) => {
        setTab(newValue);
      }}
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

const Votes = ({ visible }) => {
  const handleDismiss = (el, meta, id, action, operation) => {
    console.log({ el, meta, id, action, operation });
  };

  const handleFinish = (status) => {
    console.log(status);
  };

  const handleEnter = (el, meta, id) => {
    console.log(el, meta, id);
  };

  const mockData = [
    {
      id: "88552078",
      content: <Content />,
    },
    {
      id: "fc7e0bd4",
      content: <Content />,
    },
  ];

  return (
    <div className={`Votes ${visible ? "" : "hide"}`}>
      <div className="progress">
        <div className="bar" style={{ width: "54%" }}></div>
      </div>
      <Stack className="Stack">
        <CardSwiper
          data={mockData}
          onEnter={handleEnter}
          onFinish={handleFinish}
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
          emptyState={<div>LOREM IPSUM</div>}
        />
      </Stack>
      <div className="actions">
        <Button
          variant="contained"
          disableElevation
          color="secondary"
          className="contre"
          onClick={() => {
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

const Welcome = ({ visible, onStart }) => (
  <div className={`Welcome ${visible ? "" : "hide"}`}>
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
          onClick={onStart}
        >
          Commencer
        </Button>
      </div>
    </div>
    <div className="footer">
      VoteFinder est un projet bénévole, <br />
      <a href="">open-source</a>, et sans tracking.
    </div>
  </div>
);

const Resultats = ({ visible }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={`Resultats ${visible ? "" : "hide"}`}>
      <h2>🏆 Mes Résultats</h2>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        <Tab label="Partis" />
        <Tab label="Groupes" />
        <Tab label="Députés" />
      </Tabs>

      <div className="list">
        <div className="explanation">
          Pourcentage d’accord avec les listes sortantes
        </div>
        <div className="result">
          <img src="https://picsum.photos/100/100" alt="" />
          <div className="progress">
            <div className="bar" style={{ width: "54%" }}></div>
            <div className="name">
              <h4>Besoin d’Europe</h4>
              <h5>Valérie Hayer</h5>
            </div>
            <div className="score">71%</div>
          </div>
        </div>
        <Button
          className="reset"
          startIcon={<Delete />}
          color="primary"
          variant="contained"
          disableElevation
        >
          réinitialiser mes votes
        </Button>
      </div>
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
        disableElevation
      >
        nous contacter
      </Button>
      <Button
        startIcon={<Newspaper />}
        color="primary"
        variant="contained"
        size="large"
        disableElevation
      >
        communiqué de presse
      </Button>
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

function App() {
  const [tab, setTab] = useState(-1);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      {/* Switch with CSS to keep the state and rendering */}
      <div className="content">
        <Welcome visible={tab == -1} onStart={() => setTab(0)} />
        <Votes visible={tab == 0} />
        <Resultats visible={tab == 1} />
        <About visible={tab == 2} />
      </div>
      <BottomNav state={[tab, setTab]} />
    </ThemeProvider>
  );
}

export default App;
