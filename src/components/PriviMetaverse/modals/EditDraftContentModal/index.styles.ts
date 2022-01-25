import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const useModalStyles = makeStyles(theme => ({
  root: {
    background: "#0B151C !important",
    borderRadius: "0px !important",
    width: "788px !important",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    padding: "0px !important",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 32,
    color: "#fff",
  },
  tabSection: {
    marginTop: 32,
    width: 390,
    marginLeft: 12,
    [theme.breakpoints.down("xs")]: {
      width: 280,
      marginLeft: 0,
    },
  },
  stepsBorder: {
    borderBottom: "1.5px solid #707582",
    width: "calc(100% - 70px)",
    marginLeft: "30px",
    marginTop: "18px",
    marginBottom: "-22px",
  },
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "22px",
    "& div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "#fff",
      fontWeight: "normal",
      fontSize: "14px",
      width: 50,
    },
    "& button": {
      background: "#0B151C",
      border: "1px solid #fff",
      boxSizing: "border-box",
      color: "#fff",
      marginBlockEnd: "14px",
      width: "45px",
      height: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      borderRadius: "50%",
      fontSize: "14px",
      paddingBottom: "0.5px",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
      "& div": {
        fontSize: 12,
        "& span": {
          textAlign: "center",
        },
      },
      "& div:nth-child(1)": {
        "& span": {
          paddingBottom: 16,
        },
      },
      "& div:nth-child(2)": {},
      "& div:nth-child(3)": {},
    },
  },
  selected: {
    fontSize: "14px",
    lineHeight: "120%",

    "& button": {
      border: "0.858716px solid #9897B8",
      "& div": {
        color: "#212121",
        background: "#E9FF26",
        width: 37,
        height: 37,
        borderRadius: "50%",
        alignItems: "center !important",
        justifyContent: "center",
      },
    },
  },
  tick: {
    position: "absolute",
    top: -20,
    left: 0,
  },
  divider: {
    opacity: 0.2,
    backgroundColor: "#707582",
    width: "100%",
    height: 1,
  },
  mainSection: {
    padding: "40px 52px 26px",
    width: "100%",
  },
  footerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 106,
  },
  header1: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "Grifter",
    lineHeight: "120%",
    textTransform: "uppercase",
  },
  header2: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "Grifter",
    lineHeight: "120%",
  },
}));
