import { makeStyles } from "@material-ui/core";

export const marketplaceFeedStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
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

  fitContent: {
    maxWidth: 1280,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 32,
      paddingRight: 32,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 24,
      paddingRight: 24,
    },
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

  title: {
    margin: 0,
    marginBottom: 20,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 34,
    lineHeight: "40px",
    textTransform: "uppercase",
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      lineHeight: "24px",
    },
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textBox: {
    display: "flex",
    flexDirection: "column",
  },
  textTitle: {
    color: "#FFFFFF",
    fontFamily: "Rany",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "18px",
    margin: 0,
  },
  description: {
    color: "#E9FF26",
    fontFamily: "Rany",
    fontSize: 14,
    lineHeight: "20px",
    margin: 0,
  },
  titleImg: {
    width: 45,
    height: 45,
    borderRadius: 6,
    objectFit: "cover",
    margin: "0 20px",
  },
  accTitle: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "Rany",
    fontSize: 14,
    lineHeight: "20px",
    margin: 0,
  },
  whiteText: {
    color: "#FFFFFF",
    fontFamily: "Rany",
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "22px",
    margin: 0,
  },
  button: {
    backgroundColor: "transparent !important",
    border: "2px solid rgba(255,255,255,0.5) !important",
  },

  table: {
    border: "2px solid",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderImageSlice: 1,
    width: "100%",
  },
}));
