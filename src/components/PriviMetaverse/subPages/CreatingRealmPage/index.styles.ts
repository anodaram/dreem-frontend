import { makeStyles } from "@material-ui/core";

export const usePageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    padding: "0px 0px",
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
    backgroundImage: `url(${require("assets/metaverseImages/background_body.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",
    position: "relative",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Rany",
    textTransform: "uppercase",
    cursor: "pointer",
    "& span": {
      marginLeft: 5,
      marginTop: 2,
    },
  },
  content: {
    marginTop: 120,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 1600,
    marginLeft: "auto",
    marginRight: "auto",
    padding: "0 96px",
    [theme.breakpoints.down("sm")]: {
      padding: "0 24px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0 16px",
    },
  },
  smallPlanetImg: {
    position: "absolute",
    left: 127,
    top: 0,
  },
  largePlanetImg: {
    position: "absolute",
    right: 0,
    top: -25,
  },
  nextBtn: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "100px !important",
    fontSize: "18px !important",
    fontWeight: 700,
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    padding: "8px 53px 12px !important",
    color: "#212121 !important",
    cursor: "pointer",
    textTransform: "uppercase",
    height: "50px !important",
  },
  cancelBtn: {
    background: "transparent",
    border: "2px solid #ffffff80",
    borderRadius: 100,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    color: "#fff",
    padding: "15px 37px 10px",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  createCollectionBtn: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "19.2px",
    fontFamily: "GRIFTER",
    padding: "14px 18px",
    color: "#212121",
    cursor: "pointer",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: 12,
    },
  },
  typo1: {
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: "120%",
    textAlign: "center",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: 30,
      lineHeight: "30px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 22,
      lineHeight: "22px",
      width: 280,
    },
  },
  typo3: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "175%",
    fontFamily: "Rany",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
      width: 280,
    },
  },
  typo4: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: "120%",
    textAlign: "center",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      lineHeight: "30px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      lineHeight: "22px",
      width: 280,
    },
  },
  sideBox: {
    width: 136,
    height: 171,
    [theme.breakpoints.down("xs")]: {
      width: 82,
      height: 103,
    },
  },
  centerBox: {
    width: 169,
    height: 212,
    [theme.breakpoints.down("xs")]: {
      width: 102,
      height: 129,

      "& img": {
        width: 70,
        height: 70,
      },
    },
  },
  footer: {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    background: "rgba(0, 0, 0, 0.9)",
    backdropFilter: "blur(24px)",
    padding: "14px 212px",
    display: "flex",
    justifyContent: "space-between",
  },
}));
