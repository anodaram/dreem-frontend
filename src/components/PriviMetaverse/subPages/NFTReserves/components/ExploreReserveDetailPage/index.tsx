import React, { useState, useEffect } from "react";
import Web3 from "web3";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";

import { setMarketFee, setTokenList } from "store/actions/MarketPlace";
import { BackButton } from "components/PriviMetaverse/components/BackButton";
import CancelReserveModal from "components/PriviMetaverse/modals/CancelReserveModal";
import ClaimPaymentModal from "components/PriviMetaverse/modals/ClaimPaymentModal";
import ClaimYourNFTModal from "components/PriviMetaverse/modals/ClaimYourNFTModal";
import { Avatar, Color, SecondaryButton, Text, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal } from "shared/ui-kit";
import { ShareWhiteIcon } from "shared/ui-kit/Icons/SvgIcons";
import DiscordPhotoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import { getGameNFT, getMarketplaceFee, syncUpNFT, acceptBlockingOffer } from "shared/services/API/ReserveAPI";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import { getDefaultAvatar, getExternalAvatar } from "shared/services/user/getUserAvatar";
import { checkChainID, getChainForNFT } from "shared/functions/metamask";
import GameNFTDetailModal from "components/PriviMetaverse/modals/GameNFTDetailModal";
import RentSuccessModal from "components/PriviMetaverse/modals/RentSuccessModal";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import NFTDetailTabSection from "./components/NFTDetailTabSection";
import GeneralDetailSection from "./components/GeneralDetailSection";
import RentedDetailSection from "./components/RentedDetailSection";
import BlockedDetailSection from "./components/BlockedDetailSection";
import BlockedStatusSection from "./components/BlockedStatusSection";
import RegularBlockedDetailSection from "./components/RegularBlockedDetailSection";
import RegularBlockedStatusSection from "./components/RegularBlockedStatusSection";
import ExpiredPayDetailSection from "./components/ExpiredPayDetailSection";
import ExpiredPayStatusSection from "./components/ExpiredPayStatusSection";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { exploreOptionDetailPageStyles } from "./index.styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { RootState } from "store/reducers/Reducer";
import { ContractInstance } from "shared/connectors/web3/functions";
import NFTReserveMarketplaceContract from "shared/connectors/web3/contracts/reserve/ReserveMarketplace.json";

const isProd = process.env.REACT_APP_ENV === "prod";

