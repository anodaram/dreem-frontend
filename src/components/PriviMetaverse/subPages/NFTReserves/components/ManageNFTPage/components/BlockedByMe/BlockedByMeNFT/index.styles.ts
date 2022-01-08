import { makeStyles } from "@material-ui/core/styles";

export const blockedByMeNFTStyles = makeStyles(theme => ({
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
    width: 157,
    height: 157,
    borderRadius: 8,
  },
  header: {
    opacity: 0.8,
    textTransform: "capitalize",
    letterSpacing: "0.02em",
    fontSize: 14,
    lineHeight: "30px",
  },
  section: {
    borderRight: "1px solid #ffffff20",
    fontFamily: "GRIFTER",
    fontWeight: 700,
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
    width: '60px',
    textAlign: 'center'
  },
}));
