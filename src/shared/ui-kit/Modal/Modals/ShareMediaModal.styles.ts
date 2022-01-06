import { makeStyles } from "@material-ui/core/styles";

export const shareMediaToSocialModalStyles = makeStyles(theme => ({
  root: {
    background: "#0B151C !important",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    borderRadius: "30px !important",
    color: "white !important",
    width: "auto !important",
  },
  modalContent: {
    padding: "20px 30px",
    display: "flex",
    flexDirection: "column",
  },
  shareSocialMedia: {
    fontSize: 20,
    lineHeight: "26px",
    textAlign: "center",
    marginBottom: 30,
  },
  link: {
    display: "flex",
    alignItems: "center",
    "& button": {
      background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
      borderRadius: 8,
      marginLeft: 12,
      color: "#1C0A4D",
    },
  },
  pageLink: {
    width: "100%",
    outline: "none",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    background: "rgba(218, 230, 229, 0.26)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    lineHeight: "120%",
    textOverflow: "ellipsis",
    padding: "5px 16px",
    borderRadius: 8,
    "& > input": {
      color: "white",
    },
  },
  socialBox: {
    display: "flex",
    justifyContent: "center",
    "& > div": {
      display: "flex",
    },
    "& > div + div": {
      marginLeft: 26,
    },
    [theme.breakpoints.down(765)]: {
      flexDirection: "column",
      alignItems: "center",
      "& > div + div": {
        marginLeft: 0,
        marginTop: 26,
      },
    },
    [theme.breakpoints.down(500)]: {
      marginTop: 16,
    },
  },
  socialMedia: {
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& + &": {
      marginLeft: 26,
    },
    [theme.breakpoints.down(500)]: {
      "& + &": {
        marginLeft: 16,
      },
    },
  },
  bubble: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: 58,
    borderRadius: "50%",
    background: "#4218B5",
    cursor: "pointer",
    "& svg path": {
      fill: "#212121",
    },
    [theme.breakpoints.down(500)]: {
      width: 48,
      height: 48,
    },
  },
  qrBox: {
    marginTop: 36,
    border: "4px solid",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderImageSlice: "30%",
    display: "flex",
    alignItems: "center",
    padding: 8,
    paddingRight: 32,
    "& > div": {
      marginLeft: 27,
      flex: 1,
    },
    "& canvas": {
      borderRadius: 20,
    },
    "& svg": {
      width: 140,
      height: 140,
    },
    "& button": {
      backgroundColor: "transparent",
      borderRadius: 8,
      marginLeft: 0,
      color: "white",
      border: "2px solid rgba(255, 255, 255, 0.5)",
      textTransform: "uppercase",
    },
    "& button + button": {
      marginLeft: "0 !important",
      marginTop: 8,
    },
    [theme.breakpoints.down(500)]: {
      flexDirection: "column",
      paddingRight: 8,
      "& > div": {
        marginLeft: 0,
        marginTop: 27,
        width: "100%",
      },
    },
  },
}));
