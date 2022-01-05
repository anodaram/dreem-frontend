import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import Moment from "react-moment";
import { Accordion, AccordionDetails, AccordionSummary, Hidden } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import MakeRentalOfferModal from "components/PriviMetaverse/modals/MakeRentalOfferModal";
import RentProceedModal from "components/PriviMetaverse/modals/RentProceedModal";
import CancelOfferModal from "components/PriviMetaverse/modals/CancelOfferModal";
import { TagIcon, HistoryIcon, HideIcon, ShowIcon } from "./index";

import { PrimaryButton, Variant } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { toDecimals } from "shared/functions/web3";
import { visitProfile } from "shared/services/API/UserAPI";
import { formatDuration } from "shared/helpers/utils";
import { getChainForNFT } from "shared/functions/metamask";
import { useAuth } from "shared/contexts/AuthContext";

import { exploreOptionDetailPageStyles } from "../../index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

export default ({ offerData, historyData, isOwnership, nft, setNft }) => {
  const classes = exploreOptionDetailPageStyles();
  const history = useHistory();
  const { isSignedin } = useAuth();
  const { account } = useWeb3React();

  const [openMakeRentalModal, setOpenMakeRentalModal] = useState<boolean>(false);
  const [proceedItem, setProceedItem] = useState<any>(null);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const [offers, setOffers] = useState<any[]>([]);
  const [openCancelOfferModal, setOpenCancelOfferModal] = useState<boolean>(false);
  const [selectedOfferData, setSelectedOfferData] = useState<any>();
  const [selectedChain] = React.useState<any>(getChainForNFT(nft));
  const [isOfferExpanded, setIsOfferExpanded] = React.useState<boolean>(true);
  const [isHistoryExpaned, setIsHistoryExpanded] = React.useState<boolean>(true);

  useEffect(() => {
    if (!offerData) {
      return;
    }
    offerData.sort((a, b) => b.created - a.created);
    setOffers(offerData);
  }, [offerData]);

  const offerTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "USER",
    },
    {
      headerName: "PRICE PER SECOND",
      headerAlign: "center",
    },
    {
      headerName: "ESTIMATED COST",
      headerAlign: "center",
    },
    {
      headerName: "RENTAL TIME",
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
      headerName: "PRICE PER SECOND",
      headerAlign: "center",
    },
    {
      headerName: "ESTIMATED COST",
      headerAlign: "center",
    },
    {
      headerName: "RENTAL TIME",
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

  const handleAcceptOffer = item => {
    setProceedItem(item);
  };

  const toMinizeAddress = address => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCancelOffer = item => {
    setOpenCancelOfferModal(true);
    setSelectedOfferData(item);
  };

  const handleClickLink = _hash => {
    if (selectedChain.name === "POLYGON") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${_hash}`, "_blank");
    } else if (selectedChain.name === "ETHEREUM") {
      window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${_hash}`, "_blank");
    } else {
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
                  <Box color="white" mr={1}>
                    {isOfferExpanded ? "Hide" : "Show"}
                  </Box>
                  {isOfferExpanded ? <HideIcon /> : <ShowIcon />}
                </Box>
              }
              aria-controls="panel-content"
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <div className={classes.typo8}>
                  <TagIcon />
                  <span className={classes.gradientText}>Rental offers</span>
                </div>
                <Hidden xsDown>
                  {!isOwnership && isSignedin && (
                    <PrimaryButton
                      size="small"
                      className={classes.pricingButton}
                      onClick={event => {
                        event.stopPropagation();
                        setOpenMakeRentalModal(true);
                      }}
                    >
                      MAKE RENTAL OFFER
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
                        setOpenMakeRentalModal(true);
                      }}
                    >
                      MAKE RENTAL OFFER
                    </PrimaryButton>
                  </Box>
                )}
              </Hidden>
              <div className={classes.table}>
                <CustomTable
                  variant={Variant.Transparent}
                  headers={offerTableHeaders}
                  rows={offers.map(item => {
                    const token = tokenList.find(v => v.Address === item.fundingToken);
                    let estimatedCost = +toDecimals(item.pricePerSecond, token?.Decimals) * item.rentalTime;
                    estimatedCost = +estimatedCost.toFixed(8);
                    return [
                      {
                        cell:
                          item.offerer === account ? (
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
                            <Box display="flex" alignItems="center" style={{ maxWidth: "250px" }}>
                              <span
                                className={classes.gradientText}
                                style={{
                                  width: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                }}
                                onClick={() => visitProfile(item.offerer, history)}
                              >
                                {item.offerer}
                              </span>
                            </Box>
                          ),
                      },
                      {
                        cell: `${+toDecimals(item.pricePerSecond, token?.Decimals)} ${token?.Symbol ?? ""}`,
                      },
                      {
                        cell: `${estimatedCost} ${token?.Symbol ?? ""}`,
                      },
                      {
                        cell: `${formatDuration(+item.rentalTime * 1000)}`,
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
                    ];
                  })}
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
                  <Box color="white" mr={1}>
                    {isHistoryExpaned ? "Hide" : "Show"}
                  </Box>
                  {isHistoryExpaned ? <HideIcon /> : <ShowIcon />}
                </Box>
              }
              aria-controls="panel-content"
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <div className={classes.typo8}>
                  <HistoryIcon />
                  <span className={classes.gradientText}>Rental History</span>
                </div>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.table}>
                <CustomTable
                  variant={Variant.Transparent}
                  headers={historyTableHeaders}
                  rows={historyData.map(item => {
                    const token = tokenList.find(v => v.Address === item.fundingToken);
                    let estimatedCost = item.pricePerSecond * item.rentalTime;
                    estimatedCost = Math.floor(estimatedCost * Math.pow(10, 8)) / Math.pow(10, 8);
                    return [
                      {
                        cell: (
                          <span
                            className={classes.gradientText}
                            onClick={() => visitProfile(item.offerer, history)}
                            style={{ cursor: "pointer" }}
                          >
                            {item.offerer}
                          </span>
                        ),
                      },
                      {
                        cell: `${item.pricePerSecond} ${token?.Symbol ?? ""}`,
                      },
                      {
                        cell: `${estimatedCost} ${token?.Symbol ?? ""}`,
                      },
                      {
                        cell: `${formatDuration(+item.rentalTime * 1000)}`,
                      },
                      {
                        cell: <Moment format="DD-MM-YYYY">{new Date(+item.rentalExpiration)}</Moment>,
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
                            />
                          </div>
                        ),
                      },
                    ];
                  })}
                  placeholderText="No History"
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <MakeRentalOfferModal
        open={openMakeRentalModal}
        handleClose={() => setOpenMakeRentalModal(false)}
        nft={nft}
        setNft={setNft}
      />
      <CancelOfferModal
        open={openCancelOfferModal}
        handleClose={() => setOpenCancelOfferModal(false)}
        offer={selectedOfferData}
        nft={nft}
        setNft={setNft}
        type="rent"
      />
      {proceedItem && (
        <RentProceedModal
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
