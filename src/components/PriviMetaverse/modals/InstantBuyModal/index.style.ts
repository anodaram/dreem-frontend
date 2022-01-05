import { makeStyles } from "@material-ui/core/styles";

export const InstantBuyModalStyles = makeStyles((theme) => ({
  container: {
    padding:'0px !important'
  },
  title: {
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    textTransform: "uppercase",
    fontSize: "24px",
    fontFamily: "Rany",
    fontWeight: "bold"
  },
  purpleText: {
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    cursor: "pointer",
    fontSize: "18px",
    minWidth: "55px",
    fontWeight: "bold"
  },
  primaryButton: {
    color: "#212121 !important",
    padding: "0 37px !important",
    height: "40px !important",
    background: "linear-gradient(#B7FF5C, #EEFF21) !important",
    borderRadius: "40px",
    border: "none",
    "&:disabled": {
      background: "linear-gradient(#B7FF5C, #EEFF21) !important",
      color: "#212121 !important",
    }
  },
  borderBox: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    padding: 2,
  },
  box: {
    padding: "23px 18px",
    background: "rgb(11, 21, 28)",
    display: "flex",
    justifyContent: "space-between"
  }
}));
