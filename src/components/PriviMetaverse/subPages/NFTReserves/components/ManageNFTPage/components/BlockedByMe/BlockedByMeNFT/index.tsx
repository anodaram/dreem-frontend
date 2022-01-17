import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useWeb3React } from "@web3-react/core";

import { Skeleton } from "@material-ui/lab";

import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import RangeSlider from "shared/ui-kit/RangeSlider";
import { blockedByMeNFTStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";
export default ({ item, isLoading }: { item: any; isLoading?: boolean }) => {
  const classes = blockedByMeNFTStyles();
  const history = useHistory();
  const { account } = useWeb3React();
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

  
  const handleClickAddress = () => {
    const address = item?.Address || "";
    if (item?.Chain?.toLowerCase() === "polygon") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/address/${address}`, "_blank");
    } else if (item?.Chain.toLowerCase() === "bsc") {
      window.open(`https://bscscan.com/address/${address}`, "_blank");
    }
  };

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
      seconds: Math.floor(value % 60),
    };
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const collateralPercent = Number(item.history?.TotalCollateralPercent)

  const isPaid = item.history?.PaidAmount === item.history?.Price;
  const isExpired = item.history?.ReservePeriod * 3600 * 24 * 1000 + item.history?.created - Date.now() <= 0;
  const isClaimed = item.ownerAddress?.toLowerCase() === account?.toLowerCase();

  const chainImage = item.Chain?.toLowerCase().includes("polygon")
    ? require("assets/tokenImages/POLYGON.png")
    : require("assets/metaverseImages/bsc.png");

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
                <Box className={classes.header}>Blocking Price</Box>
                <Box>{`${item.history?.Price} ${getTokenSymbol(item.history?.PaymentToken)}`}</Box>
              </Box>
              <Box display="flex" flexDirection="column" flex={0.25} pl={6} className={classes.section}>
                <Box className={classes.header}>Collateral</Box>
                <Box>
                  {`${
                    ((item.history?.Price *
                      (item.history?.TotalCollateralPercent || item.history?.CollateralPercent)) /
                    100).toFixed(2)
                  } ${getTokenSymbol(item.history?.PaymentToken)}`}
                </Box>
              </Box>

              <Box flex={0.5} pl={3} display="flex" alignItems="center">
                {isExpired ? (
                  isPaid ? (
                    <Box className={classes.paymentStatus} mr={2} color="#EEFF21">
                      Paid
                    </Box>
                  ) : (
                    <Box className={classes.paymentStatus} mr={2} color="#FF6868">
                      You’ve lost the posibility to buy
                    </Box>
                  )
                ) : (
                  <Box className={classes.paymentStatus} mr={2} color="#ffffff">
                    Payment In
                  </Box>
                )}
                <span className={classes.time}>{closeTime?.day} day(s) </span>
                <span className={classes.time}>{closeTime?.hour} hour(s) </span>
                <span className={classes.time}>{closeTime?.min} min</span>
                <span className={classes.time}>{closeTime?.seconds} sec</span>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" flexDirection="column" mr={8}>
                <Box className={classes.header}>Collateral Pct.</Box>
                <Box>
                  {item.history?.TotalCollateralPercent
                    ? Number(item.history?.TotalCollateralPercent).toFixed(2)
                    : "0.00"}
                  %
                </Box>
              </Box>
              {isExpired ? (
                isPaid ? (
                  isClaimed ? (
                    <Box mr={4.5}>
                      <Box className={classes.gradientText}>Already Claimed</Box>
                      <PrimaryButton
                        size="medium"
                        className={classes.primaryButton}
                        onClick={() => handleClickAddress()}
                      >
                        check on {item.Chain}scan
                        <img src={chainImage} style={{ width: "16px", height: "16px", marginLeft: "8px" }} />
                      </PrimaryButton>
                    </Box>
                  ) : (
                    <Box mr={4.5}>
                      <PrimaryButton
                        size="medium"
                        className={classes.primaryButton}
                        onClick={() => {
                          history.push(`/gameNFTS/${item.Slug}/${item.id}`);
                        }}
                      >
                        CLAIM OUTSTANDING COLLATERAL
                      </PrimaryButton>
                    </Box>
                  )
                ) : isClaimed ? (
                  <Box mr={4.5}>
                    <Box className={classes.gradientText}>Already Claimed</Box>
                    <PrimaryButton
                      size="medium"
                      className={classes.primaryButton}
                      onClick={() => handleClickAddress()}
                    >
                      check on {item.Chain}scan
                      <img src={chainImage} style={{ width: "16px", height: "16px", marginLeft: "8px" }} />
                    </PrimaryButton>
                  </Box>
                ) : (
                  <Box mr={4.5}>
                    <PrimaryButton
                      size="medium"
                      className={classes.primaryButton}
                      onClick={() => {
                        history.push(`/gameNFTS/${item.Slug}/${item.id}`);
                      }}
                    >
                      CLAIM YOUR NFT
                    </PrimaryButton>
                  </Box>
                )
              ) : (
                <Box display="flex" flexDirection="column" flex={1} mr={4} mt={0.5}>
                  <RangeSlider
                    value={(collateralPercent / 80) * 100}
                    variant="transparent"
                    onChange={(event, newValue) => {}}
                  />
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} width="100%">
                    <Box flex={collateralPercent / 80}>
                      <strong>0%</strong>
                    </Box>
                    <Box flex={(collateralPercent / 80) * 0.2} className={classes.flexBox}>
                      <strong>{Number(collateralPercent).toFixed(1)}% Liquidation</strong>
                    </Box>
                    <Box flex={(collateralPercent / 80) * 0.3} className={classes.flexBox}>
                      {Number(collateralPercent * 1.2).toFixed(1)}% High Risk
                    </Box>
                    <Box flex={(collateralPercent / 80) * 0.5}>
                      {Number(collateralPercent * 1.5).toFixed(1)}% Medium Risk
                    </Box>
                    <Box>
                      <strong>{Number(collateralPercent * 2).toFixed(1)}% Low Risk</strong>
                    </Box>
                  </Box>
                </Box>
              )}
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
