import { makeStyles } from "@material-ui/core/styles";

export const MakeSetBlockingPriceModalStyles = makeStyles(theme => ({
  container: {
    maxWidth: "508px !important",
    padding: "0px !important",
  },
  nameField: {
    margin: "27px 0px 7px 0px",
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    color: "#ffffff",
  },
  inputJOT: {
    backgroundColor: "#172227 !important",
    border: "1px solid rgba(218, 218, 219, 0.59) !important",
    width: "100%",
    padding: theme.spacing(1),
    color: "#ffffff60 !important",
    borderRadius: "unset !important"
  },
  tokenSelect: {
    backgroundColor: "#172227 !important",
    border: "1px solid rgba(218, 218, 219, 0.59) !important",
    width: "100%",
    padding: theme.spacing(1),
    color: "#ffffff !important",
    borderRadius: "unset !important",
    flex: "1"
  },
  purpleText: {
    fontFamily: "Rany",
    cursor: "pointer",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 500,
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
      color: "#ffffff",
      fontSize: "16px",
    },
  },
  usdt: {
    fontFamily: "Agrandir GrandHeavy !important",
    color: "#ffffff",
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
    color: "#ffffff",
  },
  secondaryButton: {
    padding: "0 37px !important",
  },
  datePicker: {
    border: "1px solid #ffffff",
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
}));
