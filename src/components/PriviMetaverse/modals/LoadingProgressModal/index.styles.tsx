import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const useLoadingProgressModalStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    padding: "100px 146px !important",
    maxWidth: "755px !important",
    height: "612px",
    background: "rgba(11, 21, 28, 0.6)!important;",
    borderRadius: "0px!important",
    [theme.breakpoints.down("sm")]: {
      padding: "24px 18px!important",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "11px 12px!important",
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "GRIFTER",
    "& span": {
      fontWeight: 400,
    },
  },
  header1: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "24px",
    color: "#FFFFFF",
  },
  header2: {
    fontSize: 18,
    fontWeight: 400,
    color: "#FFFFFF",
  },
  header3: {
    fontSize: 28,
    fontWeight: 800,
    color: Color.MusicDAODark,
    "& span": {
      color: Color.MusicDAOGray,
    },
  },
  button: {
    width: "249px",
    position: "absolute",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    bottom: "61px",
    left: "calc(50% - 249px/2)",
    height: "48px",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "1000px",
    color: "#000000",
    fontSize: "18px",
    fontWeight: "bold"
  },
  customButtonBox: {
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    "& svg": {
      position: "absolute",
      right: 0,
      top: 0,
      left: 0,
      transform: "translate(0, 0)",
      height: "100%",
      zIndex: 0,
    },
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
  loader: {
    WebkitAnimation: "$rotating 0.5s linear infinite",
    animation: "$rotating 0.5s linear infinite",
    MozAnimation: "$rotating 0.5s linear infinite",
  },
}));
