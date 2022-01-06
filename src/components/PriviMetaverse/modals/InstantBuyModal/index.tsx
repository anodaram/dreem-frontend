import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { InstantBuyModalStyles } from "./index.style";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { toNDecimals } from "shared/functions/web3";
import { useParams } from "react-router";
import TransactionProgressModal from "../TransactionProgressModal";
import { acceptBuyingOffer } from "shared/services/API/ReserveAPI";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function InstantBuyModal({ open, handleClose, onConfirm, offer, nft }) {
  const classes = InstantBuyModalStyles();
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
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
    setSelectedChain(filteredBlockchainNets.find(net => net.value === nft.chain))
  }, [nft])

  const getTokenName = addr => {
    if (tokens.length == 0 || !addr) return "";
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || '';
  };

  const getTokenDecimals = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    if (token) return token.Decimals;
    return 0;
  };

  const handleApprove = async () => {
    try {
      if (chainId !== BlockchainNets[1].chainId && chainId !== BlockchainNets[2].chainId) {
        showAlertMessage(`network error`, { variant: "error" });
        return;
      }
      setOpenTransactionModal(true);
      const web3Config = selectedChain.config;
      if (chainId && chainId !== selectedChain?.chainId) {
        const isHere = await switchNetwork(selectedChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target network", { variant: "error" });
          return;
        }
      }
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      let balance = await web3APIHandler.Erc20[getTokenName(offer.PaymentToken)].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[getTokenName(offer.PaymentToken)].decimals(web3, { account });
      if (balance / 10 ** decimals < (offer.Price || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[getTokenName(offer.PaymentToken)].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        toNDecimals(offer.Price, getTokenDecimals(offer.PaymentToken))
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${offer.Price} ${getTokenName(offer.PaymentToken)}!`, {
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
    if (chainId !== BlockchainNets[1].chainId && chainId !== BlockchainNets[2].chainId) {
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
        collection_id,
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
          [collection_id, token_id, offer.PaymentToken, 0, account]
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
        <Box fontSize="24px" color="#431AB7">
          Instant Buy
        </Box>
        <Box mt="12px" mb="15px">
          Accept and buy NFT at Owner price.
        </Box>
        <Box className={classes.box}>
          <span className={classes.purpleText}>Amount to pay</span>
          <span className={classes.purpleText} style={{ fontFamily: "Agrandir GrandHeavy" }}>
            {`${offer?.Price} ${getTokenName(offer?.PaymentToken)}`}
          </span>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
          <SecondaryButton
            size="medium"
            className={classes.primaryButton}
            style={{ backgroundColor: "#431AB7" }}
            onClick={handleApprove}
            disabled={isApproved}
          >
            {isApproved ? "Approved" : "Approve"}
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            className={classes.primaryButton}
            style={{ backgroundColor: "#431AB7" }}
            onClick={handleConfirm}
            disabled={!isApproved}
          >
            Confirm Offer
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
