import { makeStyles } from "@material-ui/core/styles";

export const cardStyles = makeStyles(theme => ({
  outerCard: {
    width: "100%",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    cursor: "pointer",
    padding: 24,
    background: "#151515",
    border: "2px solid #EEFF21",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  chainImage: {
    background: "#15151560",
    borderRadius: "8px",
    width: 30,
    height: 30,
    position: 'absolute',
    top: 7,
    right: 7,
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
    '& img': {
      width: 17,
      height: 17
    }
  },
  cardNftName: {
    fontFamily: "GRIFTER",
    fontWeight: 700,
    fontSize: "19.5px",
    lineHeight: "23.39px",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    height: 20,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginTop: "16px",
    marginBottom: "16px",
  },
  cardImg: {
    position: "relative",
    "& img": {
      borderRadius: 9,
      overflow: "hidden",
      height: "330px",
      objectFit: "contain",
    },
  },
  cardContent: {
    padding: "0px 8px",
  },
  cardContentDiv: {
    fontFamily: "Rany",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
  },
  cardContentText: {
    fontStyle: "normal",
    fontWeight: 500,
    fontFamily: "Rany",
    fontSize: "16px",
    lineHeight: "17px",
    textAlign: "start",
    textTransform: "uppercase",
    color: "#FFFFFF",
    opacity: 0.5,
  },
  cardContentAmount: {
    float: "right",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "17px",
    textAlign: "end",
    color: "#FFFFFF",
    fontFamily: "Rany",
  },
  divider: {
    height: 1,
    width: "calc(100% + 14px)",
    background: "linear-gradient(#B7FF5C, #EEFF21)",
    marginLeft: -7,
    marginBottom: 13,
  },
  skeleton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    "& .MuiSkeleton-root": {
      backgroundColor: "#505050",
      borderRadius: 6,
    },
  },
  primaryButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "12px !important",
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: "16px important",
    color: "#212121 !important",
    border: "none !important",
    padding: "2px 24px !important",
    marginTop: 21,
    width: "100% !important"
  }
}));
