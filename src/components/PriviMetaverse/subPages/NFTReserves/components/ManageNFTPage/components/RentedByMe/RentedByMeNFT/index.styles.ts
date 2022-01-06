import { makeStyles } from "@material-ui/core/styles";

export const RentedByMeNFTStyles = makeStyles(theme => ({
  borderContainer: {
    border: (props: { isExpired: boolean | undefined }) =>
      props.isExpired ? "1px solid rgba(255, 255, 255, 0.5)" : "1px solid #E9FF26",
    borderRadius: 14,
    margin: "8px 0",
  },
  container: {
    padding: 28,
    backgroundColor: "#2c2c2c",
    borderRadius: 14,
  },
  nftImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  address: {
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    "& span": {
      marginLeft: 5,
      cursor: "pointer",
    },
  },
  header: {
    opacity: 0.8,
    textTransform: "capitalize",
    letterSpacing: "0.02em",
    fontSize: 14,
    lineHeight: "30px",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  section: {
    borderRight: (props: { isExpired: boolean | undefined }) =>
      props.isExpired ? "1px solid #ffffff10" : "1px solid #B7FF5C",
    fontFamily: "GRIFTER",
    fontWeight: 700,
    fontSize: 16,
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
    fontSize: "16px",
    lineHeight: "21px",
  },
  topContainer: {
    borderBottom: (props: { isExpired: boolean | undefined }) =>
      props.isExpired ? "1px solid #ffffff10" : "1px solid #B7FF5C",
  },
  primaryButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%) !important",
    padding: "0 50px !important",
    color: "#212121 !important",
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
}));
