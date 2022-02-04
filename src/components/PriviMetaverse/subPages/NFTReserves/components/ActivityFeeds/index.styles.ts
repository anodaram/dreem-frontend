import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  root: {
    background: "#212121",
    border: "2px solid #151515",
    width: 398,
    height: "45%",
    position: "relative",
    padding: "22px 32px 8px 19px",
    [theme.breakpoints.down("sm")]: {
      width: 255,
      padding: "22px 8px 8px",
    },
  },
  collapseIcon: {
    position: "absolute",
    top: "16px",
    right: "18px",
    cursor: "pointer",
  },
  switch: {
    width: 256,
    height: 47,
    background: "#151515",
    padding: 7,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      width: 235,
      height: 88,
    },
  },
  switchButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 133,
    height: 33,
    borderRadius: 2,
    paddingTop: 4,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  content: {
    marginTop: 21,
    overflowY: "scroll",
    height: 310,
    [theme.breakpoints.down("sm")]: {
      height: 263,
      marginTop: 12,
    },
  },
  typeTag: {
    borderRadius: 4,
    padding: "9px 8px 7.5px",
    textTransform: "uppercase",
    fontSize: 10,
    fontFamily: "Grifter",
    fontWeight: 700,
    color: "#212121",
  },
  orderTag: {
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "Rany",
    color: "#E9FF26",
    background: "#313321",
    borderRadius: 4,
    padding: "11px 7px",
  },
  typo1: {
    fontSize: 16,
    fontFamily: "Grifter",
    fontWeight: 700,
    color: "#fff",
    textTransform: "uppercase",
  },
  typo2: {
    fontSize: 14,
    fontFamily: "Rany",
    fontWeight: 400,
    color: "#ffffff50",
  },
}));
