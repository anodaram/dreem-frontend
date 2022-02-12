import { makeStyles } from "@material-ui/core";

export const gameDetailPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "auto",
  },
  headerBG: {},
  mobileSideBar: {
    bottom: 0,
    width: "100%",
    height: 53,
    background: "#212121",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 2,
  },
  sideBar: {
    display: "flex",
    justifyContent: "center",
    marginTop: 72,
    height: "calc(100vh - 72px)",
    background: "#212121",
    border: "2px solid #151515",
    zIndex: 1,
  },
  expandIcon: {
    padding: 16,
    cursor: "pointer",
  },
  collapseIcon: {
    position: "absolute",
    top: "16px",
    right: "18px",
    cursor: "pointer",
  },
  container: {
    position: "absolute",
    top: 150,
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
  },
  fitContent: {
    maxWidth: (props: any) => (props.openSideBar ? 1040 : 1280),
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("md")]: {
      maxWidth: 1280,
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: (props: any) => (props.openSideBar ? 16 : 32),
      paddingRight: (props: any) => (props.openSideBar ? 16 : 32),
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "12px !important",
      paddingRight: "12px !important",
    },
  },
  title: {
    fontFamily: "GRIFTER",
    fontSize: 62,
    fontWeight: 800,
    lineHeight: "100%",
    color: "white",
    maxWidth: 700,
    [theme.breakpoints.down("sm")]: {
      fontSize: 34,
      maxWidth: 420,
      marginTop: (props: any) => (props.openSideBar ? 24 : 0),
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 34,
      maxWidth: "300px !important",
    },
  },
  tabTitle: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "34px",
    lineHeight: "120%",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    width: "fit-content",
  },
  description: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 20,
    lineHeight: "155%",
    color: "#FFFFFF",
    maxWidth: (props: any) => (props.openSideBar ? 738 : 540),
    marginTop: 24,
    maxHeight: 60,
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "420px !important",
      marginTop: 8,
      fontSize: 16,
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "300px !important",
      fontSize: 14,
      lineHeight: "21.7px",
    },
  },
  fullDescItem: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Rany",
    color: "#E9FF26",
    marginTop: 10,
  },
  fullDescPanel: {
    position: "absolute",
    top: 320,
    background: "rgba(21, 21, 21)",
    boxShadow: "0px 12px 37px #000000",
    width: 774,
    padding: "14px 18px",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Rany",
    lineHeight: "155%",
  },
  gameInfoLoading: {
    background: '#313131',
    borderRadius: 9,
    [theme.breakpoints.down("sm")]: {
      width: (props: any) => (props.openSideBar ? "100%" : 220),
      height: 250,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100% !important",
    },
  },
  gameInfoImg: {
    width: 398,
    height: 398,
    borderRadius: 9,
    [theme.breakpoints.down("sm")]: {
      width: (props: any) => (props.openSideBar ? "100%" : 220),
      height: 250,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100% !important",
    },
  },
  content: {
    paddingBottom: 180,
  },
  cardOptionButton: {
    float: "right",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 8px 2px",
    background: "rgba(190, 167, 255, 0.6)",
    borderRadius: "5.90529px",
    flex: "none",
    order: 1,
    flexGrow: 0,
    color: "#212121",
    margin: "2px",
    fontFamily: "GRIFTER",
    fontStyle: "10px",
    fontWeight: "bold",
    fontSize: "8.26741px",
  },
  select: {
    marginTop: "8px",
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
      marginRight: 8,
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
    "& svg path": {
      stroke: "#E9FF26",
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
  filterButtonBox: {
    background: "rgba(21, 21, 21, 0.3)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px`,
    cursor: "pointer",
    color: "#ffffff80",
    minWidth: 274,
    height: 38,
    [theme.breakpoints.down("xs")]: {
      minWidth: 195,
      padding: "8px",
    },
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    background: "#FFFFFF10",
    borderRadius: 6,
  },
  showButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none !important",
    backgroundColor: "transparent !important",
    minWidth: "unset !important",
    padding: "10px !important",
    "& svg": {
      fill: "white",
    },
  },
  showButtonSelected: {
    background: "#E9FF26 !important",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08), 0px -1px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: 6,
    "& svg": {
      fill: "#212121",
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
  table: {
    minHeight: 400,
    "& .MuiTable-root": {
      borderSpacing: "0px 8px",
      borderCollapse: "unset",
    },
    "& .MuiTableCell-root": {
      border: "none",
      fontFamily: "Grifter",
    },
    "& .MuiTableRow-head": {
      background: "transparent",
      "& .MuiTableCell-head": {
        border: "none",
        color: "#4218B5",
        fontSize: "14px",
        fontFamily: "Rany",
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
        fontFamily: "Rany",
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
        background: "#151515 !important",
        "& td:first-child": {
          borderTopLeftRadius: "14px",
          borderBottomLeftRadius: "14px",
        },
        "& td:last-child": {
          borderTopRightRadius: "14px",
          borderBottomRightRadius: "14px",
        },
      },
    },

    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
  },
  listLoading: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "2px solid #F2C525",
    borderRadius: 16,
    padding: 12,
    background: "rgba(255, 255, 255, 0.1) !important",
    "& .MuiSkeleton-root": {
      backgroundColor: "#505050",
      borderRadius: 6,
    },
  },
}));

export const gameDetailTabsStyles = makeStyles(theme => ({
  tab: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "19.2px",
    color: "white",
    borderRadius: "2px",
    padding: "8px 20px",
    textTransform: "uppercase",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      flex: 1,
      fontSize: 10,
      padding: "8px 0px",
      textAlign: "center",
    },
  },
  selected: {
    color: "#212121",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
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
