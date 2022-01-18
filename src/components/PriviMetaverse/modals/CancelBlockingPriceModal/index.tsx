import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { toNDecimals } from "shared/functions/web3";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "../TransactionProgressModal";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { MakeSetBlockingPriceModalStyles } from "./index.style";
import { useParams } from "react-router";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { cancelBlockingOffer } from "shared/services/API/ReserveAPI";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
const isProd = process.env.REACT_APP_ENV === "prod";

export default function CancelBlockingPriceModal({ open, handleClose, offer, nft, setNft }) {
  const classes = MakeSetBlockingPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

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

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token.Decimals;
  };

  const handleCancel = async () => {
    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", { variant: "error" });
        return;
      }
    }

    try {
      setOpenTransactionModal(true);
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.ReserveMarketplace.cancelSaleReserveProposal(
        web3,
        account!,
        {
          collection_id: nft.Address,
          token_id,
          paymentToken: offer.PaymentToken,
          price: toNDecimals(offer.Price, getTokenDecimal(offer.PaymentToken)),
          collateralToken: offer.PaymentToken,
          collateralPercent: toNDecimals(offer.CollateralPercent, 2),
          reservePeriod: Math.ceil(+offer.ReservePeriod * 3600 * 24),
          owner: account,
        },
        setHash
      );

      setTransactionSuccess(true);

      await cancelBlockingOffer({
        mode: isProd ? "main" : "test",
        offerId: offer.id,
        CollectionId: collection_id,
        TokenId: token_id,
      });
      let newNft = { ...nft };
      newNft.blockingSaleOffer = {};
      setNft(newNft);
      handleClose();
      if (!contractResponse.success) {
        setTransactionSuccess(false);
        showAlertMessage("Failed to decline an offer", { variant: "error" });
      }
    } catch (err) {
      showAlertMessage("Failed to decline blocking offer, Please try again", { variant: "error" });
    }
  };

  return (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.cancelModal}>
        <span className={classes.cancelTitle}>Are you sure about cancelling this blocking offer? </span>
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
