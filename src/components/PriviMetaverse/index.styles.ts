import { makeStyles } from "@material-ui/core";

export const priviMetaversePageStyles = makeStyles(theme => ({
  priviMetaverse: {
    width: "100%",
    height: "100vh",
    background: "#151515",
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    background: "#151515",
    color: "#ffffff",
  },
  content: {
    display: "flex",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    flexDirection: "column",
    // "& ::-webkit-scrollbar": {
    //   width: 10,
    // },
    // "& ::-webkit-scrollbar-thumb": {
    //   width: 20,
    //   background: "rgba(238, 241, 244, 1)",
    // },
    // "& button": {
    //   userSelect: "none",
    // }
  },
}));
