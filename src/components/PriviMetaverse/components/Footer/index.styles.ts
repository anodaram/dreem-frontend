import { makeStyles } from "@material-ui/core/styles";

export const footerStyles = makeStyles(theme => ({
  bottomBox: {
    display: "flex",
    justifyContent: "center",
    backgroundImage: `url(${require("assets/metaverseImages/background_footer.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",
  },
  contentBox: {
    display: "flex",
    alignItems: "flex-end",
    padding: "80px 0 100px",
    width: "100%",
    color: "#fff",
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      padding: "60px 0 68px 0",
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: 32,
      paddingBottom: 80,
      flexDirection: "column",
      alignItems: "flex-start",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "60px 0",
      "& > div + div": {
        marginTop: 40,
      },
    },
  },
  fitContent: {
    maxWidth: 1280,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("lg")]: {
      paddingLeft: 120,
      paddingRight: 120,
    },
    [theme.breakpoints.down("md")]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 80,
      paddingRight: 160,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 40,
      paddingRight: 40,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  snsBox: {
    width: 52,
    height: 52,
    background: "#D9F66F",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  descriptionBox: {
    display: "flex",
    flexDirection: "column",
    "& > a": {
      color: "white",
      textDecoration: "unset",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 87,
    },
  },
  header1: {
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "Rany",
    lineHeight: "190%",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  title1: {
    fontSize: "56px",
    fontWeight: 700,
    fontFamily: "GRIFTER",
    color: "#fff",
    textTransform: "uppercase",
    [theme.breakpoints.down("xs")]: {
      fontSize: 38,
      marginTop: 32,
    },
  },
  title2: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    lineHeight: "104.5%",
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
      marginBottom: 16,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  title3: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    lineHeight: "104.5%",
  },
  image: {
    width: 320,
    height: 320,
    marginRight: 80,
    [theme.breakpoints.down("sm")]: {
      width: 100,
      height: 100,
      marginBottom: 24,
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: -100,
    },
    WebkitAnimation: "$rotating 3s linear infinite",
    animation: "$rotating 3s linear infinite",
    MozAnimation: "$rotating 3s linear infinite",
  },
  "@keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  "@-webkit-keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  "@-moz-keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  left: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      flex: 0,
      flexDirection: "column",
      justifyContent: "flex-start",
    },
  },
}));
