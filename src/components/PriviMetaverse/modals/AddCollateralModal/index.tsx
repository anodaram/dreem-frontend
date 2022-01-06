import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReserveNftModalStyles } from "./index.style";
import { Grid } from "@material-ui/core";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "../TransactionProgressModal";

import { useParams } from "react-router";
import Web3 from "web3";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { updateBlockingHistory } from "shared/services/API/ReserveAPI";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

export default function AddCollateralModal({ open, handleClose, nft, refresh }) {
  const classes = ReserveNftModalStyles();
  const { collection_id, token_id } = useParams();
  const { account, library, chainId } = useWeb3React();
  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [price, setPrice] = useState<number>(0);
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [reservePriceToken, setReservePriceToken] = useState<any>(
    tokenList.find(item => item.Address == nft?.blockingSaleOffer?.PaymentToken)
  );
  const [collateralPercent, setCollateralPercent] = useState<string | number>(
    nft?.blockingSaleOffer?.CollateralPercent
  );
  const [totalBalance, setTotalBalance] = useState<string>('0')
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [confirmSuccess, setConfirmSuccess] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  const isProd = process.env.REACT_APP_ENV === "prod";

  useEffect(() => {
    setReservePriceToken(tokenList[0])
  }, [tokenList])

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
      const targetChain = BlockchainNets.find(net => net.value === nft.chain);
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target network", { variant: "error" });
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
      if (chainId && chainId !== selectedChain?.chainId) {
        const isHere = await switchNetwork(selectedChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target network", { variant: "error" });
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
        toNDecimals(price, reservePriceToken.Decimals)
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
    setOpenTransactionModal(true);
    if (chainId !== BlockchainNets[1].chainId && chainId !== BlockchainNets[2].chainId) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);
    const activeReserveId = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ["address", "uint256", "address", "address"],
        [
          collection_id,
          token_id,
          nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].from,
          nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].Beneficiary
        ]
      )
    );

    const response = await web3APIHandler.ReservesManager.increaseReserveCollateral(
      web3,
      account!,
      {
        activeReserveId,
        amount: toNDecimals(price, reservePriceToken.Decimals)
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);

      await updateBlockingHistory({
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
        OfferId: nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].id,
        TotalCollateralPercent: Number(nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].TotalCollateralPercent 
          || nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].CollateralPercent) 
          + Number(price / nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].Price * 100),
        PaidAmount: nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].PaidAmount || 0
      });

      refresh();
      handleClose();
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
              <Box fontSize="24px" color="#431AB7">
                Add Collateral
              </Box>
              <Box className={classes.nameField}></Box>
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
            </Box>
            <Box className={classes.footer}>
              <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
                <SecondaryButton
                  size="medium"
                  className={classes.primaryButton}
                  onClick={handleApprove}
                  style={{ backgroundColor: "#431AB7" }}
                  disabled={isApproved || !price}
                >
                  Approve
                </SecondaryButton>
                <PrimaryButton
                  size="medium"
                  className={classes.primaryButton}
                  style={{ backgroundColor: "#431AB7" }}
                  onClick={handleConfirm}
                  disabled={!isApproved || !price || !collateralPercent}
                >
                  Confirm Offer
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
