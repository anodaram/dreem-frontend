import React, { useState } from "react";
import Box from "shared/ui-kit/Box";
import { makeStyles } from "@material-ui/core/styles";

interface ILoadingScreenProps {
  loading: boolean;
}

export const LoadingArrow: React.FC<ILoadingScreenProps> = ({
  loading
}) => {
  const classes = useStyles();

  return loading ? (
    <Box className={classes.root}>
      <img className={classes.loader} src={require("assets/metaverseImages/loading.png")} />
    </Box>
  ) : (
    <></>
  );
};

export const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: "calc(50% - 4em)",
    left: "calc(50% - 4em)"
  },
  "@keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  "@-webkit-keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  "@-moz-keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  loader: {
    WebkitAnimation: "$rotating 0.5s linear infinite",
    animation: "$rotating 0.5s linear infinite",
    MozAnimation: "$rotating 0.5s linear infinite",
  },
}));
