import { makeStyles } from "@material-ui/core/styles";

export const footerStyles = makeStyles(theme => ({
  contentBox: {
    borderTop: "1px solid #18181822",
    padding: `0px ${theme.spacing(20)}px`,
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      padding: `0px ${theme.spacing(5)}px`,
    },
    fontFamily: "Agrandir",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "22px",
    fontWeight: "normal",
    textDecoration: "underline",
  },
  title: {
    fontSize: "35px",
    fontWeight: 800,
    background: "radial-gradient(427.58% 951.54% at 39.31% -84.13%, #000000 0%, #DBDDF0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title2: {
    fontSize: "30px",
    fontWeight: 400,
  },
  title3: {
    color: "#4218B5",
    fontSize: 30,
    fontWeight: 400,
  },
  findUs: {
  },
  footerBox: {
    maxWidth: "1000px",
    margin: "auto",
    background: "#FFF",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 100,
    paddingBottom: 120,
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#D9F66F",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  footerTextWrapper: {
    marginTop: 0,
    marginLeft: 0,
  },
  '@media (max-width: 780px)' : {
    findUs: {
      marginTop: 10,
    },
    footerBox: {
      flexDirection: "column",
      paddingTop: 40,
    },
    footerTextWrapper: {
      marginTop: 30,
      marginLeft: 16,
    },
    contentBox: {
      padding: "0 20px",
    },
    header1: {
      fontSize: 18,
    },
    title2: {
      fontSize: 24,
    },
    title3: {
      fontSize: 24,
    },
    flexBox: {
      justifyContent: "space-between",
    }
  }
}));
