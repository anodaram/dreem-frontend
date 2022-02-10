import { makeStyles } from "@material-ui/core";

export const collectionDetailPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    background: "#151515",
    position: "relative",
    backgroundImage: `url(${require("assets/metaverseImages/nft_reserve_bg.png")})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 45%",
  },
  container: {
    width: "100%",
    height: "100%",
    marginTop: 72,
    paddingTop: 80,
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
    [theme.breakpoints.down("md")]: {
      paddingTop: 80,
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: 40,
    },
  },
  imageBg: {
    position: "absolute",
    top: 0,
    width: "100%",
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
  },
  no: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    color: "#fff",
    paddingLeft: 2,
  },
  title: {
    fontSize: 72,
    fontWeight: 700,
    lineHeight: "100%",
    textTransform: "uppercase",
    color: "#fff",
    marginBottom: 4,
    [theme.breakpoints.down("xs")]: {
      fontSize: 34,
    },
  },
  description: {
    fontSize: "16px",
    fontWeight: 400,
    fontFamily: "Rany",
    lineHeight: "28px",
    color: "#FFFFFF",
    maxWidth: 900,
    marginBottom: 40,
    [theme.breakpoints.down("sm")]: {
      marginBottom: 78,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
      lineHeight: "21.7px",
      marginBottom: 31,
    },
  },
  symbol: {
    fontFamily: "Rany",
    fontWeight: "bold",
    fontSize: "18px",
    lineHeight: "190%",
    color: "#E9FF26",
    marginBottom: 26,
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