const ExploreReserveDetailPage = () => {
  const classes = exploreOptionDetailPageStyles();
  const dispatch = useDispatch();
  const { collection_id, token_id }: { collection_id: string; token_id: string } = useParams();

  const { shareMedia } = useShareMedia();
  const { account, library, chainId } = useWeb3React();

  const [syncing, setSyncing] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isBuyer, setIsBuyer] = useState<boolean>(false);
  const [isRenter, setIsRenter] = useState<boolean>(false);
  const [isListed, setIsListed] = useState<boolean>(false);
  const [isBlockedNFT, setIsBlockedNFT] = useState<boolean>(false);
  const [isRentedNFT, setIsRentedNFT] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isExpiredPaySuccess, setIsExpiredPaySuccess] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<any>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);

  const history = useHistory();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isTableScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openCancelReserveModal, setOpenCancelReserveModal] = useState<boolean>(false);
  const [openClaimPaymentModal, setOpenClaimPaymentModal] = useState<boolean>(false);
  const [openClaimYourNFTModal, setOpenClaimYourNFTModal] = useState<boolean>(false);
  const [openGameDetailModal, setOpenGameDetailModal] = useState<boolean>(false);
  const [openRentSuccess, setOpenRentSccess] = useState<boolean>(false);
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const [claimType, setClaimType] = useState("");
  const [nft, setNft] = useState<any>({});

  const [openModalPhotoFullScreen, setOpenModalPhotoFullScreen] = useState<boolean>(false);

  const avatarUrl = React.useMemo(() => {
    if (nft?.owner?.urlIpfsImage?.startsWith("/assets")) {
      const lastIndex = nft?.owner?.urlIpfsImage.lastIndexOf("/");

      return require(`assets/anonAvatars/${nft?.owner?.urlIpfsImage.substring(lastIndex + 1)}`);
    }

    return nft?.owner?.urlIpfsImage;
  }, [nft?.owner?.urlIpfsImage]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (nft) {
      setIsOwner((account || "").toLowerCase() === (nft.ownerAddress || "").toLowerCase());
      setIsBlockedNFT(nft.status?.length ? nft.status.includes("Blocked") : false);
      setIsRentedNFT(nft.status?.length ? nft.status.includes("Rented") : false);
      setIsListed(
        nft.sellingOffer?.Price || nft.blockingSaleOffer?.Price || nft.rentSaleOffer?.pricePerSecond
      );
      if (nft.blockingSalesHistories?.length > 0) {
        let _blockingInfo = nft.blockingSalesHistories[nft.blockingSalesHistories.length - 1];

        setIsExpired(
          _blockingInfo?.ReservePeriod * 3600 * 24 * 1000 + _blockingInfo?.created - Date.now() < 0
        );
        setIsExpiredPaySuccess(_blockingInfo.PaidAmount === _blockingInfo.Price);
        setIsBuyer((account || "").toLowerCase() === (_blockingInfo?.to || "").toLowerCase());
      }
      if (nft.rentHistories?.length > 0) {
        let _rentInfo = nft.rentHistories[nft.rentHistories.length - 1];
        setIsRenter((account || "").toLowerCase() === _rentInfo.offerer.toLowerCase());
      }
    }
  }, [nft]);

  useEffect(() => {
    if (!nft) return;

    (async () => {
      const nftChain = getChainForNFT(nft);
      if (!nftChain) return;

      const { tokens } = await getAllTokenInfos();
      const nftTokens = tokens.find(token => token.Network.toLowerCase() === nftChain.name.toLowerCase());
      dispatch(setTokenList([nftTokens]));
    })();
  }, [nft]);

  const getData = async () => {
    setIsLoading(true);
    const response = await getGameNFT({
      mode: isProd ? "main" : "test",
      collectionId: collection_id,
      tokenId: token_id,
    });

    if (response.success) {
      setNft({
        ...response.nft,
      });
      setSelectedChain(getChainForNFT(response.nft))
    }

    const marketFeeRes = await getMarketplaceFee();
    if (marketFeeRes.success && marketFeeRes.data) {
      dispatch(setMarketFee(marketFeeRes.data.Fee));
    }

    setIsLoading(false);
  };

  const goBack = () => {
    if (history.action === "POP") {
      history.push("/gameNFTS/");
    } else {
      history.goBack();
    }
  };

  const handleClaimPayment = () => {
    setOpenClaimPaymentModal(true);
  };

  const handleClaimCollateral = type => {
    setOpenClaimYourNFTModal(true);
    setClaimType(type);
  };

  const syncRentalInfos = async (nftChain: any) => {
    const web3APIHandler = nftChain.apiHandler;
    const web3 = new Web3(library.provider);
    const payloads = {
      collectionId: nft.Address,
      tokenId: Number(nft.tokenId),
    };

    Promise.all([
      web3APIHandler.RentalManager.rentedTokenData(web3, payloads),
      web3APIHandler.RentalManager.rentedTokenSyntheticID(web3, payloads),
      web3APIHandler.RentalManager.getSyntheticNFTAddress(web3, payloads),
    ]).then(([{ rentalInfos }, { nftAddress }, syntheticNFTRes]) => {
      web3APIHandler.SyntheticNFTManager.ownerOf(web3, {
        contractAddress: syntheticNFTRes.nftAddress,
        tokenId: Number(nftAddress),
      }).then(res => {
        syncUpNFT({
          mode: isProd ? "main" : "test",
          collectionId: nft.collectionId,
          tokenId: nft.tokenId,
          rentalInfos: {
            collection: rentalInfos.collection,
            tokenId: rentalInfos.tokenId,
            maximumRentTime: Number(rentalInfos.maximumRentTime),
            pricePerSecond: Number(rentalInfos.pricePerSecond),
            rentalExpiration: Number(rentalInfos.rentalExpiration),
            fundingToken: rentalInfos.fundingToken,
            owner: rentalInfos.owner,
            renter: res.rentalInfos,
            syntehticId: nftAddress,
          },
        })
          .then(() => {
            setSyncing(false);
            getData();
          })
          .catch(err => console.log(err));
      });
    });
  };

  const syncNft = () => {
    if (!nft) return;

    if (nft.blockingSaleOffer) {
      handleConfirmRefresh()
    } else {
      const nftChain = getChainForNFT(nft);
      if (!nftChain) return;

      setSyncing(true);
      syncRentalInfos(nftChain);
    }
  };

  const refresh = () => {
    getData();
  };

  const handleClickLink = () => {
    if (nft.Chain?.toLowerCase() === "bsc") {
      window.open(
        `https://${!isProd ? "testnet." : ""}bscscan.com/token/${nft.Address}?a=${nft.id}`,
        "_blank"
      );
    } else {
      window.open(
        `https://${!isProd ? "mumbai." : ""}polygonscan.com/token/${nft.Address}?a=${nft.id}`,
        "_blank"
      );
    }
  };

  const getTokenDecimal = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token.Decimals;
  };

  const handleConfirmRefresh = async () => {
    const web3Config = selectedChain.config;
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);

    setIsRefreshing(true);
    if (!checkChainID(chainId)) {
      showAlertMessage(`network error`, { variant: "error" });
      setSyncing(false);
      return;
    }
    const nftRes = await getGameNFT({
      mode: isProd ? "main" : "test",
      collectionId: collection_id,
      tokenId: token_id,
    });

    if (nftRes.success) {
      const updatedNFT = nftRes.nft;
      if (updatedNFT.currentOwner === web3Config.CONTRACT_ADDRESSES.RESERVES_MANAGER.toLowerCase()) {
        const contract = ContractInstance(web3, NFTReserveMarketplaceContract.abi, web3Config.CONTRACT_ADDRESSES.RESERVE_MARKETPLACE);

        contract.getPastEvents(
          "PurchaseReserved",
          {
            fromBlock: updatedNFT?.blockingSaleOffer?.blockNumber
          },
          async (error, events) => {
            console.log('events... ', events, updatedNFT )
            const event = (events || []).find(e => e.returnValues?.collection.toLowerCase() === nft?.Address.toLowerCase() && e.returnValues.tokenId === nft?.tokenId)

            if (event) {
              const offer = event.returnValues;

              console.log('offer... ', offer) 
              const activeReserveId = web3.utils.keccak256(
                web3.eth.abi.encodeParameters(
                  ["address", "uint256", "address", "address"],
                  [
                    nft.Address,
                    token_id,
                    offer?.seller,
                    offer?.buyer,
                  ]
                )
              );
              
              console.log('activeReserveId... ', activeReserveId)
              const response = await web3APIHandler.ReservesManager.getActiveReserves(
                web3,
                {
                  activeReserveId
                }
              );

              if (response.success) {
                const blockedInfo = response.offer;

                const offerRes = await acceptBlockingOffer({
                  mode: isProd ? "main" : "test",
                  CollectionId: collection_id,
                  TokenId: blockedInfo.tokenId,
                  AcceptDuration: nft.blockingSaleOffer.AcceptDuration,
                  PaymentToken: nft.blockingSaleOffer.PaymentToken,
                  Price: nft.blockingSaleOffer.Price,
                  Beneficiary: blockedInfo.buyer,
                  CollateralPercent: nft?.blockingSaleOffer?.CollateralPercent,
                  TotalCollateralPercent: Number(blockedInfo.collateralPercent) / 100,
                  ReservePeriod: nft.blockingSaleOffer.ReservePeriod,
                  from: blockedInfo.seller,
                  to: blockedInfo.buyer,
                  notificationMode: -1,
                });

                if (offerRes.success) {
                  setNft(offerRes.data)
                }
              }
            }
          }
        );
      }
    }
    
    setSyncing(false);
  }

  return (
    <Box style={{ position: "relative", flex: 1, display: "flex", justifyContent: "center" }}>
      <div className={classes.content}>
        <Box className={classes.header} mb={3}>
          <BackButton light overrideFunction={goBack} />
          {isOwner && isBlockedNFT && !isExpired && (
            <PrimaryButton
              size="medium"
              className={classes.cancelBlockingBtn}
              style={{
                backgroundColor: "#EEFF21",
                color: "#212121",
              }}
              onClick={() => setOpenCancelReserveModal(true)}
            >
              CANCEL RESERVE
            </PrimaryButton>
          )}
        </Box>
        <LoadingWrapper loading={isLoading} theme={"blue"} height="calc(100vh - 100px)">
          <Box
            display="flex"
            alignItems="center"
            flexDirection={isMobileScreen ? "column" : "row"}
            mt={2}
            mb={3}
            width="100%"
          >
            <Box
              position="relative"
              width={isMobileScreen ? 1 : isTableScreen ? "320px" : 0.35}
              height={isTableScreen ? "320px" : 1}
              mr={isMobileScreen ? 0 : isTableScreen ? 2 : 5}
              borderRadius="20px"
              style={{
                minWidth: "40%",
                backgroundImage: `url("${!nft?.animation_url ? nft?.image : nft?.CardImage}")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                boxShadow: "0px 32.6829px 21.7886px -26.7406px rgba(0, 0, 0, 0.07)",
                overflow: "hidden",
              }}
            >
              {nft?.content_url && (
                <Box
                  position="absolute"
                  top={20}
                  right={20}
                  onClick={() => {
                    setOpenModalPhotoFullScreen(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FullViewIncon />
                </Box>
              )}
            </Box>
            <Box
              ml={isMobileScreen ? 0 : isTableScreen ? 2 : 5}
              py={2}
              style={{ flex: "1", overflow: "auto" }}
              width={1}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                {isListed ? (
                  <Box className={classes.status}>
                    {isRentedNFT ? "RENTED" : isBlockedNFT ? "BLOCKED" : "LISTED"}
                  </Box>
                ) : (
                  <div />
                )}
                <Box display="flex" alignItems="center">
                  <span
                    onClick={() =>
                      shareMedia(
                        "gameNFTS",
                        `gameNFTS/${encodeURIComponent(nft?.Slug)}/${encodeURIComponent(nft?.id)}`
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <ShareWhiteIcon />
                  </span>
                  <SecondaryButton
                    className={classes.detailsButton}
                    size="small"
                    onClick={() => syncNft()}
                    ml={2}
                  >
                    <IconButtonWrapper style={{ marginLeft: -10 }} rotate={syncing}>
                      <RefreshIcon />
                    </IconButtonWrapper>
                    Sync NFT
                  </SecondaryButton>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection={isMobileScreen ? "column" : "row"}
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Box
                  flex={1}
                  display="flex"
                  flexDirection={isMobileScreen ? "column" : "row"}
                  alignItems="center"
                  ml={0.25}
                  mr={1.25}
                  style={{ overflow: "hidden" }}
                >
                  <Text
                    color={Color.Black}
                    className={classes.creatorName}
                    style={{ marginBottom: 4 }}
                    title={nft.name}
                  >
                    {nft.name}
                  </Text>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <SecondaryButton
                    className={classes.detailsButton}
                    size="small"
                    onClick={() => setOpenGameDetailModal(true)}
                  >
                    Details
                  </SecondaryButton>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection={isMobileScreen ? "column" : "row"}
                alignItems={isMobileScreen ? "flex-start" : "center"}
                justifyContent="space-between"
                mt={1}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ cursor: "pointer" }}
                  onClick={() => (nft?.owner?.urlSlug ? history.push(`/profile/${nft?.owner?.urlSlug}`) : {})}
                >
                  <Avatar
                    url={avatarUrl ?? (nft?.owner ? getDefaultAvatar() : getExternalAvatar())}
                    size="small"
                  />
                  <Text style={{ margin: "0px 9px", fontFamily: "Rany", fontWeight: 400 }}>Owned by</Text>
                  <Text className={classes.gradientText}>
                    {nft?.owner?.name ||
                      nft?.ownerAddress?.substr(0, 18) +
                        "..." +
                        nft?.ownerAddress?.substr(nft?.ownerAddress?.length - 3, 3)}
                  </Text>
                </Box>
                <SecondaryButton size="small" onClick={handleClickLink} className={classes.checkOnBtn}>
                  Check on
                  <img src={getChainImageUrl(nft.Chain)} alt="" />
                </SecondaryButton>
              </Box>
              <hr className={classes.divider} />
              {isOwner ? (
                // Owner pages
                isBlockedNFT ? (
                  <>
                    <BlockedDetailSection nft={nft} refresh={refresh} />
                    {isExpired && isExpiredPaySuccess && (
                      <PrimaryButton
                        size="medium"
                        style={{
                          width: "100%",
                          height: 52,
                          backgroundColor: "#EEFF21",
                          marginTop: 14,
                          color: "#212121",
                        }}
                        onClick={handleClaimPayment}
                      >
                        CLAIM PAYMENT
                      </PrimaryButton>
                    )}
                    {isExpired && !isExpiredPaySuccess && (
                      <PrimaryButton
                        size="medium"
                        style={{
                          width: "100%",
                          height: 52,
                          backgroundColor: "#EEFF21",
                          marginTop: 14,
                          textTransform: "uppercase",
                          color: "#212121",
                        }}
                        onClick={() => handleClaimCollateral("block")}
                      >
                        claim Collateral & nft back
                      </PrimaryButton>
                    )}
                  </>
                ) : isRentedNFT ? (
                  <RentedDetailSection nft={nft} setNft={setNft} isOwner={isOwner} refresh={refresh} />
                ) : (
                  <GeneralDetailSection
                    isOwnership={isOwner}
                    nft={nft}
                    setNft={setNft}
                    refresh={refresh}
                    onRent={() => setOpenRentSccess(true)}
                  />
                )
              ) : isBuyer ? (
                // Buyer pages
                isBlockedNFT ? (
                  isExpired ? (
                    <ExpiredPayDetailSection nft={nft} refresh={refresh} isSuccess={isExpiredPaySuccess} />
                  ) : (
                    <RegularBlockedDetailSection nft={nft} refresh={refresh} />
                  )
                ) : (
                  <GeneralDetailSection
                    isOwnership={isOwner}
                    nft={nft}
                    setNft={setNft}
                    refresh={refresh}
                    onRent={() => setOpenRentSccess(true)}
                  />
                )
              ) : isRenter ? (
                // Renter pages
                <RentedDetailSection nft={nft} setNft={setNft} isOwner={isOwner} refresh={refresh} />
              ) : // Spectator pages
              isBlockedNFT ? (
                <RegularBlockedDetailSection nft={nft} refresh={refresh} isSpectator isBlocked />
              ) : isRentedNFT ? (
                <RentedDetailSection
                  nft={nft}
                  setNft={setNft}
                  isOwner={false}
                  isSpectator
                  isBlocked={false}
                  refresh={refresh}
                />
              ) : (
                <GeneralDetailSection
                  isOwnership={isOwner}
                  nft={nft}
                  setNft={setNft}
                  refresh={refresh}
                  onRent={() => setOpenRentSccess(true)}
                />
              )}
            </Box>
          </Box>
          {isOwner ? (
            isRentedNFT ? null : isBlockedNFT ? (
              !isExpired && <BlockedStatusSection isOwnership={isOwner} nft={nft} refresh={refresh} />
            ) : (
              <NFTDetailTabSection isOwnership={isOwner} nft={nft} setNft={setNft} handleRefresh={refresh} />
            )
          ) : isBlockedNFT && isBuyer ? (
            isExpired ? (
              isExpiredPaySuccess ? null : (
                <ExpiredPayStatusSection nft={nft} />
              )
            ) : (
              <RegularBlockedStatusSection isOwnership={isOwner} nft={nft} refresh={refresh} />
            )
          ) : (
            <NFTDetailTabSection isOwnership={isOwner} nft={nft} setNft={setNft} handleRefresh={refresh} />
          )}
        </LoadingWrapper>
      </div>
      <CancelReserveModal
        open={openCancelReserveModal}
        handleClose={() => setOpenCancelReserveModal(false)}
        onConfirm={refresh}
        nft={nft}
      />
      <ClaimPaymentModal
        open={openClaimPaymentModal}
        handleClose={() => setOpenClaimPaymentModal(false)}
        onConfirm={refresh}
        nft={nft}
      />
      <ClaimYourNFTModal
        open={openClaimYourNFTModal}
        handleClose={() => setOpenClaimYourNFTModal(false)}
        onConfirm={refresh}
        nft={nft}
        claimType={claimType}
      />
      {openGameDetailModal && (
        <GameNFTDetailModal
          open={openGameDetailModal}
          nft={nft}
          onClose={() => setOpenGameDetailModal(false)}
          onFruit={() => {}}
        />
      )}
      {openModalPhotoFullScreen && (
        <Modal
          size="medium"
          className={classes.discordPhotoFullModal}
          isOpen={openModalPhotoFullScreen}
          onClose={() => {
            setOpenModalPhotoFullScreen(false);
          }}
          theme="img-preview"
          showCloseIcon
        >
          <DiscordPhotoFullScreen
            onCloseModal={() => {
              setOpenModalPhotoFullScreen(false);
            }}
            url={nft?.content_url}
          />
        </Modal>
      )}
      {openRentSuccess && (
        <RentSuccessModal
          open={openRentSuccess}
          handleClose={() => setOpenRentSccess(false)}
          nft={nft}
          setNft={setNft}
        />
      )}
    </Box>
  );
};

export default React.memo(ExploreReserveDetailPage);

const FullViewIncon = () => (
  <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.90918 14.934C0.90918 6.90221 7.42028 0.391113 15.4521 0.391113H16.4198C24.4517 0.391113 30.9628 6.90221 30.9628 14.934V14.934C30.9628 22.9659 24.4517 29.477 16.4198 29.477H15.4521C7.42028 29.477 0.90918 22.9659 0.90918 14.934V14.934Z"
      fill="black"
      fill-opacity="0.13"
    />
    <path
      d="M14.0292 15.8164L8.89216 20.788V19.0251C8.89216 18.6488 8.5766 18.3434 8.18778 18.3434C7.79896 18.3434 7.4834 18.6488 7.4834 19.0251V22.4336C7.4834 22.8099 7.79896 23.1153 8.18778 23.1153H11.7097C12.0985 23.1153 12.4141 22.8099 12.4141 22.4336C12.4141 22.0573 12.0985 21.7519 11.7097 21.7519H9.88816L15.0252 16.7803C15.3003 16.5141 15.3003 16.0826 15.0252 15.8164C14.7505 15.5501 14.3039 15.5501 14.0292 15.8164V15.8164Z"
      fill="white"
    />
    <path
      d="M23.6843 6.75342H20.1624C19.7736 6.75342 19.4581 7.05882 19.4581 7.43512C19.4581 7.81142 19.7736 8.11682 20.1624 8.11682H21.984L16.8469 13.0885C16.5719 13.3547 16.5719 13.7862 16.8469 14.0524C16.9846 14.1857 17.1646 14.2521 17.3449 14.2521C17.5252 14.2521 17.7052 14.1857 17.8429 14.0524L22.98 9.08074V10.8436C22.98 11.2199 23.2955 11.5253 23.6843 11.5253C24.0732 11.5253 24.3887 11.2199 24.3887 10.8436V7.43512C24.3887 7.05882 24.0732 6.75342 23.6843 6.75342Z"
      fill="white"
    />
  </svg>
);

const RefreshIcon = () => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 8.25051C14.8166 6.93068 14.2043 5.70776 13.2575 4.77013C12.3107 3.83251 11.0818 3.2322 9.76025 3.06168C8.43869 2.89115 7.09772 3.15987 5.9439 3.82645C4.79009 4.49302 3.88744 5.52046 3.375 6.75051M3 3.75051V6.75051H6"
        stroke="#E9FF26"
        stroke-width="1.125"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 9.75C3.18342 11.0698 3.7957 12.2928 4.74252 13.2304C5.68934 14.168 6.91818 14.7683 8.23975 14.9388C9.56131 15.1094 10.9023 14.8406 12.0561 14.1741C13.2099 13.5075 14.1126 12.48 14.625 11.25M15 14.25V11.25H12"
        stroke="#E9FF26"
        stroke-width="1.125"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const IconButtonWrapper = styled.div<{ rotate: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${props => (props.rotate ? `rotate 1.5s linear 0s infinite` : "")};
  -webkit-animation: ${props => (props.rotate ? `rotate 1.5s linear 0s infinite` : "")};
  -moz-animation: ${props => (props.rotate ? `rotate 1.5s linear 0s infinite` : "")};
  @keyframes rotate {
    0% {
    }
    100% {
      -webkit-transform: rotate(-360deg);
      -moz-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
`;
