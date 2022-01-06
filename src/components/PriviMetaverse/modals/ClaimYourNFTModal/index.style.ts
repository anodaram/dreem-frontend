import { makeStyles } from "@material-ui/core/styles";

export const ClaimYourNFTModalStyles = makeStyles(theme => ({
  container: {
    maxWidth: "681px !important",
    padding: "50px 130px !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  infoValueRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Agrandir GrandHeavy",
  },
  confirmButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%) !important",
    color: "#212121 !important",
    fontSize: "18px",
    borderRadius: "40px !important",
    textTransform: "uppercase",
    marginTop: "27px",
    padding: "0 44px !important"
  },
  title: {
    fontFamily: "GRIFTER",
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: 800,
    width: "50%",
    textAlign: "center"
  },
  description: {
    fontFamily: "Rany",
    color: "#ffffff50",
    fontSize: "16x",
    lineHeight: "24px",
    fontWeight: 400,
    marginTop: "20px",
    width: "70%",
    textAlign: "center",
  },
  card: {
    transform: "scale(0.8)",
    position: "relative",
  },
  checkMark: {
    width: "103px",
    height: "103px",
    background: "linear-gradient(0deg, #F4F2FB, #F4F2FB), #17172D",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -22,
    left: "calc(50% - 52px)",
  },
  cardImg: {
    height: "316px",
    objectFit: "cover"
  }
}));
