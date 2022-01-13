import React, { useState } from "react";

import { Skeleton } from "@material-ui/lab";

import Box from "shared/ui-kit/Box";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import Avatar from "shared/ui-kit/Avatar";
import { cardStyles } from "./index.styles";

export default function LandOwnerTopCard(props) {
  const { isFirst, isLoading, item, index } = props;
  const classes = cardStyles();

  return (
    <Box className={classes.card} borderColor={isFirst ? "#FFBF85 !important" : "#E1FF6B !important"}>
      {isLoading ? (
        <Box className={classes.skeleton}>
          <Skeleton variant="rect" width="100%" height={226} />
          <Skeleton variant="rect" width="100%" height={24} />
          <Skeleton variant="rect" width="80%" height={24} />
        </Box>
      ) : (
        <>
          <Box className={classes.container}>
            <Box className={classes.no}>{index + 1}</Box>
            <Avatar size={70} rounded bordered image={getDefaultAvatar()} />
            <Box className={classes.typo1} mt={"10px"} mb={"30px"}>
              @urlSlug
            </Box>
            <Box height={"1.5px"} bgcolor="#ffffff10" width={1} />
            <Box
              className={classes.typo2}
              color={isFirst ? "#FFBF85 !important" : "#E1FF6B !important"}
              mt={2}
            >
              Owner Lands
            </Box>
            <Box className={classes.typo3} mt={0.5} mb={"18px"}>
              214
            </Box>
            <Box height={"1.5px"} bgcolor="#ffffff10" width={1} />
            <Box className={classes.typo2} color="#ffffff50" mt={2}>
              Percentage
            </Box>
            <Box className={classes.typo3} mt={0.5}>
              2.2356 %
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
