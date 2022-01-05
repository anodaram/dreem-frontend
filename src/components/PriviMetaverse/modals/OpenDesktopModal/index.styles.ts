import { makeStyles } from "@material-ui/core/styles";

export const openDesktopModalStyles = makeStyles(theme => ({
  root: {
    background: "#151515 !important",
    borderRadius: "unset !important",
    border: "4px solid",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderImageSlice: 1,
    width: "100vw !important",
    maxWidth: "unset !important",
    padding: "44px !important",
    marginTop: "260px",
    [theme.breakpoints.down("xs")]: {
      padding: "24px !important",
    }
  },
  gradientText: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "32px",
    lineHeight: "38.4px",
    alignItems: "center",
    textTransform: "uppercase",
    [theme.breakpoints.down("xs")]: {
      fontSize: "30px",
      lineHeight: "32px",
    },
  },
  text: {
    fontFamily: "Rany",
    fontSize: 16,
    fontWeight: 500,
    color: "white",
    lineHeight: "18px"
  }
}));
