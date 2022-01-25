import { makeStyles } from "@material-ui/core/styles";

export const useModalStyles = makeStyles(theme => ({
  container : {
    paddingTop: "70px",
    paddingBottom: "35px"
  },
  title: {
    marginTop: 64,
    marginBottom: 48,
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 40,
    textAlign: "center",
    fontFamily: "GRIFTER",
    lineHeight: "120%",
    textTransform: "uppercase",
    color: "FFFFFF"
  },
  content: {
    display: "grid",
    justifyContent: "center",
    alignItems: "center",
    gridTemplateColumns: "1fr 1fr 1fr",
    width: "fit-content",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr 1fr",
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "1fr",
    },
  },
  maskWrapper: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    margin: "0 31px 31px 31px",
    width: "300px",
    height: "400px",
    borderRadius: "16px",
    padding: "4px"
  },
  mask: {
    background: "#212121",
    borderRadius: "16px",
    width: "100%",
    height: "100%",
    padding: "42px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    cursor: "pointer"
  },
  cardTitle: {
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: "120%",
    textTransform: "uppercase",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
  },
  comingSoon: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 12px 6px",
    fontSize: 13,
    textTransform: "uppercase",
    fontFamily: "GRIFTER",
    color: "#000000"
  },
  imageBox: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));
