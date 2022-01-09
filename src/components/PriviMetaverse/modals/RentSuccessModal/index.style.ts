import { makeStyles } from "@material-ui/core/styles";

export const RentSuccessModalStyles = makeStyles(theme => ({
  container: {
    padding: "31px 149px !important",
    maxWidth: "681px !important",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& button": {
      fontFamily: "GRIFTER",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      lineHeight: "120%",
      textAlign: "center",
      textTransform: "uppercase",
      color: "#212121",
      padding: "16px 44px",
      background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
      borderRadius: 1000,
      height: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "48px 16px !important",
    }
  },
  borderBox: {
    borderRadius: 16,
    background:
      "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)",
    padding: 2,
  },
  box: {
    position: "relative",
    borderRadius: 16,
    padding: "26px 24px 34px",
    background: "rgb(11, 21, 28)",
    "& img": {
      width: 258,
      height: 258,
    },
  },
  tag: {
    position: "absolute",
    top: 36,
    right: 32,
    background:
      "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)",
    borderRadius: 4,
    padding: "5px 4px",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "10px",
    lineHeight: "10px",
    textAlign: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  gameName: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "19.4957px",
    lineHeight: "120%",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  title: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "24px",
    lineHeight: "120%",
    textAlign: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  description: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "150%",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)",
    "& span": {
      color: "#EEFF21",
    },
  },
}));
