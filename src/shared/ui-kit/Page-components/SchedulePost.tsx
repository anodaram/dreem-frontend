import React from "react";
import Grid from "@material-ui/core/Grid";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { authorSchedulePostStyles } from "./AuthorSchedulePost.styles";

const infoIcon = require("assets/icons/info.svg");

const SchedulePost = (props: any) => {
  const classes = authorSchedulePostStyles();

  return (
    <div className={classes.authorDateRowBlogPost}>
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          <div className={classes.flexRowInputsCommunitiesModal} style={{ alignItems: "center" }}>
            <div className={classes.infoHeaderCommunitiesModal}>Schedule post</div>
            <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
            {!props.uncontrolledSchedule ? (
              <div
                className={classes.optionsContainer}
                style={{ marginTop: 0, marginLeft: 10, marginBottom: 5 }}
              >
                <button
                  className={props.scheduleOn === true ? classes.optionButtonSelected : classes.optionButton}
                  id="commentsButtonCreatePost"
                  onClick={() => {
                    props.setterScheduleOn(true);
                  }}
                >
                  On
                </button>
                <button
                  className={props.scheduleOn === false ? classes.optionButtonSelected : classes.optionButton}
                  id="noCommentsButtonCreatePost"
                  onClick={() => {
                    props.setterScheduleOn(false);
                  }}
                >
                  Off
                </button>
              </div>
            ) : null}
          </div>
          {props.scheduleOn ? (
            <div
              className={classes.textFieldCreatePost}
              style={{
                width: "calc(400px - 24px)",
                paddingTop: "1px",
                paddingBottom: "1px",
              }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  id="date-picker-start-date"
                  minDate={Date.now()}
                  placeholder="Select date..."
                  value={props.schedulePost}
                  onChange={(elem: any) => {
                    let date = new Date(elem).getTime();
                    props.setterSchedulePost(date);
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

export default SchedulePost;
