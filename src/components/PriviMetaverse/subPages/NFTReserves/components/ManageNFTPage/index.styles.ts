import { makeStyles } from "@material-ui/core/styles";

export const useManageNFTPageStyles = makeStyles(theme => ({
  subTitleSection: {
    border: "2px solid transparent",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderImageSlice: "30%",
    display: "flex",
    width: "100%",
    overflow: "auto",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "GRIFTER",
    color: "#ffffff",
    lineHeight: "23px",
    padding: "16px 20px",
    cursor: "pointer",
    margin: "0px !important",
    [theme.breakpoints.down(1110)]: {
      fontSize: 15,
    },
    [theme.breakpoints.down(950)]: {
      fontSize: 12,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "8px 8px",
    },
    "&::-webkit-scrollbar": {
      height: 0,
    },
  },
  tabSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "GRIFTER",
    padding: "10px 30px",
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
      padding: "0 10px",
      height: "84px",
      width: "50%",
    },
    borderBottom: "4px solid transparent",
    "& + &": {
      marginLeft: 80,
      [theme.breakpoints.down(1110)]: {
        marginLeft: 60,
      },
      [theme.breakpoints.down(950)]: {
        marginLeft: 40,
      },
      [theme.breakpoints.down(580)]: {
        marginLeft: 5,
      },
    },
  },
  selectedTabSection: {
    opacity: 1,
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "2px",
    color: "#212121",
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
    left: 0,
    [theme.breakpoints.down("sm")]: {
      top: -20,
    },
  },
  title: {
    fontSize: 20,
    fontFamily: "GRIFTER",
    display: "flex",
    alignItems: "center",
    color: "#EDFF1C",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    display: "flex",
    alignItems: "center",
    marginTop: 54,
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    [theme.breakpoints.down("xs")]: {
      fontSize: 28,
      marginTop: 16,
    },
  },
  fitContent: {
    maxWidth: 1280,
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

export const useTabsStyles = makeStyles(theme => ({
  tab: {
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: "20.2px",
    color: "white",
    borderRadius: "2px",
    padding: "10px 30px",
    textTransform: "uppercase",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      flex: 1,
      fontSize: 10,
      padding: "8px 10px",
      textAlign: "center",
    },
  },
  selected: {
    color: "#212121",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
  },
}));
