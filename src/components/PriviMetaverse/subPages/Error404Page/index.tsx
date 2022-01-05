import React from "react";
import { useHistory } from "react-router-dom";
import { error404PageStyles } from "./index.styles";

export default function Error404Page() {
  const classes = error404PageStyles();
  const history = useHistory();

  return (
    <>
      <div className={classes.mainContent}>
        <div className={classes.rightBg}>
          <img
            src={require("assets/metaverseImages/error_404_right.png")}
            className={classes.image}
          />
        </div>
        <div className={classes.leftBg}>
          <img
            src={require("assets/metaverseImages/error_404_left.png")}
            className={classes.image}
          />
        </div>
        <div className={classes.content}>
          <div className={classes.title}>404</div>
          <div className={classes.description}>
            <span className={classes.descPrev}>OOPS... </span>
            <span className={classes.descContent}> PAGE NOT FOUND</span>
          </div>
          <div className={classes.detail}>Looks like the page you are looking for does not exists</div>
          <div className={classes.action}>
            <div className={classes.goHomeBtn} onClick={() => history.push("/")}>
              GO TO HOMEPAGE
            </div>
          </div>
        </div>
      </div>
    </>
  );
}