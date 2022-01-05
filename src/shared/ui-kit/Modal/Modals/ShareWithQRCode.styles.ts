import { makeStyles } from "@material-ui/core/styles";

export const shareQRCodeModalStyles = makeStyles(() => ({
  root: {
    width: "500px !important",
  },
  modalContent: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    "& > img": {
      width: 50,
      height: 50,
      marginBottom: 32,
    },
    "& h3": {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 30,
      textAlign: "center",
      margin: 0,
    },
    "& h6": {
      fontSize: 17,
      lineHeight: "104.5%",
      textAlign: "center",
      color: "#949bab",
      marginTop: 10,
      marginBottom: 18,
    },
  },
  downloadBox: {
    display: "flex",
    justifyContent: "space-around",
  },
  download: {
    background: "linear-gradient(97.4deg, #23d0c6 73.68%, #00cc8f 85.96%)",
    backgroundClip: "text",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
    "text-decoration": "none",
    cursor: "pointer",
  },
}));
