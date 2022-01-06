import React, { useState, useEffect } from "react";
import Box from "shared/ui-kit/Box";
import { Text, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import PayRemainingAmountModal from "components/PriviMetaverse/modals/PayRemainingAmountModal";

import { exploreOptionDetailPageStyles } from "../../index.styles";
import moment from "moment";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";

export default ({ nft, refresh }) => {
  const classes = exploreOptionDetailPageStyles();
  const [openPayRemainingAmountModal, setOpenPayRemainingAmountModal] = useState(false);
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const [closeTime, setCloseTime] = useState<any>(null);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    if (nft) {
      setBlockingInfo(nft.blockingSalesHistories[nft.blockingSalesHistories.length - 1]);
    }
  }, [nft]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (blockingInfo) {
        let formatDate = getRemainingTime(blockingInfo);
        setCloseTime(formatDate);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [blockingInfo]);

  useEffect(() => {
    if (closeTime?.totalSeconds === 0) {
      refresh();
    }
  }, [closeTime])

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
      totalSeconds: value
    };
  };

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || '';
  };

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
          Details
        </Text>
      </Box>
      <Box display="flex" mt={2} flex={1}>
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          style={{ borderRight: "1px solid #9EACF220", fontSize: 14 }}
        >
          <Box color="#431AB7">Block Time</Box>
          <Box style={{ fontSize: 18 }}>{`${blockingInfo?.ReservePeriod} days (${moment(
            new Date(blockingInfo?.ReservePeriod * 3600 * 24 * 1000 + blockingInfo?.created)
          ).format("DD.MM.YYYY")})`}</Box>
        </Box>
        <Box display="flex" flexDirection="column" flex={1} pl={5} style={{ fontSize: 14 }}>
          <Box color="#431AB7">Collateral</Box>
          <Box style={{ fontSize: 18 }}>{blockingInfo?.CollateralPercent} %</Box>
        </Box>
      </Box>
      <Box mt={4} className={classes.BlockedDetailSection} padding="20px">
        <Box fontFamily="Agrandir GrandHeavy" fontSize={14}>
          Blocking payment:
        </Box>
        <Box mt={1} fontSize={14}>
          Your offer was accepted by the owner. You need to{" "}
          <b>pay remaining amount to buy the NFT at Future price before end of countdown</b> otherwise you
          will loose your collateral.
        </Box>
        <Box flex={1} mt="27px" display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column" flex={0.3}>
            <Box fontSize={14}>Future price</Box>
            <Box color="#431AB7" fontFamily="Agrandir GrandHeavy" fontSize={18}>
              {`${blockingInfo?.Price} ${getTokenSymbol(blockingInfo?.PaymentToken)}`}
            </Box>
          </Box>
          <Box display="flex" alignItems="center" flex={0.5} justifyContent="flex-end">
            <Box fontSize={14} textAlign="center" width="48px" mr="11px">
              Time to pay
            </Box>
            <Box className={classes.time}>{closeTime?.day} Days</Box>
            <Box className={classes.time}>{closeTime?.hour} h</Box>
            <Box className={classes.time}>{closeTime?.min} min</Box>
          </Box>
        </Box>
        {blockingInfo?.PaidAmount !== blockingInfo?.Price && (
          <PrimaryButton
            size="medium"
            style={{
              width: "100%",
              height: 52,
              backgroundColor: "#431AB7",
              marginTop: 14,
              textTransform: "uppercase",
            }}
            onClick={() => {
              setOpenPayRemainingAmountModal(true);
            }}
          >
            PAY NOW
          </PrimaryButton>
        )}
        <PayRemainingAmountModal
          open={openPayRemainingAmountModal}
          handleClose={() => setOpenPayRemainingAmountModal(false)}
          nft={nft}
          onConfirm={() => {
            refresh();
          }}
        />
      </Box>
    </>
  );
};
