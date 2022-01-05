import { makeStyles } from "@material-ui/core/styles";

export const notAppModalStyles = makeStyles(theme => ({
  root: {
    // width: "100vw !important",
    // maxWidth: "unset !important",
    width: "auto !important",
    padding: "0px !important",
    // height: "100vh !important",
    borderRadius: "20px !important",
    background: "#0B151C !important",
    color: "#fff !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "64px 100px",
    [theme.breakpoints.down("sm")]: {
      padding: "56px 70px"
    },
    [theme.breakpoints.down("xs")]: {
      padding: "48px 16px"
    }
  },
  title: {
    fontFamily: "GRIFTER",
    fontSize: 72,
    lineHeight: "120px",
    fontWeight: "bold",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    background:
      "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    [theme.breakpoints.down("xs")]: {
      fontSize: 62
    }
  },
  description: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 16,
    lineHeight: "155%",
    textAlign: "center",
  },
  button: {
    width: "70%",
    height: 56,
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    color: "#212121",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: "120%",
    textAlign: "center",
    textTransform: "uppercase",
  },
}));
