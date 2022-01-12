import { makeStyles } from "@material-ui/core/styles";

export const avatarCardStyles = makeStyles(theme => ({
  card: {
    position: "relative",
    borderRadius: 12,
    border: "2px solid #EDFF1C",
    background: "black",
    height: 460,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      height: 400,
    },
    [theme.breakpoints.down("xs")]: {
      height: 380,
    },
  },
  container: {
    padding: "28px 24px 24px 24px",
    [theme.breakpoints.down("sm")]: {
      padding: "24px 18px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "11px 12px",
    },
  },
  button: {
    color: "black !important",
    textTransform: "uppercase",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "100px !important",
    width: "169px !important",
    height: "40px !important",
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
    objectPosition: "center",
    width: "100%",
    height: 260,
    [theme.breakpoints.down("sm")]: {
      maxHeight: 209,
    },
    [theme.breakpoints.down("xs")]: {
      maxHeight: 282,
    },
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: "19.5px",
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
  zone: {
    fontSize: "14px",
    lineHeight: "120%",
    textTransform: "uppercase",
    fontFamily: "GRIFTER",
    color: "#E9FF26",
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
