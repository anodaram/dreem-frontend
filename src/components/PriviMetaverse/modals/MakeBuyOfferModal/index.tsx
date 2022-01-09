import React, { useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { Grid } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { getChainForNFT, switchNetwork, checkChainID } from "shared/functions/metamask";
import { createBuyOffer } from "shared/services/API/ReserveAPI";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { getNextDay } from "shared/helpers/utils";
import TransactionProgressModal from "../TransactionProgressModal";
import { MakeBuyOfferModalStyles } from "./index.style";

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function MakeBuyOfferModal({ open, handleClose, nft, setNft }) {
  const classes = MakeBuyOfferModalStyles();
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [token, setToken] = useState<any>(tokens[0]);
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const [price, setPrice] = useState<number>();
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const { showAlertMessage } = useAlertMessage();

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [date, setDate] = useState<any>(new Date());
  const { collection_id, token_id }: { collection_id: string; token_id: string } = useParams();

  useEffect(() => {
    setToken(tokens[0]);
  }, [tokens]);

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      setTransactionSuccess(null);
      return;
    }
  }, [chainId, selectedChain, open]);

  useEffect(() => {
    if (nft.chain) setSelectedChain(filteredBlockchainNets.find(net => net.value === nft.chain));
  }, [nft]);

  useEffect(() => {
    if (!open) return;

    setBalance();
  }, [open, token, selectedChain]);

  const setBalance = async () => {
    if (token) {
      const targetChain = await checkNetworkFromNFT();
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20[token?.Symbol || "ETH"]?.decimals(web3, token.Address);
      const balance = await web3APIHandler.Erc20[token?.Symbol || "ETH"]?.balanceOf(web3, {
        account,
      });
      setTotalBalance(toDecimals(balance, decimals));
    }
  };

  const checkNetworkFromNFT = async () => {
    const nftChain = getChainForNFT(nft);
    if (!nftChain) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }
    if (chainId && chainId !== nftChain?.chainId) {
      const isHere = await switchNetwork(nftChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
        return;
      }

      setSelectedChain(nftChain);
    }

    return nftChain;
  };

  const handleApprove = async () => {
    try {
      if (!price) {
        showAlertMessage("Please fill the fields to proceed", { variant: "error" });
        return;
      }

      const targetChain = await checkNetworkFromNFT();

      setOpenTransactionModal(true);
      const web3Config = targetChain.config;
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      let balance = await web3APIHandler.Erc20[token.Symbol].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[token.Symbol].decimals(web3, { account });
      balance = balance / Math.pow(10, decimals);
      if (balance < (price || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[token.Symbol].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        toNDecimals(price, token.Decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${price} ${token.Symbol}!`, {
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
    try {
      if (!price) {
        showAlertMessage("Please fill the fields to proceed", { variant: "error" });
        return;
      }
      const targetChain = await checkNetworkFromNFT();

      setOpenTransactionModal(true);

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const response = await web3APIHandler.openSalesManager.approvePurchase(
        web3,
        account!,
        {
          collection_id: nft.Address,
          token_id,
          paymentToken: token.Address,
          price: toNDecimals(price, token.Decimals),
          beneficiary: account,
          sellerToMatch: "0x0000000000000000000000000000000000000000",
        },
        setHash
      );

      if (response.success) {
        setTransactionSuccess(true);
        const offerId = web3.utils.keccak256(
          web3.eth.abi.encodeParameters(
            ["address", "uint256", "address", "uint256", "address"],
            [nft.Address, token_id, token.Address, toNDecimals(price, token.Decimals), account]
          )
        );

        await createBuyOffer({
          mode: isProd ? "main" : "test",
          offerId,
          CollectionId: collection_id,
          TokenId: token_id,
          Price: price,
          PaymentToken: token.Address,
          Beneficiary: account,
          Expiration: getNextDay(date),
          hash: response.hash,
        });
        let newNft = { ...nft };
        newNft.buyingOffers.unshift({
          id: offerId,
          Price: price,
          PaymentToken: token.Address,
          Beneficiary: account,
          Expiration: getNextDay(date),
          hash: response.hash,
          created: new Date().getTime(),
        });
        setNft(newNft);
        handleClose();
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to make an offer", { variant: "error" });
      }
      setOpenTransactionModal(false);
    } catch (error) {
      console.log(error);
      showAlertMessage("Something went wrong. Please try again!", {
        variant: "error",
      });
    } finally {
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
          Make Buy Offer
        </Box>
        <Box className={classes.nameField}></Box>
        <Box className={classes.nameField}>Suggested price</Box>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={7}>
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
          <Grid item xs={6} sm={5}>
            <ReserveTokenSelect
              tokens={tokens.filter(
                token => token?.Network?.toLowerCase() === selectedChain?.name?.toLowerCase()
              )}
              value={token?.Address || ""}
              onChange={e => {
                setToken(tokens.find(v => v.Address === e.target.value));
              }}
              className={classes.inputJOT}
              style={{ flex: "1" }}
              disabled={true}
            />
          </Grid>
        </Grid>
        <Box className={classes.nameField}>Offer will disapppear if not accepted before</Box>
        <Box width="100%">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="dense"
              id="date-picker-inline"
              value={date}
              onChange={(date, _) => date && setDate(new Date(date?.getTime()))}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              size="small"
              inputVariant="outlined"
              className={classes.datePicker}
              disabled={isApproved}
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
          <SecondaryButton
            size="medium"
            className={classes.primaryButton}
            style={{ backgroundColor: "#431AB7" }}
            onClick={handleApprove}
            disabled={isApproved || !price}
          >
            Approve
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            className={classes.primaryButton}
            style={{ backgroundColor: "#431AB7" }}
            onClick={handleConfirm}
            disabled={!isApproved || !price || !token || !date}
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
