import { makeStyles } from "@material-ui/core/styles";

export const EditSellingPriceModalStyles = makeStyles(theme => ({
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
    cursor: "pointer",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 700,
    fontFamily: "Rany",
    lineHeight: "150%"
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
  cancelModal: {
    maxWidth: "521px !important",
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
  },
  borderBox: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    padding: 2,
    marginTop: 32
  },
  box: {
    padding: "23px 18px",
    background: "rgb(11, 21, 28)",
    display: "flex",
    justifyContent: "space-between"
  },
  currentPrice: {
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    fontSize: "16px",
    fontFamily: "Rany",
    lineHeight: "150%"
  }
}));
