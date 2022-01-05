import { makeStyles } from "@material-ui/core/styles";

export const mnemonicWordsInputModalStyles = makeStyles(() => ({
  root: {
    width: "500px !important",
  },
  content: {
    padding: 20,
    wordBreak: "break-all",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    "& h3": {
      fontSize: 32,
      margin: 0,
    },
    "& span": {
      margin: "20px 0px",
    },
  },
  seed: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",
    columnGap: 10,
    rowGap: 10,
  },
  submit: {
    margin: "50px 0px",
  },
  word: {
    background: "#f7f9fe",
    border: "1px solid #949bab",
    boxSizing: "border-box",
    borderRadius: 11.36,
    display: "flex",
    alignItems: "center",
    width: 140,
    height: 56,
    paddingLeft: 10,
    "& > span": {
      color: "#949bab",
      fontSize: 14,
      whiteSpace: "nowrap",
    },
    "& > input": {
      border: "none",
      background: "transparent",
      outline: "none",
      width: "100%",
    },
  },
}));
