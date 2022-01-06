import { makeStyles } from "@material-ui/core/styles";

export const RentedByMeNFTStyles = makeStyles(theme => ({
  container: {
    padding: 28,
    backgroundColor: "#5F2AF4",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    margin: "8px 0",
    "&:hover": {
      boxShadow: "0px 16px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.3)",
    },
  },
  nftImage: {
    width: 96,
    height: 96,
    borderRadius: 8
  },
  address: {
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    "& span": {
      marginLeft: 5,
      cursor: "pointer"
    }
  },
  header: {
    opacity: 0.8,
    textTransform: "capitalize",
    letterSpacing: '0.02em',
    fontSize: 14,
    lineHeight: "30px"
  },
  section: {
    borderRight: "1px solid #ffffff20",
    fontFamily: "Montserrat",
    fontWeight: 700,
    fontSize: 16
  },
  time: {
    padding: "8px 13px",
    background: "rgba(66, 24, 181, 0.6)",
    borderRadius: 7,
    margin: "0 3px"
  },
  nftName: {
    fontFamily: "Agrandir GrandHeavy",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "21px"
  }
}));
