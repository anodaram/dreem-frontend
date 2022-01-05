import { makeStyles } from "@material-ui/core/styles";

export const createPriviWalletModalStyles = makeStyles(() => ({
  root: {
    width: "600px !important",
  },
  content: {
    padding: 20,
    wordBreak: "break-all",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& h1": {
      fontSize: 50,
    },
  },
  title: {
    fontSize: 30,
    marginTop: 10,
    marginBottom: 0,
  },
  subtitle: {
    color: "#949bab",
    fontSize: 18,
    marginTop: 0,
    marginBottom: 50,
  },
}));
