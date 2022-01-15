import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { Grid } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { getChainForNFT, switchNetwork, checkChainID } from "shared/functions/metamask";
import { toNDecimals } from "shared/functions/web3";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { cancelSellingOffer, createSellOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import TransactionProgressModal from "../TransactionProgressModal";
import { EditSellingPriceModalStyles } from "./index.style";

const EditPriceModal = ({ open, handleClose, offer, nft, setNft }) => {
  const classes = EditSellingPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const { collection_id, token_id } = useParams<{ collection_id: string; token_id: string }>();

  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [reservePriceToken, setReservePriceToken] = useState<any>(tokenList[0]);
  const [step, setStep] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [inputBalance, setInputBalance] = useState<number>();
  const [orgNft, setOrgNft] = useState<any>({});
  const { showAlertMessage } = useAlertMessage();

  const isProd = process.env.REACT_APP_ENV === "prod";

  useEffect(() => nft && setSelectedChain(getChainForNFT(nft)), [nft]);
  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      return;
    }
  }, [open]);

  useEffect(() => {
    setStep(0);
  }, [open]);

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals || 0;
  };

  const getTokenName = addr => {
    if (tokenList.length == 0 || !addr) return "";
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const handleCancel = async () => {
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

    setTransactionSuccess(null);
    await cancelSellingOffer({
      mode: isProd ? "main" : "test",
      offerId: offer.id,
      CollectionId: collection_id,
      TokenId: token_id,
    });
    let newNft = { ...nft };
    let _orgNft = { ...nft };
    newNft.sellingOffer = {};
    setNft(newNft);
    setOrgNft(_orgNft);
    setStep(1);
    if (!response.success) {
      setTransactionSuccess(false);
      showAlertMessage("Failed to edit price of offer", { variant: "error" });
    }
    setOpenTransactionModal(false);
  };

  const handleApprove = async () => {
    if (!inputBalance) {
      showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", { variant: "error" });
      return;
    }

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
        nftAddress: orgNft.Address,
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
    if (!inputBalance) {
      showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", { variant: "error" });
      return;
    }

    if (!checkChainID(chainId)) {
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
        collection_id: orgNft.Address,
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
            orgNft.Address,
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
        <span className={classes.cancelTitle}>Are you sure about editing price? </span>
        <span className={classes.cancelDesc}>
            This will require a few changes to the smart contract, this may take a few moments
        </span>
        <Box display="flex" alignItems="center" justifyContent="space-between" style={{ width: "80%" }}>
          <PrimaryButton size="medium" className={classes.cancelButton} onClick={handleClose}>
            Go Back
          </PrimaryButton>
          <PrimaryButton size="medium" className={classes.editPriceButton} onClick={handleCancel}>
            Yes, Edit It
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
          <Box fontSize="24px" color="#ffffff" style={{ textTransform: "uppercase" }}>
            Set New Price
          </Box>
          <Box className={classes.borderBox}>
            <Box className={classes.box}>
              <span className={classes.currentPrice}>Current price</span>
              <span className={classes.purpleText}>
                {`${orgNft?.sellingOffer?.Price} ${getTokenName(orgNft?.sellingOffer?.PaymentToken)}`}
              </span>
            </Box>
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
                placeHolder={"0.001"}
              />
            </Grid>
            <Grid item xs={6} sm={5}>
              <Box className={classes.nameField}>Selling Token</Box>
              <ReserveTokenSelect
                tokens={tokenList.filter(
                  token => token?.Network?.toLowerCase() === selectedChain?.name?.toLowerCase()
                )}
                value={reservePriceToken?.Address || ""}
                className={classes.tokenSelect}
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
              disabled={isApproved}
              onClick={handleApprove}
            >
              Approve
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              disabled={!isApproved}
              onClick={handleConfirm}
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
};

export default EditPriceModal;
