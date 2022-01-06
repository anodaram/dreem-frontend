import { makeStyles } from "@material-ui/core/styles";

export const cardStyles = makeStyles(theme => ({
  outerCard: {
    width: "100%",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    cursor: "pointer",
    padding: 24,
    background: "#151515",
    border: "2px solid #F2C525",
    "&:hover": {
      boxShadow: "0px 10px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)",
      transform: "scale(1.02)",
    },
  },
  innerCardGradient: {
    padding: "2px",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: "12px",
    backgroundImage: "linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 108.25%)",
  },
  cardTitle: {
    marginBottom: "16px",
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
  cardOptionButton: {
    float: "right",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "6px 8px",
    background: "rgba(190, 167, 255, 0.6)",
    borderRadius: "5.90529px",
    flex: "none",
    order: 1,
    flexGrow: 0,
    color: "#212121",
    margin: "0px 5.96494px",
    fontFamily: "GRIFTER",
    fontStyle: "10px",
    fontWeight: "bold",
    fontSize: "8.26741px",
    position: "absolute",
    right: 4,
    top: 16,
  },

  category: {
    float: "left",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "6px 8px",
    borderRadius: "5.90529px",
    flex: "none",
    order: 1,
    flexGrow: 0,
    margin: "0px 0px",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "8.26741px",
    position: "absolute",
    right: 4,
    top: 8,
    width: "100%",
  },
  cardImg: {
    position: "relative",
    "& img": {
      borderRadius: 9,
      overflow: "hidden",
      maxHeight: "330px",
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
    marginBottom: "6px",
  },
  cardContentText: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "12px",
    lineHeight: "17px",
    textAlign: "start",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "#FFFFFF",
    opacity: 0.8,
  },
  cardContentAmount: {
    float: "right",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "12.3951px",
    lineHeight: "16px",
    textAlign: "end",
    letterSpacing: "0.02em",
    textTransform: "capitalize",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    width: "calc(100% + 14px)",
    background:
      "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)",
    marginLeft: -7,
    marginBottom: 13,
  },
  userName: {
    display: "flex",
    alignItems: "center",
    width: "80%",
    "& span": {
      marginLeft: 10,
      color: "#FFFFFF",
      opacity: 0.7,
      fontFamily: "Montserrat",
      fontWeight: 600,
      fontSize: 12,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "&:hover": {
      "& span": {
        opacity: 0.9,
        fontSize: 13,
        fontWeight: 800,
      },
    },
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
}));
