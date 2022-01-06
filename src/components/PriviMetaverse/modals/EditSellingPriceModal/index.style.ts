import { makeStyles } from "@material-ui/core/styles";

export const EditSellingPriceModalStyles = makeStyles(theme => ({
  container: {
    maxWidth: "508px !important",
    padding: "0px !important",
  },
  nameField: {
    margin: "27px 0px 7px 0px",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    color: "#1A1B1C",
  },
  inputJOT: {
    background: "rgba(144, 155, 255, 0.16)",
    border: "1px solid #431AB7 !important",
    width: "100%",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: "0 2px",
  },
  purpleText: {
    fontFamily: "Agrandir Variable !important",
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "16px",
    fontWeight: 700,
  },
  usdWrap: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "0",
    },
  },
  point: {
    background: "#D9F66F",
    width: "13px",
    height: "13px",
    borderRadius: "100%",
    marginRight: 4,
  },
  receiveContainer: {
    background: "rgba(158, 172, 242, 0.2)",
    borderRadius: "12px",
    padding: "20px 26px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "22px",
    "& span": {
      color: "#431AB7",
      fontSize: "16px",
    },
  },
  usdt: {
    fontFamily: "Agrandir GrandHeavy !important",
    color: "#431AB7",
    fontWeight: 800,
    fontSize: "16px",
  },
  totalText: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "150%",
    letterSpacing: "0.02em",
    color: "#431AB7",
  },
  footer: {
    padding: "18px 25px 25px 25px",
    background: "#e0e0e53b",
  },
  primaryButton: {
    color: "#fff !important",
    padding: "0 73px !important",
    height: "40px !important",
    border: "none !important",
    [theme.breakpoints.down("xs")]: {
      padding: "0 0 !important",
      width: "50% !important",
    },
  },
  secondaryButton: {
    padding: "0 37px !important",
  },
  datePicker: {
    border: "1px solid #431ab7",
    borderRadius: "9px",
    width: "100%",

    "& .MuiOutlinedInput-input": {
      paddingTop: 15,
      paddingBottom: 15,
    },
  },
  cancelModal: {
    maxWidth: "521px !important",
    padding: "90px 32px 50px 32px !important",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelTitle: {
    fontFamily: "Agrandir GrandHeavy",
    fontSize: "18px",
    color: "#2D3047",
  },
  cancelDesc: {
    color: "#54658F",
    opacity: 0.9,
    marginBottom: 54,
    textAlign: "center",
    padding: "20px 50px",
  },
  cancelButton: {
    backgroundColor: "transparent !important",
    color: "black !important",
    border: "1px solid #CBCBCB !important",
    borderRadius: "4px !important",
    width: "100% !important",
  },
  editPriceButton: {
    backgroundColor: "#431AB7 !important",
    color: "white",
    width: "100% !important",
    borderRadius: "4px !important",
  },
}));
