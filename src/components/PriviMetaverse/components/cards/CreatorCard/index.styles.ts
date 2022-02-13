import { makeStyles } from "@material-ui/core/styles";

export const creatorCardStyles = makeStyles(theme => ({
  container: {
    height: "100%",
    minHeight: 438,
    maxWidth: 390,
    background: "#151515",
    borderRadius: 12,
    border: "2px solid #ED7B7B",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      minHeight: 375,
    },
  },
  shapeIcon: {
    position: "absolute",
    top: 8,
    right: 10,
    cursor: "pointer",
    padding: "10px 10px 8px 8px",
    background: "#212121",
    borderRadius: "50%",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "27px 77px",
  },
  userInfoSection: {
    padding: 24,
  },
  extraInfoSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 75,
  },
  extraInfoItemSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: "100%",
  },
  typo1: {
    fontSize: 20,
    fontFamily: "Grifter",
    fontWeight: 800,
    textTransform: "uppercase",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  typo2: {
    fontSize: 16,
    fontFamily: "Rany",
    fontWeight: 400,
    color: "rgba(255, 255, 255, 0.6)",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  typo3: {
    fontSize: 16,
    fontFamily: "Grifter",
    fontWeight: 700,
    color: "#fff",
  },
}));
