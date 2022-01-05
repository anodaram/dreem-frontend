import { makeStyles } from "@material-ui/core/styles";

export const useVerifyProfileModalStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: "#0B151C !important",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    color: "white !important",
    width: "788px !important",
    height: "500px !important",
    borderRadius: "0 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: "24px",
    lineHeight: "120%",
    textTransform: "uppercase",
    color: "#FFFFFF",
    marginBottom: "5px",
  },
  description: {
    fontFamily: "Rany",
    fontSize: "16px",
    lineHeight: "155%",
    textTransform: "uppercase",
    color: "#FFFFFF",
    textAlign: "center",
    wordBreak: "break-word",
    "& span": {
      textDecoration: "underline",
      color: "yellow",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    }
  },
  saluteIcon: {
    width: "90px",
    height: "90px",
    marginBottom: "46px",
  },
  button: {
    position: "relative",
    width: "381px !important",
    height: "54px !important",
    background: "#1DA1F2 !important",
    borderRadius: "4px !important",
    color: "white",
    fontFamily: "Montserrat",
    fontSize: "16px",
    lineHeight: "20px",
    marginTop: "38px",
    [theme.breakpoints.down("xs")]: {
      width: "256px !important",
    }
  },
  twitterIcon: {
    position: "absolute",
    left: "16px",
    top: "17px"
  },
  progressBar: {
    display: "flex",
    alignItems: "center",
    width: "400px",
    marginBottom: "94px",
    [theme.breakpoints.down("xs")]: {
      width: 260,
    }
  },
  line: {
    height: "1px",
    background: "#9897B8",
    flex: 1,
  },
  stepCircleOuter: {
    border: "0.858716px solid #9897B8",
    borderRadius: "50%",
    width: "46px",
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5px",
    position: "relative",
    "& span": {
      color: "#9897B8",
      fontFamily: "GRIFTER",
      fontWeight: "bold",
      fontSize: "16px",
      lineHeight: "120%"
    },
    "& label": {
      position: "absolute",
      top: "50px",
      whiteSpace: "nowrap"
    }
  },
  stepCircleInner: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#212121 !important"
  },
  urlInputBox: {
    display: "flex",
    flexDirection: "column",
    marginTop: "13px",
  },
  urlInputLabel: {
    fontFamily: "Rany",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "104.5%",
    color: "#FFFFFF",
    marginBottom: "10px",
  },
  urlInput: {
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    width: "647px",
    height: "47px",
    paddingLeft: "19px",
    color: "rgba(255, 255, 255, 0.5)",
    "&:focus": {
      outline: "none"
    },
    [theme.breakpoints.down("xs")]: {
      width: 340,
    }
  },
  confirmButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%) !important",
    width: "249px !important",
    height: "48px !important",
    color: "#212121 !important",
    marginTop: "43px",
    textTransform: "uppercase"
  }
}))