import { makeStyles } from "@material-ui/core/styles";

export const createPhraseModalStyles = makeStyles(() => ({
  content: {
    padding: 20,
    wordBreak: "break-all",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  main: {
    width: "50%",
    boxSizing: "border-box",
    "& h1": {
      fontSize: 40,
    },
    "& h3": {
      fontSize: 30,
      fontWeight: 800,
    },
  },
  seed: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",
    columnGap: 10,
    rowGap: 10,
    width: 400,
    "& span": {
      color: "#949bab",
      fontSize: 14,
      whiteSpace: "nowrap",
    },
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
  },
  random: {
    background: "transparent",
    color: "#23d0c6",
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: 10,
    },
  },
  goBack: {
    marginLeft: 10,
  },
  danger: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
    color: "#f43e5f",
    alignItems: "center",
  },
  comment: {
    marginLeft: 40,
    display: "flex",
    flexDirection: "column",
    fontSize: 14,
    color: "#6c6c6c",
    width: 230,
    "& > b": {
      color: "#f43e5f",
    },
  },
  other: {
    width: "50%",
    marginLeft: 20,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    height: 500,
    "& span": {
      fontSize: 14,
      color: "#6c6c6c",
      marginTop: 30,
    },
    "& i": {
      color: "#23d0c6",
      fontWeight: 800,
      fontSize: 14,
    },
  },
  image: {
    background: "#333",
    width: "100%",
    maxHeight: 600,
    height: "100%",
  },
}));
