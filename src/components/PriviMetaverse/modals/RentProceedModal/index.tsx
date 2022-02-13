import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { Modal } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { toDecimals } from "shared/functions/web3";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import TransactionProgressModal from "../TransactionProgressModal";
import { RentProceedModalStyles } from "./index.style";

import { acceptRentOffer } from "shared/services/API/ReserveAPI";
import { getChainForNFT, switchNetwork, checkChainID } from "shared/functions/metamask";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";

const isProd = process.env.REACT_APP_ENV === "prod";
const SECONDS_PER_HOUR = 3600;

export default function RentProceedModal({ open, offer, handleClose = () => {}, nft, setNft }) {
  const classes = RentProceedModalStyles();
  const [selectedChain, setSelectedChain] = React.useState<any>(getChainForNFT(nft));
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { collection_id, token_id } = useParams();

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
    }
  }, [open]);

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

  const handleApprove = async () => {
    try {
      if (isApproved) {
        return;
      }

      if (chainId && chainId !== selectedChain?.chainId) {
        const isHere = await switchNetwork(selectedChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", { variant: "error" });
          return;
        }
      }

      setOpenTransactionModal(true);
      const web3Config = selectedChain.config;
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      let approved = await web3APIHandler.Erc721.approve(web3, account || "", {
        to: web3Config.CONTRACT_ADDRESSES.RENTAL_MANAGER,
        tokenId: token_id,
        nftAddress: nft.Address,
      });
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved your nft!`, {
        variant: "success",
      });
      setTransactionSuccess(null);
      setOpenTransactionModal(false);
    } catch (error) {
      console.log(error);
      showAlertMessage("Something went wrong. Please try again!", {
        variant: "error",
      });
    } finally {
    }
  };

  const handleAccept = async () => {
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }

    try {
      setOpenTransactionModal(true);
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.RentalManager.acceptRentalOffer(
        web3,
        account!,
        {
          collectionId: nft.Address,
          tokenId: token_id,
          rentalTime: offer.rentalTime,
          pricePerSecond: offer.pricePerSecond,
          rentalExpiration: offer.rentalExpiration,
          fundingToken: offer.fundingToken,
          offerer: offer.offerer,
          operator: offer.operator,
        },
        setHash
      );

      if (contractResponse.success) {
        const newOffer = contractResponse.offer;
        setTransactionSuccess(true);
        await acceptRentOffer({
          mode: isProd ? "main" : "test",
          rentalOfferId: offer.id,
          collection: collection_id,
          tokenId: newOffer.tokenId,
          rentalTime: newOffer.rentalTime,
          pricePerSecond: newOffer.pricePerSecond,
          rentalExpiration: newOffer.rentalExpiration,
          fundingToken: newOffer.fundingToken,
          operator: newOffer.operator,
          syntheticID: newOffer.syntheticID,
          offerer: offer.offerer,
          hash: newOffer.hash,
        });
        let newNft = { ...nft };
        newNft.status = "Rented";
        newNft.rentBuyOffers = newNft.rentBuyOffers.filter(el => el.id !== offer.id);
        newNft.rentHistories.unshift({
          id: offer.id,
          rentalTime: newOffer.rentalTime,
          pricePerSecond: newOffer.pricePerSecond,
          rentalExpiration: newOffer.rentalExpiration,
          fundingToken: newOffer.fundingToken,
          operator: newOffer.operator,
          syntheticID: newOffer.syntheticID,
          hash: newOffer.hash,
          created: new Date().getTime(),
        });
        setNft(newNft);
        handleClose();
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to make an offer", { variant: "error" });
      }
    } catch (err) {
      console.log("err", err);
      showAlertMessage("Failed to accept rent offer, Please try again", { variant: "error" });
    }
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const handleClickLink = _hash => {
    if (selectedChain.name === "POLYGON") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${_hash}`, "_blank");
    } else if (selectedChain.name === "ETHEREUM") {
      window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${_hash}`, "_blank");
    }
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token?.Symbol || "";
  };

  return (
    <>
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
          <Box className={classes.title}>Accept Rent Offer</Box>
          <Box className={classes.description}>
            {`Accept the offer from user "${offer?.offerer ?? ""} " to rent the "${nft.name}"`}
          </Box>
          <Box className={classes.borderBox}>
            <Box className={classes.box}>
              <Box className={classes.infoRow}>
                <span className={classes.infoLabel}>Price Per Hour</span>
                <span className={classes.infoValue}>
                  {`${toDecimals(offer.pricePerSecond*SECONDS_PER_HOUR, getTokenDecimal(offer.fundingToken))} ${getTokenSymbol(
                    offer.fundingToken
                  )}`}
                </span>
              </Box>
              <Box className={classes.infoRow} mt={1}>
                <span className={classes.infoLabel}>Rental Time</span>
                <span className={classes.infoValue}>{`${(offer.rentalTime / SECONDS_PER_HOUR).toFixed(
                  2
                )} Hours`}</span>
              </Box>
              <Box className={classes.infoRow} mt={1}>
                <span className={classes.infoLabel}>Total Cost</span>
                <span className={classes.infoValue}>
                  {`${toDecimals(
                    offer.pricePerSecond * offer.rentalTime,
                    getTokenDecimal(offer.fundingToken)
                  )} ${getTokenSymbol(offer.fundingToken)}`}
                </span>
              </Box>
              {/* <Box className={classes.infoRow} mt={1}>
                <span className={classes.infoLabel}>Etherscan link</span>
                <span
                  className={classes.infoValue}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClickLink(offer.hash)}
                >
                  {offer.hash.substr(0, 18) + "..." + offer.hash.substr(offer.hash.length - 3, 3)}
                </span>
              </Box> */}
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleApprove}
              disabled={isApproved}
            >
              {isApproved ? "Approved" : "Approve"}
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleAccept}
              disabled={!isApproved}
            >
              Accept Offer
            </PrimaryButton>
          </Box>
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
