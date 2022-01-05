import { makeStyles } from "@material-ui/core/styles";

export const joinupDAOModalStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    color: "white",
  },
  imgContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
    fontSize: "18px",
  },
  description: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
    color: "#707582",
  },
}));
