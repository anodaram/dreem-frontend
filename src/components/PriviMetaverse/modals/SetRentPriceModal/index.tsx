import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router";
import DateFnsUtils from "@date-io/date-fns";
import { useSelector } from "react-redux";

import { Grid } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { createListOffer } from "shared/services/API/ReserveAPI";
import { toNDecimals } from "shared/functions/web3";
import { getNextDay } from "shared/helpers/utils";
import { RootState } from "store/reducers/Reducer";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import TransactionProgressModal from "../TransactionProgressModal";
import { SetRentPriceModalStyles } from "./index.style";

const isProd = process.env.REACT_APP_ENV === "prod";
const SECONDS_PER_HOUR = 3600;

export default function SetRentPriceModal({ open, handleClose = () => {}, nft, setNft }) {
  const classes = SetRentPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const { collection_id, token_id } = useParams<{ collection_id: string; token_id: string }>();
  const [pricePerHour, setPricePerHour] = useState<number>();

  const [maxRentalTime, setMaxRentalTime] = useState<any>(new Date());
  const [limitDays, setLimitDays] = useState<number>(0);
  const [limitHour, setLimitHour] = useState<number>(0);
  const [limitMin, setLimitMin] = useState<number>(0);
  const [limitSec, setLimitSec] = useState<number>(0);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [rentalToken, setRentalToken] = useState<any>(tokenList[0]);

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => setSelectedChain(getChainForNFT(nft)), [nft]);

  useEffect(() => {
    setRentalToken(tokenList[0]);
  }, [tokenList]);

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

      if (!pricePerHour || !(limitDays || limitHour || limitMin || limitSec)) {
        showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", {
          variant: "error",
        });
        return;
      }

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
        to: web3Config.CONTRACT_ADDRESSES.RENTAL_MANAGER,
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
    try {
      if (!isApproved) {
        return;
      }

      if (!pricePerHour || !(limitDays || limitHour || limitMin || limitSec)) {
        showAlertMessage("Hey there! Please make sure to fill out all fields before you proceed", {
          variant: "error",
        });
        return;
      }

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
      const web3 = new Web3(library.provider);
      const response = await web3APIHandler.RentalManager.listOffer(
        web3,
        account!,
        {
          collectionId: nft.Address,
          tokenId: token_id,
          maximumRentalTime: toSeconds(limitDays, limitHour, limitMin, limitSec),
          pricePerSecond: toNDecimals(pricePerHour / SECONDS_PER_HOUR, rentalToken.Decimals),
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

  const toSeconds = (day, hour, min, sec) => {
    return day * 86400 + hour * 3600 + min * 60 + sec;
  };

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
          <Box className={classes.title}>Set Rental Price</Box>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={7}>
              <Box className={classes.nameField}>
                <span>Price Per Hour</span>
                <InfoTooltip
                  tooltip={"Will be paid in full by the renter's wallet when rental period starts"}
                />
              </Box>
              <InputWithLabelAndTooltip
                inputValue={pricePerHour}
                onInputValueChange={e => setPricePerHour(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0.001}
                disabled={isApproved}
                placeHolder={"0"}
              />
            </Grid>
            <Grid item xs={6} sm={5}>
              <Box className={classes.nameField}>
                <span>Rental Token</span>
                <InfoTooltip tooltip={""} />
              </Box>
              <ReserveTokenSelect
                tokens={tokenList.filter(
                  token => token?.Network?.toLowerCase() === selectedChain?.name?.toLowerCase()
                )}
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
          <Box className={classes.nameField}>
            <span>Last day of rental before returning item</span>
            <InfoTooltip tooltip={"Your NFT will be available for rental till this date"} />
          </Box>
          <Box width="100%">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MMM/yyyy"
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
          <Box display="flex" alignItems="center" className={classes.nameField}>
            <span>Max duration of one rental</span>
            <InfoTooltip
              tooltip={
                "This is the maximum length of time you want to rent out your NFT. If you put 6 days, no one can rent it for 7."
              }
            />
          </Box>
          <Box display="flex" alignItems="center">
            <InputWithLabelAndTooltip
              inputValue={limitDays}
              onInputValueChange={e => setLimitDays(e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.suffixText}>DAYS</div>}
              disabled={isApproved}
              placeHolder={"00"}
            />
            <InputWithLabelAndTooltip
              inputValue={limitHour}
              onInputValueChange={e => setLimitHour(e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.suffixText}>HRS</div>}
              disabled={isApproved}
              style={{ marginLeft: "8px" }}
              placeHolder={"00"}
            />
            <InputWithLabelAndTooltip
              inputValue={limitMin}
              onInputValueChange={e => setLimitMin(e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.suffixText}>MINS</div>}
              disabled={isApproved}
              style={{ marginLeft: "8px" }}
              placeHolder={"00"}
            />
            <InputWithLabelAndTooltip
              inputValue={limitSec}
              onInputValueChange={e => setLimitSec(e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.suffixText}>SEC</div>}
              disabled={isApproved}
              style={{ marginLeft: "8px" }}
              placeHolder={"00"}
            />
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
              Confirm
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
