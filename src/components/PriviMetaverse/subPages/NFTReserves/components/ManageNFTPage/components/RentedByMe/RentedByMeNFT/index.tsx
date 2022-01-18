import React, { useEffect, useState } from "react";
import Box from "shared/ui-kit/Box";

import { Skeleton } from "@material-ui/lab";

import { ReactComponent as CopyIcon } from "assets/icons/copy-icon-white.svg";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { toDecimals } from "shared/functions/web3";
import { PrimaryButton } from "shared/ui-kit";
import { RentedByMeNFTStyles } from "./index.styles";
import { useHistory } from "react-router-dom";

const isProd = process.env.REACT_APP_ENV === "prod";
export default ({
  item,
  onFinished,
  isExpired,
  isLoading,
}: {
  item: any;
  onFinished?: (arg: any) => void;
  isExpired?: boolean;
  isLoading?: boolean;
}) => {
  const history = useHistory();
  const classes = RentedByMeNFTStyles({ isExpired });
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

  useEffect(() => {
    if (closeTime?.value === 0 && onFinished) {
      onFinished(item);
    }
  }, [closeTime]);

  const getRemainingTime = _blockingInfo => {
    let value = Math.max(_blockingInfo?.rentalTime * 1000 + _blockingInfo?.created - Date.now(), 0);
    value = value / 1000;

    let day_unit = 3600 * 24;
    let hr_unit = 3600;
    let min_unit = 60;
    return {
      day: parseInt((value / day_unit).toString()),
      hour: parseInt(((value % day_unit) / hr_unit).toString()),
      min: parseInt(((value / min_unit) % min_unit).toString()),
      sec: Math.floor(value % 60),
      value,
    };
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const handleOpenAddress = () => {
    if (item.Chain?.toLowerCase() === "mumbai" || item.Chain?.toLowerCase() === "polygon") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/token/${item?.Address}`, "_blank");
    } else {
      window.open(`https://${!isProd ? "testnet." : ""}bscscan.com/token/${item?.Address}`, "_blank");
    }
  };

  const getTokenDecimal = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token.Decimals;
  };

  const getAmount = () => {
    const a =
      +toDecimals(item.history?.pricePerSecond, getTokenDecimal(item.history?.fundingToken)) *
      item.history.rentalTime;
    return Math.round(a * 100) / 100;
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
            alt={item?.name}
          />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            ml={4}
            flex={1}
            height="96px"
            mr={2}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={2}
              className={classes.topContainer}
            >
              <Box className={classes.nftName}>{item?.name}</Box>
              <Box className={classes.address}>
                Address:{" "}
                {item.Address.substr(0, 18) + "..." + item.Address.substr(item.Address.length - 3, 3)}
                <span onClick={handleOpenAddress}>
                  <CopyIcon />
                </span>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" flex={1} mt={2}>
              <Box display="flex" flexDirection="column" flex={0.25} className={classes.section}>
                <Box className={classes.header}>Rental Price</Box>
                <Box>{`${getAmount()} ${getTokenSymbol(item.history.fundingToken)}`}</Box>
              </Box>
              <Box display="flex" flexDirection="column" flex={0.25} pl={6} className={classes.section}>
                <Box className={classes.header}>Total Paid</Box>
                <Box>{`${getAmount()} ${getTokenSymbol(item.history.fundingToken)}`}</Box>
              </Box>
              {isExpired ? (
                <Box display="flex" flex={1} justifyContent="flex-end">
                  <PrimaryButton
                    size="medium"
                    className={classes.primaryButton}
                    style={{
                      borderRadius: "40px",
                    }}
                    onClick={() => {
                      history.push(`/gameNFTS/${item.Slug}/${item.id}`);
                    }}
                  >
                    Rent again
                  </PrimaryButton>
                </Box>
              ) : (
                <Box flex={0.5} pl={6} display="flex" alignItems="center">
                  <Box mr={3} color="#fff" fontSize={14} style={{ textTransform: "capitalize" }}>
                    Remaining Rental Time
                  </Box>
                  <span className={classes.time}>{closeTime?.day} day(s)</span>
                  <span className={classes.time}>{closeTime?.hour} hour(s)</span>
                  <span className={classes.time}>{closeTime?.min} min</span>
                  <span className={classes.time}>{closeTime?.sec} sec</span>
                </Box>
              )}
            </Box>
          </Box>
          <img src={require(`assets/icons/arrow_white_right.png`)} style={{ cursor: "pointer" }} />
        </Box>
      )}
    </Box>
  );
};
