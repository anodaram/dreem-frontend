import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";

import { DateInput } from "shared/ui-kit/DateTimeInput";
import Box from "shared/ui-kit/Box";
import { StyledSelectComponent } from "../Select/TokenSelect";
import { authorSchedulePostStyles } from "./AuthorSchedulePost.styles";

const infoIcon = require("assets/icons/info_gray.png");
const infoIconWhite = require("assets/icons/info_white.png");

type AuthorScheduleProps = React.PropsWithChildren<{
  theme?: "dark" | "light";
  author: string | any;
  setterAuthor: (e) => void;
  schedulePost: Date;
  setterSchedulePost: (e) => void;
  authorArray: string[];
}>;

const AuthorSchedulePost = ({
  theme,
  author,
  setterAuthor,
  schedulePost,
  setterSchedulePost,
  authorArray,
}: AuthorScheduleProps) => {
  const classes = authorSchedulePostStyles();

  return (
    <Box
      width="100%"
      color={theme && theme === "dark" ? "white" : "#181818"}
      className={classes.authorDateRowBlogPost}
      fontSize="14px"
    >
      <Grid container direction="row" alignItems="flex-start" justify="flex-start" spacing={2}>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" mb={1}>
            <Box mr="4px" color={theme && theme === "dark" ? "white" : "#707582"}>
              Author
            </Box>
            <img
              style={{ width: "12px", height: "12px" }}
              src={theme === "dark" ? infoIconWhite : infoIcon}
              alt={"info"}
            />
          </Box>
          <StyledSelectComponent
            theme={theme}
            value={author}
            onChange={event => {
              setterAuthor(event.target.value);
            }}
            options={authorArray}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <Box mr="4px" color={theme && theme === "dark" ? "white" : "#707582"}>
              Schedule post
            </Box>
            <img
              style={{ width: "12px", height: "12px" }}
              src={theme === "dark" ? infoIconWhite : infoIcon}
              alt={"info"}
            />
          </Box>
          <DateInput
            theme={theme}
            customStyle={{ marginTop: 8 }}
            id="date-picker-start-date"
            minDate={Date.now()}
            format="MM.dd.yyyy"
            placeholder="Select date..."
            value={schedulePost}
            onChange={(elem: any) => {
              let date = new Date(elem).getTime();
              setterSchedulePost(date);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthorSchedulePost;
