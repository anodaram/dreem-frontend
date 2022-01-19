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
    fontFamily: "Rany",
    fontWeight: 700,
    lineHeight: "33px",
    border: "2px solid",
    borderImageSlice: 1,
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "& span": {
      fontSize: 20,
    },
  },
});

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
