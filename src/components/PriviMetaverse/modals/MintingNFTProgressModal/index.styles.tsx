import { makeStyles } from "@material-ui/core/styles";

export const useModalStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    padding: "60px 80px !important",
    maxWidth: "680px !important",
    background: "rgba(11, 21, 28, 0.6) !important",
    borderRadius: "0px !important",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    "& span": {
      fontWeight: 400,
    },
  },
  header1: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "24px",
    color: "#ffffff",
  },
  header2: {
    fontSize: 18,
    fontWeight: 400,
    color: "#E9FF26",
  },
  header3: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Rany",
    color: "#fff",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  ethImg: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "calc(50% - 34px)",
    top: "calc(50% - 40px)",
    borderRadius: "50%",
    padding: "10px",
    width: "70px",
    height: "70px",
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
  nftImage: {
    width: 397,
    height: 258,
    border: "3px solid #E9FF26",
  },
  shareSection: {
    borderTop: "1px solid rgba(218, 230, 229, 0.06)",
    paddingTop: 20,
    marginTop: 30,
  },
  snsIconList: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& div:not(:last-child)": {
      marginRight: theme.spacing(4),
    },
  },
  snsBox: {
    width: 48,
    height: 48,
    background: "#E9FF26",
    borderRadius: "50%",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
}));
