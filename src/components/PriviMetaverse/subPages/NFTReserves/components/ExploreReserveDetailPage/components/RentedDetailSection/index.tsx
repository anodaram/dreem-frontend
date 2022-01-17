import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import moment from "moment";
import Box from "shared/ui-kit/Box";
import { useWeb3React } from "@web3-react/core";
import { PrimaryButton, Text } from "shared/ui-kit";
import { toDecimals } from "shared/functions/web3";
import { formatDuration } from "shared/helpers/utils";
import { resetStatus } from "shared/services/API/ReserveAPI";
import { BlockchainNets } from "shared/constants/constants";

import { exploreOptionDetailPageStyles } from "../../index.styles";
import Web3 from "web3";
const isProd = process.env.REACT_APP_ENV === "prod";

export default ({ nft, setNft, isOwner }) => {
  const classes = exploreOptionDetailPageStyles();
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const histories = nft?.rentHistories ?? [];
  const offer = histories.length ? histories[0] : null;
  const { library, account, chainId } = useWeb3React();
  const [remainingTime, setRemainingTime] = useState(0);

  const chain = React.useMemo(() => BlockchainNets.find(net => net.chainId === chainId), [chainId]);

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
    return token?.Symbol || "";
  };

  const getTokenDecimal = addr => {
    if (tokens.length == 0) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token.Decimals;
  };

  const getSyntheticNftAddress = async () => {
    try {
      const web3APIHandler = chain.apiHandler;
      const web3 = new Web3(library.provider);
      const response = await web3APIHandler.RentalManager.getSyntheticNFTAddress(
        web3,
        {
          collectionId: nft.Address,
        },
      );
      return response;
    } catch (err) {
      return '';
    }
  };

  const handleOpenToken = async () => {
    let syntheticAddress: any = offer.syntheticAddress
    if (!syntheticAddress) {
      syntheticAddress = await getSyntheticNftAddress();
      setNft({...nft, syntheticAddress})
    }
    window.open(`${chain?.scan?.url}/token/${syntheticAddress}?a=${offer.syntheticID}`, "_blank");
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
            fontWeight: 700,
            color: "white",
            fontFamily: "GRIFTER",
          }}
        >
          Rented NFT Details
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" className={classes.RentedDetailSection} mt={3}>
        <Box display="flex" flexDirection="column" className={classes.RentedDetailSectionOne}>
          <Box
            ml={3}
            padding="28px 24px 28px 0"
            display="flex"
            justifyContent="space-between"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.5)" }}
          >
            <span>Price Per Hour</span>
            <Box
              className={classes.gradientText}
              textAlign="end"
              fontWeight="700"
              fontFamily="GRIFTER"
              fontSize={18}
            >
              {`${toDecimals(offer.pricePerSecond, getTokenDecimal(offer.fundingToken))}`}{" "}
              {getTokenSymbol(offer.fundingToken)}
            </Box>
          </Box>
          <Box ml={3} padding="28px 24px 28px 0" display="flex" justifyContent="space-between">
            <span>Remaining rental time</span>
            <Box
              className={classes.gradientText}
              textAlign="end"
              fontWeight="700"
              fontFamily="GRIFTER"
              fontSize={18}
            >
              {formatDuration(remainingTime)}
            </Box>
          </Box>
        </Box>
        <Box
          className={classes.revenueTotal}
          padding="30px 24px 30px 24px"
          display="flex"
          justifyContent="space-between"
          color="#4218B5"
        >
          <Box
            className={classes.gradientText}
            fontWeight="700"
            fontFamily="GRIFTER"
            fontSize={18}
            style={{ textTransform: "uppercase" }}
          >
            Total {isOwner ? "Revenue" : "Paid"}
          </Box>
          <Box
            className={classes.gradientText}
            textAlign="end"
            fontWeight="700"
            fontFamily="GRIFTER"
            fontSize={18}
          >
            {`${toDecimals(
              offer.pricePerSecond * offer.rentalTime,
              getTokenDecimal(offer.fundingToken)
            )} ${getTokenSymbol(offer.fundingToken)}`}
          </Box>
        </Box>
      </Box>
      <PrimaryButton
        size="medium"
        style={{
          width: "100%",
          height: 52,
          backgroundColor: "#E9FF26",
          marginTop: 14,
          textTransform: "uppercase",
          color: "#212121",
          borderRadius: 0,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
        onClick={() => handleOpenToken()}
      >
        <img
          src={
            nft?.Chain === "BSC"
              ? require("assets/icons/icon_bscscan.ico")
              : require("assets/icons/polygon_scan.png")
          }
          width={24}
          style={{
            marginRight: 12,
          }}
        />
        View Synthetic
      </PrimaryButton>
    </>
  );
};
