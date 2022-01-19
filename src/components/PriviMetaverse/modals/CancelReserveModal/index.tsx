import React, { useState, useEffect } from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CancelReserveModalStyles } from "./index.style";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { useParams } from "react-router";
import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Web3 from "web3";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { toNDecimals } from "shared/functions/web3";
import { closeBlockingHistory } from "shared/services/API/ReserveAPI";
import TransactionProgressModal from "../TransactionProgressModal";

const isProd = process.env.REACT_APP_ENV === "prod";

const PRECISSION = 1.01;

export default function CancelReserveModal({
  open,
  handleClose = () => {},
  onConfirm,
  nft,
}: {
  open: boolean;
  handleClose: any;
  onConfirm: any;
  nft?: any;
}) {
  const classes = CancelReserveModalStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { collection_id, token_id } = useParams();
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const [penaltyFee, setPenaltyFee] = useState<number>(0);
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const fee = useSelector((state: RootState) => state.marketPlace.fee);

  useEffect(() => {
    setSelectedChain(getChainForNFT(nft))
  }, [nft])

  useEffect(() => {
    if (!open) return;
    (async () => {
      if (nft && nft?.blockingSalesHistories) {
        setBlockingInfo(nft?.blockingSalesHistories[nft?.blockingSalesHistories?.length - 1]);
      }
      const chain = BlockchainNets.find(net => net.name.toLowerCase() === nft.Chain.toLowerCase());
      if (chain) {
        const web3APIHandler = chain.apiHandler;
        const web3 = new Web3(library.provider);

        const contractResponse = await web3APIHandler.ReservesManager.sellerCancelFeePercent(web3);
        setPenaltyFee(contractResponse.response);
      }
    })();
  }, [open, nft]);

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || '';
  };

  const handleCloseModal = () => {
    handleClose();
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
      setOpenTransactionModal(true);
      const web3Config = selectedChain.config;
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      let balance = await web3APIHandler.Erc20[getTokenSymbol(blockingInfo?.PaymentToken)].balanceOf(web3, {
        account,
      });
      let decimals = await web3APIHandler.Erc20[getTokenSymbol(blockingInfo?.PaymentToken)].decimals(web3, {
        account,
      });
      balance = balance / Math.pow(10, decimals);
      if (balance < ((blockingInfo?.Price * penaltyFee) / 100 || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[getTokenSymbol(blockingInfo?.PaymentToken)].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.RESERVES_MANAGER,
        toNDecimals(Number(blockingInfo?.Price) * penaltyFee / 100 * (1 + fee) *PRECISSION, decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(
        `Successfully approved ${(Number(blockingInfo?.Price) * penaltyFee) / 100 * (1 + fee) *PRECISSION} ${getTokenSymbol(
          blockingInfo?.PaymentToken
        )}!`,
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
    try {
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
      const activeReserveId = web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ["address", "uint256", "address", "address"],
          [nft.Address, token_id, blockingInfo.from, blockingInfo.Beneficiary]
        )
      );

      const contractResponse = await web3APIHandler.ReservesManager.cancelReserve(
        web3,
        account!,
        {
          activeReserveId,
        },
        setHash
      );

      if (contractResponse.success) {
        await closeBlockingHistory({
          ...blockingInfo,
          mode: isProd ? "main" : "test",
          CollectionId: collection_id,
          TokenId: token_id,
          Id: activeReserveId,
          Beneficiary: blockingInfo.Beneficiary,
          offerer: account!,
          notificationMode: 0,
          hash: contractResponse.hash
        });

        setTransactionSuccess(true);
        handleClose();
        onConfirm();
        //   handleRefresh();
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to cancel reserve", { variant: "error" });
      }
    } catch (err) {
      console.log(err);
      showAlertMessage("Failed to cancel reserve, Please try again", { variant: "error" });
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <>
        <Box>
          <Box fontSize="24px" color="#ffffff" marginTop="50px" style={{
            textTransform: "uppercase"
          }}>
            Cancel Reserve
          </Box>
          <Box className={classes.nameField}>
            Repay your collaterall to be able to recover and withdraw your NFT
          </Box>
          <Box className={classes.nameField}>
            By recovering your NFT before end of  the auction  you’ll have to pay penalty fee of {penaltyFee}%
          </Box>
          <Box className={classes.availableCollateral}>
            <Box className={classes.collateralText}>{"Penalty Fee"}</Box>
            <Box className={classes.collateralAmount}>{`${
              (blockingInfo?.Price * penaltyFee) / 100 * (1 + fee)
            } ${getTokenSymbol(blockingInfo?.PaymentToken)}`}</Box>
          </Box>
          <Box fontSize={12} lineHeight="21px" textAlign="right" color="#ffffff">
            incl. {fee * 100}% marketplace fee
          </Box>
        </Box>
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <SecondaryButton size="medium" className={classes.cancelButton} onClick={handleCloseModal}>
              Cancel
            </SecondaryButton>
            <Box display="flex" alignItems="center">
              <PrimaryButton
                size="medium"
                className={classes.confirmButton}
                onClick={handleApprove}
                disabled={isApproved}
              >
                {isApproved ? "Approved" : "Approve"}
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                className={classes.confirmButton}
                onClick={handleConfirm}
                disabled={!isApproved}
              >
                pay & cancel
              </PrimaryButton>
            </Box>
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
