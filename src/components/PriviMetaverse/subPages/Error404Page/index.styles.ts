import { makeStyles } from '@material-ui/core';

export const error404PageStyles = makeStyles(theme => ({
  mainContent: {
    width: "100%",
    height: "100%",
    paddingTop: "72px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#000",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 10,
    padding: "0px 30px",
    textAlign: "center",
  },
  title: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bolder",
    fontSize: "143px",
    lineHeight: "149px",
    textTransform: "uppercase",
    background: "linear-gradient(113deg, #ED7C7C 40%, #EDF225 65%, #000)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  description: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bolder",
    fontSize: "32px",
    lineHeight: "33px",
    textTransform: "uppercase",
  },
  descPrev: {

  },
  descContent: {
    background: "linear-gradient(289deg, #ED7C7C 40%, #e3e736 80%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  detail: {
    marginTop: "10px",
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "25px",
  },
  action: {
    marginTop: "40px"
  },
  goHomeBtn: {
    fontFamily: "GRIFTER",
    fontWeight: 700,
    borderRadius: 48,
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%) !important",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px 40px',
    fontSize: "18px",
    lineHeight: "18px",
    color: '#212121',
    marginTop: 30,
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      fontSize: "16px",
      lineHeight: "16px",
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: "14px",
      lineHeight: "14px",
    }
  },
  leftBg: {
    position: "absolute",
    left: 0,
    bottom: 0,
    maxWidth: "50%",
  },
  rightBg: {
    position: "absolute",
    right: 0,
    top: 0,
    maxWidth: "50%",
  },
  image: {
    maxWidth: "100%",
  }
}));
