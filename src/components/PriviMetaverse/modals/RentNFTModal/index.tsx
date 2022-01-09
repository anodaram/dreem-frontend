import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import Box from "shared/ui-kit/Box";
import { Modal } from "shared/ui-kit";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { toDecimals, toNDecimals, toSeconds } from "shared/functions/web3";
import { rentNFT } from "shared/services/API/ReserveAPI";
import { formatDuration } from "shared/helpers/utils";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import TransactionProgressModal from "../TransactionProgressModal";
import { RentNFTModalStyles } from "./index.style";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function RentNFTModal({ open, handleClose = () => {}, offer, nft, setNft }) {
  const classes = RentNFTModalStyles();
  const { account, library, chainId } = useWeb3React();
  const { collection_id, token_id } = useParams<{ collection_id: string; token_id: string }>();

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
    ? (+toDecimals(offer.pricePerSecond ?? 0, getTokenDecimal(offer.fundingToken)) * rentalTime).toFixed(3)
    : 0;

  useEffect(() => setSelectedChain(getChainForNFT(nft)), [nft]);

  useEffect(() => {
    (async () => {
      if (chainId && selectedChain && chainId !== selectedChain?.chainId) {
        const isHere = await switchNetwork(selectedChain?.chainId || 0);

        if (!isHere) {
          showAlertMessage("Got failed while switching over to target network", { variant: "error" });
          return;
        }
      }
    })();
  }, [chainId, selectedChain]);

  useEffect(() => {
    if (!open) return;

    getBalance();
  }, [open, offer, selectedChain]);

  const getBalance = async () => {
    if (tokenList && offer && library) {
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

      if (!(limitDays || limitHour || limitMin || limitSec)) {
        showAlertMessage("Please fill all fields to proceed", { variant: "error" });
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

      if (!(limitDays || limitHour || limitMin || limitSec)) {
        showAlertMessage("Please fill all fields to proceed", { variant: "error" });
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
          collectionId: nft.Address,
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
          collection: collection_id,
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

  const resetRentalTime = () => {
    setLimitDays(0);
    setLimitHour(0);
    setLimitMin(0);
    setLimitSec(0);
  };

  const setRentalTimeAsMax = () => {
    resetRentalTime();
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
          <Box className={classes.title}>Rent Game NFT</Box>
          <Box className={classes.subTitle} mt="12px">
            You must approve the rental time and price in order to rent this NFT.
          </Box>
          <Box className={classes.subTitle} mb="40px">
            By approving this, you are agreeing to receive a synthetic NFT to use as the original for the allotted time.
          </Box>
          <Box display="flex" justifyContent="space-between" mb="7px">
            <Box className={classes.nameField}>Rental Time</Box>
            <Box className={classes.maxTime} onClick={setRentalTimeAsMax}>
              Max {maxDays > 0 ? `${maxDays} days` : maxHours > 0 ? `${maxHours} hours` : `${maxMins} mins`}
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            {maxDays > 0 && (
              <InputWithLabelAndTooltip
                inputValue={limitDays}
                onInputValueChange={e => setLimitDays(e.target.value)}
                overriedClasses={classes.inputDays}
                required
                type="number"
                theme="light"
                maxValue={maxDays}
                minValue={0}
                endAdornment={<div className={classes.inputLabel}>DAYS</div>}
                disabled={isApproved}
                style={{ marginRight: "8px" }}
                placeHolder="00"
              />
            )}
            {maxHours > 0 && (
              <InputWithLabelAndTooltip
                inputValue={limitHour}
                onInputValueChange={e => setLimitHour(e.target.value)}
                overriedClasses={classes.inputDays}
                required
                type="number"
                theme="light"
                maxValue={24}
                minValue={0}
                endAdornment={<div className={classes.inputLabel}>h</div>}
                disabled={isApproved}
                style={{ marginRight: "8px" }}
                placeHolder="00"
              />
            )}
            <InputWithLabelAndTooltip
              inputValue={limitMin}
              onInputValueChange={e => setLimitMin(e.target.value)}
              overriedClasses={classes.inputDays}
              required
              type="number"
              theme="light"
              maxValue={60}
              minValue={0}
              endAdornment={<div className={classes.inputLabel}>min</div>}
              disabled={isApproved}
              style={{ marginRight: "8px" }}
              placeHolder="00"
            />
            <InputWithLabelAndTooltip
              inputValue={limitSec}
              onInputValueChange={e => setLimitSec(e.target.value)}
              overriedClasses={classes.inputDays}
              required
              type="number"
              theme="light"
              maxValue={60}
              minValue={0}
              endAdornment={<div className={classes.inputLabel}>sec</div>}
              disabled={isApproved}
              placeHolder="00"
            />
          </Box>
          <Box className={classes.borderBox}>
            <Box className={classes.box}>
              <Box display="flex" flexDirection="column">
                <span className={classes.amountLabel}>Amount to pay</span>
                <span className={classes.purpleText}>{`${price} ${rentalToken?.Symbol ?? "USDT"}`}</span>
              </Box>
              <Box display="flex" flexDirection="column">
                <span className={classes.amountLabel}>Max rental time</span>
                <span className={classes.purpleText}>
                  {`${formatDuration((offer?.maximumRentTime ?? 0) * 1000) ?? "0 seconds"}`}
                </span>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gridColumnGap="10px"
            fontSize="14px"
            color="#E9FF26"
            my={2}
            ml={2}
          >
            <span>Wallet Balance</span>
            <Box fontWeight="700">{`${balance.toFixed() ?? "0.00"} ${rentalToken?.Symbol ?? "USDT"}`}</Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleApprove}
              disabled={isApproved}
            >
              Approve
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              onClick={handleConfirm}
              disabled={!isApproved}
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
