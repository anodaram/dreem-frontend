import { makeStyles } from "@material-ui/core/styles";

export const joinupCommunityModalStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    padding: 20,
  },
  imgContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.typography.h2.fontSize,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.h4.fontSize,
  },
  description: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
    color: "grey",
  },
}));
