import { makeStyles } from "@material-ui/core/styles";

export const postStyles = makeStyles((theme) => ({
  inputPost: {
    width: "100%",
    borderRadius: 16,
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    padding: 20,
    textAlign: "justify",
    marginBottom: 15,
    "& .ql-editor": {
      background: "#ffffff"
    },
    [theme.breakpoints.down("xs")]: {
      padding: 10,
    },
  },
  inputPostDark: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.16)",
    border: "1px solid #ffffff",
    boxSizing: "border-box",
    padding: 16,
    textAlign: "justify",
    marginBottom: 24,
    [theme.breakpoints.down("xs")]: {
      padding: 10,
    },
  },
  editor: {
    "& .quill": {
      height: 300,
      overflow: "auto",
      background: "#f7f9fe",
    },
    "& .ql-toolbar": {
      background: "white",
    },
  },
  editorDark: {
    "& .quill": {
      height: 300,
      overflow: "auto",
      background: "rgba(255, 255, 255, 0.16)",
    },
    "& .ql-toolbar": {
      background: "white",
    },
  },
}));
