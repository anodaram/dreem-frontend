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
      fontFamily: "Agrandir GrandHeavy",
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
    }
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

    '& svg': {
      marginRight: '13px'
    }
  },
  gameslider: {
    border: "2px solid transparent",
    borderImageSource: "linear-gradient(180deg, rgba(255, 255, 255, 0) 42%, #E9FF26 100%)",
    borderImageSlice: "30%",
  },
  gameContent: {
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(255,0,0,0))'
  },
  gameBgImage: {
    position: 'absolute',
    width: '100% !important',
    height: '100% !important',
    zIndex: -1
  },
  sliderFooter: {
    position: 'absolute',
    bottom: '-38px'
  },
  sliderLeft: {
    position: 'absolute',
    bottom: '100px',
    left: '-110px'
  },
  sliderRight: {
    position: 'absolute',
    top: '90px',
    right: '-110px'
  },
  sliderRect: {
    position: 'absolute',
    bottom: 0,
    right: '-59px'
  },
  NFTSection: {
    width: "100%",
    marginTop: 46,
    maxWidth: 1400
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
        opacity: 1
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
    fontSize: 24,
    fontWeight: 800,
    color: "#431AB7",
    fontFamily: "Agrandir GrandHeavy",
    lineHeight: "130%",
    "& span": {
      paddingBottom: 25,
    },
    "& img": {
      width: 80,
      height: 80,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 25,
    },
  },
}));
