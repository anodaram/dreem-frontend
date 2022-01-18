import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Box from "shared/ui-kit/Box";
import { useWeb3React } from "@web3-react/core";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "../TransactionProgressModal";
import { Modal } from "shared/ui-kit";
import { PrimaryButton } from "shared/ui-kit";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { CancelRentPriceModalStyles } from "./index.style";
import { BlockchainNets } from "shared/constants/constants";
import { useParams } from "react-router";
import { cancelListOffer } from "shared/services/API/ReserveAPI";
const isProd = process.env.REACT_APP_ENV === "prod";

export default function CancelRentPriceModal({ open, handleClose, offer, nft, setNft }) {
  const classes = CancelRentPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const [selectedChain] = useState<any>(getChainForNFT(nft));

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  const { collection_id, token_id } = useParams();

  useEffect(() => {
    if (!open) {
      return;
    }
  }, [open]);

  const handleCancel = async () => {
    try {
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
      const contractResponse = await web3APIHandler.RentalManager.cancelListOffer(
        web3,
        account!,
        {
          collectionId: nft.Address,
          tokenId: token_id,
          maximumRentalTime: offer.maximumRentTime,
          pricePerSecond: offer.pricePerSecond,
          rentalExpiration: offer.rentalExpiration,
          fundingToken: offer.fundingToken,
        },
        setHash
      );

      setTransactionSuccess(true);

      await cancelListOffer({
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
      });

      handleClose();
      let newNft = { ...nft };
      newNft.rentSaleOffer = null;
      setNft(newNft);
      if (!contractResponse.success) {
        setTransactionSuccess(false);
        showAlertMessage("Failed to decline an offer", { variant: "error" });
      }
    } catch (err) {
      showAlertMessage("Failed to decline cancel offer, Please try again", { variant: "error" });
    }
  };

  return (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.cancelModal}>
        <span className={classes.cancelTitle}>Are you sure about cancelling this rental offer?</span>
        <span className={classes.cancelDesc}>
           This will require a few changes to the smart contract, this may take a few moments
        </span>
        <Box display="flex" alignItems="center" justifyContent="space-between" style={{ width: "80%" }}>
          <PrimaryButton size="medium" className={classes.cancelButton} onClick={handleClose}>
            Go Back
          </PrimaryButton>
          <PrimaryButton size="medium" className={classes.editPriceButton} onClick={handleCancel}>
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
}
