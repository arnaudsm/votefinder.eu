import { createTheme } from "@mui/material";

export const theme = createTheme({
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
