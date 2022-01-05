import { makeStyles } from "@material-ui/core";

export const statsStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    margin: "70px 0",
    marginRight: 16,
    [theme.breakpoints.down("sm")]: {
      margin: "35px 0",
      marginRight: 8,
    },
    "&:first-child": {
      borderRight: "2px solid rgba(255,255,255,0.1)",
      [theme.breakpoints.down("sm")]: {
        borderRight: 0,
      },
    },
  },
  title: {
    margin: 0,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: "28px",
    // marginBottom: (props: any) => (props.isFeature ? 24 : 8),
    textTransform: "uppercase",
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
      lineHeight: "20px",
    },
  },
  itemsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    paddingRight: 16,
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "2px solid rgba(255,255,255,0.1)",
    "&:last-child": {
      borderRight: 0,
    },
    "&:first-child": {
      justifyContent: "flex-start",
    },
  },
  itemInner: {
    display: "flex",
    flexDirection: "column",
  },
  itemTitle: {
    fontFamily: "GRIFTER",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: "21px",
    margin: 0,
    opacity: 0.5,
    textTransform: "uppercase",
  },
  itemNumber: {
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: "28px",
    margin: 0,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
      lineHeight: "22px",
    },
  },
}));
