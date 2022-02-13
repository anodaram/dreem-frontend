import React, { useState, useEffect } from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { PayRemainingAmountModalStyles } from "./index.style";
import { typeUnitValue } from "shared/helpers/utils";
import { useParams } from "react-router";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { BlockchainNets } from "shared/constants/constants";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { switchNetwork, checkChainID, getChainForNFT } from "shared/functions/metamask";
import TransactionProgressModal from "../TransactionProgressModal";
import { updateBlockingHistory } from "shared/services/API/ReserveAPI";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function PayRemainingAmountModal({ open, nft, handleClose = () => { }, onConfirm }) {
  const classes = PayRemainingAmountModalStyles();
  const { collection_id, token_id } = useParams();
  const { account, library, chainId } = useWeb3React();
  const [totalBalance, setTotalBalance] = useState<string>('0')
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const fee = useSelector((state: RootState) => state.marketPlace.fee);

  const PRECISSION = 1.01;

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      return;
    }

    if (selectedChain && nft && selectedChain.value !== nft.chain) {
      setSelectedChain(getChainForNFT(nft))
    }
  }, [nft, selectedChain, open]);

  useEffect(() => {
    if (!open) return;

    if (nft)
      setBalance();
  }, [open, nft, selectedChain]);

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token?.Symbol || '';
  };

  const setBalance = async () => {
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
    const decimals = await web3APIHandler.Erc20[
      getTokenSymbol(nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].PaymentToken) || "ETH"
    ].decimals(web3);
    const balance = await web3APIHandler.Erc20[getTokenSymbol(nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].PaymentToken) || "ETH"].balanceOf(web3, {
      account,
    });
    setTotalBalance(toDecimals(balance, decimals));
  };

  const handleApprove = async () => {
    try {
      if (chainId && chainId !== selectedChain?.chainId) {
        const isHere = await switchNetwork(selectedChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", { variant: "error" });
          return;
        }
      }
      const info = nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1];
      const symbol = getTokenSymbol(info.PaymentToken)
      setOpenTransactionModal(true);
      const web3Config = selectedChain.config;
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      let balance = await web3APIHandler.Erc20[symbol].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[symbol].decimals(web3, { account });
      balance = balance / Math.pow(10, decimals);
      if (balance < (info.Price || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[symbol].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.RESERVES_MANAGER,
        toNDecimals(Number(info.Price) * (1 + fee) * PRECISSION, decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${(Number(info.Price) * (1 + fee)* PRECISSION).toFixed(2)} ${symbol}!`, {
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
    const info = nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1];
    const symbol = getTokenSymbol(info.PaymentToken)
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
          nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].from,
          nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].Beneficiary
        ]
      )
    );

    const response = await web3APIHandler.ReservesManager.payThePrice(
      web3,
      account!,
      {
        activeReserveId,
      },
      setHash
    );

    if (response.success) {
      await updateBlockingHistory({
        ...nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1],
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
        PaidAmount: nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].Price,
        offerer: account!,
        status: "SOLD",
        notificationMode: 1,
        hash: response.hash,
      });

      setTransactionSuccess(true);
      onConfirm();
      handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <>
        <Box>
          <Box fontSize="24px" color="#ffffff" marginTop="50px" fontFamily="GRIFTER" style={{ textTransform: "uppercase" }}>
            Payment
          </Box>
          <Box className={classes.nameField}>Pay reserved price for your  NFT in one payment or few installment.</Box>
          <Box className={classes.availableCollateral} display="flex">
            <Box>
              <Box className={classes.collateralText} style={{ marginRight: "40px" }}>
                Amount to pay
              </Box>
              <Box className={classes.collateralAmount} style={{ marginRight: "40px" }}>
                {`${Number(nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].Price) * (1 + fee) } ${getTokenSymbol(nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].PaymentToken)}`}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="#ffffff50"
          marginTop="14px"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gridColumnGap="10px"
            fontSize="14px"
            width="100%"
          >
            <Box display="flex">
              <span>Wallet Balance</span>
              <Box className={classes.usdWrap} display="flex" alignItems="center" ml={2} color="#E9FF26">
                <Box fontWeight="700">{`${typeUnitValue(totalBalance, 1)} ${getTokenSymbol(nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].PaymentToken)}`} </Box>
              </Box>
            </Box>
            <Box fontSize={12} color="#ffffff">
              incl. {fee * 100}% marketplace fee
            </Box>
          </Box>
        </Box>
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleApprove}
              disabled={isApproved}
            >
              APPROVE
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleConfirm}
              disabled={!isApproved}
            >
              CONFIRM PAYMENT
            </PrimaryButton>
          </Box>
        </Box>
      </>
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
