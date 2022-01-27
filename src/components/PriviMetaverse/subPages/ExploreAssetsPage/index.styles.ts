import { makeStyles } from "@material-ui/core";

export const exploreAssetsPage = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "auto",
    zIndex: 1,
  },
  container: {
    position: "absolute",
    top: 200,
    width: "100%",
    // marginTop: 400,
    // paddingTop: 80,
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
  },
  fitContent: {
    maxWidth: 1280,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 32,
      paddingRight: 32,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 24,
      paddingRight: 24,
    },
  },
  gradientText: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "56px",
    lineHeight: "67.2px",
    alignItems: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
      lineHeight: "48px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "34px",
      lineHeight: "40.8px",
    },
  },
  backImg1: {
    position: "absolute",
    top: 200,
    left: -100,
    [theme.breakpoints.down("xs")]: {
      width: 100,
      left: -50,
    },
  },
  backImg2: {
    position: "absolute",
    top: 400,
    right: -141,
    [theme.breakpoints.down("md")]: {
      width: 400,
    },
    [theme.breakpoints.down("sm")]: {
      width: 300,
    },
  },
}));
