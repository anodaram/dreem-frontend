import { makeStyles } from "@material-ui/core/styles";

export const ClaimPaymentModalStyles = makeStyles(theme => ({
  container: {
    padding: "0px !important",
  },
  primaryButton: {
    color: "#212121 !important",
    padding: "0 37px !important",
    height: "40px !important",
    border: "none !important",
    background: "#DDFF57 !important",
    borderRadius: "40px !important"
  },
  infoPanel: {
    marginTop: 17,
    marginBottom: 34,
    padding: 19,
    display: "flex",
    flexDirection: "column",
    background: "transparent",
    border: "1px solid",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderImageSlice: 1,
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 1,
    color: "#ffffff",
    fontFamily: "Rany"
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 800,
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  description: {
    fontFamily: "Rany",
    fontSize: "14px",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 17,
    lineHeight: "17px"
  }
}));
