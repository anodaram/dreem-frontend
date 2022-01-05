import React from "react";
import Grid from "@material-ui/core/Grid";
import { postStyles } from "./Post.styles";
import QuillEditor from "../QuillEditor";
import Box from "shared/ui-kit/Box";

const infoIcon = require("assets/icons/info_gray.png");
const infoIconWhite = require("assets/icons/info_white.png");

const Post = ({
  setterEditor,
  title,
  editor,
  theme,
}: {
  setterEditor: (e) => void | React.Dispatch<any>;
  title: string;
  editor?: any;
  theme?: "dark" | "light";
}) => {
  const classes = postStyles();
  const editorRawState = "";

  const onChange = editorState => {
    setterEditor(editorState);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        marginBottom="8px"
        fontSize="14px"
        color={theme === "dark" ? "white" : "#707582"}
      >
        <Box mr={"4px"}>{title}</Box>
        <img
          src={theme === "dark" ? infoIconWhite : infoIcon}
          alt={"info"}
          style={{ width: "12px", height: "12px" }}
        />
      </Box>
      <Grid container direction="row" alignItems="flex-start" justify="flex-start">
        <Grid xs={12} md={12}>
          <div className={theme === "dark" ? classes.inputPostDark : classes.inputPost}>
            <div className={theme === "dark" ? classes.editorDark : classes.editor}>
              <QuillEditor editorState={editor ?? editorRawState} onChange={onChange} />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Post;
