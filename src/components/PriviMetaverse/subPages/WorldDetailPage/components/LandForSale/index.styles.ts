import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    lineHeight: "120%",
    letterSpacing: "0.02em",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
}));
