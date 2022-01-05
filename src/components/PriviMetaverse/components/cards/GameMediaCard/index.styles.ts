import { makeStyles } from "@material-ui/core/styles";

export const gameMediaCardStyles = makeStyles(theme => ({
  card: {
    position: "relative",
    borderRadius: 12,
    border: "2px solid #EDFF1C",
    background: "black",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    // "&:hover": {
    //   boxShadow: "0px 10px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)",
    //   transform: "scale(1.02)",
    // },
  },
  container: {
    padding: "28px 24px 20px 24px",
    [theme.breakpoints.down("sm")]: {
      padding: "24px 18px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "11px 12px",
    },
  },
  divider: {
    width: "calc(100% - 48px)",
    marginLeft: 24,
    height: 1,
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
  },
  button: {
    color: "black !important",
    textTransform: "uppercase",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "12px !important",
    width: "100% !important",
    [theme.breakpoints.down("sm")]: {
      fontSize: "14px !important",
      height: "37px !important",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px !important",
      height: "27px !important",
      lineHeight: "31px !important",
    },
  },
  image: {
    objectFit: "contain",
    objectPosition: "center",
    width: "100%",
    height: 260,
    [theme.breakpoints.down("sm")]: {
      height: 209,
    },
    [theme.breakpoints.down("xs")]: {
      height: 132,
    },
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "19px",
    lineHeight: "120%",
    textTransform: "uppercase",
    color: "#FFFFFF",
    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
  },
  skeleton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "30px 24px 70px",
    height: "100%",
    minHeight: 260,
    "& .MuiSkeleton-root": {
      backgroundColor: "#505050",
      borderRadius: 6,
    },
  },
  userName: {
    display: "flex",
    alignItems: "center",
    marginTop: 16,
    "& span": {
      marginLeft: 10,
      color: "#FFFFFF",
      fontFamily: "Rany",
      fontWeight: 500,
      fontSize: 16,
    },
  },
  cardContentDiv: {
    fontFamily: "Rany",
    display: "flex",
    justifyContent: "space-between",
    whiteSpace: "nowrap",
    marginBottom: "6px",
  },
  cardContentText: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "13px",
    lineHeight: "17px",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    color: "#FFFFFF",
    opacity: 0.5,
  },
  cardContentAmount: {
    float: "right",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "13px",
    lineHeight: "16px",
    textAlign: "center",
    letterSpacing: "0.02em",
    textTransform: "capitalize",
    color: "#FFFFFF",
  },
}));
