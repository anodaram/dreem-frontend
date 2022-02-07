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
      height: 48,
    },
    "& img,video": {
      width: "100%",
      height: "100%",
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
    height: 40,
    "& svg": {
      marginRight: 8,
    },
  },
  mapButton: {
    background: "#151515 !important",
    color: "#fff !important",
    borderRadius: "100px !important",
    display: "flex !important",
    justifyContent: "center !important",
    alignItems: "center !important",
    textTransform: "uppercase",
    padding: "0px 40px !important",
    border: "none !important"
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
  videoCtn: {
    position: 'relative',
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: "116px 0px 51px 0px",
    background: "linear-gradient(180deg, rgba(197, 255, 78, 0) 68.46%, rgba(228, 255, 45, 0.3) 95.05%), linear-gradient(180deg, rgba(0, 0, 0, 0) 9.5%, #17151A 69.7%)",
    borderBottom: "2px solid #E9FF26",
    "& > div:last-child":{
      border: 'none',
    }
  },
  statItem: {
    color: '#E9FF26',
    paddingLeft: 52,
    width: '100%',
    borderRight: '2px solid rgba(233, 255, 38, 0.2)',
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 12,
    },
  },
  val: {
    textShadow: "0px 4px 7px rgba(230, 255, 42, 0.26)",
    "fontFamily": "GRIFTER",
    "fontStyle": "normal",
    "fontWeight": "bold",
    "fontSize": "34px",
    "lineHeight": "36px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  desc: {
    "fontFamily": "Rany",
    "fontStyle": "normal",
    "fontWeight": "bold",
    "fontSize": "14px",
    "lineHeight": "150%",
    textTransform: 'uppercase',
    [theme.breakpoints.down("sm")]: {
      fontSize: 10,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 8,
    },
  },
  publicStateCtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 32,
    left: 51,
    zIndex: 999,
  },
  public: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    "fontFamily": "Rany",
    "fontStyle": "normal",
    "fontWeight": "bold",
    "fontSize": "20px",
    "lineHeight": "190%",
    color: "#E9FF26",
    background: "#151515",
    borderRadius: 4,
    padding: '4px 18px',
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
      top: 12,
      left: 30,
      padding: '2px 8px',
    },
  },
  seeDetailBtn: {
    color: "#151515",
    background: 'linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)',
    borderRadius: 4,
    "fontFamily": "Rany",
    "fontStyle": "normal",
    "fontWeight": "bold",
    "fontSize": "20px",
    "lineHeight": "190%",
    padding: '4px 18px',
    cursor: 'pointer',
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
    },
  }
}));
