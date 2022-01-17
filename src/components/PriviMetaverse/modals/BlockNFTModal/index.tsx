import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import Web3 from "web3";

import { Grid } from "@material-ui/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import ExploreCard from "components/PriviMetaverse/components/cards/ExploreCard";
import { getChainForNFT, switchNetwork, checkChainID } from "shared/functions/metamask";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { acceptBlockingOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import TransactionProgressModal from "../TransactionProgressModal";
import { ReserveNftModalStyles } from "./index.style";

export default function BlockNFTModal({ open, handleClose, nft, setNft, onConfirm }) {
  const classes = ReserveNftModalStyles();
  const { collection_id, token_id } = useParams<{ collection_id: string; token_id: string }>();
  const { account, library, chainId } = useWeb3React();

  const [price, setPrice] = useState<number>(nft?.blockingSaleOffer?.Price);
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const fee = useSelector((state: RootState) => state.marketPlace.fee);
  const [collateralToken, setCollateralToken] = useState<any>(tokenList[0]);
  const [reservePriceToken, setReservePriceToken] = useState<any>(tokenList[0]);
  const [collateral, setCollateral] = useState<number>(
    (Number(nft?.blockingSaleOffer?.Price) * Number(nft?.blockingSaleOffer?.CollateralPercent)) / 100
  );
  const [totalBalance, setTotalBalance] = React.useState<string>("0");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [confirmSuccess, setConfirmSuccess] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  const isProd = process.env.REACT_APP_ENV === "prod";

  useEffect(() => {
    setCollateralToken(tokenList[0]);
    setReservePriceToken(tokenList.find(token => token.Address === nft?.blockingSaleOffer?.PaymentToken));
  }, [tokenList, nft]);

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      return;
    }
  }, [nft, selectedChain, open]);

  useEffect(() => {
    if (!open) return;

    setBalance();
  }, [open, reservePriceToken, selectedChain]);

  const setBalance = async () => {
    if (reservePriceToken) {
      const targetChain = BlockchainNets.find(net => net.name.toLowerCase() === nft.Chain.toLowerCase());
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", {
            variant: "error",
          });
          return;
        }
      }

      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20[reservePriceToken?.Symbol || "ETH"]?.decimals(
        web3,
        reservePriceToken?.Address
      );
      const balance = await web3APIHandler.Erc20[reservePriceToken?.Symbol || "ETH"]?.balanceOf(web3, {
        account,
      });
      setTotalBalance(toDecimals(balance, decimals));
    }
  };

  const handleApprove = async () => {
    try {
      if (!price || !collateral) {
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
        toNDecimals(Number(collateral) * (1 + fee), reservePriceToken.Decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(
        `Successfully approved ${Number(collateral) * (1 + fee)} ${reservePriceToken.Symbol}!`,
        {
          variant: "success",
        }
      );
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
    if (!price || !collateral) {
      showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", {
        variant: "error",
      });
      return;
    }

    setOpenTransactionModal(true);
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);
    const response = await web3APIHandler.ReserveMarketplace.approveReserveToBuy(
      web3,
      account!,
      {
        collection_id: nft.Address,
        token_id,
        paymentToken: reservePriceToken?.Address,
        collateralToken: reservePriceToken?.Address,
        price: toNDecimals(price, reservePriceToken.Decimals),
        beneficiary: account,
        collateralInitialAmount: toNDecimals(Number(collateral), collateralToken.Decimals),
        collateralPercent: toNDecimals((Number(collateral) / Number(nft?.blockingSaleOffer?.Price)) * 100, 2),
        reservePeriod: Math.ceil(+nft.blockingSaleOffer.ReservePeriod * 3600 * 24),
        validityPeriod: Number(nft.blockingSaleOffer.AcceptDuration || 0) * 3600 * 24,
        sellerToMatch: nft.blockingSaleOffer.Beneficiary,
        mode: 0
      },
      setHash
    );

    if (response.success) {
      const offerId = web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ["address", "uint256", "address", "uint256", "address", "uint80", "uint64"],
          [
            nft.Address,
            token_id,
            reservePriceToken?.Address,
            toNDecimals(price, reservePriceToken.Decimals),
            account,
            toNDecimals((Number(collateral) / Number(nft?.blockingSaleOffer?.Price)) * 100, 2),
            Math.ceil(+nft.blockingSaleOffer.ReservePeriod * 3600 * 24),
          ]
        )
      );

      await acceptBlockingOffer({
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
        AcceptDuration: nft.blockingSaleOffer.AcceptDuration,
        PaymentToken: nft.blockingSaleOffer.PaymentToken,
        Price: nft.blockingSaleOffer.Price,
        Beneficiary: account,
        CollateralPercent: nft?.blockingSaleOffer?.CollateralPercent,
        TotalCollateralPercent: ((Number(collateral) / Number(nft?.blockingSaleOffer?.Price)) * 100).toFixed(
          2
        ),
        ReservePeriod: nft.blockingSaleOffer.ReservePeriod,
        from: nft.blockingSaleOffer.Beneficiary,
        to: account,
        hash: response.hash,
        notificationMode: 1,
      });
      let newNft = { ...nft };
      newNft.status = "Blocked";
      newNft.blockingBuyOffers = newNft.blockingBuyOffers.filter(el => el.Beneficiary !== account);
      newNft.blockingSalesHistories.unshift({
        id: offerId,
        PaymentToken: nft.blockingSaleOffer.PaymentToken,
        Price: nft.blockingSaleOffer.Price,
        Beneficiary: account,
        CollateralPercent: nft.blockingSaleOffer.CollateralPercent,
        TotalCollateralPercent: ((Number(collateral) / Number(nft?.blockingSaleOffer?.Price)) * 100).toFixed(
          2
        ),
        ReservePeriod: nft.blockingSaleOffer.ReservePeriod,
        from: nft.blockingSaleOffer.Beneficiary,
        hash: response.hash,
        created: new Date().getTime(),
      });
      setTransactionSuccess(true);
      setNft(newNft);
      onConfirm();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

  return (
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={handleClose}
        showCloseIcon
        className={classes.container}
        style={{
          maxWidth: confirmSuccess ? 775 : 508,
        }}
      >
        {!confirmSuccess && (
          <>
            <Box style={{ padding: "25px" }}>
              <Box fontSize="24px" color="#ffffff" style={{ textTransform: "uppercase" }}>
                Block NFT
              </Box>
              <Box className={classes.nameField}>Blocking Price</Box>
              <Box
                display="flex"
                justifyContent="space-between"
                bgcolor="rgba(218, 230, 229, 0.06)"
                padding="16px"
                fontFamily="Rany"
              >
                <Box fontSize={16} color="#E9FF26" fontWeight={500}>
                  {nft?.blockingSaleOffer?.Price}
                </Box>
                <Box fontSize={14} color="#ffffff">
                  USDT
                </Box>
              </Box>
              <Box className={classes.nameField}>
                Required {nft?.blockingSaleOffer?.CollateralPercent}% as Collateral
              </Box>
              <Grid container spacing={2}>
                <Grid item sm={7}>
                  <InputWithLabelAndTooltip
                    inputValue={collateral}
                    onInputValueChange={e => setCollateral(e.target.value)}
                    overriedClasses={classes.inputJOT}
                    required
                    type="number"
                    theme="light"
                    minValue={0}
                    placeHolder={"0"}
                  />
                </Grid>
                <Grid item sm={5}>
                  <ReserveTokenSelect
                    tokens={tokenList.filter(
                      token => token?.Network?.toLowerCase() === selectedChain?.name?.toLowerCase()
                    )}
                    value={reservePriceToken?.Address || ""}
                    className={classes.tokenSelect}
                    onChange={e => {
                      setReservePriceToken(tokenList.find(v => v.Address === e.target.value));
                    }}
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
                  <Box className={classes.usdWrap} display="flex" alignItems="center" color="#E9FF26">
                    <Box fontWeight="700">{totalBalance} USDT</Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" fontSize="16px">
                  <span>MAX</span>
                </Box>
              </Box>
            </Box>
            <Box className={classes.footer}>
              <Box className={classes.totalText}>Total</Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                <Box
                  style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}
                >
                  Collateral at{" "}
                  {((Number(collateral) / Number(nft?.blockingSaleOffer?.Price)) * 100).toFixed(2)}% /{" "}
                  <b>{nft?.blockingSaleOffer?.CollateralPercent}</b>%
                  {Number(nft?.blockingSaleOffer?.CollateralPercent) >
                    (Number(collateral) / Number(nft?.blockingSaleOffer?.Price)) * 100 && (
                    <Box style={{ color: "red" }}>You need to add more collateral</Box>
                  )}
                </Box>
                <Box
                  style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}
                >
                  {collateral || 0} USDT
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                <Box
                  style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}
                >
                  Marketplace fee ({fee * 100}%)
                </Box>
                <Box
                  style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}
                >
                  {Number(collateral) * fee} USDT
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                <Box
                  style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}
                >
                  TOTAL
                </Box>
                <Box
                  style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}
                >
                  {(collateral || 0) * (1 + fee)} USDT
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
                <SecondaryButton
                  size="medium"
                  className={classes.primaryButton}
                  onClick={handleApprove}
                  disabled={isApproved || !price}
                >
                  Approve
                </SecondaryButton>
                <PrimaryButton
                  size="medium"
                  className={classes.primaryButton}
                  onClick={handleConfirm}
                  disabled={!isApproved || !price || !collateral}
                >
                  Confirm
                </PrimaryButton>
              </Box>
            </Box>
          </>
        )}
        {confirmSuccess && (
          <Box
            style={{
              padding: "50px 144px",
              maxWidth: "900px !important",
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            <Grid xs={6} sm={6} md={6} lg={6}>
              <ExploreCard nft={nft} />
            </Grid>
            <div
              style={{
                fontFamily: "Agrandir GrandHeavy",
                color: "#2D3047",
                fontSize: "22px",
                fontWeight: 800,
                marginTop: "31px",
                textAlign: "center",
              }}
            >
              You’ve blocked your NFT <br /> for purchase.
            </div>
            <div style={{ color: "#54658F", fontSize: "16px", marginTop: "20px", textAlign: "center" }}>
              Congrat,s you’ve succesfully reserved a price to
              <br /> buy [ NFT name] in future at [Price]
            </div>
            <PrimaryButton
              size="medium"
              style={{
                background: "#431AB7",
                color: "#ffffff",
                minWidth: "56%",
                fontSize: "14px",
                marginTop: "35px",
              }}
              onClick={handleClose}
            >
              Close
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
