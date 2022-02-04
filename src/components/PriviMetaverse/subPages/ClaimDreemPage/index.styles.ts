import { makeStyles } from "@material-ui/core";

export const claimPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    color: "#ffffff",
    height: "100%",
    background: "#000000",
    position: "relative",
    zIndex: 1,
    [theme.breakpoints.down("md")]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 12,
      paddingRight: 12,
    },
  },
  fitContent: {
    width: "100%",
    position: "relative",
    maxWidth: 1280,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 100,
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
  decorationImage1: {
    width: 500,
    height: 900,
    top: 0,
    right: 0,
    position: "absolute",
    [theme.breakpoints.down("sm")]: {
      width: 300,
      height: 700,
    },
  },
  decorationImage2: {
    width: 320,
    height: 390,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  claimTokenSection: {
    width: "100%",
    background: "#151515",
    padding: "20px",
    border: "3px solid",
    borderImageSlice: 1,
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
    marginTop: 20,
    [theme.breakpoints.down("xs")]: {
      alignItems: "flex-start",
      flexDirection: "column",
    },
  },
  claimTokenImg: {
    width: 102,
    height: 102,
    [theme.breakpoints.down("sm")]: {
      width: 48,
      height: 48,
    },
  },
  transactionInfoSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 36,
    width: "40%",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      marginTop: 16,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      background: "#151515",
      padding: "8px 16px",
    },
  },
  transactionsTable: {
    zIndex: 1,
    width: "100%",
    marginTop: "34px",
    background: "#151515",
    border: "3px solid",
    borderImageSlice: 1,
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "& .MuiTableRow-root": {
      background: "#151515",
    },
    "& .MuiTableContainer-root": {
      background: "#151515",
      borderRadius: "0px",
      boxShadow: "none",
      "& tr": {
        "& .MuiTableCell-head": {
          color: "#EEFF21",
          fontFamily: "Grifter",
          fontWeight: 800,
          fontSize: "14px",
          lineHeight: "14px",
          textTransform: "uppercase",
          borderBottom: "3px solid #EEFF21",
          borderRight: "3px solid #EEFF21",
          "&:last-child": {
            borderRight: "none",
          },
          "& span svg path": {
            fill: "#EEFF21",
          },
        },
        "& td": {
          color: "#fff",
          fontFamily: "Rany",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "12px",
          lineHeight: "13px",
          borderBottom: "1px solid #1C1C1C",
        },
      },
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "24px",
      "& .MuiTableContainer-root": {
        "& tr": {
          "& .MuiTableCell-head": {
            fontSize: "12px !important",
          },
        },
      },
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: "28px",
    },
  },
  typo1: {
    fontSize: 40,
    fontWeight: 800,
    fontFamily: "Grifter",
    lineHeight: "120%",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    width: "fit-content",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
  },
  typo2: {
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Grifter",
    lineHeight: "120%",
    textTransform: "uppercase",
    color: "rgba(255, 255, 255, 0.5)",
  },
  typo3: {
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Rany",
    lineHeight: "120%",
    color: "#E9FF26",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 115,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  typo4: {
    fontSize: 12,
    fontWeight: 400,
    fontFamily: "Rany",
    lineHeight: "120%",
    color: "rgba(255, 255, 255, 0.6)",
  },
  typo5: {
    fontSize: 24,
    fontWeight: 400,
    fontFamily: "Grifter",
    lineHeight: "120%",
    color: "#fff",
    "& span": {
      color: "rgba(255, 255, 255, 0.5)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  typo6: {
    fontSize: 34,
    fontWeight: 700,
    fontFamily: "Grifter",
    lineHeight: "120%",
    textTransform: "uppercase",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  typo7: {
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Rany",
    lineHeight: "120%",
    textTransform: "uppercase",
    color: "rgba(255, 255, 255, 0.5)",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
}));
