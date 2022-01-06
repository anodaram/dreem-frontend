import { makeStyles } from "@material-ui/core";

const tag = {
  fontFamily: "GRIFTER",
  fontSize: 14,
  lineHeight: "20px",
  color: "#FFFFFF",
  backgroundColor: "#0091B0",
  padding: "6px 17px",
  paddingTop: 10,
  borderRadius: 4,
};

export const tagStyles = makeStyles(theme => ({
  rented: {
    ...tag,
    backgroundColor: "#0091B0",
  },
  sold: {
    ...tag,
    backgroundColor: "#212121",
  },
  blocked: {
    ...tag,
    backgroundColor: "#BA26FF",
  },
}));
