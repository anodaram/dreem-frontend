import { makeStyles } from "@material-ui/core";

export const modalStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "540px !important",
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
    color: "#212121 !important",
    padding: "0 37px !important",
    height: "40px !important",
    background: "linear-gradient(#B7FF5C, #EEFF21) !important",
    borderRadius: "40px",
    border: "none",
    "&:disabled": {
      background: "linear-gradient(#B7FF5C, #EEFF21) !important",
      color: "#212121 !important",
    }
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
    maxWidth: "545px !important",
    padding: "90px 32px 50px 32px !important",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelTitle: {
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    fontFamily: "GRIFTER",
    fontSize: "18px",
  },
  cancelDesc: {
    color: "#ffffff",
    marginBottom: 64,
    textAlign: 'center',
    padding: '16px 50px',
    fontSize: '16px',
    lineHeight: '24px'
  },
  cancelButton: {
    backgroundColor: "transparent !important",
    color: "#DDFF57 !important",
    border: "1px solid #E9FF26 !important",
    borderRadius: "40px !important",
    width: '165px !important',
    textTransform: "uppercase"
  },
  editPriceButton: {
    backgroundColor: "#DDFF57 !important",
    color: "#0B151C !important",
    width: '165px !important',
    borderRadius: "40px !important",
    textTransform: "uppercase"
  }
}));
