import { makeStyles } from "@material-ui/core/styles";

export const wallFeedCardStyles = makeStyles(theme => ({
  wallItem: {
    display: "flex",
    flexDirection: "column",
    background: "white",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 16,
    width: "100%",
    fontSize: 14,
    color: "#181818",
    padding: 24,
    cursor: "pointer",
    h3: {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 14,
      lineHeight: "21px",
      margin: "0px 0px 8px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: 16,
      background: "#EFF2FD",
      borderRadius: 20,
    },
  },
  desc: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  shareButton: {
    marginLeft: 16,
    height: "auto",
    padding: 0,
    minHeight: 0,
    width: "auto",
    minWidth: 0,
    borderRadius: 0,
    "& svg path": {
      fill: "#181818",
    },
    [theme.breakpoints.down("md")]: {
      "& svg": {
        width: 40,
      }
    },
  },
  shareImg: {
    width: 19,
  },
  fruitsContainer: {
    background: "#65CB63",
    boxShadow: "0px 1.4852px 5.94081px rgba(0, 0, 0, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    [theme.breakpoints.down("md")]: {
      "& img": {
        width: 20,
      }
    },
  },
  readMore: {
    fontWeight: 800,
  },
  feedImg: {
    borderRadius: "14px",
    width: "100%",
    height: "auto",
    maxWidth: 460,
    minHeight: 460,
    [theme.breakpoints.down("md")]: {
      maxWidth: 300,
      minHeight: 300,
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: 200,
      minHeight: 200,
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: 125,
      minHeight: 125,
    },
  },
  feedText: {
    flex: 1,
    "& > div": {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
    }
  }
}));
