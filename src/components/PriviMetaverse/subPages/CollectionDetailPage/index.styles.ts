import { makeStyles } from "@material-ui/core";

export const collectionDetailPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${require("assets/metaverseImages/background_body.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",
    position: "relative",
  },
  container: {
    width: "100%",
    marginTop: 71,
    paddingTop: 80,
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 40,
    },
    "& > img": {
      position: "absolute",
      top: -70,
      right: -40,
      [theme.breakpoints.down("sm")]: {
        top: -100,
        right: -150,
      },
      [theme.breakpoints.down("sm")]: {
        top: -148,
        right: -168,
      },
    },
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
      paddingLeft: 46,
      paddingRight: 46,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 26,
      paddingRight: 26,
    },
  },
  no: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    color: "#fff",
    paddingLeft: 2,
  },
  title: {
    fontSize: 72,
    fontWeight: 700,
    lineHeight: "62px",
    textTransform: "uppercase",
    color: "#fff",
    [theme.breakpoints.down("xs")]: {
      fontSize: 34,
    },
  },
  description: {
    fontSize: "16px",
    fontWeight: 400,
    fontFamily: "Rany",
    lineHeight: "28px",
    color: "#FFFFFF",
    maxWidth: 900,
    marginBottom: 40,
    [theme.breakpoints.down("sm")]: {
      marginBottom: 78,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
      lineHeight: "21.7px",
      marginBottom: 31,
    },
  },
  symbol: {
    fontFamily: "Rany",
    fontWeight: "bold",
    fontSize: "18px",
    lineHeight: "190%",
    color: "#E9FF26",
    marginBottom: 26,
  }
}));
