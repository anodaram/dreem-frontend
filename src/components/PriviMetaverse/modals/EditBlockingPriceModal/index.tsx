import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "../TransactionProgressModal";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { MakeEditBlockingPriceModalStyles } from "./index.style";
import { Grid } from "@material-ui/core";
import { BlockchainNets } from "shared/constants/constants";
import { useParams } from "react-router";
import { cancelBlockingOffer, setBlockingOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
const isProd = process.env.REACT_APP_ENV === "prod";

export default function EditBlockingPriceModal({ open, handleClose, offer, nft, setNft }) {
  const classes = MakeEditBlockingPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const [price, setPrice] = React.useState<number | string>("");
  const [period, setPeriod] = React.useState<number | string>("");
  const [collateralPercent, setCollateralPercent] = useState<number | string>("");
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [reservePriceToken, setReservePriceToken] = useState<any>(tokenList[0]);
  const [step, setStep] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  const { collection_id, token_id } = useParams();

  useEffect(() => {
    setReservePriceToken(tokenList[0])
  }, [tokenList])
  
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
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
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
          collection_id,
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

      if (contractResponse.success) {
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
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to decline an offer", { variant: "error" });
      }
      setOpenTransactionModal(false);
    } catch (err) {
      showAlertMessage("Failed to decline blocking offer, Please try again", { variant: "error" });
    }
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
        to: web3Config.CONTRACT_ADDRESSES.RESERVE_MARKETPLACE,
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
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.ReserveMarketplace.approveReserveToSell(
        web3,
        account!,
        {
          collection_id,
          token_id,
          paymentToken: reservePriceToken?.Address,
          collateralToken: reservePriceToken?.Address,
          price: toNDecimals(price, reservePriceToken.Decimals),
          beneficiary: account,
          collateralPercent: toNDecimals(collateralPercent, 2),
          reservePeriod: Number(period) * 3600 * 24,
          validityPeriod: 3 * 3600 * 24,
          buyerToMatch: "0x0000000000000000000000000000000000000000",
        },
        setHash
      );

      if (contractResponse.success) {
        setTransactionSuccess(true);
        const offerId = web3.utils.keccak256(
          web3.eth.abi.encodeParameters(
            ["address", "uint256", "address", "uint256", "address", "uint80", "uint64"],
            [
              collection_id,
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
          AcceptDuration: 1000,
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
          <span className={classes.cancelTitle}>Are you sure you want to edit blocking price? </span>
          <span className={classes.cancelDesc}>
            This process will require changes through smart contract that will take few moments.
          </span>
          <Box display="flex" alignItems="center" justifyContent="space-between" style={{ width: "80%" }}>
            <PrimaryButton size="medium" className={classes.cancelButton} onClick={handleClose}>
              Cancel
            </PrimaryButton>
            <PrimaryButton size="medium" className={classes.editPriceButton} onClick={handleCancel}>
              Yes, Edit Blocking
            </PrimaryButton>
          </Box>
        </Modal>
      ) : (
        <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
          <Box style={{ padding: "25px" }}>
            <Box fontSize="24px" color="#431AB7">
              Edit Blocking Price
            </Box>
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
                  onInputValueChange={e => setPrice(+e.target.value)}
                  overriedClasses={classes.inputJOT}
                  required
                  type="number"
                  theme="light"
                  minValue={0}
                  disabled={isApproved}
                />
              </Grid>
              <Grid item sm={5}>
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
            <Box className={classes.nameField}>Blocking Period</Box>
            <InputWithLabelAndTooltip
              inputValue={period}
              onInputValueChange={e => setPeriod(+e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.purpleText}>DAYS</div>}
              disabled={isApproved}
            />
            <Box className={classes.nameField}>Collateral Required (%)</Box>
            <InputWithLabelAndTooltip
              inputValue={collateralPercent}
              onInputValueChange={e => setCollateralPercent(+e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              disabled={isApproved}
            />
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
              <PrimaryButton
                size="medium"
                className={classes.primaryButton}
                style={{ backgroundColor: isApproved ? "#431AB750" : "#431AB7" }}
                onClick={handleApprove}
                disabled={isApproved}
              >
                Approve
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                className={classes.primaryButton}
                style={{ backgroundColor: !isApproved ? "#431AB750" : "#431AB7" }}
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
