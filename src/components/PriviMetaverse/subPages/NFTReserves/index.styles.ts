import { makeStyles } from "@material-ui/core/styles";

export const useNFTOptionsStyles = makeStyles(theme => ({
  main: {
    position: "relative",
    width: "100%",
  },
  pixImage: {
    position: "absolute",
    top: 8,
    right: 75,
    width: 85,
    [theme.breakpoints.down(600)]: {
      right: -10,
    },
  },
  cameraImage: {
    position: "absolute",
    top: 112,
    left: 91,
    [theme.breakpoints.down("sm")]: {
      top: 130,
      left: 50,
    },
    [theme.breakpoints.down(600)]: {
      top: 220,
      left: -15,
    },
  },
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 72px)",
    maxHeight: "calc(100vh - 72px)",
    overflowX: "hidden",
    position: "relative",
    padding: "90px 32px 45px",
    maxWidth: 1600,
    marginLeft: "auto",
    marginRight: "auto",
    "& > div > h2": {
      fontFamily: "Agrandir GrandHeavy",
      fontWeight: "800",
      fontSize: "40px",
      lineHeight: "104.5%",
      margin: 0,
      color: "#431AB7",
      [theme.breakpoints.down("xs")]: {
        fontSize: "28px",
      },
      "& span": {
        fontSize: "18px",
        lineHeight: "23px",
      },
    },
    "& > h3": {
      marginTop: "64px",
      fontSize: "30px",
      lineHeight: "104.5%",
      marginBottom: "16px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "63px 30px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "63px 20px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "35px 16px",
    },
  },
  titleBar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "0 35px",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  title: {
    fontFamily: "Agrandir GrandHeavy",
    fontSize: 32,
    fontWeight: 800,
    color: "#431AB7",
    textAlign: "center",
    [theme.breakpoints.down(950)]: {
      fontSize: 28,
    },
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 8,
    },
  },
  subTitle: {
    fontFamily: "Agrandir",
    fontSize: 20,
    fontWeight: 400,
    color: "#431AB7",
    marginTop: 10,
    textAlign: "center",
    [theme.breakpoints.down(950)]: {
      fontSize: 28,
    },
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 8,
    },
  },
  manageButton: {
    position: "relative",
    background: "linear-gradient(269.78deg, #418DFF 1.15%, #4541FF 52.53%, #EF41CB 94.95%), #000000",
    borderRadius: "74px !important",
    color: "#fff !important",
    border: "none !important",
    height: "41x !important",
    padding: "0 30px !important",
    lineHeight: "24px !important",
    fontSize: 16,
    fontFamily: "Agrandir",
    fontWeight: 800,
  },
  subTitleSection: {
    display: "flex",
    width: "100%",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "Agrandir",
    color: "#431AB7",
    lineHeight: "23px",
    marginTop: 32,
    padding: "0 20px",
    cursor: "pointer",
    [theme.breakpoints.down(1110)]: {
      fontSize: 15,
    },
    [theme.breakpoints.down(950)]: {
      fontSize: 12,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0 0",
    },
  },
  optionSection: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      justifyContent: "flex-end",
    },
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    background: "#EFF2FD",
    borderRadius: 69,
  },
  showButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none !important",
    backgroundColor: "transparent !important",
  },
  showButtonSelected: {
    background: "#ffffff !important",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08), 0px -1px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: 34,
  },
  listViewRow: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontFamily: "Montserrat",
    fontWeight: 600,
    color: "#4218B5",
    [theme.breakpoints.down("sm")]: {
      fontSize: "11px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "8px",
    },
  },
  tabSection: {
    height: 55,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "0 40px",
    fontSize: 18,
    fontFamily: "Agrandir GrandHeavy",
    [theme.breakpoints.down(1250)]: {
      minWidth: 420,
    },
    [theme.breakpoints.down(1110)]: {
      minWidth: 350,
    },
    [theme.breakpoints.down(950)]: {
      minWidth: 275,
      fontSize: 14,
    },
    [theme.breakpoints.down(580)]: {
      minWidth: 165,
      fontSize: 16,
      margin: "0 0",
      padding: "0 24px",
      height: "84px",
      width: "50%",
    },
    borderBottom: "4px solid transparent",
  },
  selectedTabSection: {
    borderBottom: "4px solid #431AB7",
  },
  explorerContent: {
    padding: "35px 0",
    width: "100%",
  },
  filterTag: {
    background: "#EFF2FD",
    borderRadius: "100px",
    marginTop: "15px",
    marginRight: "10px",
    color: "rgb(45, 48, 71)",
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: "18px",
    padding: "8px 14px",
    cursor: "pointer",
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
    color: "#2D3047",
    [theme.breakpoints.down("xs")]: {
      padding: "8px",
    },
  },
  select: {
    background: "#EFF2FD",
    borderRadius: 17,
    padding: "8px 12px",
    "& + &": {
      marginLeft: 10,
    },
    "& .MuiSelect-root": {
      padding: "0px 4px",
      fontSize: 12,
      color: "rgba(67, 26, 183, 0.5)",
      "&:focus": {
        backgroundColor: "unset",
      },
      "& svg": {
        width: 18,
        height: 18,
      },
      "& span": {
        fontSize: 14,
        fontWeight: 600,
        color: "#5343B1",
      },
    },
  },
  table: {
    minHeight: 400,
    "& .MuiTable-root": {
      borderSpacing: "0px 8px",
      borderCollapse: "unset",
    },
    "& .MuiTableCell-root": {
      border: "none",
      fontFamily: "Agrandir",
    },
    "& .MuiTableRow-head": {
      background: "transparent",
      "& .MuiTableCell-head": {
        border: "none",
        color: "#4218B5",
        fontSize: "14px",
        fontFamily: "Montserrat",
        fontWeight: 600,
        [theme.breakpoints.down("sm")]: {
          fontSize: "12px",
        },
      },
    },
    "& .MuiTableBody-root": {
      "& .MuiTableCell-body": {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Montserrat",
        color: "white",
        [theme.breakpoints.down("sm")]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 8,
        },
      },
      "& .MuiTableRow-root": {
        cursor: "pointer",
        background: "#5F2AF4",
        "& td:first-child": {
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
        },
        "& td:last-child": {
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
        },
      },
    },

    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
  },
  listNFTImage: {
    height: 60,
    width: 60,
    "& img": {
      width: "100%",
      borderRadius: 4,
    },
  },
}));

export const useFilterSelectStyles = makeStyles({
  paper: {
    background: "#EFF2FD",
    boxShadow: "0px 15px 35px -31px rgba(13, 12, 62, 0.19)",
    borderRadius: 12,
    "& svg": {
      width: 18,
      height: 18,
      marginRight: 8,
    },
  },
  list: {
    padding: "20px 8px",
    paddingRight: 8,
    "& .MuiListItem-root": {
      borderRadius: 6,
      marginBottom: 12,
      padding: "2px 8px",
      minHeight: 32,
      "&:last-child": {
        marginBottom: 0,
      },
      "&:hover": {
        background: "white",
      },
    },
  },
});
