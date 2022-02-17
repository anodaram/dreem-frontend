import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 20,
    fontFamily: "Grifter",
    fontWeight: 700,
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    lineHeight: "33px",
    marginBottom: 32,
    textAlign: "center",
    padding: "0px 140px",
    textTransform: "uppercase",
    [theme.breakpoints.down("md")]: {
      padding: "0px 120px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0px 80px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0px 40px",
    },
  },
  timerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "22px 21px 10px",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    fontSize: 36,
    fontFamily: "Rany",
    fontWeight: 700,
    lineHeight: "33px",
    border: "2px solid",
    borderImageSlice: 1,
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "& span": {
      fontSize: 20,
    },
  },
}));
