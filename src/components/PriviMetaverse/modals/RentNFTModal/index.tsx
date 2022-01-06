import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router";

import Box from "shared/ui-kit/Box";
import { Modal } from "shared/ui-kit";
import { PrimaryButton } from "shared/ui-kit";
import { RentNFTModalStyles } from "./index.style";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "../TransactionProgressModal";

import { BlockchainNets } from "shared/constants/constants";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { toDecimals, toNDecimals, toSeconds } from "shared/functions/web3";
import { rentNFT } from "shared/services/API/ReserveAPI";
import { formatDuration } from "shared/helpers/utils";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";

const SECONDS_PER_DAY = 86400;
const isProd = process.env.REACT_APP_ENV === "prod";

export default function RentNFTModal({ open, handleClose = () => {}, offer, nft, setNft }) {
  const classes = RentNFTModalStyles();
  const { account, library, chainId } = useWeb3React();
  const { collection_id, token_id } = useParams();

  const [maxDays, setMaxDays] = useState<number>(0);
  const [maxHours, setMaxHours] = useState<number>(0);
  const [maxMins, setMaxMins] = useState<number>(0);
  const [maxSeconds, setMaxSeconds] = useState<number>(0);
  const [limitDays, setLimitDays] = useState<number>(0);
  const [limitHour, setLimitHour] = useState<number>(0);
  const [limitMin, setLimitMin] = useState<number>(0);
  const [limitSec, setLimitSec] = useState<number>(0);
  const [balance, setBalance] = React.useState<number>(0);
  const [rentalToken, setRentalToken] = useState<any>();
  const rentalTime = React.useMemo(
    () => toSeconds(limitDays, limitHour, limitMin, limitSec),
    [limitDays, limitHour, limitMin, limitSec]
  );

  const [isApproved, setIsApproved] = useState<boolean>(false);

  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals;
  };

  const price = offer
    ? Math.ceil(+toDecimals(offer.pricePerSecond ?? 0, getTokenDecimal(offer.fundingToken)) * rentalTime)
    : 0;

  useEffect(() => {
    if (!open) return;

    getBalance();
  }, [open, offer, selectedChain]);

  const getBalance = async () => {
    if (tokenList && offer && library) {
      const targetChain = BlockchainNets.find(net => net.value === nft.chain);
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target network", { variant: "error" });
          return;
        }
      }

      const token = tokenList.find(v => v.Address === offer.fundingToken);
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20[token?.Symbol || "ETH"]?.decimals(web3, token?.Address);
      const balance = await web3APIHandler.Erc20[token?.Symbol || "ETH"]?.balanceOf(web3, {
        account,
      });
      setRentalToken(token);
      setBalance(+toDecimals(balance, decimals));

      const maxSeconds = Math.min(Math.floor(balance / offer.pricePerSecond), offer.maximumRentTime);
      setMaxDays(Math.floor(maxSeconds / (3600 * 24)));
      setMaxHours(Math.floor(maxSeconds / 3600));
      setMaxMins(Math.floor(maxSeconds / 60));
      setMaxSeconds(Math.floor(maxSeconds % 60));
    }
  };

  useEffect(() => {
    if (nft) {
      setSelectedChain(getChainForNFT(nft));
    }
  }, [nft]);

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
    }
  }, [open]);

  const handleApprove = async () => {
    try {
      if (isApproved) {
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
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      let balance = await web3APIHandler.Erc20[rentalToken.Symbol].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[rentalToken.Symbol].decimals(web3, { account });
      balance = balance / Math.pow(10, decimals);

      if (balance < (price || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      let approved = await web3APIHandler.Erc20[rentalToken.Symbol].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.RENTAL_MANAGER,
        toNDecimals(price, rentalToken.Decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${price} ${rentalToken.Symbol}!`, {
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
      if (!isApproved) {
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
      const response = await web3APIHandler.RentalManager.rentNFT(
        web3,
        account!,
        {
          collectionId: collection_id,
          tokenId: token_id,
          maximumRentalTime: offer.maximumRentTime,
          pricePerSecond: offer.pricePerSecond,
          rentalExpiration: offer.rentalExpiration,
          fundingToken: offer.fundingToken,
          operator: offer.owner,
          rentalTime: Math.ceil(rentalTime),
        },
        setHash
      );

      if (response.success) {
        const offer = response.offer;
        if (!offer) {
          setTransactionSuccess(false);
          showAlertMessage("Failed to rent NFT", { variant: "error" });
          return;
        }
        setTransactionSuccess(true);

        const nftRentedOffer = {
          mode: isProd ? "main" : "test",
          collection: offer.collection,
          fundingToken: rentalToken.Address,
          operator: offer.operator,
          pricePerSecond: offer.pricePerSecond,
          rentalExpiration: offer.rentalExpiration,
          rentalTime: offer.rentalTime,
          syntheticID: offer.syntheticID,
          tokenId: offer.tokenId,
          offerer: account,
          hash: offer.hash,
        };

        await rentNFT(nftRentedOffer);
        let newNft = { ...nft };
        newNft.status = "Rented";
        newNft.rentSaleOffer = null;
        newNft.rentHistories.unshift({
          id: offer.syntheticID,
          fundingToken: rentalToken.Address,
          operator: offer.operator,
          pricePerSecond: offer.pricePerSecond,
          rentalExpiration: offer.rentalExpiration,
          rentalTime: offer.rentalTime,
          offerer: account,
          hash: offer.hash,
          created: new Date().getTime(),
        });
        setNft(newNft);
        handleClose();
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to rent NFT", { variant: "error" });
      }
    } catch (err) {
      showAlertMessage("Something went wrong. Please try again!", {
        variant: "error",
      });
    }
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const setRentalTimeAsMax = () => {
    if (maxDays > 0) {
      setLimitDays(maxDays);
    } else if (maxHours > 0) {
      setLimitHour(maxHours);
    } else if (maxMins > 0) {
      setLimitMin(maxMins);
    } else {
      setLimitSec(maxSeconds);
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
          <Box fontSize="24px" color="#431AB7">
            Rent NFT
          </Box>
          <Box mt="12px">Accept the Owner price and rent the NFT.</Box>
          <Box className={classes.purpleText} mb="15px">
            By renting you will receive NFT Synthetic to use however you need.
          </Box>
          <Box display="flex" justifyContent="space-between" mt="27px" mb="7px">
            <Box className={classes.nameField}>Rental Time</Box>
            <Box className={classes.maxTime} onClick={setRentalTimeAsMax}>
              Max {maxDays > 0 ? `${maxDays} days` : maxHours > 0 ? `${maxHours} hours` : `${maxMins} mins`}
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            {maxDays > 0 && (
              <InputWithLabelAndTooltip
                inputValue={limitDays}
                onInputValueChange={e => setLimitDays(+e.target.value)}
                overriedClasses={classes.inputDays}
                required
                type="number"
                theme="light"
                maxValue={maxDays}
                minValue={0}
                endAdornment={<div className={classes.inputLabel}>DAYS</div>}
                disabled={isApproved}
              />
            )}
            {maxHours > 0 && (
              <InputWithLabelAndTooltip
                inputValue={limitHour}
                onInputValueChange={e => setLimitHour(+e.target.value)}
                overriedClasses={classes.inputDays}
                required
                type="number"
                theme="light"
                maxValue={24}
                minValue={0}
                endAdornment={<div className={classes.inputLabel}>h</div>}
                disabled={isApproved}
              />
            )}
            <InputWithLabelAndTooltip
              inputValue={limitMin}
              onInputValueChange={e => setLimitMin(+e.target.value)}
              overriedClasses={classes.inputDays}
              required
              type="number"
              theme="light"
              maxValue={60}
              minValue={0}
              endAdornment={<div className={classes.inputLabel}>min</div>}
              disabled={isApproved}
            />
            <InputWithLabelAndTooltip
              inputValue={limitSec}
              onInputValueChange={e => setLimitSec(+e.target.value)}
              overriedClasses={classes.inputDays}
              required
              type="number"
              theme="light"
              maxValue={60}
              minValue={0}
              endAdornment={<div className={classes.inputLabel}>sec</div>}
              disabled={isApproved}
            />
          </Box>
          <Box className={classes.box}>
            <Box display="flex" flexDirection="column">
              <span className={classes.purpleText}>Amount to pay</span>
              <span className={classes.purpleText} style={{ fontFamily: "Agrandir GrandHeavy" }}>
                {`${price} ${rentalToken?.Symbol ?? ""}`}
              </span>
            </Box>
            <Box display="flex" flexDirection="column">
              <span className={classes.purpleText}>Max rental time</span>
              <span className={classes.purpleText} style={{ fontFamily: "Agrandir GrandHeavy" }}>
                {formatDuration((offer?.maximumRentTime ?? 0) * 1000)}
              </span>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gridColumnGap="10px"
            fontSize="14px"
            color="#431AB7"
            my={2}
            ml={2}
          >
            <span>Wallet Balance</span>
            <Box fontWeight="700">{`${balance.toFixed()} ${rentalToken?.Symbol ?? ""}`}</Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleApprove}
              style={{ backgroundColor: isApproved ? "#431AB750" : "#431AB7" }}
            >
              Approve
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleConfirm}
              style={{ backgroundColor: !isApproved ? "#431AB750" : "#431AB7" }}
            >
              Confirm Offer
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
