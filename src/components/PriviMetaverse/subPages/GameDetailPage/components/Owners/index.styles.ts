import { makeStyles } from "@material-ui/core";

export const ownersStyles = makeStyles(theme => ({
  root: {},
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
  accTitle: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 82.37%, #EDFF1C 100.47%)",
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
}));
