import { makeStyles } from "@material-ui/core/styles";

export const ReserveNftModalStyles = makeStyles(theme => ({
  container: {
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
    borderRadius: "unset !important",
  },
  tokenSelect: {
    backgroundColor: "#172227 !important",
    border: "1px solid rgba(218, 218, 219, 0.59) !important",
    width: "100%",
    padding: theme.spacing(1),
    color: "#ffffff !important",
    borderRadius: "unset !important",
    flex: "1",
  },
  purpleText: {
    fontFamily: "Rany",
    cursor: "pointer",
    color: "#ffffff",
    fontSize: "14px",
    minWidth: "55px",
    fontWeight: 400,
  },
  usdWrap: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "0",
    },
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
    fontFamily: "Rany",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "16px",
  },
  totalText: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "150%",
    letterSpacing: "0.02em",
    color: "#ffffff",
  },
  footer: {
    padding: "18px 25px 25px 25px",
    background: "#182127",
  },
  primaryButton: {
    background: "linear-gradient(#B7FF5C, #EEFF21) !important",
    color: "#212121 !important",
    padding: "0 37px !important",
    height: "40px !important",
    border: "none !important",
    borderRadius: "40px !important",
    "&:disabled": {
      background: "linear-gradient(#B7FF5C, #EEFF21) !important",
      color: "#212121 !important",
    },
  },
}));
