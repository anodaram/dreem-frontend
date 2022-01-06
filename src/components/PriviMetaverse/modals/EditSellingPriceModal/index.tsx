import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { EditSellingPriceModalStyles } from "./index.style";
import { BlockchainNets } from "shared/constants/constants";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "../TransactionProgressModal";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { useParams } from "react-router";
import { cancelSellingOffer, createSellOffer } from "shared/services/API/ReserveAPI";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const EditPriceModal = ({ open, handleClose, offer, nft, setNft }) => {
  const classes = EditSellingPriceModalStyles();
  const { account, library, chainId } = useWeb3React();

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [reservePriceToken, setReservePriceToken] = useState<any>(tokenList[0]);
  const [step, setStep] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [inputBalance, setInputBalance] = useState<string>("");
  const { showAlertMessage } = useAlertMessage();

  const { collection_id, token_id } = useParams();
  const isProd = process.env.REACT_APP_ENV === "prod";

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      return;
    }

    if (selectedChain && nft && selectedChain.value !== nft.chain) {
      setSelectedChain(filteredBlockchainNets.find(b => b.value === nft.chain));
    }
  }, [nft, selectedChain, open]);

  useEffect(() => {
    setStep(0);
  }, [open]);

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals || 0;
  };

  const handleCancel = async () => {
    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
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
        collection_id,
        token_id,
        paymentToken: offer.PaymentToken,
        price: toNDecimals(offer.Price, getTokenDecimal(offer.PaymentToken)),
        owner: account,
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(null);
      await cancelSellingOffer({
        mode: isProd ? "main" : "test",
        offerId: offer.id,
        CollectionId: collection_id,
        TokenId: token_id,
      });
      let newNft = { ...nft };
      newNft.sellingOffer = {};
      setNft(newNft);
      setStep(1);
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to edit price of offer", { variant: "error" });
    }
    setOpenTransactionModal(false);
  };

  const handleApprove = async () => {
    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
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
        nftAddress: collection_id,
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

  const handleConfirm = async () => {
    if (chainId !== BlockchainNets[1].chainId && chainId !== BlockchainNets[2].chainId) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }
    setOpenTransactionModal(true);
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);

    const response = await web3APIHandler.openSalesManager.approveSale(
      web3,
      account!,
      {
        collection_id,
        token_id,
        paymentToken: reservePriceToken?.Address,
        price: toNDecimals(inputBalance, reservePriceToken.Decimals),
        beneficiary: account,
        buyerToMatch: "0x0000000000000000000000000000000000000000",
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      const offerId = web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ["address", "uint256", "address", "uint256", "address"],
          [
            collection_id,
            token_id,
            reservePriceToken?.Address,
            toNDecimals(inputBalance, reservePriceToken.Decimals),
            account,
          ]
        )
      );

      await createSellOffer({
        mode: isProd ? "main" : "test",
        offerId,
        CollectionId: collection_id,
        TokenId: token_id,
        Price: inputBalance,
        PaymentToken: reservePriceToken?.Address,
        Beneficiary: account,
      });

      let newNft = { ...nft };
      newNft.sellingOffer = {
        id: offerId,
        Price: inputBalance,
        PaymentToken: reservePriceToken?.Address,
        Beneficiary: account,
        created: new Date().getTime(),
      };
      setNft(newNft);
      handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make a selling offer", { variant: "error" });
    }
  };

  return step == 0 ? (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.cancelModal}>
        <span className={classes.cancelTitle}>Are you sure you want to edit price? </span>
        <span className={classes.cancelDesc}>
          This process will require changes through smart contract that will take few moments.
        </span>
        <Box display="flex" alignItems="center" justifyContent="space-between" style={{ width: "80%" }}>
          <PrimaryButton size="medium" className={classes.cancelButton} onClick={handleClose}>
            Cancel
          </PrimaryButton>
          <PrimaryButton size="medium" className={classes.editPriceButton} onClick={handleCancel}>
            Yes, Edit Price
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
  ) : (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
        <Box style={{ padding: "25px" }}>
          <Box fontSize="24px" color="#431AB7">
            Set New Price
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={7}>
              <Box className={classes.nameField}>Selling Price</Box>
              <InputWithLabelAndTooltip
                inputValue={inputBalance}
                onInputValueChange={e => setInputBalance(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                disabled={isApproved}
              />
            </Grid>
            <Grid item xs={6} sm={5}>
              <Box className={classes.nameField}>Selling Token</Box>
              <ReserveTokenSelect
                tokens={tokenList}
                value={reservePriceToken?.Address || ""}
                className={classes.inputJOT}
                onChange={e => {
                  setReservePriceToken(tokenList.find(v => v.Address === e.target.value));
                }}
                style={{ flex: "1" }}
                disabled={true}
              />
            </Grid>
          </Grid>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              style={{ backgroundColor: isApproved ? "#431AB750" : "#431AB7" }}
              onClick={handleApprove}
            >
              Approve
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              style={{ backgroundColor: !isApproved ? "#431AB750" : "#431AB7" }}
              onClick={handleConfirm}
            >
              Confirm Set
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
};

export default EditPriceModal;
