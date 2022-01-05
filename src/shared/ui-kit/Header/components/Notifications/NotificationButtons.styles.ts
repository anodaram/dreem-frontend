import { makeStyles } from "@material-ui/core/styles";

export const notificationButtonStyles = makeStyles({
  darkButton: {
    border: "1px solid white !important",
    borderRadius: "40px !important",
    background: "none !important",
    color: "#fff !important",
    minHeight: "auto",
    width: "auto",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "104.5%",
    padding: 0,
  },
  acceptButton: {
    border: "none !important",
    borderRadius: "40px !important",
    background: "#7BE0EE !important",
    color: "#1C0A4D !important",
    minHeight: "auto",
    width: "auto",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "104.5%",
    padding: 0,
  },
  blueButton: {
    background: "#431AB7 !important",
  },
  emptyStyle: {},
  commentInNotification: {
    borderLeft: "2px solid grey",
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "grey",
    minHeight: 30,
  },
});
