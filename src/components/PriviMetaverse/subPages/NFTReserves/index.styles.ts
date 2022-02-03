import { makeStyles } from "@material-ui/core/styles";

export const useNFTOptionsStyles = makeStyles(theme => ({
  main: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundImage: `url(${require("assets/metaverseImages/metaverse_bg.png")})`,
    backgroundRepeat: "round",
    overflow: "hidden",
  },
  sideBar: {
    display: "flex",
    justifyContent: "center",
    position: "fixed",
    top: 72,
    minWidth: 59,
    height: "100%",
    background: "#212121",
    border: "2px solid #151515",
    zIndex: 2,
  },
  expandIcon: {
    marginTop: 16,
    cursor: "pointer",
  },
  collapseIcon: {
    position: "absolute",
    top: "16px",
    right: "18px",
    cursor: "pointer",
  },
  image1: {
    position: "absolute",
    left: -210,
    top: 560,
  },
  image2: {
    position: "absolute",
    top: 610,
    right: -200,
  },
  limitedContent: {
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 9.5%, #17151A 69.7%)",
    width: "100%",
    height: "100%",
  },
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100%",
    maxHeight: "100%",
    overflowX: "hidden",
    position: "relative",
    padding: "160px 32px 45px",
    marginLeft: "auto",
    marginRight: "auto",
    "& > div > h2": {
      fontFamily: "Grifter",
      fontWeight: "800",
      fontSize: "40px",
      lineHeight: "104.5%",
      margin: 0,
      color: "#431AB7",
      [theme.breakpoints.down("xs")]: {
        fontSize: "28px",
      },
      "& span": {
        fontSize: "18px",
        lineHeight: "23px",
      },
    },
    "& > h3": {
      marginTop: "64px",
      fontSize: "30px",
      lineHeight: "104.5%",
      marginBottom: "16px",
    },
    [theme.breakpoints.down("md")]: {
      paddingLeft: "30px",
      paddingRight: "30px",
      maxWidth: 1280,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "20px",
      paddingRight: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
    "& .infinite-scroll-component": {
      overflow: "visible !important",
    },
  },
  titleBar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "0 35px",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  title: {
    fontFamily: "GRIFTER",
    fontSize: 32,
    fontWeight: 700,
    color: "#fff",
    textTransform: "uppercase",
    textAlign: "left",
    [theme.breakpoints.down(950)]: {
      fontSize: 28,
    },
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 8,
      fontSize: 24,
    },
  },
  subTitle: {
    maxWidth: 750,
    fontFamily: "GRIFTER",
    fontSize: 20,
    fontWeight: 700,
    color: "white",
    marginTop: 10,
    textAlign: "center",
    textTransform: "uppercase",
    lineHeight: "20.9px",
    [theme.breakpoints.down(950)]: {
      fontSize: "14px",
      lineHeight: "120%",
    },
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 8,
    },
  },
  primaryButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "5px !important",
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: "16px important",
    color: "#212121 !important",
    border: "none !important",
    padding: "2px 24px !important",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px !important",
      width: "193px !important",
    },
  },
  gamePlayButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "100px !important",
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: "16px important",
    color: "#212121 !important",
    border: "none !important",
    padding: "2px 24px !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "35px",
  },
  gameslider: {
    border: "2px solid transparent",
    borderImageSource: "linear-gradient(180deg, rgba(255, 255, 255, 0) 42%, #E9FF26 100%)",
    borderImageSlice: "30%",
  },
  gameContent: {
    backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(255,0,0,0))",
  },
  gameBgImage: {
    position: "absolute",
    width: "100% !important",
    height: "100% !important",
    zIndex: -1,
  },
  sliderFooter: {
    position: "absolute",
    bottom: "-38px",
  },
  sliderLeft: {
    position: "absolute",
    bottom: "100px",
    left: "-110px",
  },
  sliderRight: {
    position: "absolute",
    top: "90px",
    right: "-110px",
  },
  sliderRect: {
    position: "absolute",
    bottom: 0,
    right: "-59px",
  },
  NFTSection: {
    width: "100%",
    marginTop: 46,
    maxWidth: 1400,
  },
  topGamesWrapper: {
    paddingTop: "50px",
    [theme.breakpoints.down(1200)]: {
      paddingTop: "30px",
    },
  },
  topGamesTitle: {
    display: "flex",
    alignItems: "center",
    paddingBottom: "25px",
    "& span": {
      fontFamily: "GRIFTER",
      fontSize: 34,
      fontWeight: 700,
      background: "linear-gradient(#B7FF5C, #EEFF21)",
      "-webkit-text-fill-color": "transparent",
      "-webkit-background-clip": "text",
      lineHeight: "40.8px",
      [theme.breakpoints.down("xs")]: {
        fontSize: 25,
      },
    },
    "& img": {
      width: 80,
      height: 80,
    },
  },
  carouselNav: {
    cursor: "pointer",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "8px",
    width: 74,
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      border: "2px solid #E9FF26",
      "& path": {
        stroke: "#E9FF26",
        opacity: 1,
      },
    },
  },
  topNFTContent: {
    display: "flex",
    background: "transparent",
    paddingBottom: 20,
    position: "relative",
    [theme.breakpoints.down(769)]: {
      marginBottom: 0,
      paddingBottom: 0,
    },
    "& button.rec-arrow-left": {
      position: "absolute",
      top: -100,
      right: 200,

      [theme.breakpoints.down(1200)]: {
        right: 60,
      },
      [theme.breakpoints.down(769)]: {
        // display: "none",
      },
    },
    "& button.rec-arrow-right": {
      position: "absolute",
      top: -100,
      right: 140,

      [theme.breakpoints.down(1200)]: {
        right: 0,
      },
      [theme.breakpoints.down(769)]: {
        display: "none",
      },
    },
    "& .rec-slider-container": {
      margin: "0px -12px",
      width: "calc(100% + 24px)",
      "& .rec-carousel-item": {
        "& > .rec-item-wrapper": {
          // minWidth: 330,
          // maxWidth: 370,
          // width: "unset",
          "& > div": {
            boxShadow: "none",
          },
        },
      },
    },
  },
  allNFTSection: {
    width: "100%",
    marginBottom: 40,
  },
  allNFTWrapper: {
    padding: "50px 40px",
    [theme.breakpoints.down(860)]: {
      padding: "50px 25px",
    },
  },
  fitContent: {
    maxWidth: 1600,
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "32px !important",
    paddingRight: "32px !important",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "16px !important",
      paddingRight: "16px !important",
    },
  },
  allNFTTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 34,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    lineHeight: "40.8px",
    textTransform: "uppercase",
    paddingBottom: 25,
    "& span": {
      background: "linear-gradient(90deg, #EDFF1C, #ED7B7B)",
      "-webkit-text-fill-color": "transparent",
      "-webkit-background-clip": "text",
    },
    "& img": {
      width: 80,
      height: 80,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 25,
    },
  },
  showAll: {
    border: "2px solid rgba(255, 255, 255, 0.5) !important",
    borderRadius: "12px !important",
    textTransform: "uppercase",
    background: "transparent !important",
    color: "#FFFFFF !important",
  },
  table: {
    width: "100%",
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textTitle: {
    color: "#FFFFFF",
    fontFamily: "Rany",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "18px",
    margin: 0,
  },
  titleImg: {
    width: 45,
    height: 45,
    borderRadius: 6,
    objectFit: "cover",
    margin: "0 20px",
  },
  whiteText: {
    color: "#FFFFFF",
    fontFamily: "Rany",
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "22px",
    margin: 0,
  },
  viewButton: {
    backgroundColor: "transparent !important",
    border: "2px solid rgba(255,255,255,0.5) !important",
  },
  featuredGames: {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    fontFamily: "Rany",
    fontWeight: 700,
    fontSize: 20,
    color: "#151515",
    textTransform: "uppercase",
    border: "2px solid rgba(21, 21, 21, 0.2)",
    padding: "8px 16px",

    "& svg": {
      marginRight: "13px",
    },
  },
}));
