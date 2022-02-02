import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  root: {
    background:
      "linear-gradient(180deg, rgba(231, 255, 41, 0) 73.82%, rgba(224, 255, 48, 0.2) 100%), rgba(185, 239, 116, 0.06)",
    borderRadius: 4,
    padding: "27px 25px",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    color: "#E9FF26",
  },
}));
