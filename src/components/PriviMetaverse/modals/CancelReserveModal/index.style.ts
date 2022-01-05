import { makeStyles } from "@material-ui/core/styles";

export const CancelReserveModalStyles = makeStyles(theme => ({
  container: {
    maxWidth: "508px !important",
    padding: "25px !important",
  },
  nameField: {
    margin: "8px 0px 0px 0px",
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    color: "#ffffff",
    lineHeight: "21px"
  },
  availableCollateral: {
    padding: "23px 31px 23px 31px",
    marginTop: "26px",
    textAlign: 'center',
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.5)"
  },
  collateralText: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "150%",
    letterSpacing: "0.02em",
    color: "#ffffff",
  },
  collateralAmount: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "150%",
    letterSpacing: "0.02em",
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  cancelButton: {
    color: "#E9FF26 !important",
    maxWidth: "50px",
    border: "2px solid #E9FF26 !important",
    borderRadius: "40px !important",
    textTransform: "uppercase",
    background: "transparent !important",
  },
  confirmButton: {
    background: "#E9FF26 !important",
    color: "#212121 !important",
    textTransform: "uppercase",
    borderRadius: "40px !important",
    "&:disabled": {
      background: "#E9FF26 !important",
      color: "#212121 !important",
    }
  },
}));
