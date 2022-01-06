import { makeStyles } from "@material-ui/core";

export const realmDetailPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${require("assets/metaverseImages/background_body.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",
    position: "relative",
  },
  container: {
    width: "100%",
    marginTop: 71,
    paddingTop: 80,
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 40,
    },
    "& > img": {
      position: "absolute",
      top: -70,
      right: -40,
      [theme.breakpoints.down("sm")]: {
        top: -100,
        right: -150,
      },
      [theme.breakpoints.down("sm")]: {
        top: -148,
        right: -168,
      },
    },
  },
  fitContent: {
    maxWidth: 1280,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 46,
      paddingRight: 46,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 26,
      paddingRight: 26,
    },
  },
  no: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    color: "#fff",
    paddingLeft: 2,
  },
  title: {
    fontSize: 62,
    fontWeight: 700,
    lineHeight: "62px",
    textTransform: "uppercase",
    color: "#fff",
    [theme.breakpoints.down("xs")]: {
      fontSize: 34,
    },
  },
  description: {
    fontSize: "16px",
    fontWeight: 400,
    fontFamily: "Rany",
    lineHeight: "28px",
    color: "#FFFFFF",
    maxWidth: 900,
    marginBottom: 40,
    [theme.breakpoints.down("sm")]: {
      marginBottom: 78,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
      lineHeight: "21.7px",
      marginBottom: 31,
    },
  },
  control: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "space-between",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      "& > button": {
        marginBottom: "77px",
      },
    },
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderRadius: "100%",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    cursor: "pointer",
    "& + &": {
      marginLeft: 12,
    },
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 680,
    [theme.breakpoints.down("sm")]: {
      marginTop: 32,
      height: 582,
    },
    [theme.breakpoints.down("xs")]: {
      height: 374,
    },
    "& button": {
      marginTop: -20,
      zIndex: 1,
    },
    "& img,video": {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      objectFit: "cover",
      objectPosition: "center",
    },
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%) !important",
    borderRadius: "100px !important",
    border: "2px solid #000000 !important",
    color: "black !important",
    textTransform: "uppercase",
    fontSize: "16px !important",
    "& svg": {
      marginRight: 8,
    },
  },
  content: {
    paddingTop: 90,
    background: "#151515",
    paddingBottom: 96,
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 48,
    },
  },
  extensionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "initial",
      alignItems: "flex-start",
    },
  },
  addExtensionBtn: {
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
      marginTop: 18,
    },
  },
  gradientText: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "34px",
    lineHeight: "120%",
    alignItems: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    width: "fit-content",
  },
  creatorinfoSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    width: "fit-content",
    cursor: "pointer",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "GRIFTER",
    lineHeight: "104.5%",
  },
}));
