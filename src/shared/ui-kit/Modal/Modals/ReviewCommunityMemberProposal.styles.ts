import { makeStyles } from "@material-ui/core/styles";
import { Color, Gradient } from "shared/ui-kit";

export const newProposalModalStyles = makeStyles(() => ({
  root: {
    width: "600px !important",
  },
  darkColor: {
    color: `${Color.GrayDark} !important`,
  },
  add: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  remove: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: Gradient.Red,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  acceptionSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  buttonGroup: {
    marginTop: 24,
  },
}));
