import { makeStyles } from "@material-ui/core/styles";

export const swapModalStyles = makeStyles(() => ({
  root: {
    width: "654px !important",
  },
  modalContent: {
    padding: "20px 30px",
  },
  swapSelectContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  swapSelectLogo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  swapSelectHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  swapSelectTitle: {
    margin: "21.44px 0px 10px 0px",
    fontSize: 30,
    fontWeight: 400,
  },
  swapSelectSubtitle: {
    margin: "0px 0px 10px 0px",
    color: "#949bab",
    fontSize: 18,
    fontWeight: 400,
  },
}));
