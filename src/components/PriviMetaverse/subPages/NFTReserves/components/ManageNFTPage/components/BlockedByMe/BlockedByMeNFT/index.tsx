import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { Skeleton } from "@material-ui/lab";

import { SecondaryGradientSlider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import { blockedByMeNFTStyles } from "./index.styles";

const SlideMarks = [
  {
    value: 0,
    label: "Liquidation",
  },
  {
    value: 33.0,
    label: "High Risk",
  },
  {
    value: 66.0,
    label: "Medium Risk",
  },
  {
    value: 100,
    label: "Low Risk",
  },
];

export default ({ item, isExpired, isLoading }: { item: any; isExpired?: boolean; isLoading?: boolean }) => {
  const classes = blockedByMeNFTStyles({ isExpired });
  const history = useHistory();
  const [closeTime, setCloseTime] = useState<any>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    const interval = setInterval(() => {
      if (item) {
        let formatDate = getRemainingTime(item.history);
        setCloseTime(formatDate);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [item]);

  const getRemainingTime = _blockingInfo => {
    let value = Math.max(
      _blockingInfo?.ReservePeriod * 3600 * 24 * 1000 + _blockingInfo?.created - Date.now(),
      0
    );
    value = value / 1000;

    let day_unit = 3600 * 24;
    let hr_unit = 3600;
    let min_unit = 60;
    return {
      day: parseInt((value / day_unit).toString()),
      hour: parseInt(((value % day_unit) / hr_unit).toString()),
      min: parseInt(((value / min_unit) % min_unit).toString()),
    };
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  return (
    <Box className={classes.borderContainer}>
      {isLoading ? (
        <Box className={classes.skeleton}>
          <Skeleton variant="rect" width="100%" height={226} />
          <Skeleton variant="rect" width="100%" height={24} style={{ marginTop: "8px" }} />
          <Skeleton variant="rect" width="80%" height={24} style={{ marginTop: "8px" }} />
          <Skeleton variant="rect" width="80%" height={24} style={{ marginTop: "8px" }} />
          <Skeleton variant="rect" width="80%" height={24} style={{ marginTop: "8px" }} />
        </Box>
      ) : (
        <Box display="flex" alignItems="center" color="#fff" width="100%" className={classes.container}>
          <img
            src={item?.image ?? require(`assets/backgrounds/digital_art_1.png`)}
            className={classes.nftImage}
            alt={item.nftName}
          />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            ml={4}
            flex={1}
            height="150px"
          >
            <Box className={classes.nftName}>{item?.name}</Box>
            <Box display="flex" alignItems="center" flex={1}>
              <Box display="flex" flexDirection="column" flex={0.25} className={classes.section}>
                <Box className={classes.header}>Future Price</Box>
                <Box>{`${item.history?.Price} ${getTokenSymbol(item.history?.PaymentToken)}`}</Box>
              </Box>
              <Box display="flex" flexDirection="column" flex={0.25} pl={6} className={classes.section}>
                <Box className={classes.header}>Collateral</Box>
                <Box>
                  {`${
                    (item.history?.Price *
                      (item.history?.TotalCollateralPercent || item.history?.CollateralPercent)) /
                    100
                  } ${getTokenSymbol(item.history?.PaymentToken)}`}
                </Box>
              </Box>

              {item.history?.ReservePeriod * 3600 * 24 * 1000 + item.history?.created - Date.now() > 0 ? (
                <Box flex={0.5} pl={6} display="flex" alignItems="center">
                  <Box className={classes.header} mr={3}>
                    Payment In
                  </Box>
                  <span className={classes.time}>{closeTime?.day} day(s) </span>
                  <span className={classes.time}>{closeTime?.hour} hour(s) </span>
                  <span className={classes.time}>{closeTime?.min} min</span>
                </Box>
              ) : (
                <Box flex={0.5} pl={6} display="flex" alignItems="center"></Box>
              )}
            </Box>
            <Box display="flex" alignItems="center">
              <Box display="flex" flexDirection="column" mr={8}>
                <Box className={classes.header}>Collateral Pct.</Box>
                <Box>
                  {item.history?.TotalCollateralPercent
                    ? Number(item.history?.TotalCollateralPercent).toFixed(2)
                    : item.history?.CollateralPercent
                    ? Number(item.history?.CollateralPercent).toFixed(2)
                    : "0.00"}
                  %
                </Box>
              </Box>
              <Box flex={1} mr={4}>
                <SecondaryGradientSlider
                  marks={SlideMarks}
                  step={1}
                  value={item.history?.TotalCollateralPercent || item.history?.CollateralPercent}
                  valueLabelDisplay="off"
                  className={classes.slider}
                />
              </Box>
            </Box>
          </Box>
          <img
            src={require(`assets/icons/arrow_white_right.png`)}
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.push(`/gameNFTS/${item.Slug}/${item.id}`);
            }}
          />
        </Box>
      )}
    </Box>
  );
};
