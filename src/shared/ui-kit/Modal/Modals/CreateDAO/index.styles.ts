import { makeStyles } from "@material-ui/core/styles";
import { Gradient } from "shared/ui-kit";

export const useCreateDAOStyles = makeStyles(() => ({
  root: {
    width: "auto !important",
    "& > svg": {},
  },
  firstPage: {
    width: "406px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
    "& > img": {
      height: "50px",
      margin: "0px 0px 16px",
    },
    "& span": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      textAlign: "left",
      color: "#707582",
      marginTop: "18px",
      marginBottom: "16px",
    },
  },
  label: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    marginBottom: "18px",
    color: "white",
  },
  content: {
    width: "640px",
    display: "flex",
    flexDirection: "column",
    "& label": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      color: "white",
      "& img": {
        marginLeft: "4px",
      },
    },
    "& .MuiOutlinedInput-root": {
      width: "100%",
    },
    "& .MuiFormControl-root": {
      marginTop: "8px",
      width: "100%",
      marginBottom: "50px",
    },
    "& textarea": {
      height: "140px",
    },
  },
  stepsBorder: {
    borderBottom: "1.5px solid #707582",
    width: "80%",
    marginLeft: "10%",
    marginTop: "18px",
    marginBottom: "-18px",
  },
  steps: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "40px",
    "& div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "calc(100% / 4)",
      color: "white",
      fontWeight: "normal",
      fontSize: "14px",
    },

    "& button": {
      background: "rgba(63, 63, 64, 1)",
      boxSizing: "border-box",
      color: "white",
      marginBlockEnd: "12px",
      width: "34px",
      height: "34px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: "50%",
      fontSize: "14px",
      fontWeight: "normal",
    },
  },
  selected: {
    fontSize: "14px",
    lineHeight: "120%",

    "& button": {
      background: Gradient.BlueMagenta,
      color: "white",
      border: "none",
    },
  },

  hashtagLabel: {
    color: "#A306BA",
    marginRight: "24px",
    fontSize: "18px",
  },

  radioGroup: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    marginBottom: "45px",
    alignItems: "center",
    justifyContent: "space-between",
    "& *": {
      fontFamily: "Agrandir",
      color: "white",
    },
  },

  infoMessage: {
    marginTop: "24px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "16px 20px 16px 16px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    color: "white",
    background: "rgba(255, 255, 255, 0.16)",
    border: "1px solid #FFFFFF",
    "& img": {
      marginRight: "20px",
      width: "18px",
      height: "18px",
    },
    "& p": {
      margin: 0,
    },
  },
}));
