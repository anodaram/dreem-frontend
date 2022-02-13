import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { Modal } from "shared/ui-kit";
import { useSelector } from "react-redux";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { BlockProceedModalStyles } from "./index.style";
import TransactionProgressModal from "../TransactionProgressModal";
import { toNDecimals } from "shared/functions/web3";
import { useHistory, useParams } from "react-router";
import { acceptBlockingOffer } from "shared/services/API/ReserveAPI";
import { RootState } from "store/reducers/Reducer";
import { getChainForNFT, switchNetwork, checkChainID } from "shared/functions/metamask";
import { getAbbrAddress } from "shared/helpers";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function BlockProceedModal({ open, offer, handleClose, nft, setNft, handleRefresh }) {
  const history = useHistory();
  const classes = BlockProceedModalStyles();
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [selectedChain] = useState<any>(getChainForNFT(nft));

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const fee = useSelector((state: RootState) => state.marketPlace.fee);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { collection_id, token_id } = useParams();

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      return;
    }
  }, [nft, selectedChain, open]);

  const getTokenDecimal = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token.Decimals;
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token?.Symbol || "";
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const handleApprove = async () => {
    try {
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

  const handleAccept = async () => {
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
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
          paymentToken: offer.PaymentToken,
          collateralToken: offer.CollateralToken,
          price: toNDecimals(Number(offer.Price), getTokenDecimal(offer.PaymentToken)),
          beneficiary: account,
          collateralPercent: toNDecimals(offer.CollateralPercent, 2),
          reservePeriod: Math.ceil(+offer.ReservePeriod * 3600 * 24),
          validityPeriod: Number(offer.AcceptDuration || 0) * 3600 * 24,
          buyerToMatch: offer.Beneficiary,
          mode: 0,
        },
        setHash
      );

      if (contractResponse.success) {
        const offerId = await web3.utils.keccak256(
          web3.eth.abi.encodeParameters(
            ["address", "uint256", "address", "uint256", "address", "uint80", "uint64", "address"],
            [
              nft.Address,
              token_id,
              offer.PaymentToken,
              toNDecimals(offer.Price, getTokenDecimal(offer.PaymentToken)),
              offer.Beneficiary,
              toNDecimals(offer.CollateralPercent, 2),
              Math.ceil(+offer.ReservePeriod * 3600 * 24),
              offer.Beneficiary,
            ]
          )
        );

        await acceptBlockingOffer({
          mode: isProd ? "main" : "test",
          CollectionId: collection_id,
          TokenId: token_id,
          AcceptDuration: offer.AcceptDuration,
          PaymentToken: offer.PaymentToken,
          Price: offer.Price,
          Beneficiary: offer.Beneficiary,
          CollateralPercent: offer.CollateralPercent,
          TotalCollateralPercent: offer.CollateralPercent,
          ReservePeriod: offer.ReservePeriod,
          from: account,
          to: offer.Beneficiary,
          hash: contractResponse.hash,
          notificationMode: 2,
        });
        let newNft = { ...nft };
        newNft.status = ["Blocked"];
        newNft.blockingBuyOffers = newNft.blockingBuyOffers.filter(
          el => el.Beneficiary !== offer.Beneficiary
        );
        newNft.blockingSalesHistories.unshift({
          id: offerId,
          PaymentToken: offer.PaymentToken,
          Price: offer.Price,
          Beneficiary: offer.Beneficiary,
          CollateralPercent: offer.CollateralPercent,
          TotalCollateralPercent: offer.CollateralPercent,
          ReservePeriod: offer.ReservePeriod,
          from: account,
          hash: contractResponse.hash,
          created: new Date().getTime(),
        });
        setTransactionSuccess(true);
        setNft(newNft);
        handleRefresh();
        handleClose();
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to make an offer", { variant: "error" });
      }
    } catch (err) {
      showAlertMessage("Failed to accept blocking offer, Please try again", { variant: "error" });
    }
  };

  const handleClickLink = _hash => {
    if (selectedChain.name === "POLYGON") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${_hash}`, "_blank");
    } else if (selectedChain.name === "ETHEREUM") {
      window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${_hash}`, "_blank");
    }
  };

  return (
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={handleCloseModal}
        showCloseIcon
        className={classes.container}
        style={{
          maxWidth: 508,
        }}
      >
        <Box style={{ padding: "25px" }}>
          <Box fontSize="24px" color="#ffffff" style={{ textTransform: "uppercase" }} fontFamily="GRIFTER">
            Accept Blocking Offer
          </Box>
          <Box className={classes.description}>
            {`Accept blocking offer from user `}
            <span
              style={{ cursor: "pointer" }}
              className={classes.gradientText}
              onClick={() => offer.userInfo && history.push(`/profile/${offer.userInfo.urlSlug}`)}
            >
              {offer.userInfo?.name ?? getAbbrAddress(offer.Beneficiary, 6, 3)}
            </span>
            {` to block the `}
            <span className={classes.gradientText}>{nft.name}</span>
          </Box>
          <Box className={classes.borderBox}>
            <Box className={classes.box}>
              <Box className={classes.infoRow}>
                <span className={classes.infoLabel}>Price</span>
                <span className={classes.infoValue}>{`${offer.Price} ${getTokenSymbol(
                  offer.PaymentToken
                )}`}</span>
              </Box>
              <Box className={classes.infoRow} mt={1}>
                <span className={classes.infoLabel}>Blocking Period</span>
                <span className={classes.infoValue}>{`${offer.ReservePeriod} Day(s)`}</span>
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleApprove}
              disabled={isApproved}
            >
              {isApproved ? "Approved" : "Approve"}
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleAccept}
              disabled={!isApproved}
            >
              Accept Offer
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
