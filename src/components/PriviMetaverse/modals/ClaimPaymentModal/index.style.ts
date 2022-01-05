import { makeStyles } from "@material-ui/core/styles";

export const ClaimPaymentModalStyles = makeStyles(theme => ({
  container: {
    padding: "0px !important",
  },
  primaryButton: {
    color: "#fff !important",
    padding: "0 37px !important",
    height: "40px !important",
    border: "none !important",
    background: "#431AB7 !important",
    width: "100% !important",
  },
  infoPanel: {
    marginTop: 17,
    marginBottom: 34,
    borderRadius: "16px",
    padding: 19,
    display: "flex",
    flexDirection: "column",
    background: "#eceefc",
    fontFamily: "Agrandir",
    color: "#431AB7",
  },
  divider: {
    background: "#431AB7",
    opacity: 0.2,
    margin: "13px 0",
    height: 1,
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 800,
  },
  description: {
    fontFamily: "Agrandir",
    fontSize: "14px",
    color: "#1A1B1C",
    marginTop: 10,
    marginBottom: 17,
  },
}));
