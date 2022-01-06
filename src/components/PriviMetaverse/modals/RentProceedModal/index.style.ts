import { makeStyles } from "@material-ui/core/styles";

export const RentProceedModalStyles = makeStyles(theme => ({
  container: {
    padding: "0px !important",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "Grifter",
    color: "#fff",
    textTransform: "uppercase",
    marginTop: 24,
  },
  infoPanel: {
    marginTop: 17,
    marginBottom: 34,
    borderRadius: "16px",
    padding: 19,
    display: "flex",
    flexDirection: "column",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Rany",
    fontSize: "16px",
    letterSpacing: "0.02em",
    lineHeight: "150%",
  },
  divider: {
    background: "#431AB7",
    opacity: 0.2,
    margin: "13px 0",
    height: 1,
  },
  infoLabel: {
    fontSize: 16,
    lineHeight: "24px",
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  infoValue: {
    fontWeight: 800,
    fontSize: 18,
    color: "#ffffff",
  },
  description: {
    fontFamily: "Rany",
    fontSize: "14px",
    color: "#ffffff",
    marginTop: 30,
    marginBottom: 16,
    fontWeight: 400,
  },
  hash: {
    cursor: "pointer",
  },
  primaryButton: {
    color: "#212121 !important",
    padding: "0 37px !important",
    height: "40px !important",
    background: "linear-gradient(#B7FF5C, #EEFF21) !important",
    borderRadius: "40px",
    border: "none",
    "&:disabled": {
      background: "linear-gradient(#B7FF5C, #EEFF21) !important",
      color: "#212121 !important",
    },
  },
  borderBox: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    padding: 2,
  },
  box: {
    padding: "24px 18px",
    background: "rgb(11, 21, 28)",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
}));
