import React, { useState, useEffect } from "react";
import Box from "shared/ui-kit/Box";
import { Text, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import PayRemainingAmountModal from "components/PriviMetaverse/modals/PayRemainingAmountModal";

import { exploreOptionDetailPageStyles } from "../../index.styles";
import moment from "moment";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import Web3 from "web3";
import { useParams } from "react-router-dom";
import { closeBlockingHistory, successFinishBlocking } from "shared/services/API/ReserveAPI";

const isProd = process.env.REACT_APP_ENV === "prod";

export default ({ nft, refresh }) => {
  const classes = exploreOptionDetailPageStyles();
  const [openPayRemainingAmountModal, setOpenPayRemainingAmountModal] = useState(false);
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const [closeTime, setCloseTime] = useState<any>(null);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const { collection_id, token_id } = useParams();
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

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

  
  const onWithdraw = async () => {
    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
        return;
      }
    }
    setOpenTransactionModal(true);
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);
    const activeReserveId = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ["address", "uint256", "address", "address"],
        [nft.Address, token_id, blockingInfo.from, blockingInfo.Beneficiary]
      )
    );

    const response = await web3APIHandler.ReservesManager.liquidateReserve(
      web3,
      account!,
      {
        activeReserveId,
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      await closeBlockingHistory({
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
        Id: blockingInfo.id,
        Beneficiary: blockingInfo.Beneficiary,
        offerer: account,
        notificationMode: 1,
      });

      refresh();
      // handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
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
            {blockingInfo?.CollateralPercent} %
          </Box>
        </Box>
      </Box>
      <Box mt={4} className={classes.BlockedDetailSection} padding="20px">
        <Box fontFamily="GRIFTER" fontSize={14}>
          Blocking payment:
        </Box>
        <Box mt={1} fontSize={14} fontFamily="Rany" lineHeight="16px">
        Your payment has been deposited successfully. You will be able to claim the NFT at the end of the blocking period.
        </Box>
        <Box flex={1} mt="27px" display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column" flex={0.3}>
            <Box fontSize={16}>Future price</Box>
            <Box className={classes.gradientText} fontFamily="GRIFTER" fontSize={20} mt={1}>
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
            <Box className={classes.time}>{closeTime?.second} s</Box>
          </Box>
        </Box>
        {blockingInfo?.PaidAmount !== blockingInfo?.Price ? (
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
        ) : (
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
            }}
            onClick={() => {
              onWithdraw();
            }}
          >
            WITHDRAW YOUR FUNDS
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
