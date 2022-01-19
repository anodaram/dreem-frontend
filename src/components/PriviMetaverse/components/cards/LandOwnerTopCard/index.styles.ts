import { makeStyles } from "@material-ui/core/styles";

export const cardStyles = makeStyles(theme => ({
  card: {
    position: "relative",
    borderRadius: 6,
    border: "2px solid #FFBF85",
    background: "#151515",
    height: 300,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      height: 300,
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "27px 0px",
    position: "relative",
  },
  no: {
    position: "absolute",
    left: 14,
    top: 10,
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "Rany",
  },
  typo1: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Rany",
  },
  typo2: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Rany",
    textTransform: "uppercase",
  },
  typo3: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
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
