import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import { Grid } from "@material-ui/core";

import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { toNDecimals } from "shared/functions/web3";
import { createSellOffer } from "shared/services/API/ReserveAPI";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { RootState } from "store/reducers/Reducer";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import TransactionProgressModal from "../TransactionProgressModal";
import { SetSellingPriceModalStyles } from "./index.style";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function SetSellingPriceModal({ open, handleClose, nft, setNft }) {
  const classes = SetSellingPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const { collection_id, token_id } = useParams<{ collection_id: string; token_id: string }>();
  const { showAlertMessage } = useAlertMessage();
  const [selectedChain] = useState<any>(getChainForNFT(nft));

  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [token, setToken] = useState<any>(tokens[0]);

  const [inputBalance, setInputBalance] = useState<number>();
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    setToken(tokens[0]);
  }, [tokens]);

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
    }
  }, [open]);

  useEffect(() => {
    setToken(tokens[0]);
  }, [tokens]);

  const handleApprove = async () => {
    try {
      if (!inputBalance) {
        showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", { variant: "error" });
        return;
      }

      if (chainId && chainId !== selectedChain?.chainId) {
        const isHere = await switchNetwork(selectedChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target network", { variant: "error" });
          return;
        }
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
      let approved = await web3APIHandler.Erc721.approve(web3, account || "", {
        to: web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
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
    if (!inputBalance) {
      showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", { variant: "error" });
      return;
    }

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

    const response = await web3APIHandler.openSalesManager.approveSale(
      web3,
      account!,
      {
        collection_id: nft.Address,
        token_id,
        paymentToken: token.Address,
        price: toNDecimals(inputBalance, token.Decimals),
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
          [nft.Address, token_id, token.Address, toNDecimals(inputBalance, token.Decimals), account]
        )
      );

      await createSellOffer({
        mode: isProd ? "main" : "test",
        offerId,
        CollectionId: collection_id,
        TokenId: token_id,
        Price: inputBalance,
        PaymentToken: token.Address,
        Beneficiary: account,
      });

      let newNft = { ...nft };
      newNft.sellingOffer = {
        id: offerId,
        Price: inputBalance,
        PaymentToken: token.Address,
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

  return (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
        <Box style={{ padding: "25px" }}>
          <Box fontSize="24px" color="#ffffff" fontFamily="GRIFTER" style={{ textTransform: "uppercase" }}>
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
                placeHolder={"0"}
              />
            </Grid>
            <Grid item xs={6} sm={5}>
              <Box className={classes.nameField}>Token</Box>
              <ReserveTokenSelect
                tokens={tokens.filter(
                  token => token?.Network?.toLowerCase() === selectedChain?.name?.toLowerCase()
                )}
                value={token?.Address || ""}
                className={classes.tokenSelect}
                onChange={e => {
                  setToken(tokens.find(v => v.Address === e.target.value));
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
              onClick={handleApprove}
              disabled={isApproved}
            >
              Approve for Sale
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleConfirm}
              disabled={!isApproved}
            >
              Confirm Sales Offer
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
}
