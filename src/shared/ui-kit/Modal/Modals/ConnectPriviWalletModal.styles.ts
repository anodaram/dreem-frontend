import { makeStyles } from "@material-ui/core/styles";

export const connectPriviWalletModalStyles = makeStyles(() => ({
  root: {
    width: "680px !important",
  },
  content: {
    padding: 20,
    width: 621,
    height: 621,
    wordBreak: "break-all",
    textAlign: "center",
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconBar: {
    display: "flex",
    justifyContent: "center",
  },
  priviIcon: {
    "& h5": {
      fontSize: 18,
      fontWeight: 800,
      marginBottom: 3,
    },
    "& h6": {
      fontSize: 11,
      color: "#707582",
      margin: 0,
    },
  },
  connectorIcon: {
    marginTop: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    lineHeight: "104.5%",
    marginTop: 10,
    marginBottom: 0,
  },
  description: {
    color: "black",
    fontSize: 18,
    marginTop: 0,
  },
  mainNetwork: {
    fontSize: 15,
    color: "#707582",
  },
}));
