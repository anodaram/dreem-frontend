import { makeStyles } from "@material-ui/core";

export const gameDetailPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "auto",
  },
  headerBG: {},
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
  title: {
    fontFamily: "GRIFTER",
    fontSize: 72,
    fontWeight: "bold",
    lineHeight: "100%",
    // textTransform: "uppercase",
    color: "white",
    [theme.breakpoints.down("xs")]: {
      fontSize: 34,
    },
  },
  description: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 20,
    lineHeight: "155%",
    color: "#FFFFFF",
    maxWidth: 900,
    // marginBottom: 40,
    [theme.breakpoints.down("sm")]: {
      // marginBottom: 78,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
      lineHeight: "21.7px",
      // marginBottom: 31,
    },
  },
  content: {
    // paddingTop: 90,
    paddingBottom: 180,
  },
}));
