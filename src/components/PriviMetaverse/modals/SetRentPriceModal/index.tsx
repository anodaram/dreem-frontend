import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router";
import DateFnsUtils from "@date-io/date-fns";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { Grid, Tooltip, Fade } from "@material-ui/core";
import { SetRentPriceModalStyles } from "./index.style";
import TransactionProgressModal from "../TransactionProgressModal";

import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import { createListOffer } from "shared/services/API/ReserveAPI";
import { toNDecimals } from "shared/functions/web3";
import { getNextDay } from "shared/helpers/utils";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

const infoIcon = require("assets/icons/info_black.png");

const isProd = process.env.REACT_APP_ENV === "prod";

export default function SetRentPriceModal({ open, handleClose = () => {}, nft, setNft }) {
  const classes = SetRentPriceModalStyles();
  const { account, library, chainId } = useWeb3React();
  const { collection_id, token_id } = useParams();
  const [pricePerSec, setPricePerSec] = useState<number>(0);

  const [maxRentalTime, setMaxRentalTime] = useState<any>();
  const [limitDays, setLimitDays] = useState<number>(0);
  const [limitHour, setLimitHour] = useState<number>(0);
  const [limitMin, setLimitMin] = useState<number>(0);
  const [limitSec, setLimitSec] = useState<number>(0);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [rentalToken, setRentalToken] = useState<any>(tokenList[0]);

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    setRentalToken(tokenList[0]);
  }, [tokenList])

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
      const web3APIHandler = selectedChain.apiHandler;
      const web3Config = selectedChain.config;
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
          <Box fontSize="24px" color="#431AB7">
            Set Rental Price
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={7}>
              <Box display="flex" alignItems="center" className={classes.nameField}>
                <span>Price per second</span>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 400 }}
                  arrow
                  className={classes.tooltipHeaderInfo}
                  title='To be streamed from the renters wallet to yours on a second by second basis'
                >
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
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
            <Grid item xs={6} sm={5}>
              <Box className={classes.nameField}>Rental Token</Box>
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
          <Box display="flex" alignItems="center" className={classes.nameField}>
            <span>Max Rental Time</span>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 400 }}
              arrow
              className={classes.tooltipHeaderInfo}
              title='This is the maximum time a player can rent your NFT'
            >
              <img src={infoIcon} alt={"info"} />
            </Tooltip>
          </Box>
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
          <Box display="flex" alignItems="center" className={classes.nameField}>
            <span>Limit rental time</span>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 400 }}
              arrow
              className={classes.tooltipHeaderInfo}
              title='This is the minimum time allowed someone can rent your NFT. For example if you select 10 minutes, someone cannot rent it for 9 minutes'
            >
              <img src={infoIcon} alt={"info"} />
            </Tooltip>
          </Box>
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
