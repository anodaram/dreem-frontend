import { makeStyles } from "@material-ui/core/styles";

export const useModalStyles = makeStyles(theme => ({
  content: {
    background: "rgba(11, 21, 28, 0.6)",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    color: "white",
    width: "755px",
    borderRadius: "0px",
    maxHeight: "670px",
    overflow: "auto",
  },
  warningScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& h3": {
      marginTop: 23,
      marginBottom: 14,
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 20,
      textAlign: "center",
      fontFamily: "Agrandir",
      lineHeight: "130%",
    },
    "& p": {
      fontStyle: "normal",
      fontFamily: "Montserrat",
      fontSize: 18,
      fontWeight: 500,
      lineHeight: "160%",
      textAlign: "center",
      marginTop: 0,
      marginBottom: "19px",
      "&:last-child": {
        marginTop: 30,
      },
    },
    "& b": {
      fontWeight: 600,
    },
    "& button": {
      height: 59,
      width: 295,
      marginTop: 53,
      borderRadius: "48px",
      fontSize: 16,
      fontWeight: 600,
      lineHeight: "18px",
      border: "none",
      background: "linear-gradient(90.07deg, #49E9FF 1.26%, #FFFFFF 98.76%), #FFFFFF",
      color: "#1C0A4C",
    },
  },
  warningContainer: {
    background: "rgba(231, 218, 175, 0.3)",
    borderRadius: "49px",
    height: "39px",
    width: "39px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "11px",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    lineHeight: "120%",
    textTransform: "uppercase",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
    lineHeight: "104.5%",
  },
  input: {
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "160%",
    outline: "none",
    color: "white",
    padding: "12px 20px",
  },
  uploadBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(238, 242, 247, 0.06)",
    border: "1px dashed #FFFFFF",
    "& button": {
      color: "white",
      background: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 30,
      "& svg": {
        marginRight: 8,
      },
    },
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    color: "#ffffff",
  },
  controlBox: {
    fontSize: 14,
    fontWeight: 500,
    "& span": {
      color: "#E9FF26",
    },
  },
  uploadBtn: {
    background: "white !important",
    fontSize: "18px !important",
    color: "#4218B5 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      marginRight: 8,
    },
    "& button": {
      color: "#ffffff",
      background: "#4218B5",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 20,
      "& svg": {
        marginRight: 8,
        "& path": {
          stroke: "#4218B5",
          fill: "#4218B5",
        },
      },
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    "& button": {
      borderRadius: 48,
      fontSize: 16,
      fontWeight: 600,
      height: 59,
      padding: "0 80px",
      "&:first-child": {
        border: "1px solid rgba(255, 255, 255, 0.36)",
        color: "white",
        background: "transparent",
      },
      "&:last-child": {
        background: "linear-gradient(90.07deg, #49E9FF 1.26%, #FFFFFF 98.76%), #FFFFFF",
        color: "#1C0A4C",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "0 48px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "0 24px",
      },
    },
  },
  tabWrapper: {
    display: "flex",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: 24,
    padding: 3,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    "& div:last-child": {
      marginLeft: 10,
    },
  },
  tab: {
    background: "transparent",
    color: "#FFFFFF",
    cursor: "pointer",
    padding: "10px 15px",
    borderRadius: 20,
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  tabActive: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    color: "#1C0A4D",
  },
  switchWrapper: {
    display: "flex",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "25px 0px",
    justifyContent: "space-between",
    marginTop: 20,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
    "& p": {
      color: "#ffffff",
      margin: 0,
    },
    "& .MuiFormControlLabel-root": {
      marginRight: "0px !important",
    },
  },
  royaltySwitchWrapper: {
    display: "flex",
    padding: "10px 0px",
    justifyContent: "space-between",
    marginTop: 16,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany Bold",
    "& p": {
      color: "#ffffff",
      margin: 0,
    },
    "& .MuiFormControlLabel-root": {
      marginRight: "0px !important",
    },
  },
  dropdown: {
    "& .MuiInputBase-root": {
      background: "rgba(218, 230, 229, 0.26)",
      border: "1px solid rgba(218, 218, 219, 0.59)",
      color: "#ffffff",
    },
    "& .MuiBox-root": {
      color: "#ffffff",
    },
  },
  comingsoon: {
    color: "#151515",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "120%",
    textAlign: "center",
    textTransform: "uppercase",
    background: "#646DFF",
    borderRadius: "4px",
    padding: "3px 4px 0px",
    position: "absolute",
    bottom: "-10px",
    left: "calc(50% - 46px)"
  }
}));
