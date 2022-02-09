import { makeStyles } from "@material-ui/core";

export const explorePage = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  filterBar: {
    marginTop: 72,
    height: "calc(100% - 72px)",
    background: "#212121",
    border: "2px solid #151515",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    fontSize: 16,
    fontWeight: 800,
    lineHeight: "190%",
    fontFamily: "Rany",
    textTransform: "uppercase",
  },
  mainContent: {
    width: (props: any) => (props.openFilterBar ? "calc(100% - 293px)" : "calc(100% - 55px)"),
    height: "calc(100% - 72px)",
    marginTop: 72,
    paddingTop: 32,
    position: "relative",
    overflowY: "auto",
    overflowX: "hidden",
    zIndex: 1,
  },
  fitContent: {
    paddingLeft: (props: any) => (props.openFilterBar ? 110 : 140),
    paddingRight: (props: any) => (props.openFilterBar ? 110 : 140),
    [theme.breakpoints.down("md")]: {
      paddingLeft: "60px !important",
      paddingRight: "60px !important",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "32px !important",
      paddingRight: "32px !important",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 24,
      paddingRight: 24,
    },
  },
  gradientText: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "40px",
    lineHeight: "120%",
    alignItems: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    width: "fit-content",
    [theme.breakpoints.down("sm")]: {
      fontSize: "28px",
      lineHeight: "48px",
    },
    [theme.breakpoints.down("xs")]: {},
  },
  backImg1: {
    position: "absolute",
    top: 200,
    left: 56,
    transform: "rotate(180deg)",
    [theme.breakpoints.down("xs")]: {
      width: 100,
      left: -50,
    },
  },
  backImg2: {
    position: "absolute",
    top: 400,
    right: -480,
    [theme.breakpoints.down("md")]: {
      width: 400,
    },
    [theme.breakpoints.down("sm")]: {
      width: 300,
    },
  },
  filterHeader: {
    padding: "16px 28px 16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterMainSection: {
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: 7,
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(21, 21, 21, 0.2)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: 30,
    },
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  subFilterSection: {
    padding: "12px 24px 16px",
  },
  searchSection: {
    background: "rgba(21, 21, 21, 0.3)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px`,
    cursor: "pointer",
    color: "#ffffff80",
    minWidth: 290,
    height: 48,
    [theme.breakpoints.down("sm")]: {
      minWidth: 200,
      height: 38,
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: "100%",
      marginTop: 8,
    },
  },
  expandIcon: {
    padding: 16,
    cursor: "pointer",
  },
}));
