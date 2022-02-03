import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#0B151C !important",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    borderRadius: "0 !important",
    color: "white !important",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "52px 59px !important",
    width: "682px !important",
    maxWidth: "unset !important",
    [theme.breakpoints.down("sm")]: {
      width: "549px !important",
      padding: "52px 39px !important",
    },
    [theme.breakpoints.down("xs")]: {
      width: "343px !important",
      padding: "52px 16px !important",
    },
    "& > svg path": {
      stroke: "white",
    },
  },
  title: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "130%",
    textAlign: "center",
    color: "#E9FF26",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  description: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "160%",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  alert: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "160%",
    textAlign: "center",
    color: "#E9FF26",
    cursor: "pointer",
    "&:hover": {
      textDecorationLine: "underline",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  back: {
    position: "absolute",
    top: 24,
    left: 24,
    cursor: "pointer",
  },
  divider: {
    width: 300,
    height: 1,
    background: "rgba(0, 0, 0, 0.05)",
    marginTop: 10,
    marginBottom: 50,
  },
  qrcodeBox: {
    border: "1px solid rgba(84, 101, 143, 0.3)",
    borderRadius: 28,
    width: 452,
    height: 452,
  },
  button: {
    position: "relative",
    border: "1px solid #CCD1DE",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "38px 40px",
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "22px",
    lineHeight: "130%",
    transition: "opacity 0.1s ease",
    "&:hover": {
      opacity: 0.8,
      border: "1px solid #2D3047",
    },
    "&:active": {
      opacity: 0.5,
    },
    "& > .icon": {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      paddingLeft: 37,
      [theme.breakpoints.down("xs")]: {
        fontSize: "16px",
        padding: "24px 12px",
      },
    },
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-end",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
      padding: "24px 16px",
    },
  },
}));
