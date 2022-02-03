import { makeStyles } from "@material-ui/core/styles";

export const becomeCreatorModalStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#1C0A4C !important",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    color: "#ffffff !important",
    borderRadius: "30px !important",
    width: "788px !important",
  },
  typo1: {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: "26px",
    fontFamily: "Agrandir GrandHeavy",
    marginTop: 24,
  },
  typo2: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: "150%",
    fontFamily: "Rany",
    textAlign: "center",
  },
  confirmBtn: {
    background: "linear-gradient(90.07deg, #49E9FF 1.26%, #FFFFFF 98.76%), #FFFFFF",
    borderRadius: 48,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "20px",
    color: "#1C0A4C",
    cursor: "pointer",
    padding: "19px 30px",
    marginTop: 65,
  },
}));
