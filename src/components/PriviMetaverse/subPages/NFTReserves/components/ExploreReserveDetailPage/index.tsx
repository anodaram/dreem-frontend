import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";

import { useMediaQuery, useTheme } from "@material-ui/core";

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
import { getGameNFT, getMarketplaceFee } from "shared/services/API/ReserveAPI";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import { getDefaultAvatar, getExternalAvatar } from "shared/services/user/getUserAvatar";
import { getChainForNFT } from "shared/functions/metamask";
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
import AcceptingOfferSection from "./components/AcceptingOfferSection";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { exploreOptionDetailPageStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const ExploreReserveDetailPage = () => {
  const classes = exploreOptionDetailPageStyles();
  const dispatch = useDispatch();
  const { collection_id, token_id }: { collection_id: string; token_id: string } = useParams();

  const { shareMedia } = useShareMedia();

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isBuyer, setIsBuyer] = useState<boolean>(false);
  const [isListed, setIsListed] = useState<boolean>(false);
  const [isBlockedNFT, setIsBlockedNFT] = useState<boolean>(false);
  const [isRentedNFT, setIsRentedNFT] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isExpiredPaySuccess, setIsExpiredPaySuccess] = useState<boolean>(false);

  const history = useHistory();

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isTableScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openCancelReserveModal, setOpenCancelReserveModal] = useState<boolean>(false);
  const [openClaimPaymentModal, setOpenClaimPaymentModal] = useState<boolean>(false);
  const [openClaimYourNFTModal, setOpenClaimYourNFTModal] = useState<boolean>(false);
  const [openGameDetailModal, setOpenGameDetailModal] = useState<boolean>(false);
  const [openRentSuccess, setOpenRentSccess] = useState<boolean>(false);
  const [claimType, setClaimType] = useState("");
  const [nft, setNft] = useState<any>({});
  const { account } = useWeb3React();

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
      setIsBlockedNFT(nft.status === "Blocked");
      setIsRentedNFT(nft.status === "Rented");
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
    }

    const marketFeeRes = await getMarketplaceFee();
    if (marketFeeRes.success) {
      dispatch(setMarketFee(marketFeeRes.data.Fee));
    }

    setIsLoading(false);
  };

  const goBack = () => {
    history.goBack();
  };

  const handleClaimPayment = () => {
    setOpenClaimPaymentModal(true);
  };

  const handleClaimCollateral = type => {
    setOpenClaimYourNFTModal(true);
    setClaimType(type);
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
                backgroundImage: `url("${nft?.image}")`,
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
            <Box ml={isMobileScreen ? 0 : isTableScreen ? 2 : 5} py={2} style={{ flex: "1" }} width={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                {isListed ? (
                  <Box className={classes.status}>
                    {isRentedNFT ? "RENTED" : isBlockedNFT ? "BLOCKED" : "LISTED"}
                  </Box>
                ) : (
                  <div />
                )}
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
              </Box>
              <Box
                display="flex"
                flexDirection={isMobileScreen ? "column" : "row"}
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Box display="flex" flexDirection={isMobileScreen ? "column" : "row"} alignItems="center">
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Box display="flex" flexDirection="column" ml={0.25} mr={1.25}>
                      <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                        {nft.name}
                      </Text>
                    </Box>
                  </Box>
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
                ) : (
                  <GeneralDetailSection
                    isOwnership={isOwner}
                    nft={nft}
                    setNft={setNft}
                    refresh={refresh}
                    onRent={() => setOpenRentSccess(true)}
                  />
                )
              ) : isBlockedNFT && isBuyer ? (
                isExpired ? (
                  <ExpiredPayDetailSection nft={nft} refresh={refresh} isSuccess={isExpiredPaySuccess} />
                ) : (
                  <RegularBlockedDetailSection nft={nft} refresh={refresh} />
                )
              ) : isRentedNFT ? (
                <RentedDetailSection nft={nft} setNft={setNft} isOwner={isOwner} />
              ) : (
                <>
                  <GeneralDetailSection
                    isOwnership={isOwner}
                    nft={nft}
                    setNft={setNft}
                    refresh={refresh}
                    onRent={() => setOpenRentSccess(true)}
                  />
                  {/* <AcceptingOfferSection /> */}
                </>
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
        <RentSuccessModal open={openRentSuccess} handleClose={() => setOpenRentSccess(false)} nft={nft} />
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
