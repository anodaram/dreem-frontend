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
  }, [closeTime]);

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
      second: Math.floor(value % 60),
      totalSeconds: value,
    };
  };

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "GRIFTER",
            color: "white",
            textTransform: "uppercase",
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
          <Box className={classes.gradientText} fontSize="14px" mb="4px">
            Block Time
          </Box>
          <Box fontFamily="GRIFTER" fontWeight="bold" fontSize="20px">{`${
            blockingInfo?.ReservePeriod
          } days (${moment(
            new Date(blockingInfo?.ReservePeriod * 3600 * 24 * 1000 + blockingInfo?.created)
          ).format("DD.MM.YYYY")})`}</Box>
        </Box>
        <Box display="flex" flexDirection="column" flex={1} pl={5} style={{ fontSize: 14 }}>
          <Box className={classes.gradientText} fontSize="14px" mb="4px">
            Collateral
          </Box>
          <Box fontFamily="GRIFTER" fontWeight="bold" fontSize="20px">
            {blockingInfo?.TotalCollateralPercent} %
          </Box>
        </Box>
      </Box>
      {blockingInfo?.PaidAmount !== blockingInfo?.Price ? (
        <Box mt={4} className={classes.BlockedDetailSection} padding="20px">
          <Box fontFamily="GRIFTER" fontSize={14}>
            Blocking payment:
          </Box>
          <Box mt={1} fontSize={14} fontFamily="Rany" lineHeight="16px">
            Reminder! You've blocked this NFT, but haven't paid yet. In order to successfully block, please
            pay now.
          </Box>
          <Box flex={1} mt="27px" display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column" flex={0.3}>
              <Box fontSize={16}>Future price</Box>
              <Box className={classes.gradientText} fontFamily="GRIFTER" fontSize={20} mt={1}>
                {`${blockingInfo?.Price} ${getTokenSymbol(blockingInfo?.PaymentToken)}`}
              </Box>
            </Box>
            <Box display="flex" alignItems="center" flex={0.6} justifyContent="flex-end">
              <Box fontSize={14} textAlign="center" minWidth="48px" mr="11px">
                Time to pay
              </Box>
              <Box className={classes.time}>{closeTime?.day} day(s)</Box>
              <Box className={classes.time}>{closeTime?.hour} hour(s)</Box>
              <Box className={classes.time}>{closeTime?.min} min</Box>
              <Box className={classes.time}>{closeTime?.second} sec</Box>
            </Box>
          </Box>
          <PrimaryButton
            size="medium"
            style={{
              width: "100%",
              height: 52,
              backgroundColor: "#E9FF26",
              marginTop: 14,
              color: "#212121",
              textTransform: "uppercase",
            }}
            onClick={() => {
              setOpenPayRemainingAmountModal(true);
            }}
          >
            PAY NOW
          </PrimaryButton>
          <PayRemainingAmountModal
            open={openPayRemainingAmountModal}
            handleClose={() => setOpenPayRemainingAmountModal(false)}
            nft={nft}
            onConfirm={() => {
              refresh();
            }}
          />
        </Box>
      ) : (
        <Box mt={4} className={classes.ExpiredPaySuccess} padding="20px">
          <Box fontFamily="GRIFTER" fontSize={20} color="#E9FF26">
            Offer Paid
          </Box>
          <Box mt={1} fontSize={14} lineHeight="22px" fontFamily="Rany">
            Your payment has been deposited successfully. You will be able to claim the NFT at the end of the
            blocking period
          </Box>
          <Box flex={1} mt="27px" display="flex" justifyContent="space-between" alignItems="center">
            <Box
              display="flex"
              flexDirection="column"
              flex={0.5}
              style={{ borderRight: "1px solid #A4A4A420" }}
            >
              <Box fontSize={16}>Future Price</Box>
              <Box className={classes.gradientText} fontFamily="Rany" fontSize={18} mt={1}>
                {`${((Number(blockingInfo?.TotalCollateralPercent) / 100) * Number(blockingInfo?.Price)).toFixed(2)} ${getTokenSymbol(
                  blockingInfo?.PaymentToken
                )}`}
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" flex={0.5} pl={8}>
              <Box fontSize={14}>Paid amount to withdraw</Box>
              <Box className={classes.gradientText} fontFamily="Rany" fontSize={18} mt={1}>
                100%
              </Box>
            </Box>
          </Box>
          <PrimaryButton size="medium" className={classes.primaryButton} disabled onClick={() => {}}>
            CLAIM BLOCKED NFT
          </PrimaryButton>
        </Box>
      )}
    </>
  );
};
