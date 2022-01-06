import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import moment from "moment";
import Box from "shared/ui-kit/Box";
import { Text } from "shared/ui-kit";
import { toDecimals } from "shared/functions/web3";
import { formatDuration } from "shared/helpers/utils";
import { resetStatus } from "shared/services/API/ReserveAPI";

import { exploreOptionDetailPageStyles } from "../../index.styles";
const isProd = process.env.REACT_APP_ENV === "prod";

export default ({ nft, setNft }) => {
  const classes = exploreOptionDetailPageStyles();
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const histories = nft?.rentHistories ?? [];
  const offer = histories.length ? histories[0] : null;
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!offer) {
      return;
    }

    const time = offer.created + +offer.rentalTime * 1000 - Date.now();
    setRemainingTime(time);
    const timerId = setInterval(() => {
      setRemainingTime(time => {
        if (time < 0) {
          let newNft = { ...nft };
          newNft.status = null;
          setNft(newNft);
          resetStatus({
            CollectionId: nft.token_address,
            TokenId: nft.token_id,
            mode: isProd ? "main" : "test",
          });
          return time;
        }
        return time - 1000;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [offer]);

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || '';
  };

  const getTokenDecimal = addr => {
    if (tokens.length == 0) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token.Decimals;
  };

  if (!offer) {
    return null;
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Text
          style={{
            fontSize: "18px",
            color: "#1A1B1C",
            fontWeight: 800,
            fontFamily: "Agrandir GrandHeavy",
          }}
        >
          Rented NFT Details
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: "#181818",
            fontWeight: 600,
            fontFamily: "Agrandir",
          }}
        >
          Until {moment(new Date(+offer.rentalExpiration)).format("DD.MM.YYYY")}{" "}
          <span style={{ opacity: 0.6 }}>
            ({formatDuration(moment(new Date(+offer.rentalExpiration)).diff(moment()))})
          </span>
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" className={classes.RentedDetailSection} mt={3}>
        <Box display="flex" flexDirection="column" className={classes.RentedDetailSectionOne}>
          <Box
            ml={3}
            padding="28px 24px 28px 0"
            display="flex"
            justifyContent="space-between"
            style={{ borderBottom: "1px solid #E9E9F2" }}
          >
            <span>Price per Second</span>
            <Box color="#4218B5" style={{ fontWeight: 800, fontFamily: "Montserrat" }}>
              {`${toDecimals(offer.pricePerSecond, getTokenDecimal(offer.fundingToken))}`}{" "}
              <span style={{ opacity: 0.6 }}>{getTokenSymbol(offer.fundingToken)}</span>
            </Box>
          </Box>
          <Box
            ml={3}
            padding="28px 24px 28px 0"
            display="flex"
            justifyContent="space-between"
            style={{ borderBottom: "1px solid #E9E9F2" }}
          >
            <span>Remaining rental time</span>
            <Box color="#4218B5" style={{ fontWeight: 800, fontFamily: "Montserrat" }}>
              {formatDuration(remainingTime)}
            </Box>
          </Box>
          <Box ml={3} padding="28px 24px 28px 0" display="flex" justifyContent="space-between">
            <span>Total cost</span>
            <Box color="#4218B5" style={{ fontWeight: 800, fontFamily: "Montserrat" }}>
              {toDecimals(
                offer.pricePerSecond * ((+offer.rentalTime * 1000 - remainingTime) / 1000),
                getTokenDecimal(offer.fundingToken)
              )}{" "}
              <span style={{ opacity: 0.6 }}>{getTokenSymbol(offer.fundingToken)}</span>
            </Box>
          </Box>
        </Box>
        <Box padding="30px 24px 30px 24px" display="flex" justifyContent="space-between" color="#4218B5">
          <span>Revenue to date</span>
          <span style={{ fontWeight: 800, fontFamily: "Montserrat" }}>
            {toDecimals(offer.pricePerSecond * +offer.rentalTime, getTokenDecimal(offer.fundingToken))}{" "}
            <span style={{ opacity: 0.6 }}>{getTokenSymbol(offer.fundingToken)}</span>
          </span>
        </Box>
      </Box>
    </>
  );
};
