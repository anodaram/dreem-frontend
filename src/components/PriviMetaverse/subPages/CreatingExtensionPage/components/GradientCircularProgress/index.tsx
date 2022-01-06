import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  circle: {
    stroke: "url(#linearColors)",
  },
}));

export default function GradientCircularProgress() {
  const classes = useStyles({});

  return (
    <>
      <svg width="1" height="1">
        <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C907E9" />
          <stop offset="100%" stopColor="#F4B3FF" />
        </linearGradient>
      </svg>
      <CircularProgress thickness={4} classes={{ circle: classes.circle }} size={110} />
    </>
  );
}
