import React, { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { toDecimals } from "shared/functions/web3";

import Box from "shared/ui-kit/Box";
import { PrimaryButton, Text } from "shared/ui-kit";
import { useAuth } from "shared/contexts/AuthContext";

import BlockNFTModal from "components/PriviMetaverse/modals/BlockNFTModal";
import InstantBuyModal from "components/PriviMetaverse/modals/InstantBuyModal";
import RentNFTModal from "components/PriviMetaverse/modals/RentNFTModal";
import EditSellingPriceModal from "components/PriviMetaverse/modals/EditSellingPriceModal";
import EditBlockingPriceModal from "components/PriviMetaverse/modals/EditBlockingPriceModal";
import EditRentPriceModal from "components/PriviMetaverse/modals/EditRentPriceModal";
import SetBlockingPriceModal from "components/PriviMetaverse/modals/SetBlockingPriceModal";
import SetRentPriceModal from "components/PriviMetaverse/modals/SetRentPriceModal";
import CancelBlockingPriceModal from "components/PriviMetaverse/modals/CancelBlockingPriceModal";
import CancelRentPriceModal from "components/PriviMetaverse/modals/CancelRentPriceModal";
import SetSellingPriceModal from "components/PriviMetaverse/modals/SetSellingPriceModal";
import CancelSellingPriceModal from "components/PriviMetaverse/modals/CancelSellingPriceModal";

import { exploreOptionDetailPageStyles } from "../../index.styles";

export default ({ isOwnership, nft, setNft, refresh }) => {
  const classes = exploreOptionDetailPageStyles();
  const { isSignedin } = useAuth();

  const [openEditSellingPriceModal, setOpenEditSellingPriceModal] = useState<boolean>(false);
  const [openSetSellingPriceModal, setOpenSetSellingPriceModal] = useState<boolean>(false);
  const [openCancelSellingPriceModal, setOpenCancelSellingPriceModal] = useState<boolean>(false);
  const [openInstantModal, setOpenInstantModal] = useState<boolean>(false);

  const [openSetBlockingPriceModal, setOpenSetBlockingPriceModal] = useState<boolean>(false);
  const [openCancelBlockingPriceModal, setOpenCancelBlockingPriceModal] = useState<boolean>(false);
  const [openEditBlockingPriceModal, setOpenEditBlockingPriceModal] = useState<boolean>(false);
  const [openReserveNftModal, setOpenReserveNftModal] = useState<boolean>(false);

  const [openSetRentPriceModal, setOpenSetRentPriceModal] = useState<boolean>(false);
  const [openCancelRentPriceModal, setOpenCancelRentPriceModal] = useState<boolean>(false);
  const [openEditRentPriceModal, setOpenEditRentPriceModal] = useState<boolean>(false);

  const [openRentNFTModal, setOpenRentNFTModal] = useState<boolean>(false);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return null;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals ?? 1;
  };

  const handleInstantBuy = () => {
    setOpenInstantModal(false);
    refresh();
  };

  return (
    <>
      <Box display="flex">
        <Text
          style={{
            fontSize: "18px",
            color: "white",
            fontWeight: 700,
            fontFamily: "GRIFTER",
          }}
        >
          Live Pricing Details
        </Text>
      </Box>
      <Box display="flex" justifyContent="space-between" my={3.5}>
        <Text className={classes.pricingText1}>Selling Price:</Text>
        <Box textAlign="right">
          {isOwnership && nft?.sellingOffer?.Price && (
            <Text className={classes.pricingText2}>
              {nft?.sellingOffer?.Price &&
                `${nft.sellingOffer.Price} ${getTokenSymbol(nft.sellingOffer.PaymentToken)}`}
            </Text>
          )}
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            {isOwnership ? (
              nft?.sellingOffer?.Price ? (
                <Box display="flex" alignItems="space-between" marginTop="10px">
                  <PrimaryButton
                    size="small"
                    className={classes.cancelBtn}
                    onClick={() => {
                      setOpenCancelSellingPriceModal(true);
                    }}
                  >
                    CANCEL
                  </PrimaryButton>
                  <PrimaryButton
                    size="small"
                    className={classes.pricingButton}
                    onClick={() => {
                      setOpenEditSellingPriceModal(true);
                    }}
                  >
                    EDIT
                  </PrimaryButton>
                </Box>
              ) : (
                <>
                  <Text className={classes.pricingText2}>
                    {nft?.sellingOffer?.Price &&
                      `${nft.sellingOffer.Price} ${getTokenSymbol(nft.sellingOffer.PaymentToken)}`}
                  </Text>
                  &nbsp;
                  <PrimaryButton
                    size="small"
                    className={classes.pricingButton}
                    onClick={() => {
                      setOpenSetSellingPriceModal(true);
                    }}
                  >
                    SET
                  </PrimaryButton>
                </>
              )
            ) : nft?.sellingOffer?.Price && isSignedin ? (
              <>
                <Text className={!nft?.status ? classes.pricingText2 : classes.pricingText2Disable}>
                  {nft?.sellingOffer?.Price &&
                    `${nft.sellingOffer.Price} ${getTokenSymbol(nft.sellingOffer.PaymentToken)}`}
                </Text>
                &nbsp;
                <PrimaryButton
                  size="small"
                  className={classes.pricingButton}
                  onClick={() => {
                    setOpenInstantModal(true);
                  }}
                  disabled={nft?.status}
                  style={{
                    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%) !important",
                  }}
                >
                  BUY
                </PrimaryButton>
              </>
            ) : (
              <Text className={!nft?.status ? classes.pricingText2 : classes.pricingText2Disable}>
                Not Available
              </Text>
            )}
          </Box>
        </Box>
      </Box>
      <hr className={classes.divider} />
      <Box display="flex" justifyContent="space-between" mb={3.5} mt={2.5}>
        <Text className={classes.pricingText1}>Blocking Price:</Text>
        <Box textAlign="right">
          {isOwnership && nft?.blockingSaleOffer?.Price && (
            <Text className={classes.pricingText2}>
              {nft?.blockingSaleOffer?.Price &&
                `${nft.blockingSaleOffer.Price} ${getTokenSymbol(nft.blockingSaleOffer.PaymentToken)} for ${
                  nft.blockingSaleOffer.ReservePeriod
                } Day(s)`}
            </Text>
          )}
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            {isOwnership ? (
              nft?.blockingSaleOffer?.Price ? (
                <Box display="flex" alignItems="space-between" marginTop="10px">
                  <PrimaryButton
                    size="small"
                    className={classes.cancelBtn}
                    onClick={() => {
                      setOpenCancelBlockingPriceModal(true);
                    }}
                  >
                    CANCEL
                  </PrimaryButton>
                  <PrimaryButton
                    size="small"
                    className={classes.pricingButton}
                    onClick={() => {
                      setOpenEditBlockingPriceModal(true);
                    }}
                  >
                    EDIT
                  </PrimaryButton>
                </Box>
              ) : (
                <>
                  <Text className={classes.pricingText2}>
                    {nft?.blockingSaleOffer?.Price &&
                      `${nft.blockingSaleOffer.Price} ${getTokenSymbol(
                        nft.blockingSaleOffer.PaymentToken
                      )} for ${nft.blockingSaleOffer.ReservePeriod} Day(s)`}
                  </Text>
                  &nbsp;
                  <PrimaryButton
                    size="small"
                    className={classes.pricingButton}
                    onClick={() => {
                      setOpenSetBlockingPriceModal(true);
                    }}
                  >
                    SET
                  </PrimaryButton>
                </>
              )
            ) : nft?.blockingSaleOffer?.Price && isSignedin ? (
              <>
                <Text className={!nft?.status ? classes.pricingText2 : classes.pricingText2Disable}>
                  {nft?.blockingSaleOffer?.Price &&
                    `${nft.blockingSaleOffer.Price} ${getTokenSymbol(
                      nft.blockingSaleOffer.PaymentToken
                    )} for ${nft.blockingSaleOffer.ReservePeriod} Day(s)`}
                </Text>
                &nbsp;
                <PrimaryButton
                  size="small"
                  className={classes.pricingButton}
                  onClick={() => {
                    setOpenReserveNftModal(true);
                  }}
                  disabled={nft?.status}
                >
                  Block
                </PrimaryButton>
              </>
            ) : (
              <Text className={!nft?.status ? classes.pricingText2 : classes.pricingText2Disable}>
                Not Available
              </Text>
            )}
          </Box>
        </Box>
      </Box>
      <hr className={classes.divider} />
      <Box display="flex" justifyContent="space-between" mb={3.5} mt={2.5}>
        <Text className={classes.pricingText1}>Rental Price:</Text>
        <Box>
          {isOwnership && nft?.rentSaleOffer?.pricePerSecond && (
            <Text className={classes.pricingText2}>
              {nft?.rentSaleOffer?.pricePerSecond &&
                `${(
                  +toDecimals(
                    nft.rentSaleOffer.pricePerSecond,
                    getTokenDecimal(nft.rentSaleOffer.fundingToken)
                  ) * 1440
                ).toFixed(2)} ${getTokenSymbol(nft.rentSaleOffer.fundingToken)} / hour`}
            </Text>
          )}
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            {isOwnership ? (
              nft?.rentSaleOffer?.pricePerSecond ? (
                <Box display="flex" alignItems="space-between" marginTop="10px">
                  <PrimaryButton
                    size="small"
                    className={classes.cancelBtn}
                    onClick={() => {
                      setOpenCancelRentPriceModal(true);
                    }}
                  >
                    CANCEL
                  </PrimaryButton>
                  <PrimaryButton
                    size="small"
                    className={classes.pricingButton}
                    onClick={() => {
                      setOpenEditRentPriceModal(true);
                    }}
                  >
                    EDIT
                  </PrimaryButton>
                </Box>
              ) : (
                <>
                  <Text className={classes.pricingText2}>
                    {nft?.rentSaleOffer?.pricePerSecond &&
                      `${(
                        +toDecimals(
                          nft.rentSaleOffer.pricePerSecond,
                          getTokenDecimal(nft.rentSaleOffer.fundingToken)
                        ) * 1440
                      ).toFixed(3)} ${getTokenSymbol(nft.rentSaleOffer.fundingToken)} / hour`}
                  </Text>
                  &nbsp;
                  <PrimaryButton
                    size="small"
                    className={classes.pricingButton}
                    onClick={() => {
                      setOpenSetRentPriceModal(true);
                    }}
                  >
                    SET
                  </PrimaryButton>
                </>
              )
            ) : nft?.rentSaleOffer?.pricePerSecond && isSignedin ? (
              <>
                <Text className={!nft?.status ? classes.pricingText2 : classes.pricingText2Disable}>
                  {nft?.rentSaleOffer?.pricePerSecond &&
                    `${(
                      +toDecimals(
                        nft.rentSaleOffer.pricePerSecond,
                        getTokenDecimal(nft.rentSaleOffer.fundingToken)
                      ) * 1440
                    ).toFixed(3)} ${getTokenSymbol(nft.rentSaleOffer.fundingToken)} / hour`}
                </Text>
                &nbsp;
                <PrimaryButton
                  size="small"
                  className={classes.pricingButton}
                  onClick={() => {
                    setOpenRentNFTModal(true);
                  }}
                >
                  Rent
                </PrimaryButton>
              </>
            ) : (
              <Text className={!nft?.status ? classes.pricingText2 : classes.pricingText2Disable}>
                Not Available
              </Text>
            )}
          </Box>
        </Box>
      </Box>
      <hr className={classes.divider} />
      <InstantBuyModal
        open={openInstantModal}
        handleClose={() => setOpenInstantModal(false)}
        onConfirm={handleInstantBuy}
        offer={nft.sellingOffer}
        nft={nft}
      />
      <SetSellingPriceModal
        open={openSetSellingPriceModal}
        handleClose={() => setOpenSetSellingPriceModal(false)}
        nft={nft}
        setNft={setNft}
      />
      <CancelSellingPriceModal
        open={openCancelSellingPriceModal}
        handleClose={() => setOpenCancelSellingPriceModal(false)}
        offer={nft.sellingOffer}
        nft={nft}
        setNft={setNft}
      />
      <EditSellingPriceModal
        open={openEditSellingPriceModal}
        handleClose={() => setOpenEditSellingPriceModal(false)}
        offer={nft.sellingOffer}
        nft={nft}
        setNft={setNft}
      />
      <BlockNFTModal
        open={openReserveNftModal}
        handleClose={() => setOpenReserveNftModal(false)}
        nft={nft}
        setNft={setNft}
        onConfirm={() => {
          setOpenReserveNftModal(false);
          refresh();
        }}
      />
      <SetBlockingPriceModal
        open={openSetBlockingPriceModal}
        handleClose={() => setOpenSetBlockingPriceModal(false)}
        nft={nft}
        setNft={setNft}
      />
      <CancelBlockingPriceModal
        open={openCancelBlockingPriceModal}
        handleClose={() => setOpenCancelBlockingPriceModal(false)}
        offer={nft.blockingSaleOffer}
        nft={nft}
        setNft={setNft}
      />
      <EditBlockingPriceModal
        open={openEditBlockingPriceModal}
        handleClose={() => setOpenEditBlockingPriceModal(false)}
        offer={nft.blockingSaleOffer}
        nft={nft}
        setNft={setNft}
      />
      <SetRentPriceModal
        open={openSetRentPriceModal}
        handleClose={() => setOpenSetRentPriceModal(false)}
        nft={nft}
        setNft={setNft}
      />
      <CancelRentPriceModal
        open={openCancelRentPriceModal}
        handleClose={() => setOpenCancelRentPriceModal(false)}
        offer={nft.rentSaleOffer}
        nft={nft}
        setNft={setNft}
      />
      <EditRentPriceModal
        open={openEditRentPriceModal}
        handleClose={() => setOpenEditRentPriceModal(false)}
        offer={nft.rentSaleOffer}
        nft={nft}
        setNft={setNft}
      />
      <RentNFTModal
        open={openRentNFTModal}
        handleClose={() => setOpenRentNFTModal(false)}
        offer={nft.rentSaleOffer}
        nft={nft}
        setNft={setNft}
      />
    </>
  );
};
