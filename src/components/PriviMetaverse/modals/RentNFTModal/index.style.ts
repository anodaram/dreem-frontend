import { makeStyles } from "@material-ui/core/styles";

export const RentNFTModalStyles = makeStyles(theme => ({
  container: {
    padding: "0px !important",
  },
  purpleText: {
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "16px",
    minWidth: "55px",
    fontWeight: 400,
  },
  primaryButton: {
    color: "#fff !important",
    padding: "0 37px !important",
    height: "40px !important",
    border: "none !important",
  },
  box: {
    marginTop: 8,
    padding: "23px 18px",
    background: "rgba(158, 172, 242, 0.2)",
    borderRadius: 16,
    display: "flex",
    justifyContent: "space-between",
  },
  maxTime: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    color: "#F2604C",
    cursor: "pointer",
  },
  nameField: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    color: "#1A1B1C",
  },
  inputDays: {
    background: "rgba(144, 155, 255, 0.16)",
    border: "1px solid #431AB7 !important",
    width: "100%",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: "0 2px",
  },
  inputLabel: {
    fontFamily: "Montserrat",
    color: "#431AB7",
    fontSize: "14px",
    lineHeight: "120%",
    fontWeight: "bold",
  },
}));
