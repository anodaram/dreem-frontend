import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { Modal } from "shared/ui-kit";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { toNDecimals } from "shared/functions/web3";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { acceptBuyingOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import TransactionProgressModal from "../TransactionProgressModal";
import { BuyProceedModalStyles } from "./index.style";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function BuyProceedModal({ open, offer, handleClose, nft, setNft }) {
  const classes = BuyProceedModalStyles();
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [selectedChain] = React.useState<any>(getChainForNFT(nft));

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { collection_id, token_id } = useParams();

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      return;
    }
  }, [open]);

  const getTokenDecimal = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token.Decimals;
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || "USDT";
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const handleApprove = async () => {
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
      const web3Config = selectedChain.config;
      const web3 = new Web3(library.provider);
      let approved = await web3APIHandler.Erc721.approve(web3, account || "", {
        to: web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
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

      const contractResponse = await web3APIHandler.openSalesManager.approveSale(
        web3,
        account!,
        {
          collection_id: nft.Address,
          token_id,
          paymentToken: offer.PaymentToken,
          price: toNDecimals(offer.Price, getTokenDecimal(offer.PaymentToken)),
          beneficiary: account,
          buyerToMatch: offer.Beneficiary,
        },
        setHash
      );

      if (contractResponse.success) {
        setTransactionSuccess(true);
        const offerId = web3.utils.keccak256(
          web3.eth.abi.encodeParameters(
            ["address", "uint256", "address", "uint256", "address"],
            [nft.Address, token_id, offer.PaymentToken, 0, offer.Beneficiary]
          )
        );

        await acceptBuyingOffer({
          mode: isProd ? "main" : "test",
          offerId: offerId,
          CollectionId: collection_id,
          TokenId: token_id,
          PaymentToken: offer.PaymentToken,
          Price: offer.Price,
          Beneficiary: offer.Beneficiary,
          from: account,
          to: offer.Beneficiary,
          hash: contractResponse.hash,
          fromOwner: false,
        });
        let newNft = { ...nft };
        newNft.status = null;
        newNft.owner_of = offer.Beneficiary.toLowerCase();
        newNft.buyingOffers = newNft.buyingOffers.filter(el => el.Beneficiary !== offer.Beneficiary);
        newNft.salesHistories.unshift({
          id: offerId,
          PaymentToken: offer.PaymentToken,
          Price: offer.Price,
          Beneficiary: offer.Beneficiary,
          from: account,
          hash: contractResponse.hash,
          created: new Date().getTime(),
        });
        setNft(newNft);
        handleClose();
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to make an offer", { variant: "error" });
      }
    } catch (err) {
      showAlertMessage("Failed to accept blocking offer, Please try again", { variant: "error" });
    }
  };

  const handleClickLink = _hash => {
    if (selectedChain.name === "POLYGON") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${_hash}`, "_blank");
    } else if (selectedChain.name === "ETHEREUM") {
      window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${_hash}`, "_blank");
    }
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
          <Box className={classes.title}>Accept Buy Offer</Box>
          <Box className={classes.description}>
            {`Accept the offer from user "${offer.Beneficiary}" to block the "${nft.name}"`}
          </Box>
          <Box className={classes.borderBox}>
            <Box className={classes.box}>
              <span className={classes.infoLabel}>Price</span>
              <span className={classes.infoValue}>{`${offer.Price} ${getTokenSymbol(
                offer.PaymentToken
              )}`}</span>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              style={{ backgroundColor: "#431AB7" }}
              onClick={handleApprove}
              disabled={isApproved}
            >
              {isApproved ? "Approved" : "Approve"}
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              style={{ backgroundColor: "#431AB7" }}
              onClick={handleAccept}
              disabled={!isApproved}
            >
              Confirm
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
