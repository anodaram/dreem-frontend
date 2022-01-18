import { makeStyles } from "@material-ui/core/styles";

export const useModalStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    padding: "60px 163px !important",
    maxWidth: "680px !important",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
  },
  header1: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Rany",
    lineHeight: "24px",
    color: "#ffffff",
  },
}));
