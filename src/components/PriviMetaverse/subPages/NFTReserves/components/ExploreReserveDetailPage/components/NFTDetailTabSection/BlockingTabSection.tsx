import React, { useState } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import { Accordion, AccordionDetails, AccordionSummary, Hidden } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import MakeNewOfferModal from "components/PriviMetaverse/modals/MakeNewOfferModal";
import CancelOfferModal from "components/PriviMetaverse/modals/CancelOfferModal";
import BlockProceedModal from "components/PriviMetaverse/modals/BlockProceedModal";
import { TagIcon, HistoryIcon, HideIcon, ShowIcon } from "./index";

import { PrimaryButton, Variant } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { visitProfile } from "shared/services/API/UserAPI";
import { getChainForNFT } from "shared/functions/metamask";
import { useAuth } from "shared/contexts/AuthContext";

import { exploreOptionDetailPageStyles } from "../../index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

export default ({ offerData, historyData, isOwnership, nft, setNft, handleRefresh }) => {
  const classes = exploreOptionDetailPageStyles();
  const history = useHistory();
  const { isSignedin } = useAuth();

  const [openMakeNewOfferModal, setOpenMakeNewOfferModal] = useState<boolean>(false);
  const [openCancelOfferModal, setOpenCancelOfferModal] = useState<boolean>(false);
  const [selectedOfferData, setSelectedOfferData] = useState<any>();
  const [proceedItem, setProceedItem] = useState<any>(null);
  const { account } = useWeb3React();
  const [selectedChain] = React.useState<any>(getChainForNFT(nft));
  const [isOfferExpanded, setIsOfferExpanded] = React.useState<boolean>(true);
  const [isHistoryExpaned, setIsHistoryExpanded] = React.useState<boolean>(true);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const offerTableHeaders: Array<CustomTableHeaderInfo> = isOwnership
    ? [
      {
        headerName: "USER",
      },
      {
        headerName: "PRICE",
        headerAlign: "center",
      },
      {
        headerName: "PERIOD",
        headerAlign: "center",
      },
      {
        headerName: "COLLATERAL %",
        headerAlign: "center",
      },
      {
        headerName: "EXPIRATION",
        headerAlign: "center",
      },
      {
        headerName:
          nft.Chain?.toLowerCase() === "mumbai" || nft.Chain?.toLowerCase() === "polygon"
            ? "POLYGONSCAN"
            : "BSCSCAN",
        headerAlign: isOwnership ? "left" : "center",
      },
    ]
    : [
      {
        headerName: "USER",
      },
      {
        headerName: "PRICE",
        headerAlign: "center",
      },
      {
        headerName: "COLLATERAL %",
        headerAlign: "center",
      },
      {
        headerName: "SETTLEMENT",
        headerAlign: "center",
      },
      {
        headerName: "DURATION",
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
      headerName: "STATUS",
    },
    {
      headerName: "PRICE",
      headerAlign: "center",
    },
    {
      headerName: "PERIOD",
      headerAlign: "center",
    },
    {
      headerName: "COLLATERAL %",
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

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };
  return (
    <>
      <div className={classes.transactionsSection}>
        <div className={classes.coinFlipHistorySection}>
          <Accordion expanded={isOfferExpanded} onChange={(e, expanded) => setIsOfferExpanded(expanded)}>
            <AccordionSummary
              expandIcon={
                <Box display="flex" alignItems="center" fontSize={14} width={56} >
                  <Box color="white" mr={1} style={{ transform: isOfferExpanded ? "none" : "rotate(180deg)" }}>
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
                  <span className={classes.gradientText}>Blocking offers</span>
                </div>
                <Hidden xsDown>
                  {!isOwnership && isSignedin && (
                    <PrimaryButton
                      size="small"
                      className={classes.pricingButton}
                      onClick={event => {
                        event.stopPropagation();
                        setOpenMakeNewOfferModal(true);
                      }}
                    >
                      MAKE BLOCKING OFFER
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
                        setOpenMakeNewOfferModal(true);
                      }}
                    >
                      MAKE BLOCKING OFFER
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
                            item.Beneficiary === account ? (
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
                                  onClick={() => visitProfile(item.Beneficiary, history)}
                                >
                                  {item.Beneficiary}
                                </span>
                              </Box>
                            ),
                        },
                        {
                          cell: `${item.Price} ${getTokenSymbol(item.PaymentToken)}`,
                        },
                        {
                          cell: isOwnership ? `${item.ReservePeriod} Day(s)` : `${item.TotalCollateralPercent} %`,
                        },
                        {
                          cell: isOwnership
                            ? `${item.TotalCollateralPercent} %`
                            : `${item.CollateralAmount} ${getTokenSymbol(item.CollateralToken)}`,
                        },
                        {
                          cell: isOwnership ? `${item.AcceptDuration} Day(s)` : `${item.ReservePeriod} Day(s)`,
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
                  <Box color="white" mr={1} style={{ transform: isHistoryExpaned ? "none" : "rotate(180deg)" }}>
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
                  <span className={classes.gradientText}>Blocking History</span>
                </div>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.table}>
                <CustomTable
                  variant={Variant.Transparent}
                  headers={historyTableHeaders}
                  rows={historyData.map(item => {
                    const Status = () => {
                      if (item.status === 'CANCELLED') {
                        return <Box color="#ffffff50">CANCELLED</Box>
                      }

                      if (item.status === 'LIQUIDATED') {
                        return <Box color="#FF6868">LIQUIDATED</Box>
                      }

                      if (item.status === 'SOLD') {
                        return <Box color="#5EFF26">SOLD</Box>
                      }

                      if (item.status === 'UNPAID') {
                        return <Box color="#EEFF21">UNPAID</Box>
                      }

                      return <Box>ACTIVE</Box>
                    }
                    return [
                      {
                        cell: (
                          <span
                            className={classes.gradientText}
                            onClick={() => visitProfile(item.Beneficiary || item.to, history)}
                            style={{ cursor: "pointer" }}
                          >
                            {item.Beneficiary || item.to}
                          </span>
                        ),
                      },
                      {
                        cell: <Status />,
                      },
                      {
                        cell: `${item.Price} ${getTokenSymbol(item.PaymentToken)}`,
                      },
                      {
                        cell: `${item.ReservePeriod} Day(s)`,
                      },
                      {
                        cell: `${item.TotalCollateralPercent} %`,
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
                            />
                          </div>
                        ),
                      },
                    ]
                  })}
                  placeholderText="No History"
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <MakeNewOfferModal
        open={openMakeNewOfferModal}
        handleClose={() => setOpenMakeNewOfferModal(false)}
        nft={nft}
        setNft={setNft}
      />
      <CancelOfferModal
        open={openCancelOfferModal}
        handleClose={() => setOpenCancelOfferModal(false)}
        offer={selectedOfferData}
        nft={nft}
        setNft={setNft}
        type="block"
      />
      {proceedItem && (
        <BlockProceedModal
          open={true}
          offer={proceedItem}
          handleClose={() => setProceedItem(null)}
          nft={nft}
          setNft={setNft}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
};
