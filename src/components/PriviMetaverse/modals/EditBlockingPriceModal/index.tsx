import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router";

import { Grid } from "@material-ui/core";

import { toNDecimals } from "shared/functions/web3";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { cancelBlockingOffer, setBlockingOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import TransactionProgressModal from "../TransactionProgressModal";
import { MakeEditBlockingPriceModalStyles } from "./index.style";
import { getInputValue } from "shared/helpers";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function EditBlockingPriceModal({ open, handleClose, offer, nft, setNft }) {
  const classes = MakeEditBlockingPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const [price, setPrice] = useState<number>();
  const [period, setPeriod] = useState<number>();
  const [collateralPercent, setCollateralPercent] = useState<number>();
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [reservePriceToken, setReservePriceToken] = useState<any>(tokenList[0]);
  const [step, setStep] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  const { collection_id, token_id } = useParams<{ collection_id: string; token_id: string }>();

  useEffect(() => {
    setReservePriceToken(tokenList[0]);
  }, [tokenList]);

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
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
        showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", {
          variant: "error",
        });
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

      setTransactionSuccess(null);

      await cancelBlockingOffer({
        mode: isProd ? "main" : "test",
        offerId: offer.id,
        CollectionId: collection_id,
        TokenId: token_id,
      });
      let newNft = { ...nft };
      newNft.blockingSaleOffer = {};
      setNft(newNft);
      setStep(1);
      if (!contractResponse.success) {
        setTransactionSuccess(false);
        showAlertMessage("Failed to decline an offer", { variant: "error" });
      }
      setOpenTransactionModal(false);
    } catch (err) {
      showAlertMessage("Failed to decline blocking offer, Please try again", { variant: "error" });
    }
  };

  const handleApprove = async () => {
    if (!price || !period || !collateralPercent) {
      showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", {
        variant: "error",
      });
      return;
    }

    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", {
          variant: "error",
        });
        return;
      }
    }

    try {
      setOpenTransactionModal(true);

      const web3APIHandler = selectedChain.apiHandler;
      const web3Config = selectedChain.config;
      const web3 = new Web3(library.provider);
      let approved = await web3APIHandler.Erc721.approve(web3, account || "", {
        to: web3Config.CONTRACT_ADDRESSES.RESERVE_MARKETPLACE,
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

  const handleConfirm = async () => {
    if (!price || !period || !collateralPercent) {
      showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", {
        variant: "error",
      });
      return;
    }

    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", {
          variant: "error",
        });
        return;
      }
    }

    try {
      setOpenTransactionModal(true);
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.ReserveMarketplace.approveReserveToSell(
        web3,
        account!,
        {
          collection_id: nft.Address,
          token_id,
          paymentToken: reservePriceToken?.Address,
          collateralToken: reservePriceToken?.Address,
          price: toNDecimals(price, reservePriceToken.Decimals),
          beneficiary: account,
          collateralPercent: toNDecimals(collateralPercent, 2),
          reservePeriod: Number(period) * 3600 * 24,
          validityPeriod: 365 * 3600 * 24,
          buyerToMatch: "0x0000000000000000000000000000000000000000",
          mode: 1,
        },
        setHash
      );

      if (contractResponse.success) {
        const offerId = web3.utils.keccak256(
          web3.eth.abi.encodeParameters(
            ["address", "uint256", "address", "uint256", "address", "uint80", "uint64"],
            [
              nft.Address,
              token_id,
              reservePriceToken?.Address,
              toNDecimals(price, reservePriceToken.Decimals),
              account,
              toNDecimals(collateralPercent, 2),
              Number(period) * 3600 * 24,
            ]
          )
        );

        await setBlockingOffer({
          mode: isProd ? "main" : "test",
          offerId: offerId,
          CollectionId: collection_id,
          TokenId: token_id,
          PaymentToken: reservePriceToken?.Address,
          Price: price,
          Beneficiary: account,
          CollateralPercent: collateralPercent,
          ReservePeriod: period,
          AcceptDuration: 365 * 3600 * 24,
          hash,
        });
        let newNft = { ...nft };
        newNft.blockingSaleOffer = {
          id: offerId,
          PaymentToken: reservePriceToken?.Address,
          Price: price,
          Beneficiary: account,
          CollateralPercent: collateralPercent,
          ReservePeriod: period,
          hash,
          created: new Date().getTime(),
        };

        setTransactionSuccess(true);
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

  return (
    <>
      {step == 0 ? (
        <Modal
          size="medium"
          isOpen={open}
          onClose={handleClose}
          showCloseIcon
          className={classes.cancelModal}
        >
          <span className={classes.cancelTitle}>Are you sure about editing this blocking price? </span>
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
      ) : (
        <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
          <Box style={{ padding: "25px" }}>
            <Box className={classes.title}>Edit Blocking Price</Box>
            <Grid container spacing={2}>
              <Grid item sm={7}>
                <Box className={classes.nameField}>Blocking Price</Box>
              </Grid>
              <Grid item sm={5}>
                <Box className={classes.nameField}>Token</Box>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={7}>
                <InputWithLabelAndTooltip
                  inputValue={price}
                  onInputValueChange={e => setPrice(getInputValue(e.target.value, 0))}
                  overriedClasses={classes.inputJOT}
                  required
                  type="number"
                  theme="light"
                  minValue={0}
                  disabled={isApproved}
                  placeHolder={"0.001"}
                />
              </Grid>
              <Grid item sm={5}>
                <ReserveTokenSelect
                  tokens={tokenList.filter(
                    token => token?.Network?.toLowerCase() === selectedChain?.name?.toLowerCase()
                  )}
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
            <Box className={classes.nameField}>
              <span>Blocking Period</span>
              <InfoTooltip tooltip={""} />
            </Box>
            <InputWithLabelAndTooltip
              inputValue={period}
              onInputValueChange={e => setPeriod(getInputValue(e.target.value, 0))}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.suffixText}>DAYS</div>}
              disabled={isApproved}
              placeHolder={"00"}
            />
            <Box className={classes.nameField}>Collateral % Required</Box>
            <InputWithLabelAndTooltip
              inputValue={collateralPercent}
              onInputValueChange={e => setCollateralPercent(getInputValue(e.target.value, 0))}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              disabled={isApproved}
              placeHolder={"0"}
              endAdornment={<div className={classes.suffixText}>%</div>}
            />
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
              <PrimaryButton
                size="medium"
                className={classes.primaryButton}
                onClick={handleApprove}
                disabled={isApproved}
              >
                Approve
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                className={classes.primaryButton}
                onClick={handleConfirm}
                disabled={!isApproved || !price || !period || !collateralPercent}
              >
                Confirm
              </PrimaryButton>
            </Box>
          </Box>
        </Modal>
      )}
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
