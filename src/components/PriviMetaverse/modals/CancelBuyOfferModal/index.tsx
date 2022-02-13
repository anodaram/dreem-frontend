import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { CancelOfferModalStyles } from "./index.style";
import { useParams } from "react-router";
import { toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "../TransactionProgressModal";
import { removeBlockingOffer, removeBuyOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import { checkChainID, getChainForNFT } from "shared/functions/metamask";

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function CancelBuyOfferModal({ open, handleClose, offer, nft, setNft }) {
  const classes = CancelOfferModalStyles();
  const [hash, setHash] = useState<string>("");
  const [selectedChain, setSelectedChain] = React.useState<any>(getChainForNFT(nft));

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const { collection_id, token_id } = useParams();
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedChain(getChainForNFT(nft));
  }, [nft]);

  const getTokenDecimal = addr => {
    if (tokens.length == 0) return 0;
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token.Decimals;
  };

  const handleConfirm = async () => {
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }

    try {
      setOpenTransactionModal(true);
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.openSalesManager.cancelPurchaseProposal(
        web3,
        account!,
        {
          collection_id: nft.Address,
          token_id,
          paymentToken: offer.PaymentToken,
          price: toNDecimals(offer.Price, getTokenDecimal(offer.PaymentToken)),
          beneficiary: offer.Beneficiary,
        },
        setHash
      );

      if (!contractResponse.success) {
        showAlertMessage("Failed to cancel your own offer. Please try again", { variant: "error" });
        setTransactionSuccess(false);
        return;
      }

      await removeBuyOffer({
        mode: isProd ? "main" : "test",
        offerId: offer.id,
        CollectionId: collection_id,
        TokenId: token_id,
      });

      showAlertMessage("You canceld your own offer successuflly", { variant: "success" });
      let newNft = { ...nft };
      newNft.buyingOffers = newNft.buyingOffers.filter(el => el.id !== offer.id);
      setNft(newNft);
      handleClose();
      setTransactionSuccess(true);
    } catch (err) {
      showAlertMessage("Failed to cancel your own offer. Please try again", { variant: "error" });
    }
  };

  return (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
        <>
          <Box display="flex" alignItems="center" flexDirection="column">
            <img src={require("assets/icons/cancel_icon.png")} width="110px" /> <br />
            <Box
              fontSize="24px"
              fontWeight={700}
              color="#ffffff"
              marginTop="20px"
              style={{ textTransform: "uppercase" }}
            >
              Cancel Offer
            </Box>
            <Box className={classes.nameField}>
              Canceling will remove your offer and your  <br /> details from the list
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" mt={6}>
              <PrimaryButton
                size="medium"
                className={classes.primaryButton}
                style={{ backgroundColor: "#431AB7" }}
                onClick={handleConfirm}
              >
                Cancel Offer
              </PrimaryButton>
            </Box>
          </Box>
        </>
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
