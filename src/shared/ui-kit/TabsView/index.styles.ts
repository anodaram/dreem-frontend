import { makeStyles } from "@material-ui/core";

export const tabViewStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: "16px",
    overflowX: "auto",
    border: "2px solid",
    borderImageSlice: "1",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      padding: "15px 11px",
    },
  },
  tab: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    background: "transparent",
    borderRadius: "2px",
    color: "white",
    marginRight: "38px",
    cursor: "pointer",
    padding: "10px 32px 6px",
    fontFamily: "GRIFTER",
    fontSize: "16px",
    lineHeight: "120%",
    textTransform: "uppercase",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      marginRight: "8px",
      padding: "10px 33px 6px",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: "0px",
      padding: "8px 16px 4px",
    },
  },
  selected: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    color: "#212121",
  },
  equalized: {
    minWidth: 210,
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.down("md")]: {
      minWidth: 182,
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 142,
    },
  },
  percentaged: {
    [theme.breakpoints.down("xs")]: {
      minWidth: 0,
      width: "33%",
    },
  },
}));
