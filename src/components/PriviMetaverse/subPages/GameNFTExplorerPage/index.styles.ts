import { makeStyles } from "@material-ui/core/styles";

export const useNFTOptionsStyles = makeStyles(theme => ({
  main: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#151515",
  },
  imageBg: {
    position: "fixed",
    top: 0,
    width: "100%",
  },
  image1: {
    position: "absolute",
    top: 247,
    left: 0,
  },
  image2: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  limitedContent: {
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 9.5%, #17151A 69.7%)",
    width: "100%",
    height: "100%",
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
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "100%",
    maxHeight: "100%",
    overflowX: "hidden",
    position: "relative",
    padding: "160px 32px 45px",
    maxWidth: 1400,
    marginLeft: "auto",
    marginRight: "auto",
    "& > div > h2": {
      fontFamily: "Grifter",
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
      paddingLeft: "30px",
      paddingRight: "30px",
      maxWidth: 1280,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "20px",
      paddingRight: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
    "& .infinite-scroll-component": {
      overflow: "visible !important",
    },
  },
  title: {
    fontFamily: "GRIFTER",
    fontSize: 56,
    fontWeight: 700,
    background: "linear-gradient(#EEFF21, #B7FF5C)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    textTransform: "uppercase",
    textAlign: "center",
    width: "100%",
    [theme.breakpoints.down(950)]: {
      fontSize: 28,
    },
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 8,
      fontSize: 24,
    },
  },
  primaryButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "5px !important",
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: "16px important",
    color: "#212121 !important",
    border: "none !important",
    padding: "2px 24px !important",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px !important",
      width: "193px !important",
    },
  },
  gamePlayButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "100px !important",
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: "16px important",
    color: "#212121 !important",
    border: "none !important",
    padding: "2px 24px !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "35px",

    "& svg": {
      marginRight: "13px",
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
    background: "#FFFFFF1A",
    borderRadius: 69,
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
    background: "#ffffff !important",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08), 0px -1px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: 34,
    "& svg": {
      fill: "#212121",
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
    fontFamily: "Grifter",
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
  explorerContent: {
    padding: "35px 0",
    width: "100%",
  },
  filterTag: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderRadius: "100px",
    marginTop: "15px",
    marginRight: "10px",
    color: "white",
    fontFamily: "Rany",
    fontWeight: 400,
    fontSize: 12,
    lineHeight: "18px",
    padding: "8px 14px",
    cursor: "pointer",
  },
  filterActive: {
    color: "#fff",
    "& *": {
      color: "#fff !important",
    },
    "& svg path": {
      fill: "#fff !important",
    },
    "& span": {
      color: "#EDFF1C !important",
    },
  },
  filterButtonBox: {
    background: "#FFFFFF1A",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px`,
    cursor: "pointer",
    borderRadius: "100vh",
    color: "white",
    [theme.breakpoints.down("xs")]: {
      padding: "8px",
    },
  },
  searchOpened: {
    padding: "inherit 24px",
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
  chainImage: {
    width: "20px",
    marginRight: "8px",
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
  listNFTImage: {
    height: 60,
    width: 60,
    "& img": {
      width: "100%",
      borderRadius: 4,
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
  gameslider: {
    border: "2px solid transparent",
    borderImageSource: "linear-gradient(180deg, rgba(255, 255, 255, 0) 42%, #E9FF26 100%)",
    borderImageSlice: "30%",
  },
  gameContent: {
    backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(255,0,0,0))",
  },
  gameBgImage: {
    position: "absolute",
    width: "100% !important",
    height: "100% !important",
    zIndex: -1,
  },
  sliderFooter: {
    position: "absolute",
    bottom: "-38px",
  },
  sliderLeft: {
    position: "absolute",
    bottom: "100px",
    left: "-56px",
  },
  sliderRight: {
    position: "absolute",
    top: "90px",
    right: "-65px",
  },
  sliderRect: {
    position: "absolute",
    bottom: 0,
    right: "-59px",
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

export const useTabsStyles = makeStyles(theme => ({
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
      padding: "8px 10px",
      textAlign: "center",
    },
  },
  selected: {
    color: "#212121",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
  },
}));
