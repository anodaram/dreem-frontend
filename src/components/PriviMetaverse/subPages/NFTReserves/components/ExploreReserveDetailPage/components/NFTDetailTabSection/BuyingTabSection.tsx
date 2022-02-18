import React, { useState } from "react";
import { useHistory } from "react-router";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";

import { Accordion, AccordionDetails, AccordionSummary, Hidden } from "@material-ui/core";

import MakeBuyOfferModal from "components/PriviMetaverse/modals/MakeBuyOfferModal";
import BuyProceedModal from "components/PriviMetaverse/modals/BuyProceedModal";
import CancelBuyOfferModal from "components/PriviMetaverse/modals/CancelBuyOfferModal";
import { TagIcon, HistoryIcon, HideIcon, ShowIcon } from "./index";

import { PrimaryButton, Variant } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { visitProfile } from "shared/services/API/UserAPI";
import { getChainForNFT } from "shared/functions/metamask";
import { useAuth } from "shared/contexts/AuthContext";

import { exploreOptionDetailPageStyles } from "../../index.styles";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

const isProd = process.env.REACT_APP_ENV === "prod";

export default ({ offerData, historyData, isOwnership, nft, setNft }) => {
  const classes = exploreOptionDetailPageStyles();
  const history = useHistory();
  const { isSignedin } = useAuth();

  const [openMakeOfferModal, setOpenMakeOfferModal] = useState<boolean>(false);
  const [proceedItem, setProceedItem] = useState<any>(null);
  const [openCancelOfferModal, setOpenCancelOfferModal] = useState<boolean>(false);
  const [selectedOfferData, setSelectedOfferData] = useState<any>();
  const { account } = useWeb3React();
  const [selectedChain] = React.useState<any>(getChainForNFT(nft));
  const [isOfferExpanded, setIsOfferExpanded] = React.useState<boolean>(true);
  const [isHistoryExpaned, setIsHistoryExpanded] = React.useState<boolean>(true);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  const offerTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "USER",
    },
    {
      headerName: "PRICE",
      headerAlign: "center",
    },
    {
      headerName: "EXPIRATION DATE",
      headerAlign: "center",
    },
    {
      headerName:
        nft.Chain?.toLowerCase() === "mumbai" || nft.Chain?.toLowerCase() === "polygon"
          ? "POLYGONSCAN"
          : "BSCSCAN",
      headerAlign: isOwnership ? "left" : "center",
    },
  ];

  const historyTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "USER",
    },
    {
      headerName: "PRICE",
      headerAlign: "center",
    },
    {
      headerName: "DATE",
      headerAlign: "center",
    },
    {
      headerName:
        nft.Chain?.toLowerCase() === "mumbai" || nft.Chain?.toLowerCase() === "polygon"
          ? "POLYGONSCAN"
          : "BSCSCAN",
      headerAlign: "center",
    },
  ];

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const handleAcceptOffer = item => {
    setProceedItem(item);
  };

  const handleCancelOffer = item => {
    setOpenCancelOfferModal(true);
    setSelectedOfferData(item);
  };

  const handleClickLink = _hash => {
    if (selectedChain.name === "POLYGON") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${_hash}`, "_blank");
    } else if (selectedChain.name === "BSC") {
      window.open(`https://${!isProd ? "testnet." : ""}bscscan.com/tx/${_hash}`, "_blank");
    }
  };

  return (
    <>
      <div className={classes.transactionsSection}>
        <div className={classes.coinFlipHistorySection}>
          <Accordion expanded={isOfferExpanded} onChange={(e, expanded) => setIsOfferExpanded(expanded)}>
            <AccordionSummary
              expandIcon={
                <Box display="flex" alignItems="center" fontSize={14} width={56}>
                  <Box color="white" mr={1} >
                    Hide
                  </Box>
                  {isOfferExpanded ? <ShowIcon /> : <HideIcon />}
                </Box>
              }
              aria-controls="panel-content"
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <div className={classes.typo8}>
                  <TagIcon />
                  <span className={classes.gradientText}>Buy offers</span>
                </div>
                <Hidden xsDown>
                  {!isOwnership && isSignedin && (
                    <PrimaryButton
                      size="small"
                      className={classes.pricingButton}
                      onClick={event => {
                        event.stopPropagation();
                        setOpenMakeOfferModal(true);
                      }}
                    >
                      MAKE BUY OFFER
                    </PrimaryButton>
                  )}
                </Hidden>
              </Box>
            </AccordionSummary>
            <AccordionDetails style={{ display: "block" }}>
              <Hidden smUp>
                {!isOwnership && isSignedin && (
                  <Box display="flex" justifyContent="flex-end" width={1} mb={1} mt={-1} pr={2}>
                    <PrimaryButton
                      size="small"
                      className={classes.pricingButton}
                      onClick={event => {
                        event.stopPropagation();
                        setOpenMakeOfferModal(true);
                      }}
                    >
                      MAKE BUY OFFER
                    </PrimaryButton>
                  </Box>
                )}
              </Hidden>
              <div className={classes.table}>
                <CustomTable
                  variant={Variant.Transparent}
                  headers={offerTableHeaders}
                  rows={
                    offerData
                      ? offerData.map(item => [
                        {
                          cell:
                            item.Beneficiary?.toLowerCase() === account?.toLowerCase() ? (
                              <Box display="flex" alignItems="center">
                                <span>Your Offer</span>
                                <PrimaryButton
                                  size="small"
                                  className={classes.cancelOfferButton}
                                  onClick={() => handleCancelOffer(item)}
                                >
                                  CANCEL OFFER
                                </PrimaryButton>
                              </Box>
                            ) : (
                              <Box
                                className={classes.gradientText}
                                display="flex"
                                alignItems="center"
                                style={{ maxWidth: "250px" }}
                              >
                                <span
                                  style={{
                                    width: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => visitProfile(item.Beneficiary, history)}
                                >
                                  {item.priviUser?.id || item.Beneficiary}
                                </span>
                              </Box>
                            ),
                        },
                        {
                          cell: `${item.Price} ${getTokenSymbol(item.PaymentToken)}`,
                        },
                        {
                          cell: moment(new Date(item.Expiration)).format("DD-MM-YYYY"),
                        },
                        {
                          cellAlign: isOwnership ? "left" : "center",
                          cell: (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent={isOwnership ? "space-between" : "center"}
                              ml={isOwnership ? 4.5 : 0}
                            >
                              <img
                                src={
                                  selectedChain.name === "POLYGON"
                                    ? require("assets/icons/polygon_scan.png")
                                    : require("assets/icons/icon_bscscan.ico")
                                }
                                width={24}
                                onClick={() => {
                                  handleClickLink(item.hash);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                              {isOwnership && (
                                <PrimaryButton
                                  size="small"
                                  className={classes.primaryBtn}
                                  onClick={() => handleAcceptOffer(item)}
                                >
                                  ACCEPT
                                </PrimaryButton>
                              )}
                            </Box>
                          ),
                        },
                      ])
                      : []
                  }
                  placeholderText="No History"
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <div className={classes.transactionsSection}>
        <div className={classes.coinFlipHistorySection}>
          <Accordion expanded={isHistoryExpaned} onChange={(e, expanded) => setIsHistoryExpanded(expanded)}>
            <AccordionSummary
              expandIcon={
                <Box display="flex" alignItems="center" fontSize={14} width={56}>
                  <Box color="white" mr={1} >
                    Hide
                  </Box>
                  {isHistoryExpaned ? <ShowIcon /> : <HideIcon />}
                </Box>
              }
              aria-controls="panel-content"
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <div className={classes.typo8}>
                  <HistoryIcon />
                  <span className={classes.gradientText}>Buy History</span>
                </div>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.table}>
                <CustomTable
                  variant={Variant.Transparent}
                  headers={historyTableHeaders}
                  rows={
                    historyData
                      ? historyData.map(item => [
                        {
                          cell: (
                            <Box className={classes.gradientText} component="span">
                              {item.priviUser?.id || item.Beneficiary}
                            </Box>
                          ),
                        },
                        {
                          cell: `${item.Price} ${getTokenSymbol(item.PaymentToken)}`,
                        },
                        {
                          cell: moment(new Date(item.created)).format("DD-MM-YYYY"),
                        },
                        {
                          cellAlign: "center",
                          cell: (
                            <div
                              onClick={() => {
                                handleClickLink(item.hash);
                              }}
                            >
                              <img
                                src={
                                  selectedChain.name === "POLYGON"
                                    ? require("assets/icons/polygon_scan.png")
                                    : require("assets/icons/icon_bscscan.ico")
                                }
                                width={24}
                                onClick={() => {
                                  handleClickLink(item.hash);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          ),
                        },
                      ])
                      : []
                  }
                  placeholderText="No History"
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <MakeBuyOfferModal
        open={openMakeOfferModal}
        handleClose={() => setOpenMakeOfferModal(false)}
        nft={nft}
        setNft={setNft}
      />
      <CancelBuyOfferModal
        open={openCancelOfferModal}
        handleClose={() => setOpenCancelOfferModal(false)}
        offer={selectedOfferData}
        nft={nft}
        setNft={setNft}
      />
      {proceedItem && (
        <BuyProceedModal
          open={true}
          offer={proceedItem}
          handleClose={() => setProceedItem(null)}
          nft={nft}
          setNft={setNft}
        />
      )}
    </>
  );
};
