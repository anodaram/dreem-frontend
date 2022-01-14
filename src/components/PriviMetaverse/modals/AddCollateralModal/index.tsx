import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router";
import Web3 from "web3";
import { useSelector } from "react-redux";

import { Grid } from "@material-ui/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getChainForNFT, switchNetwork, checkChainID } from "shared/functions/metamask";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { updateBlockingHistory } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import TransactionProgressModal from "../TransactionProgressModal";
import { ReserveNftModalStyles } from "./index.style";

export default function AddCollateralModal({ open, handleClose, nft, refresh }) {
  const classes = ReserveNftModalStyles();
  const { collection_id, token_id } = useParams<{ collection_id: string; token_id: string }>();
  const { account, library, chainId } = useWeb3React();
  const [price, setPrice] = useState<number>(0);
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const fee = useSelector((state: RootState) => state.marketPlace.fee);
  const [reservePriceToken, setReservePriceToken] = useState<any>(
    tokenList.find(item => item.Address == nft?.blockingSaleOffer?.PaymentToken)
  );
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [confirmSuccess, setConfirmSuccess] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const { showAlertMessage } = useAlertMessage();
  const isProd = process.env.REACT_APP_ENV === "prod";

  useEffect(() => {
    setReservePriceToken(tokenList[0]);
  }, [tokenList]);

  useEffect(() => {
    if (nft?.blockingSalesHistories?.length > 0) {
      setBlockingInfo(nft.blockingSalesHistories[nft.blockingSalesHistories.length - 1])
    }
  }, [nft])

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
      const targetChain = BlockchainNets.find(net => net.name.toLowerCase() === nft.Chain.toLowerCase());
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", { variant: "error" });
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

  const getTokenName = addr => {
    if (tokenList.length == 0 || !addr) return "";
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const handleApprove = async () => {
    try {
      if (!price) {
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
        web3Config.CONTRACT_ADDRESSES.RESERVES_MANAGER,
        toNDecimals(price * (1 + fee), reservePriceToken.Decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${price * (1 + fee)} ${reservePriceToken.Symbol}!`, {
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
    if (!price) {
      showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", { variant: "error" });
      return;
    }

    setOpenTransactionModal(true);
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);
    const activeReserveId = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ["address", "uint256", "address", "address"],
        [
          nft.Address,
          token_id,
          blockingInfo?.from,
          blockingInfo?.Beneficiary,
        ]
      )
    );

    const response = await web3APIHandler.ReservesManager.increaseReserveCollateral(
      web3,
      account!,
      {
        activeReserveId,
        amount: toNDecimals(price * (1 + fee), reservePriceToken.Decimals),
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);

      await updateBlockingHistory({
        ...blockingInfo,
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
        TotalCollateralPercent:
          Number(blockingInfo?.TotalCollateralPercent) +
          Number(((price || 0) / Number(blockingInfo?.Price)) * 100),
        notificationMode: 2,
      });

      refresh();
      handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

  const collateral =
    (Number(blockingInfo?.Price) * Number(blockingInfo?.TotalCollateralPercent)) / 100;

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
              <Box
                fontSize="24px"
                color="#ffffff"
                fontFamily="GRIFTER"
                style={{
                  textTransform: "uppercase",
                }}
              >
                Add Collateral
              </Box>
              <Box className={classes.borderBox} mt="20px">
                <Box className={classes.box}>
                  <span style={{ fontSize: "16px", color: "#ffffff" }}>Current Collateral</span>
                  <span className={classes.gradientText}>
                    {`${collateral} ${getTokenName(nft?.blockingSaleOffer?.PaymentToken)}`}
                  </span>
                </Box>
              </Box>
              <Grid
                container
                spacing={2}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Grid item sm={7}>
                  <Box className={classes.nameField}>Amount To Add</Box>
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
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Rany", fontWeight: 500 }}>
                  Collateral at{" "}
                  {(
                    (Number(price) / Number(blockingInfo?.Price)) * 100 +
                    Number(blockingInfo?.TotalCollateralPercent)
                  ).toFixed(2)}
                  % / <b>{blockingInfo?.CollateralPercent}</b>%
                </Box>
                <Box style={{ color: "#ffffff", fontSize: "14px", fontFamily: "Rany", fontWeight: 500 }}>
                  {price} USDT
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
                  disabled={!isApproved || !price}
                >
                  Accept
                </PrimaryButton>
              </Box>
            </Box>
          </>
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
