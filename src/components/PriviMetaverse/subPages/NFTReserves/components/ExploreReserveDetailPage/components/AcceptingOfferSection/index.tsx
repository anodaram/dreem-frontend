import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Box from "shared/ui-kit/Box";

const useStyles = makeStyles({
  title: {
    fontSize: 20,
    fontFamily: "Grifter",
    fontWeight: 700,
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    lineHeight: "33px",
    marginBottom: 32,
    textAlign: "center",
    padding: "0px 164px",
    textTransform: "uppercase",
  },
  timerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "22px 21px 10px",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    fontSize: 36,
    fontFamily: "Grifter",
    fontWeight: 700,
    lineHeight: "33px",
    border: "2px solid",
    borderImageSlice: 1,
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "& span": {
      fontSize: 16,
    },
  },
});

export default ({}) => {
  const classes = useStyles();

  return (
    <>
      <Box display="flex" flexDirection={"column"} py={10}>
        <Box className={classes.title}>This NFT is rented at this moment. It will be available again in:</Box>
        <Box className={classes.timerSection}>
          <Box>
            09 <span>days</span>
          </Box>
          <Box>
            12 <span>hours</span>
          </Box>
          <Box>
            01 <span>min</span>
          </Box>
          <Box>
            02 <span>sec</span>
          </Box>
        </Box>
      </Box>
    </>
  );
};
