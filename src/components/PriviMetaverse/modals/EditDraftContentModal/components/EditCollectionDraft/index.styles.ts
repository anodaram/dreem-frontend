import { makeStyles } from "@material-ui/core";

export const useModalStyles = makeStyles(theme => ({
  root: {},
  itemTitle: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
    lineHeight: "104.5%",
    textTransform: "uppercase",
  },
  collectionSection: {
    padding: "40px 0px",
    width: "100%",
    background: "rgba(238, 242, 247, 0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 14,
  },
  typo3: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "175%",
    fontFamily: "Rany",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
      width: 280,
    },
  },
  typo4: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: "120%",
    textAlign: "center",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      lineHeight: "30px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      lineHeight: "22px",
      width: 280,
    },
  },
  createCollectionBtn: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "19.2px",
    fontFamily: "GRIFTER",
    padding: "14px 18px",
    color: "#212121",
    cursor: "pointer",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: 12,
    },
  },
  centerBox: {
    width: 169,
    height: 212,
    [theme.breakpoints.down("xs")]: {
      width: 102,
      height: 129,

      "& img": {
        width: 70,
        height: 70,
      },
    },
  },
  sideBox: {
    width: 136,
    height: 171,
    [theme.breakpoints.down("xs")]: {
      width: 82,
      height: 103,
    },
  },
}));
