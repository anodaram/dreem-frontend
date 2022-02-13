import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { modalStyles } from "./index.styles";
import { BlockchainNets } from "shared/constants/constants";
import { toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "../TransactionProgressModal";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useParams } from "react-router";
import { cancelSellingOffer } from "shared/services/API/ReserveAPI";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";

const isProd = process.env.REACT_APP_ENV === "prod";

const CancelSellingPriceModal = ({ open, handleClose, offer, nft, setNft }) => {
  const classes = modalStyles();
  const { account, library, chainId } = useWeb3React();
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  const { collection_id, token_id } = useParams();

  useEffect(() => {
    if (!open) return;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    setSelectedChain(getChainForNFT(nft));
  }, [open, nft]);

  const getTokenDecimal = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals;
  };

  const handleConfirm = async () => {
    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", {
          variant: "error",
        });
        return;
      }
    }

    setOpenTransactionModal(true);
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);

    const response = await web3APIHandler.openSalesManager.cancelSaleProposal(
      web3,
      account!,
      {
        collection_id: nft.Address,
        token_id,
        paymentToken: offer.PaymentToken,
        price: toNDecimals(offer.Price, getTokenDecimal(offer.PaymentToken)),
        owner: account,
      },
      setHash
    );

    setTransactionSuccess(true);
    await cancelSellingOffer({
      mode: isProd ? "main" : "test",
      offerId: offer.id,
      CollectionId: collection_id,
      TokenId: token_id,
    });
    let newNft = { ...nft };
    newNft.sellingOffer = {};
    setNft(newNft);
    handleClose();
    if (!response.success) {
      setTransactionSuccess(false);
      showAlertMessage("Failed to cancel selling of offer", { variant: "error" });
    }
  };

  return (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.cancelModal}>
        <span className={classes.cancelTitle}>Are you sure about cancelling this sale? </span>
        <span className={classes.cancelDesc}>
          This will require a few changes to the smart contract, this may take a few moments
        </span>
        <Box display="flex" alignItems="center" justifyContent="space-between" style={{ width: "80%" }}>
          <PrimaryButton size="medium" className={classes.cancelButton} onClick={handleClose}>
            Go Back
          </PrimaryButton>
          <PrimaryButton size="medium" className={classes.editPriceButton} onClick={handleConfirm}>
            Yes, Cancel It
          </PrimaryButton>
        </Box>
      </Modal>
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

export default CancelSellingPriceModal;
