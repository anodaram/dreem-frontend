import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { Grid } from "@material-ui/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { getChainForNFT, switchNetwork, checkChainID } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { createBlockingOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import TransactionProgressModal from "../TransactionProgressModal";
import { MakeNewOfferModalStyles } from "./index.style";

export default function MakeNewOfferModal({ open, handleClose, nft, setNft }) {
  const classes = MakeNewOfferModalStyles();
  const { collection_id, token_id } = useParams<{ collection_id: string; token_id: string }>();
  const { account, library, chainId } = useWeb3React();

  const [price, setPrice] = useState<number>();
  const [disappearDays, setDisappearDays] = useState<number>();
  const [collateral, setCollateral] = useState<number>();
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [reservePriceToken, setReservePriceToken] = useState<any>(tokenList[0]);
  const [colaterralPriceToken, setColaterralPriceToken] = useState<any>(tokenList[0]);
  const [collateralPercent, setCollateralPercent] = useState<number>();
  const [blockingPeriod, setBlockingPeriod] = useState<number>();
  const [totalBalance, setTotalBalance] = React.useState<string>("0");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [confirmSuccess, setConfirmSuccess] = useState<boolean>(false);

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  const isProd = process.env.REACT_APP_ENV === "prod";

  useEffect(() => {
    setReservePriceToken(tokenList[0]);
    setColaterralPriceToken(tokenList[0]);
  }, [tokenList]);

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    setBalance();
  }, [open, reservePriceToken, selectedChain]);

  const setBalance = async () => {
    if (reservePriceToken) {
      if (!checkChainID(chainId)) {
        showAlertMessage(`network error`, { variant: "error" });
        return;
      }

      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20[reservePriceToken?.Symbol || "USDT"]?.decimals(
        web3,
        reservePriceToken?.Address
      );
      const balance = await web3APIHandler.Erc20[reservePriceToken?.Symbol || "USDT"]?.balanceOf(web3, {
        account,
      });
      setTotalBalance(toDecimals(balance, decimals));
    }
  };

  const handleApprove = async () => {
    try {
      if (!price || !blockingPeriod || !collateral || !collateralPercent || !disappearDays) {
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
      setOpenTransactionModal(true);
      const web3Config = selectedChain.config;
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      let balance = await web3APIHandler.Erc20[reservePriceToken.Symbol].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[reservePriceToken.Symbol].decimals(web3, { account });
      balance = balance / Math.pow(10, decimals);
      if (balance < (price || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[reservePriceToken.Symbol].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.RESERVE_MARKETPLACE,
        toNDecimals(price * (1 + fee), reservePriceToken.Decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${price} ${reservePriceToken.Symbol}!`, {
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
    if (!price || !blockingPeriod || !collateral || !collateralPercent || !disappearDays) {
      showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", { variant: "error" });
      return;
    }

    setOpenTransactionModal(true);
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }
    const web3Config = selectedChain.config;
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);

    const response = await web3APIHandler.ReserveMarketplace.approveReserveToBuy(
      web3,
      account!,
      {
        collection_id: nft.Address,
        token_id,
        paymentToken: reservePriceToken?.Address,
        collateralToken: colaterralPriceToken?.Address,
        price: toNDecimals(price * (1 + fee), reservePriceToken.Decimals),
        beneficiary: account,
        collateralPercent: toNDecimals(collateralPercent, 2),
        collateralInitialAmount: toNDecimals(collateral, colaterralPriceToken.Decimals),
        reservePeriod: Number(blockingPeriod) * 3600 * 24,
        validityPeriod: Number(disappearDays || 0) * 3600 * 24,
        sellerToMatch: "0x0000000000000000000000000000000000000000",
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      const offerId = web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ["address", "uint256", "address", "address", "uint80", "uint256", "uint256", "address"],
          [
            nft.Address,
            token_id,
            reservePriceToken?.Address,
            colaterralPriceToken?.Address,
            toNDecimals(collateralPercent, 2),
            toNDecimals(price, reservePriceToken.Decimals),
            toNDecimals(collateral, colaterralPriceToken.Decimals),
            account,
          ]
        )
      );

      await createBlockingOffer({
        mode: isProd ? "main" : "test",
        offerId,
        CollectionId: collection_id,
        TokenId: token_id,
        PaymentToken: reservePriceToken?.Address,
        CollateralPercent: collateralPercent,
        TotalCollateralPercent: (Number(collateral) / Number(price) * 100).toFixed(2),
        Price: price,
        Beneficiary: account,
        ReservePeriod: blockingPeriod,
        CollateralAmount: collateral,
        CollateralToken: colaterralPriceToken?.Address,
        AcceptDuration: disappearDays,
        hash: response.hash,
      });
      let newNft = { ...nft };
      newNft.blockingBuyOffers.unshift({
        id: offerId,
        PaymentToken: reservePriceToken?.Address,
        CollateralPercent: collateralPercent,
        TotalCollateralPercent: (Number(collateral) / Number(price) * 100).toFixed(2),
        Price: price,
        Beneficiary: account,
        ReservePeriod: blockingPeriod,
        CollateralAmount: collateral,
        CollateralToken: colaterralPriceToken?.Address,
        AcceptDuration: disappearDays,
        hash: response.hash,
        created: new Date().getTime(),
      });
      setNft(newNft);
      handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

  return (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
        {!confirmSuccess && (
          <>
            <Box style={{ padding: "25px" }}>
              <Box fontSize="24px" color="#ffffff" style={{ textTransform: "uppercase" }}>
                Make New Blocking Offer
              </Box>
              <Grid container spacing={2}>
                <Grid item sm={7}>
                  <Box className={classes.nameField}>Price Offer</Box>
                </Grid>
                <Grid item sm={5}>
                  <Box className={classes.nameField}>Reserve Token</Box>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={7}>
                  <InputWithLabelAndTooltip
                    inputValue={price}
                    onInputValueChange={e => setPrice(e.target.value)}
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
              <Box className={classes.nameField}>Blocking Period</Box>
              <InputWithLabelAndTooltip
                inputValue={blockingPeriod}
                onInputValueChange={e => setBlockingPeriod(Number(e.target.value))}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                endAdornment={<div className={classes.purpleText}>DAYS</div>}
                disabled={isApproved}
                placeHolder={"00"}
              />
              <Box className={classes.nameField}>Collateral % to Block Price</Box>
              <InputWithLabelAndTooltip
                inputValue={collateralPercent}
                onInputValueChange={e => setCollateralPercent(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                endAdornment={<div className={classes.purpleText}>%</div>}
                disabled={isApproved}
                placeHolder={"0"}
              />
              <Box className={classes.nameField}>Collateral Amount & Token</Box>
              <Grid container spacing={2}>
                <Grid item sm={7}>
                  <InputWithLabelAndTooltip
                    inputValue={collateral}
                    // onInputValueChange={e => setCollateral(e.target.value)}
                    onInputValueChange={e => setCollateral(e.target.value)}
                    overriedClasses={classes.inputJOT}
                    required
                    type="number"
                    theme="light"
                    minValue={0}
                    disabled={isApproved}
                    placeHolder={"0"}
                  />
                </Grid>
                <Grid item sm={5}>
                  <ReserveTokenSelect
                    tokens={tokenList.filter(
                      token => token?.Network?.toLowerCase() === selectedChain?.name?.toLowerCase()
                    )}
                    value={colaterralPriceToken?.Address || ""}
                    className={classes.inputJOT}
                    onChange={e => {
                      setColaterralPriceToken(tokenList.find(v => v.Address === e.target.value));
                    }}
                    style={{ flex: "1" }}
                    disabled={true}
                  />
                </Grid>
              </Grid>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                color="#ffffff"
                marginTop="14px"
              >
                <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
                  <span>Wallet Balance</span>
                  <Box className={classes.usdWrap} display="flex" alignItems="center">
                    <Box fontWeight="700" color="#E9FF26">
                      {totalBalance} {reservePriceToken?.Symbol}
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" fontSize="16px">
                  <span onClick={() => setPrice(Number(totalBalance))}>MAX</span>
                </Box>
              </Box>

              <Box className={classes.nameField}>Offer will disapppear if not accepted within</Box>
              <InputWithLabelAndTooltip
                inputValue={disappearDays}
                onInputValueChange={e => setDisappearDays(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                endAdornment={<div className={classes.purpleText}>DAYS</div>}
                disabled={isApproved}
                placeHolder={"0"}
              />
            </Box>
            <Box className={classes.footer}>
              <Box className={classes.totalText}>Total</Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Rany", fontWeight: 500 }}>
                  Your collateral at{" "}
                  {(((collateral || 0) / (!price || price == 0 ? 1 : price)) * 100).toFixed(2)}% of{" "}
                  {collateralPercent}% required
                  {((collateral || 0) / (!price || price == 0 ? 1 : price)) * 100 <
                    (collateralPercent || 0) && (
                    <Box style={{ color: "red" }}>You need to add more collateral</Box>
                  )}
                </Box>
                <Box style={{ color: "#fff", fontSize: "14px", fontFamily: "Rany", fontWeight: 500 }}>
                  {`${collateral} ${colaterralPriceToken?.Symbol}`}
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
                <SecondaryButton
                  size="medium"
                  className={classes.primaryButton}
                  onClick={handleApprove}
                  disabled={
                    isApproved ||
                    !price ||
                    ((collateral || 0) / (!price || price == 0 ? 1 : price)) * 100 < (collateralPercent || 0)
                  }
                >
                  {isApproved ? "Approved" : "Approve"}
                </SecondaryButton>
                <PrimaryButton
                  size="medium"
                  className={classes.primaryButton}
                  onClick={handleConfirm}
                  disabled={
                    !isApproved ||
                    !price ||
                    !blockingPeriod ||
                    !collateral ||
                    !collateralPercent ||
                    !disappearDays
                  }
                >
                  Confirm
                </PrimaryButton>
              </Box>
            </Box>
          </>
        )}
        {confirmSuccess && (
          <Box
            style={{ padding: "218px 25px 52px" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            flexDirection="column"
          >
            <img src={require("assets/icons/lock-success-icon.png")} width="110px" /> <br />
            <div
              style={{
                fontFamily: "GRIFTER",
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: 800,
                marginTop: "31px",
                textAlign: "center",
              }}
            >
              Your blocking <br />
              offer was sent
            </div>
            <div style={{ color: "#ffffff50", fontSize: "16px", marginTop: "34px", textAlign: "center" }}>
              You’ve succesfully send blocking offer for <br />
              [NFT NAME]
            </div>
            <PrimaryButton
              size="medium"
              style={{
                background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                color: "#ffffff",
                minWidth: "56%",
                fontSize: "14px",
                marginTop: "144px",
              }}
              onClick={handleClose}
            >
              Done
            </PrimaryButton>
          </Box>
        )}
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
