import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import CopyToClipboard from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { CancelOfferModalStyles } from "./index.style";
import { useParams } from "react-router";
import { toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "../TransactionProgressModal";
import { removeBlockingOffer, cancelRentOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import { switchNetwork, getChainForNFT } from "shared/functions/metamask";

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function CancelOfferModal({ open, handleClose, offer, type, nft, setNft }) {
  const classes = CancelOfferModalStyles();
  const [hash, setHash] = useState<string>("");

  const [selectedChain] = useState<any>(getChainForNFT(nft));
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
  }, [open]);

  const getTokenDecimal = addr => {
    if (tokens.length == 0) return 0;
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token.Decimals;
  };

  const handleConfirm = async () => {
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

      let contractResponse;
      if (type === "block") {
        contractResponse = await web3APIHandler.ReserveMarketplace.cancelPurchaseReserveProposal(
          web3,
          account!,
          {
            collection_id: nft.Address,
            token_id,
            paymentToken: offer.PaymentToken,
            price: toNDecimals(offer.Price, getTokenDecimal(offer.PaymentToken)),
            collateralToken: offer.CollateralToken,
            collateralPercent: toNDecimals(offer.CollateralPercent, 2),
            reservePeriod: Math.ceil(+offer.ReservePeriod * 3600 * 24),
            buyer: offer.Beneficiary,
          },
          setHash
        );
      } else if (type === "rent") {
        contractResponse = await web3APIHandler.RentalManager.cancelRentalOffer(
          web3,
          account!,
          {
            collectionId: nft.Address.toLowerCase(),
            tokenId: token_id,
            rentalTime: offer.rentalTime,
            pricePerSecond: offer.pricePerSecond,
            rentalExpiration: offer.rentalExpiration,
            fundingToken: offer.fundingToken.toLowerCase(),
            operator: nft.owner_of.toLowerCase(),
          },
          setHash
        );
      } else {
        setOpenTransactionModal(false);
        return;
      }
      if (!contractResponse.success) {
        showAlertMessage("Failed to cancel your own offer. Please try again", { variant: "error" });
        setTransactionSuccess(false);
        return;
      }

      if (type === "block") {
        await removeBlockingOffer({
          mode: isProd ? "main" : "test",
          offerId: offer.id,
          CollectionId: collection_id,
          TokenId: token_id,
        });
      } else if (type === "rent") {
        await cancelRentOffer({
          mode: isProd ? "main" : "test",
          offerId: offer.id,
          CollectionId: collection_id,
          TokenId: token_id,
        });
      }
      showAlertMessage("You canceld your own offer successuflly", { variant: "success" });
      handleClose();
      let newNft = { ...nft };
      if (type === "block") {
        newNft.blockingBuyOffers = newNft.blockingBuyOffers.filter(el => el.id !== offer.id);
      } else if (type === "rent") {
        newNft.rentBuyOffers = newNft.rentBuyOffers.filter(el => el.id !== offer.id);
      }
      setNft(newNft);
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
            <Box fontSize="24px" color="#ffffff" marginTop="20px" style={{ textTransform: "uppercase" }}>
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
