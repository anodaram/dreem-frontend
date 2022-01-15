import React, { useState, useEffect } from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { ClaimPaymentModalStyles } from "./index.style";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { useParams } from "react-router";
import Web3 from "web3";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useWeb3React } from "@web3-react/core";
import TransactionProgressModal from "components/PriviMetaverse/modals/TransactionProgressModal";
import { successFinishBlocking } from "shared/services/API/ReserveAPI";
import { checkChainID } from "shared/functions/metamask";
const isProd = process.env.REACT_APP_ENV === "prod";

export default function ClaimPaymentModal({ open, nft, handleClose = () => { }, onConfirm }) {
  const classes = ClaimPaymentModalStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const { collection_id, token_id } = useParams();
  const { account, library, chainId } = useWeb3React();
  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [price, setPrice] = useState<number>(0);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (nft?.blockingSalesHistories?.length > 0) {
      setBlockingInfo(nft.blockingSalesHistories[nft.blockingSalesHistories.length - 1])
    }
  }, [nft])

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || '';
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
        mode: 0
      },
      setHash
    );

    if (response.success) {
      await successFinishBlocking({
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
        Id: blockingInfo.id,
        Beneficiary: blockingInfo.Beneficiary,
        offerer: account!,
        notificationMode: 0,
      });

      setTransactionSuccess(true);
      onConfirm();
      handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleCloseModal}
      showCloseIcon
      className={classes.container}
      style={{
        maxWidth: 508,
      }}
    >
      <Box style={{ padding: "25px" }}>
        <Box
          fontSize="24px"
          color="#ffffff"
          fontFamily="GRIFTER"
          fontWeight={700}
          style={{
            textTransform: "uppercase"
          }}
        >
          Claim Payment
        </Box>
        <Box className={classes.description}>
          Repay your collateral to be able to recover and withdraw your NFT
        </Box>
        <Box className={classes.infoPanel}>
          <span className={classes.infoLabel}>Payment</span>
          <span className={classes.infoValue}>{`${blockingInfo?.Price} ${getTokenSymbol(blockingInfo?.PaymentToken)}`}</span>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" mt={3}>
          <PrimaryButton size="medium" className={classes.primaryButton} onClick={handleConfirm}>
            CLAIM
          </PrimaryButton>
        </Box>
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
    </Modal>
  );
}
