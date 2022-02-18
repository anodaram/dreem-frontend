import { makeStyles } from "@material-ui/core";

export const exploreRealmsPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
    background: "#151515",
    position: "relative",
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
    "& .infinite-scroll-component": {
      overflow: "visible !important",
    },
  },
  realmContainer: {
    position: "relative",
    paddingTop: 150,
    paddingBottom: 96,
    background: "#151515",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 48,
    },
  },
  gradientText: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "40px",
    lineHeight: "120%",
    alignItems: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: "26px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "25px",
    },
  },
  carousel: {
    display: "flex",
    alignItems: "center",
    marginLeft: -72,
    marginRight: -72,
    "& .rec.rec-slider-container": {
      margin: 0,
      width: "calc(100% + 16px)",
      marginLeft: -8,
      marginRight: -8,
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginLeft: 4,
      marginRight: 0,
    },
  },
  carouselItem: {
    width: "100%",
    height: 200,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      height: 130,
    },
    [theme.breakpoints.down("xs")]: {
      height: 100,
    },
    "&:hover": {
      transform: "scaleX(1.02)",
    },
  },
  arrowBox: {
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "100vh",
    width: 53,
    height: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginTop: "-150px",
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      marginTop: "-25px",
    },
  },
  shadowText: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "40px",
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    marginLeft: "20px",

    letterSpacing: "0.02em",
    textTransform: "uppercase",
    WebkitTextStroke: "1px rgba(255, 255, 255, 0.6)",
    color: "transparent",
    WebkitBackgroundClip: "text",
    background: "transparent",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      fontSize: "26px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "25px",
    },
  },
  gradient1: {
    WebkitBackgroundClip: "text",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
  },
  fitSize: {
    [theme.breakpoints.down("xs")]: {
      whiteSpace: "break-spaces",
    },
  },
  bgImgTriangle: {
    position: "absolute",
    width: 635,
    right: "-23px",
    top: "123px",
    [theme.breakpoints.down("md")]: {
      width: 425,
    },
    [theme.breakpoints.down("sm")]: {
      // display: "none",
      right: -210,
    },
  },
  bgImgGreenCircle: {
    position: "absolute",
    width: 400,
    top: 1600,
    left: 10,
    right: "calc(50% - 185px)",
    [theme.breakpoints.down("sm")]: {
      right: -150,
      width: "300px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "200px",
      left: -100,
      bottom: 70,
    },
  },
}));
