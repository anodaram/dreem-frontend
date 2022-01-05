import { makeStyles } from "@material-ui/core/styles";

export const podCreateNFTMedialModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  warningScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& img:first-child": {
      marginTop: 20,
    },
    "& h3": {
      marginTop: 22,
      marginBottom: 30,
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 30,
      textAlign: "center",
      color: "#181818",
    },
    "& p": {
      fontStyle: "normal",
      fontSize: 18,
      textAlign: "center",
      color: "#707582",
      marginTop: 0,
      marginBottom: 15,
    },
    "& p:last-of-type": {
      marginBottom: 25,
      marginTop: 15,
      fontSize: 16,
    },
    "& button": {
      marginBottom: 20,
    },
  },
  modalContent: {
    padding: "20px 30px",
  },
  cardsOptions: {
    display: "flex",
    marginTop: -13,
    alignItems: "flex-start",
    marginBottom: 50,
  },
  tabHeaderPodMedia: {
    width: "auto",
    marginRight: 30,
  },
  tabHeaderPodMediaSelected: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 14,
    height: "auto",
    background: "-webkit-linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
    margin: 0,
    fontFamily: "Agrandir",
    color: "#29e8dc",
    borderBottom: "3px solid #29e8dc",
    cursor: "pointer",
  },
  tabHeaderPodMediaUnselected: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 14,
    height: "auto",
    color: "#99a1b3",
    fontFamily: "Agrandir",
    margin: 0,
    cursor: "pointer",
  },
  tabHeaderPodMediaLine: {
    background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%) left bottom #777 no-repeat",
    backgroundSize: "100% 5px",
  },
  headerCreatePod: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 22,
    color: "#181818",
    marginBottom: 18,
  },
  tooltipHeaderInfo: {
    width: 14,
    height: 14,
    margin: 0,
    marginLeft: 3,
    transform: "translateY(-1px)",
  },
  flexCenterCenterRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  popper: {
    maxWidth: 131,
    fontFamily: "Agrandir",
    fontSize: 11,
  },
  popperArrow: {
    "&::before": {
      borderColor: "#EFF2F8",
      backgroundColor: "#EFF2F8",
    },
  },
  tooltip: {
    padding: "22px 9px",
    borderColor: "#EFF2F8",
    backgroundColor: "#EFF2F8",
    color: "#707582",
    fontFamily: "Agrandir",
    fontSize: 11,
    textAlign: "center",
  },
}));
