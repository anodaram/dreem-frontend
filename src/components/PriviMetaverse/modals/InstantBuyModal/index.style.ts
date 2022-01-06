import { makeStyles } from "@material-ui/core/styles";

export const InstantBuyModalStyles = makeStyles((theme) => ({
  container: {
    padding:'0px !important'
  },
  purpleText: {
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "16px",
    minWidth: "55px",
    fontWeight: 400
  },
  primaryButton: {
    color: "#fff !important",
    padding: "0 37px !important",
    height: "40px !important",
    border: "none !important"
  },
  box: {
    padding: "23px 18px",
    background: "rgba(158, 172, 242, 0.2)",
    borderRadius: 16,
    display: "flex",
    justifyContent: "space-between"
  }
}));
