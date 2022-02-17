import React, { useState, useEffect } from "react";

import Box from "shared/ui-kit/Box";
import { useStyles } from "./index.styles";

export default ({ nft, refresh, isBlocked }) => {
  const classes = useStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const [rentalInfo, setRentalInfo] = useState<any>();
  const [closeTime, setCloseTime] = useState<any>(null);

  useEffect(() => {
    if (isBlocked && nft && nft?.blockingSalesHistories?.length) {
      setBlockingInfo(nft.blockingSalesHistories[nft.blockingSalesHistories.length - 1]);
    } else if (nft && nft.rentHistories?.length) {
      setRentalInfo(nft.rentHistories[nft.rentHistories.length - 1]);
    }
  }, [nft]);

  useEffect(() => {
    if (isBlocked && blockingInfo) {
      let time = Math.max(
        blockingInfo?.ReservePeriod * 3600 * 24 * 1000 + blockingInfo?.created - Date.now(),
        0
      );

      if (time > 0) {
        const interval = setInterval(() => {
          time = time - 1000;
          let formatDate = formatRemainingTime(time);
          setCloseTime(formatDate);
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [isBlocked, blockingInfo]);

  useEffect(() => {
    if (rentalInfo) {
      let time = Math.max(rentalInfo.created + +rentalInfo.rentalTime * 1000 - Date.now(), 0);

      if (time > 0) {
        const interval = setInterval(() => {
          time = time - 1000;
          let formatDate = formatRemainingTime(time);
          setCloseTime(formatDate);
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [rentalInfo]);

  const formatRemainingTime = value => {
    value = value / 1000;
    let day_unit = 3600 * 24;
    let hr_unit = 3600;
    let min_unit = 60;
    return {
      day: parseInt((value / day_unit).toString()),
      hour: parseInt(((value % day_unit) / hr_unit).toString()),
      min: parseInt(((value / min_unit) % min_unit).toString()),
      second: Math.floor(value % 60),
      totalSeconds: value,
    };
  };

  return (
    <>
      <Box display="flex" flexDirection={"column"} py={10}>
        <Box className={classes.title}>
          This NFT is {isBlocked ? "blocked" : "rented"} at this moment. It will be available again in:
        </Box>
        <Box className={classes.timerSection}>
          <Box>
            {closeTime?.day || 0} <span>days</span>
          </Box>
          <Box>
            {closeTime?.hour || 0} <span>hours</span>
          </Box>
          <Box>
            {closeTime?.min || 0} <span>min</span>
          </Box>
          <Box>
            {closeTime?.second || 0} <span>sec</span>
          </Box>
        </Box>
      </Box>
    </>
  );
};
