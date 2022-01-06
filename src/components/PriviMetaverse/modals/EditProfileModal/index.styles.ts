import { makeStyles } from "@material-ui/core/styles";

export const createNFTModalStyles = makeStyles(theme => ({
  content: {
    backgroundColor: "#0B151C !important",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    color: "white !important",
    width: "788px !important",
    borderRadius: "0 !important",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
  },
  itemTitle: {
    fontFamily: "Rany",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: "104%",
  },
  inputBox: {
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    height: 48,
    fontSize: 14,
    fontFamily: "Rany",
    fontWeight: 500,
    lineHeight: "14px",
    padding: "12px 16px",
    color: "white",
  },
  input: {
    outline: "none",
  },
  timeSelect: {
    padding: 0,
    "& .MuiFormControl-root.MuiTextField-root": {
      height: "100%",
      "& .MuiInputBase-root.MuiInput-root": {
        border: "none",
        backgroundColor: "transparent",
        "& input": {
          color: "white",
          fontFamily: "Rany !important",
        },
      },
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    "& button": {
      fontFamily: "GRIFTER",
      background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
      color: "#1C0A4C",
      fontSize: 18,
      fontWeight: "bold",
      borderRadius: 70,
      height: 59,
      padding: "0 80px",
      textTransform: "uppercase",
    },
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: 24,
    background: "transparent",
    padding: 4,
  },
  tabItem: {
    fontSize: 16,
    fontWeight: 700,
    padding: "15px 40px",
    cursor: "pointer",
    textTransform: "uppercase",
    "& + &": {
      marginLeft: 12,
    },
  },
  tabSelectedItem: {
    color: "#1C0A4D",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: 20,
  },
  socialInput: {
    display: "flex",
    lineHeight: "1.1876em",
    "& input": {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "inherit",
      fontSize: 14,
      lineHeight: "inherit",
      "&::-webkit-input-placeholder": {
        lineHeight: "inherit",
      },
    },
    "& svg": {
      height: "100%",
      "& path": {
        fill: "white",
      },
    },
  },
  countryContainer: {
    fontFamily: "Rany",
    "& .MuiInputBase-fullWidth": {
      borderRadius: "0 !important",
      height: "48px !important",
      border: "1px solid rgba(218, 218, 219, 0.59) !important",
      background: "rgba(218, 230, 229, 0.06) !important",
      color: "white !important",
      fontFamily: "Rany !important",
    },
  },
}));
