import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  root: {
    background:
      "linear-gradient(180deg, rgba(231, 255, 41, 0) 73.82%, rgba(224, 255, 48, 0.2) 100%), rgba(185, 239, 116, 0.06)",
    borderRadius: 4,
    padding: "27px 25px",
    width: "100%",
    maxHeight: 319,
    flex: 1,
  },
  content: {
    marginTop: 16,
    overflowY: "scroll",
    maxHeight: 222,
  },
  nftItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 6,
    marginBottom: 4,
  },
  typeTag: {
    borderRadius: 4,
    padding: "9px 8px 7.5px",
    textTransform: "uppercase",
    fontSize: 10,
    fontFamily: "Grifter",
    fontWeight: 700,
    color: "#212121",
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    color: "#E9FF26",
  },
  typo1: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Rany",
    textTransform: "uppercase",
    color: "#fff",
    width: 200,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
}));
