import React, { useEffect, useState } from "react";
import Box from "shared/ui-kit/Box";

import { RentedByMeNFTStyles } from "./index.styles";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon-white.svg";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { toDecimals } from "shared/functions/web3";

const isProd = process.env.REACT_APP_ENV === "prod";
export default ({ item, onFinished }: { item: any, onFinished?: (arg: any) => void }) => {
  const classes = RentedByMeNFTStyles();
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
      onFinished(item)
    }
  }, [closeTime])

  const getRemainingTime = _blockingInfo => {
    let value = Math.max(
      _blockingInfo?.rentalTime * 1000 + _blockingInfo?.created - Date.now(),
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
      value
    };
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || '';
  };

  const handleOpenAddress = () => {
    if (item.chainsFullName?.toLowerCase() === "mumbai" || item.chainsFullName?.toLowerCase() === "polygon") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${item?.history?.hash}`, "_blank");
    } else {
      window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${item?.history?.hash}`, "_blank");
    }
  };

  const getTokenDecimal = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token.Decimals;
  };

  const getAmount = () => {
    const a = (+toDecimals(item.history?.pricePerSecond, getTokenDecimal(item.history?.fundingToken))) * item.history.rentalTime * 86400;
    return Math.round(a * 100) / 100;
  }
  return (
    <Box display="flex" alignItems="center" color="#fff" width="100%" className={classes.container}>
      <img
        src={item?.content_url ?? require(`assets/backgrounds/digital_art_1.png`)}
        className={classes.nftImage}
        alt={item?.name}
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        ml={4}
        flex={1}
        pt={1}
        height="96px"
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.nftName}>{item?.name}</Box>
          <Box className={classes.address}>
            Address:{" "}
            {item.token_address.substr(0, 18) +
              "..." +
              item.token_address.substr(item.token_address.length - 3, 3)}
            <span onClick={handleOpenAddress}>
              <CopyIcon />
            </span>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" flex={1}>
          <Box display="flex" flexDirection="column" flex={0.25} className={classes.section}>
            <Box className={classes.header}>Rental Price</Box>
            <Box>
              {`${getAmount()} ${getTokenSymbol(
                item.history.fundingToken
              )}`}
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" flex={0.25} pl={6} className={classes.section}>
            <Box className={classes.header}>Total Paid</Box>
            <Box>
              {`${getAmount()} ${getTokenSymbol(
                item.history.fundingToken
              )}`}
            </Box>
          </Box>
          <Box flex={0.5} pl={6} display="flex" alignItems="center">
            <Box className={classes.header} mr={3}>
              Remaining Rental Time
            </Box>
            <span className={classes.time}>{closeTime?.day} Days</span>
            <span className={classes.time}>{closeTime?.hour} h</span>
            <span className={classes.time}>{closeTime?.min} min</span>
          </Box>
        </Box>
      </Box>
      <img src={require(`assets/icons/arrow_white_right.png`)} style={{ cursor: "pointer" }} />
    </Box>
  );
};
