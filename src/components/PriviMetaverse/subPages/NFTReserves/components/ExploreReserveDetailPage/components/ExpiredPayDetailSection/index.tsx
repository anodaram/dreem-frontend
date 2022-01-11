import React, { useEffect, useState } from "react";
import Box from "shared/ui-kit/Box";
import { Text, SecondaryButton, PrimaryButton } from "shared/ui-kit";

import { exploreOptionDetailPageStyles } from "../../index.styles";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import moment from "moment";
import { useParams } from "react-router";
import Web3 from "web3";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useWeb3React } from "@web3-react/core";
import TransactionProgressModal from "components/PriviMetaverse/modals/TransactionProgressModal";
import { closeBlockingHistory, successFinishBlocking } from "shared/services/API/ReserveAPI";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";

const isProd = process.env.REACT_APP_ENV === "prod";

export default ({ isSuccess, refresh, nft }: { isSuccess: any; refresh: any; nft: any }) => {
  const classes = exploreOptionDetailPageStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const { collection_id, token_id } = useParams();
  const { account, library, chainId } = useWeb3React();
  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [price, setPrice] = useState<number>(0);
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (nft?.blockingSalesHistories?.length > 0) {
      setBlockingInfo(nft.blockingSalesHistories[nft.blockingSalesHistories.length - 1]);
    }
  }, [nft]);

  const onConfirm = async () => {
    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", { variant: "error" });
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
      if (isSuccess) {
        await successFinishBlocking({
          mode: isProd ? "main" : "test",
          CollectionId: collection_id,
          TokenId: token_id,
          Id: blockingInfo.id,
          Beneficiary: blockingInfo.Beneficiary,
          offerer: account,
          notificationMode: 1,
        });
      } else {
        await closeBlockingHistory({
          ...blockingInfo,
          mode: isProd ? "main" : "test",
          CollectionId: collection_id,
          TokenId: token_id,
          Id: activeReserveId,
          Beneficiary: blockingInfo.Beneficiary,
          offerer: account,
          notificationMode: 1,
        });
      }

      refresh();
      // handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
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
            Option Time
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
            {blockingInfo?.TotalCollateralPercent || 0} %
          </Box>
        </Box>
      </Box>
      <hr className={classes.divider} />
      <Box mt={4} className={isSuccess ? classes.ExpiredPaySuccess : classes.ExpiredPayFailed} padding="20px">
        <Box fontFamily="GRIFTER" fontSize={20} color="#E9FF26">
          {isSuccess ? "Offer Paid" : "Offer Expired"}
        </Box>
        {isSuccess ? (
          <>
            <Box mt={1} fontSize={14} lineHeight="22px" fontFamily="Rany">
              Your payment has been deposited successfully. You will be able to claim the NFT at the end of the blocking period
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
                  {`${(blockingInfo?.TotalCollateralPercent / 100) * blockingInfo?.Price} ${getTokenSymbol(
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
          </>
        ) : (
          <Box mt={1} fontFamily="Rany" fontSize={14} lineHeight="22.4px">
            You didn’t manage to pay full amount necessary to buy out your NFT. You’ve lost a chance to buy it
            and lost <span style={{ color: "#E9FF26" }}>{blockingInfo?.CollateralPercent}%</span> of
            collaterall for blocking Claim the outstanding amount
          </Box>
        )}
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
            onConfirm();
          }}
        >
          {isSuccess ? "CLAIM BLOCKED NFT" : "WITHDRAW YOUR FUNDS"}
        </PrimaryButton>
      </Box>
      {openTranactionModal && (
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash("");
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
          network={selectedChain?.value.replace(" blockchain", "") || ""}
        />
      )}
    </>
  );
};
