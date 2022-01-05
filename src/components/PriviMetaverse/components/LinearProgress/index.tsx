import { createStyles, withStyles, Theme } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

export const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: "transparent",
    },
    bar: {
      borderRadius: 32,
      background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    },
  })
)(LinearProgress);

export const GreenLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 34,
      borderRadius: 34,
    },
    colorPrimary: {
      backgroundColor: "#DAE6E5",
    },
    bar: {
      borderRadius: 34,
      background: "#65CB63",
    },
  })
)(LinearProgress);

export const RedLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 34,
      borderRadius: 34,
    },
    colorPrimary: {
      backgroundColor: "#DAE6E5",
    },
    bar: {
      borderRadius: 34,
      background: "#F74484",
    },
  })
)(LinearProgress);
