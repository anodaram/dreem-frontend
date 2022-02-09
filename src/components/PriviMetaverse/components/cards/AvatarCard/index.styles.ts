import { makeStyles } from "@material-ui/core/styles";

export const avatarCardStyles = makeStyles(theme => ({
  card: {
    position: "relative",
    borderRadius: 12,
    border: "2px solid #EDFF1C",
    background: "black",
    height: 390,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      height: 365,
    },
    [theme.breakpoints.down("xs")]: {
      height: 365,
    },
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
    width: "100%",
    height: 2,
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
    maxHeight: 230,
    [theme.breakpoints.down("sm")]: {
      maxHeight: 220,
    },
    [theme.breakpoints.down("xs")]: {
      maxHeight: 220,
    },
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "18px",
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
    "& .MuiSkeleton-root": {
      backgroundColor: "#505050",
      borderRadius: 6,
    },
  },
}));
