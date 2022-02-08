import { makeStyles } from "@material-ui/core";

export const worldDetailPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${require("assets/metaverseImages/background_world_body.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      height: "145%",
    },
  },
  container: {
    width: "100%",
    paddingTop: 150,
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
  },
  seedImage: {
    position: "absolute",
    top: -180,
    right: "calc(48% - 285px)",
  },
  fitContent: {
    maxWidth: 1280,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 48px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0px 16px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  userInfoSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "start",
    },
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 43,
    height: 43,
    borderRadius: "100%",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    cursor: "pointer",
    "& + &": {
      marginLeft: 12,
    },
  },
  worldInfoSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      marginTop: 0,
    },
  },
  worldImage: {
    minWidth: 600,
    height: 600,
    [theme.breakpoints.down("sm")]: {
      minWidth: 675,
      height: 450,
      marginBottom: 40,
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: 345,
      height: 320,
      marginBottom: 40,
    },
  },
  content: {
    background: "#151515",
    marginTop: 80,
    paddingTop: 80,
    paddingBottom: 96,
    position: "relative",
    minHeight: 800,
  },
  tabSection: {
    position: "absolute",
    top: -32,
    background: "#151515",
    width: 1280,
    [theme.breakpoints.down("sm")]: {
      width: "88%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "91%",
    },
  },
  bgImgTriangle: {
    position: "absolute",
    width: 635,
    right: -300,
    bottom: 160,
  },
  typo1: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    lineHeight: "120%",
  },
  typo2: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Rany",
  },
  typo3: {
    fontSize: 62,
    fontWeight: 800,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    lineHeight: "100%",
    letterSpacing: "0.02em",
    [theme.breakpoints.down("xs")]: {
      fontSize: 34,
    },
  },
  typo4: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Rany",
    lineHeight: "175%",
  },
}));
