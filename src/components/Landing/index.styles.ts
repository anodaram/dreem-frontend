import { makeStyles } from "@material-ui/core";

export const useLandingStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    color: "#ffffff",
    position: "relative",
    "& video": {
      width: "100%",
      height: "100%",
      position: "absolute",
      objectFit: "cover",
      zindex: 0,
    },
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#00000077",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%) !important",
    boxShadow: "0px 0px 35px rgba(199, 255, 77, 0.63)",
    backdropFilter: "blur(10px)",
    borderRadius: "100vh !important",
    fontSize: "16px !important",
    fontWeight: "bold",
    fontFamily: "GRIFTER !important",
    lineHeight: 21,
    color: "#212121 !important",
    minWidth: "252px !important",
    textTransform: "uppercase",
    height: "64px !important",
    width: "100% !important",
    paddingTop: 2,
    "& img": {
      marginLeft: 24,
    },
    "& .MuiCircularProgress-root": {
      marginLeft: 24,
      width: "30px !important",
      height: "30px !important",
      color: "#181818 !important",
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "290px !important",
    },
  },
  text: {
    fontSize: 15,
    fontWeight: 400,
    fontFamily: "Rany",
    letterSpacing: "0.05em",
  },
  alert: {
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: 800,
  },
  logo: {
    [theme.breakpoints.down("xs")]: {
      width: "290px !important",
    },
  },
}));
