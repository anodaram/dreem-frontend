import React, { useState } from "react";

import { Skeleton } from "@material-ui/lab";

import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getDefaultBGImage } from "shared/services/user/getUserAvatar";
import { cardStyles } from "./index.styles";

export default function LandForSaleCard(props) {
  const { isLoading, item } = props;
  const classes = cardStyles();

  return (
    <Box className={classes.card}>
      {isLoading ? (
        <Box className={classes.skeleton}>
          <Skeleton variant="rect" width="100%" height={226} />
          <Skeleton variant="rect" width="100%" height={24} />
          <Skeleton variant="rect" width="80%" height={24} />
        </Box>
      ) : (
        <>
          <Box
            flex={1}
            position="relative"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            className={classes.container}
          >
            <img className={classes.image} src={getDefaultBGImage()} alt="robot" />
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
              <Box className={classes.name}>{item.name}</Box>
              <PolygonIcon />
            </Box>
            <Box className={classes.zone}>Zone 1</Box>
          </Box>
          <Box display="flex" justifyContent="center" pb={3}>
            <PrimaryButton size="medium" className={classes.button} onClick={() => {}}>
              Mint NFT
            </PrimaryButton>
          </Box>
        </>
      )}
    </Box>
  );
}

const PolygonIcon = () => (
  <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.713 6.6112C19.475 6.4782 19.2069 6.40837 18.9343 6.40837C18.6617 6.40837 18.3936 6.4782 18.1556 6.6112L14.5827 8.68357L12.155 10.0351L8.58222 12.1075C8.34421 12.2404 8.07615 12.3101 7.80355 12.3101C7.53095 12.3101 7.26289 12.2404 7.02488 12.1075L4.1848 10.4856C3.95373 10.3531 3.76072 10.1633 3.62441 9.93441C3.4881 9.70556 3.4131 9.44542 3.40664 9.17913V5.98048C3.40344 5.71217 3.47442 5.44819 3.61173 5.21765C3.74904 4.98711 3.94735 4.79898 4.1848 4.674L6.97901 3.0972C7.21702 2.96431 7.48508 2.89454 7.75768 2.89454C8.03028 2.89454 8.29834 2.96431 8.53635 3.0972L11.3306 4.674C11.5616 4.80651 11.7546 4.99635 11.891 5.22521C12.0273 5.45406 12.1023 5.71419 12.1087 5.98048V8.05285L14.5364 6.65626V4.58389C14.5396 4.31558 14.4686 4.0516 14.3313 3.82106C14.194 3.59052 13.9957 3.40239 13.7582 3.2774L8.58222 0.30422C8.34421 0.171328 8.07615 0.101562 7.80355 0.101562C7.53095 0.101563 7.26289 0.171328 7.02488 0.30422L1.75653 3.27761C1.51912 3.40257 1.32082 3.59068 1.18351 3.82118C1.0462 4.05167 0.975215 4.31561 0.978375 4.58389V10.5757C0.975177 10.844 1.04615 11.108 1.18346 11.3386C1.32077 11.5691 1.51909 11.7572 1.75653 11.8822L7.02427 14.8556C7.26228 14.9885 7.53034 15.0583 7.80294 15.0583C8.07553 15.0583 8.3436 14.9885 8.58161 14.8556L12.1544 12.8283L14.582 11.4317L18.155 9.40439C18.393 9.27138 18.6611 9.20155 18.9337 9.20155C19.2063 9.20155 19.4744 9.27138 19.7124 9.40439L22.5066 10.9812C22.7376 11.1137 22.9306 11.3036 23.0669 11.5324C23.2032 11.7613 23.2783 12.0214 23.2847 12.2877V15.4863C23.2879 15.7546 23.217 16.0186 23.0796 16.2492C22.9423 16.4797 22.744 16.6678 22.5066 16.7928L19.7124 18.4147C19.4744 18.5475 19.2063 18.6173 18.9337 18.6173C18.6611 18.6173 18.393 18.5475 18.155 18.4147L15.3608 16.8379C15.1298 16.7053 14.9368 16.5155 14.8004 16.2866C14.6641 16.0578 14.5891 15.7977 14.5827 15.5314V13.4588L12.155 14.8554V16.9278C12.1518 17.1961 12.2228 17.4601 12.3601 17.6906C12.4974 17.9211 12.6957 18.1093 12.9332 18.2342L18.2009 21.2076C18.4389 21.3405 18.707 21.4103 18.9796 21.4103C19.2522 21.4103 19.5202 21.3405 19.7582 21.2076L25.026 18.2342C25.257 18.1017 25.45 17.9119 25.5863 17.683C25.7226 17.4542 25.7976 17.194 25.8041 16.9278V10.9361C25.8073 10.6678 25.7364 10.4038 25.599 10.1733C25.4617 9.94276 25.2634 9.75463 25.026 9.62964L19.713 6.6112Z"
      fill="white"
    />
  </svg>
);
