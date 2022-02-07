import { makeStyles } from "@material-ui/core/styles";

export const votingItemStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: 2,
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
  },
  rootMain: {
    background: "#151515",
    padding: "21px 105px 20px 20px",
    [theme.breakpoints.down("sm")]: {
      padding: 10,
    },
    [theme.breakpoints.down("xs")]: {
      padding: 8,
    },
  },
  skeleton: {},
  sktImage: {},
  sktTitle: {},
  sktDays: {},
  sktInfo1: {},
  sktInfo2: {},
  sktButton: {},

  container: {},
  image: {
    width: 102,
    height: 102,
    marginRight: 28,
    [theme.breakpoints.down("xs")]: {
      width: 57,
      height: 57,
      marginRight: 8,
    },
  },
  titleSection: {
    flex: 1,
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "104.5%",
    marginRight: 32,
    [theme.breakpoints.down("sm")]: {
      fontWeight: "normal",
      display: "flex",
      flexDirection: "column",
      margin: 8,
    },
    [theme.breakpoints.down("xs")]: {
      margin: 0,
      justifyContent: "space-between",
    },
  },
  title: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 34,
    lineHeight: "120%",
    alignItems: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    // width: "fit-content",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  status: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: "140%",
    alignItems: "center",
    textTransform: "uppercase",
    // width: "fit-content",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
  },
  infoSection: {
    flex: 2,
  },
  quorumName: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: "104%",
  },
  quorumValue: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: "150%",
  },
  name: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 16,
    lineHeight: "160%",
    color: 'rgba(255, 255, 255, 0.6)',
    paddingRight: 16,
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
      paddingRight: 4,
    },
  },
  address: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 16,
    lineHeight: "104%",
    color: 'rgba(255, 255, 255, 0.8)',
    paddingLeft: 16,
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
      paddingLeft: 4,
    },
  },
  votingPowerValue: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: "120%",
    color: '#FFFFFF',
    marginTop: 11,
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
  },
  arWrap: {},
  progressBox: {
    width: 188,
    height: 24,
    background: "rgba(255,255,255,0.3)",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: 95,
      display: "flex",
      marginRight: 0,
    },
    [theme.breakpoints.down("xs")]: {
      width: 95,
      display: "flex",
      marginRight: 0,
    },
  },
  doneBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 24,
  },
  barLabel: {
    position: "absolute",
    top: 2,
    left: 12,
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: "160%",
    color: "#151515",
  },
  barValue: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 16,
    lineHeight: "19px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  detailButton: {
    width: 156,
    height: 46,
    color: "#151515 !important",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    [theme.breakpoints.down("sm")]: {
      width: "100% !important",
    },
    [theme.breakpoints.down("xs")]: {
      width: "156px !important",
    },
  },
}));
