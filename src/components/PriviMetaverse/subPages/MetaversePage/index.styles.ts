import { makeStyles } from "@material-ui/core";

export const metaversePageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
    position: "relative",
    background: "black",
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
    "& .infinite-scroll-component": {
      overflow: "visible !important",
    },
  },
  mainContainer: {
    position: "relative",
    paddingTop: 150,
    paddingBottom: 96,
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 48,
    }
  },
  title: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "62px",
    lineHeight: "62px",
    alignItems: "center",
    textTransform: "uppercase",
    [theme.breakpoints.down("md")]: {
      fontSize: "34px",
      lineHeight: "34px",
    },
    [theme.breakpoints.down("sm")]: {
      whiteSpace: "break-spaces",
    },
  },
  description: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "24px",
    lineHeight: "37.2px",
    maxWidth: "600px",
    whiteSpace: "pre-wrap",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
      lineHeight: "20px",
      marginTop: 20,
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
  },
  arrowBox: {
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "100vh",
    width: 53,
    height: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginTop: "-150px",
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      marginTop: "-25px",
    },
  },
  fitSize: {
    [theme.breakpoints.down("xs")]: {
      whiteSpace: "break-spaces",
    },
  },
  bgContainer: {
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "800px",
    left: 0,
    top: "0px",
  },
  bgCover: {
    position: "absolute",
    width: "100%",
    height: "800px",
    left: 0,
    top: "0px",
  },
  bgTop: {
    position: "absolute",
    top: 0,
    left: "70%",
  },
  bgBotom: {
    position: "absolute",
    width: "100%",
    height: "430px",
    top: "400px",
    left: 0,
    background: "linear-gradient(180deg, #00000000 0%, #000000ff 80%)",
  },
  nftContentSection: {
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
  },
  tabSection: {
    display: "none", //"flex",
    padding: "24px 16px",
    border: "1px solid #ED7B7B",
    overflow: "scroll",
    marginTop: 32,
    "&::-webkit-scrollbar": {
      height: 0,
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: -26,
      borderRight: "none",
    },
  },
  selectSection: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-end",
    }
  },
  selectedTab: {
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "GRIFTER",
    lineHeight: "120%",
    cursor: "pointer",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    padding: "10px 39px",
    color: "#212121",
    textTransform: "uppercase",
    borderRadius: 2,
    height: 35,
    whiteSpace: "nowrap",
  },
  tab: {
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "GRIFTER",
    lineHeight: "120%",
    color: "#ffffff",
    cursor: "pointer",
    background: "transparent",
    padding: "10px 39px",
    height: 35,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  searchBarContainer: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      marginLeft: "42px",
      alignItems: "flex-start",
    },
    [theme.breakpoints.down("xs")]: {
      margin: "32px auto",
      width: "100%",
    },
  },
  searchBar: {
    width: "390px",
    height: "59px",
    border: "solid white 1px",
    color: "white",
    fontSize: "16px",
    fontWeight: 500,
    fontFamily: "Rany",
    lineHeight: "120%",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    [theme.breakpoints.down("sm")]: {
      width: "251px",
      height: "42px",
      borderRadius: 0,
    },
    [theme.breakpoints.down("xs")]: {
      margin: "20px 0px",
      width: "100%",
    },
  },
  searchIcon: {},
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  filterActive: {
    background: "#4218B5 !important",
    color: "#fff",
    "& *": {
      color: "#fff !important",
    },
    "& svg path": {
      fill: "white !important",
    },
  },
  filterButtonBox: {
    background: "rgba(240, 245, 248, 0.7)",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px`,
    cursor: "pointer",
    borderRadius: "100vh",
    border: "1px solid #ccc",
    color: "#E9FF26",
    [theme.breakpoints.down("xs")]: {
      padding: "8px",
    },
  },
  select: {
    background: "#212121",
    padding: "8px 12px",
    "& + &": {
      marginLeft: 10,
    },
    "& .MuiSelect-root": {
      padding: "0px 4px",
      fontFamily: "Rany",
      fontWeight: 700,
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.5)",
      "&:focus": {
        backgroundColor: "unset",
      },
      "& svg": {
        width: 18,
        height: 18,
      },
      "& span": {
        fontSize: 14,
        fontWeight: 700,
        color: "#E9FF26",
      },
    },
  },
  chainImage: {
    width: "20px",
    marginRight: "8px",
  },
}));

export const useFilterSelectStyles = makeStyles({
  paper: {
    marginTop: "10px",
    marginLeft: "-13px",
    background: "#212121",
    boxShadow: "0px 15px 35px -31px rgba(13, 12, 62, 0.19)",
    color: "rgba(255, 255, 255, 0.5)",
    "& svg": {
      width: 18,
      height: 18,
      marginRight: 8,
    },
  },
  list: {
    padding: "20px 8px!important",
    paddingRight: 8,
    "& .MuiListItem-root": {
      marginBottom: 10,
      padding: "2px 8px",
      minWidth: "200px",
      Height: "36px",
      border: "solid 1px transparent",
      "&:last-child": {
        marginBottom: 0,
      },
      "&:hover": {
        color: "white",
        border: "solid 1px #E9FF26",
      },
    },
  },
});
