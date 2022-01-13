import React, { useState, useEffect, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { InstantBuyModalStyles } from "./index.style";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork, checkChainID, getChainForNFT } from "shared/functions/metamask";
import { toNDecimals } from "shared/functions/web3";
import { useParams } from "react-router";
import TransactionProgressModal from "../TransactionProgressModal";
import { acceptBuyingOffer } from "shared/services/API/ReserveAPI";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
const isProd = process.env.REACT_APP_ENV === "prod";

export default function InstantBuyModal({ open, handleClose, onConfirm, offer, nft }) {
  const classes = InstantBuyModalStyles();
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const marketFee = useSelector((state: RootState) => state.marketPlace.fee);
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const offerPrice = useMemo(() => (offer?.Price || 0) * (1 + marketFee), [offer, marketFee]);
  const { account, library, chainId } = useWeb3React();
  const { collection_id, token_id } = useParams();
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
    }
  }, [open]);

  useEffect(() => {
    setSelectedChain(getChainForNFT(nft));
  }, [nft]);

  const getTokenName = addr => {
    if (tokens.length == 0 || !addr) return "";
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const getTokenDecimals = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    if (token) return token.Decimals;
    return 0;
  };

  const handleApprove = async () => {
    try {
      if (!checkChainID(chainId)) {
        showAlertMessage(`network error`, { variant: "error" });
        return;
      }
      setOpenTransactionModal(true);
      const web3Config = selectedChain.config;
      if (chainId && chainId !== selectedChain?.chainId) {
        const isHere = await switchNetwork(selectedChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", {
            variant: "error",
          });
          return;
        }
      }
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      let balance = await web3APIHandler.Erc20[getTokenName(offer.PaymentToken)].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[getTokenName(offer.PaymentToken)].decimals(web3, { account });
      if (balance / 10 ** decimals < offerPrice) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[getTokenName(offer.PaymentToken)].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        toNDecimals(offerPrice, getTokenDecimals(offer.PaymentToken))
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${offerPrice} ${getTokenName(offer.PaymentToken)}!`, {
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

  const handleConfirm = async () => {
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }
    setOpenTransactionModal(true);
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);

    const response = await web3APIHandler.openSalesManager.approvePurchase(
      web3,
      account!,
      {
        collection_id: nft.Address,
        token_id,
        paymentToken: offer.PaymentToken,
        price: toNDecimals(offer.Price, getTokenDecimals(offer.PaymentToken)),
        beneficiary: account,
        sellerToMatch: offer.Beneficiary,
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      const offerId = web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ["address", "uint256", "address", "uint256", "address"],
          [nft.Address, token_id, offer.PaymentToken, 0, account]
        )
      );

      await acceptBuyingOffer({
        mode: isProd ? "main" : "test",
        offerId,
        CollectionId: collection_id,
        TokenId: token_id,
        Price: offer.Price,
        PaymentToken: offer.PaymentToken,
        Beneficiary: account,
        from: offer.Beneficiary,
        to: account,
        hash: response.hash,
        fromOwner: true,
      });
      handleClose();
      onConfirm();
      //   handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to edit a selling offer", { variant: "error" });
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      className={classes.container}
      style={{
        maxWidth: 508,
      }}
    >
      <Box style={{ padding: "25px" }}>
        <Box fontSize="24px" className={classes.title}>
          Instant Buy
        </Box>
        <Box mt="12px" mb="15px" color="#ffffff">
          Accept and buy NFT at Owner price.
        </Box>
        <Box className={classes.borderBox}>
          <Box className={classes.box}>
            <span style={{ fontSize: "16px", color: "#ffffff" }}>Amount to pay</span>
            <span className={classes.purpleText} style={{ fontFamily: "Rany" }}>
              {`${offer?.Price} ${getTokenName(offer?.PaymentToken)}`}
            </span>
          </Box>
        </Box>
        <Box textAlign="end" fontSize={12} fontFamily="Rany" mt={1} color="white">
          incl. {marketFee}% marketplace fee
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
          <SecondaryButton
            size="medium"
            className={classes.primaryButton}
            onClick={handleApprove}
            disabled={isApproved}
          >
            {isApproved ? "Approved" : "Approve"}
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            className={classes.primaryButton}
            onClick={handleConfirm}
            disabled={!isApproved}
          >
            Confirm
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
