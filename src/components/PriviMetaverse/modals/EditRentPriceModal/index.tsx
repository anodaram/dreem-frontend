import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router";
import DateFnsUtils from "@date-io/date-fns";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { Grid } from "@material-ui/core";
import { EditRentPriceModalStyles } from "./index.style";
import TransactionProgressModal from "../TransactionProgressModal";

import { BlockchainNets } from "shared/constants/constants";
import { cancelListOffer, createListOffer } from "shared/services/API/ReserveAPI";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { getNextDay } from "shared/helpers/utils";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function EditRentPriceModal({ open, offer, handleClose = () => {}, nft, setNft }) {
  const classes = EditRentPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const { collection_id, token_id } = useParams();
  const [pricePerSec, setPricePerSec] = useState<number>(0);

  const [maxRentalTime, setMaxRentalTime] = useState<any>();
  const [limitDays, setLimitDays] = useState<number>(0);
  const [limitHour, setLimitHour] = useState<number>(0);
  const [limitMin, setLimitMin] = useState<number>(0);
  const [limitSec, setLimitSec] = useState<number>(0);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [rentalToken, setRentalToken] = useState<any>(tokenList[0]);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    setIsCancelled(false);
    setIsApproved(false);
  }, [open]);

  useEffect(() => {
    setRentalToken(tokenList[0])
  }, [tokenList])

  useEffect(() => {
    if (!open) {
      setIsApproved(false);
      return;
    }

    if (selectedChain && nft && selectedChain.value !== nft.chain) {
      setSelectedChain(filteredBlockchainNets.find(b => b.value === nft.chain));
    }
  }, [nft, selectedChain, open]);

  const handleApprove = async () => {
    try {
      if (isApproved) {
        return;
      }

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

      setOpenTransactionModal(true);
      const web3Config = nftChain.config;
      const web3APIHandler = nftChain.apiHandler;
      const web3 = new Web3(library.provider);
      let approved = await web3APIHandler.Erc721.approve(web3, account || "", {
        to: web3Config.CONTRACT_ADDRESSES.RENTAL_MANAGER,
        tokenId: token_id,
        nftAddress: collection_id,
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
    try {
      if (!isApproved) {
        return;
      }
      setOpenTransactionModal(true);
      if (chainId !== BlockchainNets[1].chainId && chainId !== BlockchainNets[2].chainId) {
        showAlertMessage(`network error`, { variant: "error" });
        return;
      }
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      const response = await web3APIHandler.RentalManager.listOffer(
        web3,
        account!,
        {
          collectionId: collection_id,
          tokenId: token_id,
          maximumRentalTime: toSeconds(limitDays, limitHour, limitMin, limitSec),
          pricePerSecond: toNDecimals(pricePerSec, rentalToken.Decimals),
          rentalExpiration: getNextDay(maxRentalTime),
          fundingToken: rentalToken.Address,
        },
        setHash
      );

      if (response.success) {
        const offer = response.offer;
        if (!offer) {
          setTransactionSuccess(false);
          showAlertMessage("Failed to make an offer", { variant: "error" });
          return;
        }
        setTransactionSuccess(true);
        const newOffer = {
          mode: isProd ? "main" : "test",
          collection: collection_id,
          maximumRentTime: offer.maximumRentTime,
          owner: offer.owner,
          pricePerSecond: offer.pricePerSecond,
          rentalExpiration: offer.rentalExpiration,
          tokenId: token_id,
          fundingToken: rentalToken.Address,
          hash: offer.hash,
        };
        await createListOffer(newOffer);
        let newNft = { ...nft };
        newNft.rentSaleOffer = {
          maximumRentTime: offer.maximumRentTime,
          owner: offer.owner,
          pricePerSecond: offer.pricePerSecond,
          rentalExpiration: offer.rentalExpiration,
          fundingToken: rentalToken.Address,
          hash: offer.hash,
        };
        setNft(newNft);
        handleClose();
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to list an offer", { variant: "error" });
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

  const handleCancel = async () => {
    if (chainId !== BlockchainNets[1].chainId && chainId !== BlockchainNets[2].chainId) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }

    try {
      setOpenTransactionModal(true);
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      const contractResponse = await web3APIHandler.RentalManager.cancelListOffer(
        web3,
        account!,
        {
          collectionId: collection_id,
          tokenId: token_id,
          maximumRentalTime: offer.maximumRentTime,
          pricePerSecond: offer.pricePerSecond,
          rentalExpiration: offer.rentalExpiration,
          fundingToken: offer.fundingToken,
        },
        setHash
      );

      if (contractResponse.success) {
        setTransactionSuccess(null);
        await cancelListOffer({
          mode: isProd ? "main" : "test",
          CollectionId: collection_id,
          TokenId: token_id,
        });
        let newNft = { ...nft };
        newNft.rentSaleOffer = null;
        setNft(newNft);
        setIsCancelled(true);
      } else {
        setTransactionSuccess(false);
      }
      setOpenTransactionModal(false);
    } catch (err) {
      showAlertMessage("Failed to decline cancel offer, Please try again", { variant: "error" });
    }
  };

  const toSeconds = (day, hour, min, sec) => {
    return day * 86400 + hour * 3600 + min * 60 + sec;
  };

  if (!isCancelled) {
    return (
      <>
        <Modal
          size="medium"
          isOpen={open}
          onClose={handleCloseModal}
          showCloseIcon
          className={classes.cancelModal}
        >
          <span className={classes.cancelTitle}>Are you sure you want to edit price? </span>
          <span className={classes.cancelDesc}>
            This process will require changes through smart contract that will take few moments.
          </span>
          <Box display="flex" alignItems="center" justifyContent="space-between" style={{ width: "80%" }}>
            <PrimaryButton size="medium" className={classes.cancelButton} onClick={handleClose}>
              Cancel
            </PrimaryButton>
            <PrimaryButton size="medium" className={classes.editPriceButton} onClick={handleCancel}>
              Yes, Edit Price
            </PrimaryButton>
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

  return (
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={handleCloseModal}
        showCloseIcon
        className={classes.container}
      >
        <Box style={{ padding: "25px" }}>
          <Box fontSize="24px" color="#431AB7">
            Edit Rental Price
          </Box>
          <Grid container spacing={2}>
            <Grid item sm={7}>
              <Box className={classes.nameField}>Price per second</Box>
            </Grid>
            <Grid item sm={5}>
              <Box className={classes.nameField}>Rental Token</Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item sm={7}>
              <InputWithLabelAndTooltip
                inputValue={pricePerSec}
                onInputValueChange={e => setPricePerSec(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                disabled={isApproved}
              />
            </Grid>
            <Grid item sm={5}>
              <ReserveTokenSelect
                tokens={tokenList}
                value={rentalToken?.Address || ""}
                className={classes.inputJOT}
                onChange={e => {
                  setRentalToken(tokenList.find(v => v.Address === e.target.value));
                }}
                style={{ flex: "1" }}
                disabled={true}
              />
            </Grid>
          </Grid>
          <Box className={classes.nameField}>Max Rental Time Until</Box>
          <Box width="100%">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="dense"
                id="date-picker-inline"
                value={maxRentalTime}
                onChange={(date, _) => date && setMaxRentalTime(new Date(date?.getTime()))}
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
          <Box className={classes.nameField}>Limit rental time</Box>
          <Box display="flex" alignItems="center">
            <InputWithLabelAndTooltip
              inputValue={limitDays}
              onInputValueChange={e => setLimitDays(+e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.purpleText}>d</div>}
              disabled={isApproved}
            />
            <InputWithLabelAndTooltip
              inputValue={limitHour}
              onInputValueChange={e => setLimitHour(+e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.purpleText}>h</div>}
              disabled={isApproved}
            />
            <InputWithLabelAndTooltip
              inputValue={limitMin}
              onInputValueChange={e => setLimitMin(+e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.purpleText}>m</div>}
              disabled={isApproved}
            />
            <InputWithLabelAndTooltip
              inputValue={limitSec}
              onInputValueChange={e => setLimitSec(+e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.purpleText}>s</div>}
              disabled={isApproved}
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              style={{ backgroundColor: isApproved ? "#431AB750" : "#431AB7" }}
              onClick={handleApprove}
            >
              Approve
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              style={{ backgroundColor: !isApproved ? "#431AB750" : "#431AB7" }}
              onClick={handleConfirm}
            >
              Confirm Set
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
