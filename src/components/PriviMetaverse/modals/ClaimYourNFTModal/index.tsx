import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { useParams } from "react-router";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { ClaimYourNFTModalStyles } from "./index.style";
import Web3 from "web3";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "components/PriviMetaverse/modals/TransactionProgressModal";

// import ProcessingPaymentModal from "components/PriviMetaverse/modals/ProcessingPaymentModal";
import { closeBlockingHistory } from "shared/services/API/ReserveAPI";
import { checkChainID, getChainForNFT } from "shared/functions/metamask";
const isProd = process.env.REACT_APP_ENV === "prod";

export default function ClaimYourNFTModal({ open, claimType, handleClose = () => { }, onConfirm, nft }) {
  const classes = ClaimYourNFTModalStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const { collection_id, token_id } = useParams();
  const { account, library, chainId } = useWeb3React();
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (nft?.blockingSalesHistories?.length > 0) {
      setBlockingInfo(nft.blockingSalesHistories[nft.blockingSalesHistories.length - 1])
    }
    setSelectedChain(getChainForNFT(nft))
  }, [nft])

  useEffect(() => {
    if (!open) {
      setOpenTransactionModal(false);
    }
  }, [open]);

  const getTokenName = addr => {
    if (tokens.length == 0 || !addr) return "";
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || "USDT";
  };

  const handleConfirm = async () => {
    setOpenTransactionModal(true);
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);
    const activeReserveId = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ["address", "uint256", "address", "address"],
        [
          nft.Address,
          token_id,
          blockingInfo.from,
          blockingInfo.Beneficiary
        ]
      )
    );

    const response = await web3APIHandler.ReservesManager.liquidateReserve(
      web3,
      account!,
      {
        activeReserveId,
        mode: 1
      },
      setHash
    );

    if (response.success) {
      await closeBlockingHistory({
        ...blockingInfo,
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
        Id: activeReserveId,
        Beneficiary: blockingInfo.Beneficiary,
        offerer: account!,
        notificationMode: 2,
        hash: response.hash
      });

      setTransactionSuccess(true);
      onConfirm();
      handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box className={classes.card}>
        <img src={nft.image || nft.content_url} className={classes.cardImg} />
        {transactionSuccess && (
          <Box className={classes.checkMark}>
            <img src={require("assets/icons/check.svg")} alt="check" />
          </Box>
        )}
      </Box>
      <div className={classes.title}>Claim your Game NFT & Collateral</div>
      <div className={classes.description}>
        {transactionSuccess
          ? `Congrats, you’ve successfully ${claimType}ed your NFT ${nft.name} and Collateral. here is summary`
          : ''}
      </div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="rgba(218, 230, 229, 0.06)"
        padding="32px"
        border="1px solid rgba(218, 218, 219, 0.59)"
        color="#ffffff"
        width="100%"
      >
        <Box>
          Collateral to claim
        </Box>
        <Box>
          {(Number(blockingInfo?.Price) * Number(blockingInfo?.TotalCollateralPercent) / 100).toFixed(2)} {getTokenName(blockingInfo?.PaymentToken)}
        </Box>
      </Box>
      <PrimaryButton size="medium" onClick={handleConfirm} className={classes.confirmButton}>
        Confirm
      </PrimaryButton>
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
    </Modal>
  );
}
function setOpenTransactionModal(arg0: boolean) {
  throw new Error("Function not implemented.");
}

