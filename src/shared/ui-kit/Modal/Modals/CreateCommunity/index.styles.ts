import { makeStyles } from "@material-ui/core/styles";
import { Gradient } from "shared/ui-kit";

export const useCreateCommunityStyles = makeStyles(() => ({
  root: {
    width: "auto !important",
    "& > svg": {},
  },
  firstPage: {
    width: "490px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
    "& > img": {
      height: "50px",
      margin: "30px 0px 22px",
    },
    "& h3": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "30px",
      margin: "0px 0px 10px",
    },
    "& span": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      textAlign: "left",
      color: "#707582",
      marginTop: "15px",
      marginBottom: "42px",
      width: "394px",
      paddingRight: "100px",
    },
  },
  label: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    marginBottom: "18px",
    color: "#707582",
    marginTop: "35px",
  },
  content: {
    width: "600px",
    display: "flex",
    flexDirection: "column",
    padding: "16px 0px",
    "& h5": {
      margin: "0px 0px 16px",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      color: "#181818",
    },
    "& label": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      color: "#181818",
      "& img": {
        marginLeft: "8px",
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
  },
  stepsBorder: {
    borderBottom: "1.5px solid #707582",
    width: "calc(100% - 25px)",
    marginLeft: "10px",
    marginTop: "18px",
    marginBottom: "-18px",
  },
  steps: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "22px",
    "& div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "calc(100% / 4)",
      color: "#707582",
      fontWeight: "normal",
      fontSize: "14px",
    },

    "& button": {
      background: "#ffffff",
      border: "1.5px solid #707582",
      boxSizing: "border-box",
      color: "#707582",
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

    "& div:first-child": {
      alignItems: "flex-start",

      "& button": {
        marginLeft: "10px",
      },
    },

    "& div:nth-child(2)": {
      marginRight: "8%",
    },

    "& div:last-child": {
      alignItems: "flex-end",
      "& button": {
        marginRight: "15px",
      },
      "& span": {
        marginRight: "15px",
      },
    },
  },
  selected: {
    fontSize: "14px",
    lineHeight: "120%",
    color: "#181818",

    "& button": {
      background: Gradient.Mint,
      color: "white",
      border: "none",
    },
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "45px",
    "& button": {
      fontSize: "16px",
      "& img": {
        width: "12px",
      },
    },
  },
  select: {
    "& > div": {
      paddingBottom: "11px",
      minWidth: "364px",
    },
  },
  hashtags: {
    display: "flex",
    alignItems: "center",
    marginTop: "-5px",
    "& div": {
      cursor: "pointer",
      marginRight: "8px",
      background: "white",
      border: "1px solid #707582",
      color: "#707582",
      fontSize: "14.5px",
      padding: "7px 12px 6px",
      borderRadius: "36px",
      "&.selected": {
        color: "white",
        borderColor: "black",
        background: "black",
      },
    },
    "& img": {
      marginLeft: "7px",
      width: "18px",
      height: "18px",
      cursor: "pointer",
    },
  },
  inputsRow: {
    display: "flex",
    alignItems: "center",
    "& div": {
      display: "flex",
      flexDirection: "column",
    },
    "& > :nth-child(2)": {
      width: "30%",
    },
    "& > :first-child": {
      marginRight: "18px",
      width: "70% !important",
    },
    "& input": {
      width: "100%",
    },
  },
  inputSelectorRow: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "45px",
    "& > .MuiPaper-rootdiv": {
      display: "flex",
      flexDirection: "column",
    },
    "& > :nth-child(2)": {
      width: "20%",
    },
    "& > :first-child": {
      marginRight: "18px",
      width: "80% !important",
    },
    "& input": {
      width: "100%",
    },
    "& .MuiFormControl-root": {
      marginBottom: "16px",
      "& > div": {
        height: "44px",
        "& > div": {
          padding: "10px",
        },
      },
    },
  },

  add: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& img": {
      marginLeft: "10px",
      marginRight: "10px",
      width: "10px",
      height: "10px",
    },
    "& span": {
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "14px",
    },
  },

  radioGroup: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "& .Mui-checked": {
      color: "#181818",
    },
  },

  infoMessage: {
    margin: "-20px 0px 25px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "16px 23px 17px 17px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    color: "#707582",
    borderRadius: "6px",
    border: "1px solid #E0E4F3",
    "& img": {
      marginRight: "16px",
      width: "18px",
      height: "18px",
    },
    "& p": {
      margin: 0,
    },
  },
}));
