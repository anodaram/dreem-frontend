import { makeStyles } from "@material-ui/core/styles";

export const RentProceedModalStyles = makeStyles(theme => ({
  container: {
    padding: "0px !important",
  },
  primaryButton: {
    color: "#fff !important",
    padding: "0 37px !important",
    height: "40px !important",
    border: "none !important",
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
    fontFamily: "Agrandir",
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
    color: "#1A1B1C",
  },
  infoValue: {
    fontWeight: 800,
    color: "#431AB7",
  },
  description: {
    fontFamily: "Agrandir",
    fontSize: "14px",
    color: "#1A1B1C",
    marginTop: 10,
    marginBottom: 17,
  },
}));
