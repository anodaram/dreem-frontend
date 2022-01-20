import { makeStyles } from "@material-ui/core/styles";

export const blockedByMeNFTStyles = makeStyles(theme => ({
  borderContainer: {
    border: "1px solid #E9FF26",
    borderRadius: 14,
    margin: "8px 0",
  },
  container: {
    padding: 28,
    backgroundColor: "#2c2c2c",
    borderRadius: 14,
    [theme.breakpoints.down("xs")]: {
      padding: "28px 12px",
    },
  },
  nftImage: {
    width: 157,
    height: 157,
    borderRadius: 8,
    [theme.breakpoints.down("xs")]: {
      width: 141,
      height: 141,
    },
  },
  header: {
    opacity: 0.8,
    textTransform: "capitalize",
    letterSpacing: "0.02em",
    fontSize: 14,
    lineHeight: "30px",
  },
  paymentStatus: {
    opacity: 0.8,
    fontFamily: "Rany",
    fontWeight: 500,
    fontSize: 14,
    width: 128,
    textTransform: "uppercase",
    lineHeight: "18px",
    [theme.breakpoints.down("sm")]: {
      width: 96,
    },
  },
  section: {
    borderRight: "1px solid #ffffff20",
    fontFamily: "GRIFTER",
    fontWeight: 700,
    [theme.breakpoints.down("sm")]: {
      borderRight: "none",
    },
  },
  time: {
    padding: "8px 13px",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: 7,
    margin: "0 3px",
    color: "#212121",
  },
  nftName: {
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "22px",
    lineHeight: "29px",
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  gradientText: {
    textTransform: "uppercase",
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  slider: {
    width: "100%",
    "& .MuiSlider-markLabel": {
      top: "14px",
      color: "#ffffff60",
    },
  },
  skeleton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    padding: 16,
    "& .MuiSkeleton-root": {
      backgroundColor: "#505050",
      borderRadius: 14,
    },
  },
  flexBox: {
    width: "90px",
    textAlign: "center",
  },
  primaryButton: {
    color: "#212121 !important",
    padding: "2px 37px 0px !important",
    height: "40px !important",
    border: "none !important",
    background: "#DDFF57 !important",
    borderRadius: "2px !important",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
  },
}));
