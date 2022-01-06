import { makeStyles } from "@material-ui/core/styles";

export const useManageNFTPageStyles = makeStyles(theme => ({
  subTitleSection: {
    display: "flex",
    width: "100%",
    overflow: "auto",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "Agrandir",
    color: "#431AB7",
    lineHeight: "23px",
    marginTop: 32,
    padding: "0 20px",
    cursor: "pointer",
    [theme.breakpoints.down(1110)]: {
      fontSize: 15,
    },
    [theme.breakpoints.down(950)]: {
      fontSize: 12,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0 0",
    },
  },
  tabSection: {
    height: 55,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Agrandir GrandHeavy",
    opacity: 0.45,
    [theme.breakpoints.down(1250)]: {
      maxWidth: 420,
    },
    [theme.breakpoints.down(1110)]: {
      maxWidth: 350,
    },
    [theme.breakpoints.down(950)]: {
      maxWidth: 275,
      fontSize: 14,
    },
    [theme.breakpoints.down(580)]: {
      maxWidth: 165,
      fontSize: 16,
      margin: "0 0",
      padding: "0 24px",
      height: "84px",
      width: "50%",
    },
    borderBottom: "4px solid transparent",
    "& + &": {
      marginLeft: 80,
    },
  },
  selectedTabSection: {
    opacity: 1,
    borderBottom: "4px solid #431AB7",
  },

  backButtonContainer: {
    width: "100%",
    margin: "10px 0 30px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      margin: "50px 0 70px 0",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "50px 0 50px 0",
    },
  },
  backBtn: {
    position: "absolute",
    left: 32,
    [theme.breakpoints.down("sm")]: {
      top: -20,
      left: 40,
    },
  },
  title: {
    fontSize: 20,
    fontFamily: "Agrandir GrandHeavy",
    display: "flex",
    alignItems: "center",
    color: "#431AB7",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  fitContent: {
    maxWidth: 1600,
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "32px !important",
    paddingRight: "32px !important",
    paddingBottom: "30px",
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "16px !important",
      paddingRight: "16px !important",
    },
  },
}));
