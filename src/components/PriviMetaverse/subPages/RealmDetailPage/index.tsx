import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import customProtocolCheck from "custom-protocol-check";
import { Hidden, useMediaQuery, useTheme, CircularProgress } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import AvatarCard from "components/PriviMetaverse/components/cards/AvatarCard";
import NotAppModal from "components/PriviMetaverse/modals/NotAppModal";
import RealmCard from "components/PriviMetaverse/components/cards/RealmCard";
import OpenDesktopModal from "components/PriviMetaverse/modals/OpenDesktopModal";
import CreateExtensionDraftModal from "components/PriviMetaverse/modals/CreateExtensionDraftModal";
import RealmRestrictedModal from "components/PriviMetaverse/modals/RealmRestrictedModal";

import { METAVERSE_URL } from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Avatar from "shared/ui-kit/Avatar";
import TabsView, { TabItem } from "shared/ui-kit/TabsView";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import URL from "shared/functions/getURL";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { detectMob } from "shared/helpers";
import VotingItem from "./VotingItem";
import CreatorItem from "./CreatorItem";
import { realmDetailPageStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  375: 1,
  600: 3,
  1200: 3,
  1440: 3,
};

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 3,
  1200: 3,
  1440: 4,
};

const RealmDetailTabs: TabItem[] = [
  {
    key: "extensions",
    title: "Extensions",
  },
  // {
  //   key: "avatars",
  //   title: "Avatars",
  // },
  // {
  //   key: "assets",
  //   title: "Assets",
  // },
  {
    key: "creators",
    title: "Creators",
  },
  {
    key: "voting",
    title: "Voting",
  },
  {
    key: "land",
    title: "Land",
  },
];

const REALM_PUBLIC_STATE = {
  PUBLIC: 'PUBLIC',
  RESTRICTED: 'RESTRICTED',
}

export default function RealmDetailPage() {
  const classes = realmDetailPageStyles();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);

  const width = useWindowDimensions().width;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const { isSignedin } = useAuth();

  const { showAlertMessage } = useAlertMessage();

  const { id: realmId } = useParams<{ id: string }>();

  const [fruitData, setFruitData] = React.useState<any>({});
  const [realmData, setRealmData] = React.useState<any>({});
  const [realmPublicState, setRealmPublicState] = React.useState<any>(REALM_PUBLIC_STATE.RESTRICTED);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [characters, setCharacters] = React.useState<any[]>([]);
  const [selectedTab, setSelectedTab] = React.useState<string>("extensions");
  const [isLoadingCharacters, setIsLoadingCharacters] = React.useState<boolean>(true);
  const [isLoadingMetaData, setIsLoadingMetaData] = React.useState<boolean>(false);

  const [metaDataForModal, setMetaDataForModal] = React.useState<any>(null);
  const [openNotAppModal, setOpenNotAppModal] = React.useState<boolean>(false);
  const [showPlayModal, setShowPlayModal] = React.useState<boolean>(false);
  const [openCreateExtensionModal, setOpenCreateExtensionModal] = React.useState<boolean>(false);
  const [openRealmRestrictedModal, setOpenRealmRestrictedModal] = React.useState<boolean>(false);

  const { shareMedia } = useShareMedia();

  const loadingCount = React.useMemo(
    () => (width > 1440 ? 4 : width > 1000 ? 3 : width > 600 ? 2 : 1),
    [width]
  );

  React.useEffect(() => {
    if (realmId) {
      loadRealm(realmId);

      axios
        .get(`${URL()}/dreemRealm/getFruitData`, {
          params: {
            realmId,
          },
        })
        .then(res => {
          setFruitData(res.data.data);
        });
      setIsLoadingCharacters(true);
      MetaverseAPI.getCharacters(realmId)
        .then(res => setCharacters(res.data.elements))
        .finally(() => setIsLoadingCharacters(false));
    }
  }, [realmId]);

  const loadRealm = realmId => {
    setIsLoading(true);
    MetaverseAPI.getWorld(realmId)
      .then(res => {
        setRealmData(res.data);
      })
      .finally(() => setIsLoading(false));
  };

  const handlePlay = () => {
    if (detectMob()) {
      setShowPlayModal(true);
    } else {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(
          `${METAVERSE_URL()}/getSessionHash/`,
          {
            worldId: realmId,
            worldTitle: realmData.worldTitle,
            worldAssetUrl: realmData.worldAssetUrl,
            worldTag: realmData.worldTag,
          },
          config
        )
        .then(res => {
          let data: any = res.data?.data?.stamp;
          if (data) {
            customProtocolCheck(
              "dreem://" + data,
              () => {
                setOpenNotAppModal(true);
              },
              () => {
                console.log("successfully opened!");
              },
              3000
            );
          }
        });
    }
  };

  const handleShare = () => {
    shareMedia("Realm", `realms/${realmData.id}`);
  };

  const handleFruit = type => {
    if (fruitData.fruits?.filter(f => f.fruitId === type)?.find(f => f.userId === userSelector.id)) {
      showAlertMessage("You had already given this fruit.", { variant: "info" });
      return;
    }

    const body = {
      realmId: realmId,
      userId: userSelector.id,
      fruitId: type,
    };
    axios.post(`${URL()}/dreemRealm/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...fruitData };
        itemCopy.fruits = resp.fruitsArray;
        setFruitData(itemCopy);
      }
    });
  };

  const handleOpenExtensionModal = async () => {
    setIsLoadingMetaData(true);
    const res = await MetaverseAPI.getUploadMetadata();
    if (res && res.success) {
      if (res.data.uploading?.enabled) {
        setMetaDataForModal(res.data);
        setIsLoadingMetaData(false);
        setOpenCreateExtensionModal(true);
      } else {
        setIsLoadingMetaData(false);
        showAlertMessage(`${res.data.uploading?.message}`, { variant: "error" });
      }
    } else {
      setIsLoadingMetaData(false);
      showAlertMessage(`Server is down. Please wait...`, { variant: "error" });
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.container} id="scrollContainer">
        <Box className={classes.fitContent} mb={2}>
          <Box
            color="#FFFFFF"
            mb={4}
            style={{ width: "fit-content", cursor: "pointer" }}
            onClick={() => history.goBack()}
            display="flex"
            alignItems="center"
          >
            <ArrowIcon />
            <Box ml={1}>Back</Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
            <Box className={classes.title}>{realmData.worldTitle || ""}</Box>
            <Hidden smDown>
              <Box display="flex" alignItems="center">
                <Box className={classes.iconBtn}>
                  <PolygonIcon />
                </Box>
                <Box className={classes.iconBtn}>
                  <OpenSeaIcon />
                </Box>
                {/* {isSignedin && (
                  <Box className={classes.iconBtn}>
                    <FruitSelect
                      fruitObject={fruitData}
                      onGiveFruit={handleFruit}
                      fruitWidth={32}
                      fruitHeight={32}
                      style={{ background: "transparent" }}
                    />
                  </Box>
                )} */}
                <div className={classes.iconBtn} onClick={handleShare}>
                  <ShareIcon />
                </div>
              </Box>
            </Hidden>
          </Box>
          <Box className={classes.description}>{realmData.worldDescription || ""}</Box>
          <Box className={classes.control}>
            {isSignedin && (
              <Hidden mdUp>
                <Box position="relative" display="flex">
                  <PrimaryButton className={classes.button} size="medium" onClick={handlePlay}>
                    <EnterIcon />
                    <Box px={5} pt={0.5}>
                      Enter realm
                    </Box>
                  </PrimaryButton>
                  <SecondaryButton
                    size="medium"
                    onClick={() => history.push("/creating_extension")}
                    style={{
                      background: "transparent",
                      textTransform: "uppercase",
                      height: 40,
                      minWidth: 250,
                      color: "#fff",
                      borderRadius: "100px",
                      marginLeft: 0,
                      marginTop: -48,
                    }}
                  >
                    Apply Extension
                  </SecondaryButton>
                </Box>
                <SecondaryButton size="medium" className={classes.mapButton}>
                  <MapIcon />
                  <Box px={2} pt={0.5}>
                    Open map
                  </Box>
                </SecondaryButton>
              </Hidden>
            )}
            <Hidden mdUp>
              <Box display="flex" alignItems="center">
                <Box className={classes.iconBtn}>
                  <PolygonIcon />
                </Box>
                <Box className={classes.iconBtn}>
                  <OpenSeaIcon />
                </Box>
                {isSignedin && (
                  <Box className={classes.iconBtn}>
                    <FruitSelect
                      fruitObject={fruitData}
                      onGiveFruit={handleFruit}
                      fruitWidth={32}
                      fruitHeight={32}
                      style={{ background: "transparent" }}
                    />
                  </Box>
                )}
                <div className={classes.iconBtn} onClick={handleShare}>
                  <ShareIcon />
                </div>
              </Box>
            </Hidden>
          </Box>
        </Box>
        <Box className={`${!isTablet ? classes.fitContent : undefined}`}>
          <Box className={classes.imageContainer}>
            {isSignedin && (
              <Box position="relative" display="flex" justifyContent="space-between" mb={4}>
                  <Hidden smDown>
                    <Box position="relative" display="flex">
                      <PrimaryButton className={classes.button} size="medium" onClick={handlePlay}>
                        <EnterIcon />
                        <Box px={5} pt={0.5}>
                          Enter realm
                        </Box>
                      </PrimaryButton>
                      <SecondaryButton
                        size="medium"
                        onClick={() => history.push(`/creating_extension/${realmData?.id}`)}
                        style={{
                          background: "transparent",
                          textTransform: "uppercase",
                          height: 48,
                          minWidth: 250,
                          color: "#fff",
                          borderRadius: "100px",
                          paddingTop: 4,
                        }}
                      >
                        Apply Extension
                      </SecondaryButton>
                    </Box>
                    <SecondaryButton size="medium" className={classes.mapButton}>
                      <MapIcon />
                      <Box px={2} pt={0.5}>
                        Open map
                      </Box>
                    </SecondaryButton>
                  </Hidden>
              </Box>
            )}
            {realmData.id ? (
              realmData.worldVideo ? (
                <div className={classes.videoCtn}>
                  {realmPublicState == REALM_PUBLIC_STATE.PUBLIC ? (
                    <Box className={classes.public}>
                      <UnlockedIcon />
                      <Box ml={1}>{realmPublicState} REALM</Box>
                    </Box>
                  ) : (
                    <Box className={classes.publicStateCtn}>
                      <Box className={classes.public}>
                        <LockedIcon />
                        <Box ml={1}>{realmPublicState} REALM</Box>
                      </Box>
                      <Box className={classes.seeDetailBtn} ml={1} onClick={() => {setOpenRealmRestrictedModal(true)}}>SEE DETAILS</Box>
                    </Box>
                  )}
                  
                  <video
                    autoPlay
                    muted
                    loop
                    style={{
                      // backgroundImage: `url("${realmData.worldImages[0]}")`,
                      backgroundImage: `url("${realmData.worldVideo}")`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  >
                    <source src={realmData.worldVideo} type="video/mp4" />
                  </video>
                  <Box className={classes.stat}>
                    <Box className={classes.statItem}>
                      <Box className={classes.val}>5</Box>
                      <Box className={classes.desc}>visitors online</Box>
                    </Box>
                    <div className={classes.statSplitter}></div>
                    <Box className={classes.statItem}>
                      <Box className={classes.val}>{realmData.realmTaxation}%</Box>
                      <Box className={classes.desc}>taxation</Box>
                    </Box>
                    <div className={classes.statSplitter}></div>
                    <Box className={classes.statItem}>
                      <Box className={classes.val}>{realmData.worldCount}</Box>
                      <Box className={classes.desc}>worlds</Box>
                    </Box>
                    <div className={classes.statSplitter}></div>
                    <Box className={classes.statItem}>
                      <Box className={classes.val}>{realmData.creatorCount}</Box>
                      <Box className={classes.desc}>creators</Box>
                    </Box>
                    <div className={classes.statSplitter}></div>
                    <Box className={classes.statItem}>
                      <Box className={classes.val}>{realmData.realmVotingConsensus}%</Box>
                      <Box className={classes.desc}>governance consensus</Box>
                    </Box>
                  </Box>
                </div>
              ) : (
                <img src={realmData.worldImage} alt="realm" />
              )
            ) : null}
          </Box>
        </Box>
        <Box className={classes.content}>
          <Box className={classes.fitContent}>
            <TabsView
              tabs={RealmDetailTabs}
              onSelectTab={tab => {
                setSelectedTab(tab.key);
              }}
              style={{
                justifyContent: "space-between",
              }}
            />
            <Box marginTop={5.65} marginBottom={4.5}>
              { selectedTab === "extensions" ? (
                <>
                  <Box className={classes.extensionHeader}>
                    <Box className={classes.gradientText}>Extensions</Box>
                    {isSignedin &&
                      (isLoadingMetaData ? (
                        <Box minWidth={250} display="flex" justifyContent="center">
                          <CircularProgress size={24} style={{ color: "#EEFF21" }} />
                        </Box>
                      ) : (
                        <PrimaryButton
                          size="medium"
                          className={classes.addExtensionBtn}
                          style={{
                            background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                            borderRadius: 100,
                            height: 48,
                            minWidth: 250,
                            fontSize: 18,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            color: "#212121",
                            paddingTop: 6,
                          }}
                          onClick={handleOpenExtensionModal}
                        >
                          Add Extension
                        </PrimaryButton>
                      ))}
                  </Box>
                  <Box mt={4}>
                    {realmData && realmData.extensions?.length ? (
                      <MasonryGrid
                        gutter={"16px"}
                        data={isLoading ? Array(loadingCount).fill(3) : realmData.extensions}
                        renderItem={(item, _) => <RealmCard item={item} isLoading={isLoading} />}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                      />
                    ) : (
                      <Box display="flex" justifyContent="center" width={1}>
                        No extensions
                      </Box>
                    )}
                  </Box>
                </>
              // ) : selectedTab === "avatars" ? (
              //   <>
              //     <Box className={classes.gradientText}>Avatars</Box>
              //     <Box mt={4}>
              //       <MasonryGrid
              //         gutter={"16px"}
              //         data={isLoadingCharacters ? Array(loadingCount).fill(3) : characters}
              //         renderItem={(item, _) => <AvatarCard item={item} isLoading={isLoadingCharacters} />}
              //         columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              //       />
              //     </Box>
              //   </>
              ) : selectedTab === "creators" ? (
                <>
                  <Box className={classes.gradientText}>Creators</Box>
                  <Box mt={2}>
                    {[1, 2].map(v => {
                      return (
                        <Box mt={3}>
                          <CreatorItem isLoading={false} />
                        </Box>
                      );
                    })}
                  </Box>
                </>
              // ) : selectedTab === "assets" ? (
              //   <Box className={classes.gradientText}>Assets</Box>
              ) : selectedTab === "land" ? (
                <>
                  <Box className={classes.gradientText}>Land</Box>
                </>
              ) : (
                <>
                  <Box className={classes.gradientText}>Voting</Box>
                  <Box mt={2}>
                    {[1, 2].map(v => {
                      return (
                        <Box mt={3}>
                          <VotingItem isLoading={false} />
                        </Box>
                      );
                    })}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {openNotAppModal && (
        <NotAppModal
          open={openNotAppModal}
          onClose={() => {
            setOpenNotAppModal(false);
          }}
        />
      )}
      {showPlayModal && (
        <OpenDesktopModal isPlay open={showPlayModal} onClose={() => setShowPlayModal(false)} />
      )}
      {openCreateExtensionModal && (
        <CreateExtensionDraftModal
          open={openCreateExtensionModal}
          onClose={() => setOpenCreateExtensionModal(false)}
          realmId={realmId}
          loadRealm={() => loadRealm(realmId)}
          metaData={metaDataForModal}
        />
      )}
      {openRealmRestrictedModal && (
        <RealmRestrictedModal
          open={openRealmRestrictedModal}
          onClose={() => setOpenRealmRestrictedModal(false)}
          realmId={realmId}
          loadRealm={() => loadRealm(realmId)}
          metaData={metaDataForModal}
        />
      )}
    </Box>
  );
}

const PolygonIcon = () => (
  <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.713 6.85534C19.475 6.72234 19.2069 6.65251 18.9343 6.65251C18.6617 6.65251 18.3936 6.72234 18.1556 6.85534L14.5827 8.92771L12.155 10.2792L8.58222 12.3516C8.34421 12.4845 8.07615 12.5543 7.80355 12.5543C7.53095 12.5543 7.26289 12.4845 7.02488 12.3516L4.1848 10.7298C3.95373 10.5973 3.76072 10.4074 3.62441 10.1786C3.4881 9.9497 3.4131 9.68956 3.40664 9.42327V6.22463C3.40344 5.95631 3.47442 5.69233 3.61173 5.46179C3.74904 5.23125 3.94735 5.04312 4.1848 4.91814L6.97901 3.34134C7.21702 3.20845 7.48508 3.13868 7.75768 3.13868C8.03028 3.13868 8.29834 3.20845 8.53635 3.34134L11.3306 4.91814C11.5616 5.05065 11.7546 5.24049 11.891 5.46935C12.0273 5.6982 12.1023 5.95833 12.1087 6.22463V8.29699L14.5364 6.9004V4.82803C14.5396 4.55972 14.4686 4.29574 14.3313 4.0652C14.194 3.83466 13.9957 3.64653 13.7582 3.52154L8.58222 0.548361C8.34421 0.415469 8.07615 0.345703 7.80355 0.345703C7.53095 0.345703 7.26289 0.415469 7.02488 0.548361L1.75653 3.52175C1.51912 3.64671 1.32082 3.83482 1.18351 4.06532C1.0462 4.29581 0.975215 4.55976 0.978375 4.82803V10.8199C0.975177 11.0882 1.04615 11.3522 1.18346 11.5827C1.32077 11.8132 1.51909 12.0014 1.75653 12.1264L7.02427 15.0997C7.26228 15.2326 7.53034 15.3024 7.80294 15.3024C8.07553 15.3024 8.3436 15.2326 8.58161 15.0997L12.1544 13.0724L14.582 11.6758L18.155 9.64853C18.393 9.51552 18.6611 9.44569 18.9337 9.44569C19.2063 9.44569 19.4744 9.51552 19.7124 9.64853L22.5066 11.2253C22.7376 11.3578 22.9306 11.5477 23.0669 11.7766C23.2032 12.0054 23.2783 12.2655 23.2847 12.5318V15.7305C23.2879 15.9988 23.217 16.2628 23.0796 16.4933C22.9423 16.7238 22.744 16.912 22.5066 17.0369L19.7124 18.6588C19.4744 18.7917 19.2063 18.8615 18.9337 18.8615C18.6611 18.8615 18.393 18.7917 18.155 18.6588L15.3608 17.082C15.1298 16.9495 14.9368 16.7596 14.8004 16.5308C14.6641 16.3019 14.5891 16.0418 14.5827 15.7755V13.7029L12.155 15.0995V17.1719C12.1518 17.4402 12.2228 17.7042 12.3601 17.9347C12.4974 18.1653 12.6957 18.3534 12.9332 18.4784L18.2009 21.4518C18.4389 21.5847 18.707 21.6544 18.9796 21.6544C19.2522 21.6544 19.5202 21.5847 19.7582 21.4518L25.026 18.4784C25.257 18.3459 25.45 18.156 25.5863 17.9272C25.7226 17.6983 25.7976 17.4382 25.8041 17.1719V11.1803C25.8073 10.912 25.7364 10.648 25.599 10.4174C25.4617 10.1869 25.2634 9.99877 25.026 9.87379L19.713 6.85534Z"
      fill="#212121"
    />
  </svg>
);

const OpenSeaIcon = () => (
  <svg width="23" height="27" viewBox="0 0 23 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip_001_opensea)">
      <path
        d="M22.5 11C22.5 17.0748 17.5748 22 11.5 22C5.42521 22 0.5 17.0748 0.5 11C0.5 4.92521 5.42521 0 11.5 0C17.5761 0 22.5 4.92521 22.5 11Z"
        fill="#212121"
      />
      <path
        d="M5.92697 11.3699L5.97443 11.2953L8.83597 6.81875C8.87779 6.75321 8.97611 6.75999 9.00774 6.83118C9.4858 7.90256 9.8983 9.23501 9.70505 10.0645C9.62255 10.4058 9.39653 10.8681 9.14223 11.2953C9.10947 11.3574 9.0733 11.4185 9.03487 11.4772C9.01678 11.5044 8.98627 11.5202 8.95349 11.5202H6.01059C5.93148 11.5202 5.88515 11.4343 5.92697 11.3699Z"
        fill="#C3FF50"
      />
      <path
        d="M18.6818 12.2018V12.9104C18.6818 12.9511 18.6569 12.9873 18.6207 13.0031C18.3992 13.098 17.6409 13.4461 17.3256 13.8846C16.5209 15.0046 15.9061 16.606 14.5319 16.606H8.79862C6.76663 16.606 5.12 14.9537 5.12 12.9149V12.8494C5.12 12.7951 5.16406 12.7511 5.21831 12.7511H8.41439C8.47766 12.7511 8.52399 12.8098 8.51836 12.872C8.49574 13.0799 8.53418 13.2924 8.63249 13.4856C8.82235 13.871 9.21565 14.1118 9.64058 14.1118H11.2228V12.8765H9.65866C9.57843 12.8765 9.53097 12.7838 9.57731 12.7183C9.59425 12.6923 9.61347 12.6652 9.6338 12.6347C9.78186 12.4245 9.99319 12.0978 10.2034 11.726C10.3469 11.4751 10.4859 11.2073 10.5978 10.9383C10.6204 10.8897 10.6385 10.84 10.6566 10.7914C10.6871 10.7055 10.7188 10.6252 10.7413 10.545C10.764 10.4772 10.782 10.406 10.8001 10.3393C10.8532 10.111 10.8758 9.86917 10.8758 9.61828C10.8758 9.51997 10.8713 9.41712 10.8623 9.3188C10.8577 9.21144 10.8442 9.10406 10.8306 8.9967C10.8216 8.90177 10.8046 8.80796 10.7866 8.70964C10.764 8.56611 10.7323 8.42373 10.6961 8.28018L10.6837 8.22595C10.6566 8.12761 10.634 8.03382 10.6024 7.9355C10.5131 7.62695 10.4102 7.32635 10.3017 7.04494C10.2622 6.93305 10.217 6.82569 10.1717 6.71833C10.1051 6.55672 10.0373 6.4098 9.97511 6.27079C9.94347 6.20749 9.91635 6.14985 9.88922 6.09109C9.85871 6.02441 9.82707 5.95773 9.79541 5.89445C9.77282 5.84586 9.74682 5.80065 9.72873 5.75544L9.53548 5.39831C9.50836 5.34971 9.55357 5.29207 9.60668 5.30677L10.8159 5.6345H10.8193C10.8216 5.6345 10.8227 5.63565 10.8238 5.63565L10.9832 5.67971L11.1584 5.72945L11.2228 5.74752V5.02875C11.2228 4.68179 11.5008 4.40039 11.8444 4.40039C12.0162 4.40039 12.1721 4.47046 12.284 4.5846C12.3959 4.69875 12.466 4.85471 12.466 5.02875V6.09562L12.5948 6.13177C12.605 6.13518 12.6151 6.13969 12.6242 6.14646C12.6558 6.1702 12.701 6.20523 12.7587 6.24819C12.8039 6.28434 12.8525 6.32843 12.9112 6.37364C13.0276 6.46742 13.1666 6.58836 13.3192 6.72737C13.3599 6.7624 13.3995 6.79857 13.4356 6.83473C13.6323 7.01782 13.8527 7.23254 14.0629 7.46988C14.1216 7.53656 14.1793 7.60436 14.238 7.67555C14.2968 7.74789 14.359 7.81908 14.4132 7.89029C14.4844 7.98522 14.5613 8.08354 14.6279 8.18639C14.6596 8.23499 14.6957 8.28471 14.7263 8.33331C14.8121 8.46326 14.8879 8.59777 14.9602 8.73226C14.9907 8.79441 15.0224 8.86221 15.0495 8.92889C15.1297 9.10859 15.193 9.29167 15.2337 9.47476C15.2461 9.51431 15.2552 9.55726 15.2597 9.59569V9.60473C15.2732 9.65896 15.2778 9.7166 15.2823 9.77536C15.3004 9.96298 15.2913 10.1506 15.2506 10.3393C15.2337 10.4196 15.2111 10.4953 15.184 10.5755C15.1568 10.6524 15.1297 10.7326 15.0947 10.8083C15.0269 10.9654 14.9466 11.1225 14.8517 11.2694C14.8212 11.3237 14.785 11.3813 14.7488 11.4356C14.7093 11.4932 14.6686 11.5474 14.6324 11.6006C14.5827 11.6684 14.5296 11.7396 14.4754 11.8029C14.4268 11.8695 14.377 11.9362 14.3228 11.995C14.2471 12.0843 14.1747 12.169 14.099 12.2504C14.0538 12.3035 14.0052 12.3578 13.9555 12.4064C13.9069 12.4606 13.8572 12.5092 13.812 12.5544C13.7363 12.6301 13.673 12.6889 13.6198 12.7375L13.4955 12.8516C13.4774 12.8675 13.4537 12.8765 13.4288 12.8765H12.466V14.1118H13.6775C13.9487 14.1118 14.2064 14.0157 14.4143 13.8394C14.4855 13.7772 14.7963 13.5083 15.1636 13.1025C15.176 13.089 15.1919 13.0788 15.21 13.0743L18.5563 12.1069C18.6185 12.0888 18.6818 12.1363 18.6818 12.2018Z"
        fill="#C3FF50"
      />
    </g>
    <defs>
      <clipPath id="clip_001_opensea">
        <rect width="22" height="27" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

const ShareIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.9963 16.2661L7.86463 12.7002M7.8545 9.80408L14.9929 6.23487M21.1184 17.7116C21.1184 19.496 19.6718 20.9426 17.8874 20.9426C16.103 20.9426 14.6564 19.496 14.6564 17.7116C14.6564 15.9272 16.103 14.4806 17.8874 14.4806C19.6718 14.4806 21.1184 15.9272 21.1184 17.7116ZM21.1184 4.78763C21.1184 6.57206 19.6718 8.01863 17.8874 8.01863C16.103 8.01863 14.6564 6.57206 14.6564 4.78763C14.6564 3.00321 16.103 1.55664 17.8874 1.55664C19.6718 1.55664 21.1184 3.00321 21.1184 4.78763ZM8.19441 11.2496C8.19441 13.0341 6.74785 14.4806 4.96342 14.4806C3.17899 14.4806 1.73242 13.0341 1.73242 11.2496C1.73242 9.46519 3.17899 8.01863 4.96342 8.01863C6.74785 8.01863 8.19441 9.46519 8.19441 11.2496Z"
      stroke="#212121"
      strokeWidth="2.23684"
    />
  </svg>
);

const EnterIcon = () => (
  <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15.418" cy="15.0957" r="15" fill="black" />
    <path
      d="M23.418 15.0957L11.418 22.0239L11.418 8.1675L23.418 15.0957Z"
      fill="url(#paint0_linear_enter_2783)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_enter_2783"
        x1="23.418"
        y1="6.61329"
        x2="22.6366"
        y2="25.9524"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EEFF21" />
        <stop offset="1" stopColor="#B7FF5C" />
      </linearGradient>
    </defs>
  </svg>
);

const ArrowIcon = ({ color = "white" }) => (
  <svg width="57" height="15" viewBox="0 0 57 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.29892 0.85612L7.15468 0.716853L7.01577 0.861441L0.855773 7.27344L0.72266 7.412L0.855773 7.55056L7.01577 13.9626L7.15218 14.1045L7.29628 13.9704L8.10828 13.2144L8.25661 13.0763L8.11656 12.9298L3.56791 8.172H55.756H55.956V7.972V6.852V6.652H55.756H3.56969L8.11618 1.92261L8.25449 1.77874L8.11092 1.64012L7.29892 0.85612Z"
      fill={color}
      stroke={color}
      strokeWidth="0.4"
    />
  </svg>
);

const LockedIcon = ({ color = "white" }) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.0909 11.8181H9.45457V8.27262C9.45457 7.3323 9.82811 6.4305 10.493 5.7656C11.1579 5.1007 12.0597 4.72716 13 4.72716C13.9403 4.72716 14.8421 5.1007 15.507 5.7656C16.1719 6.4305 16.5455 7.3323 16.5455 8.27262V9.45443H18.9091V8.27262C18.9091 6.70543 18.2866 5.20243 17.1784 4.09426C16.0702 2.98609 14.5672 2.36353 13 2.36353C11.4328 2.36353 9.92983 2.98609 8.82166 4.09426C7.71349 5.20243 7.09093 6.70543 7.09093 8.27262V11.8181H5.90911C5.59568 11.8181 5.29508 11.9426 5.07344 12.1642C4.85181 12.3859 4.72729 12.6865 4.72729 12.9999V22.4544C4.72729 22.7679 4.85181 23.0685 5.07344 23.2901C5.29508 23.5117 5.59568 23.6363 5.90911 23.6363H20.0909C20.4044 23.6363 20.705 23.5117 20.9266 23.2901C21.1482 23.0685 21.2728 22.7679 21.2728 22.4544V12.9999C21.2728 12.6865 21.1482 12.3859 20.9266 12.1642C20.705 11.9426 20.4044 11.8181 20.0909 11.8181ZM13 20.0908C12.5325 20.0908 12.0756 19.9522 11.6869 19.6925C11.2982 19.4327 10.9952 19.0636 10.8163 18.6317C10.6374 18.1998 10.5906 17.7245 10.6818 17.266C10.773 16.8075 10.9981 16.3864 11.3287 16.0558C11.6592 15.7253 12.0804 15.5001 12.5389 15.4089C12.9974 15.3177 13.4726 15.3645 13.9045 15.5434C14.3364 15.7223 14.7056 16.0253 14.9653 16.414C15.225 16.8027 15.3637 17.2597 15.3637 17.7272C15.3637 18.354 15.1146 18.9552 14.6714 19.3985C14.2281 19.8418 13.6269 20.0908 13 20.0908Z" fill="#E9FF26"/>
  </svg>
);

const UnlockedIcon = ({ color = "white" }) => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.875 15.625C14.3247 15.625 15.5 14.4497 15.5 13C15.5 11.5503 14.3247 10.375 12.875 10.375C11.4253 10.375 10.25 11.5503 10.25 13C10.25 14.4497 11.4253 15.625 12.875 15.625Z" fill="#E9FF26"/>
    <path d="M20.9162 9.30751C18.7824 7.17706 15.8903 5.98047 12.875 5.98047C9.85966 5.98047 6.96758 7.17706 4.83373 9.30751L1.75373 12.3788C1.58979 12.544 1.4978 12.7673 1.4978 13C1.4978 13.2327 1.58979 13.4561 1.75373 13.6213L4.83373 16.6925C6.96826 18.8217 9.86008 20.0174 12.875 20.0174C15.8899 20.0174 18.7817 18.8217 20.9162 16.6925L23.9962 13.6213C24.1602 13.4561 24.2521 13.2327 24.2521 13C24.2521 12.7673 24.1602 12.544 23.9962 12.3788L20.9162 9.30751ZM12.875 17.375C12.0097 17.375 11.1638 17.1184 10.4444 16.6377C9.72489 16.157 9.16414 15.4737 8.833 14.6742C8.50187 13.8748 8.41523 12.9952 8.58404 12.1465C8.75285 11.2978 9.16953 10.5183 9.78138 9.90642C10.3932 9.29456 11.1728 8.87788 12.0215 8.70907C12.8701 8.54026 13.7498 8.6269 14.5492 8.95803C15.3486 9.28917 16.0319 9.84992 16.5127 10.5694C16.9934 11.2889 17.25 12.1347 17.25 13C17.25 14.1603 16.789 15.2731 15.9686 16.0936C15.1481 16.9141 14.0353 17.375 12.875 17.375Z" fill="#E9FF26"/>
  </svg>
);

const MapIcon = ({ color = "white" }) => (
  <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.327 0.753663H19.7178V17.7684H22.2958C22.5691 17.7692 22.8309 17.8781 23.0241 18.0713C23.2173 18.2645 23.3262 18.5263 23.327 18.7996C23.325 19.0725 23.2157 19.3336 23.0228 19.5265C22.8298 19.7195 22.5687 19.8288 22.2958 19.8308H1.67192V4.87845H18.171V3.33165H0.125122V21.3776H23.327C23.5302 21.3778 23.7315 21.338 23.9193 21.2604C24.1071 21.1827 24.2777 21.0688 24.4214 20.9251C24.5651 20.7814 24.679 20.6108 24.7566 20.423C24.8343 20.2353 24.8741 20.034 24.8738 19.8308V2.30046C24.8741 2.09725 24.8343 1.89599 24.7566 1.7082C24.679 1.52042 24.5651 1.34979 24.4214 1.2061C24.2777 1.06242 24.1071 0.948491 23.9193 0.870853C23.7315 0.793216 23.5302 0.753392 23.327 0.753663Z" fill="#E9FF26"/>
    <path d="M7.34366 18.284C7.34366 18.4208 7.39798 18.5519 7.49467 18.6486C7.59136 18.7453 7.72251 18.7996 7.85925 18.7996H8.37485C8.5116 18.7996 8.64274 18.7453 8.73944 18.6486C8.83613 18.5519 8.89045 18.4208 8.89045 18.284V17.2529H9.40605C9.54279 17.2529 9.67394 17.1985 9.77063 17.1018C9.86732 17.0051 9.92165 16.874 9.92165 16.7373V14.6749H10.4372C10.574 14.6749 10.7051 14.6205 10.8018 14.5238C10.8985 14.4272 10.9528 14.296 10.9528 14.1593V13.6437C10.9528 13.5069 10.8985 13.3758 10.8018 13.2791C10.7051 13.1824 10.574 13.1281 10.4372 13.1281H7.85925V12.0969C7.996 12.0969 8.12714 12.0425 8.22384 11.9459C8.32053 11.8492 8.37485 11.718 8.37485 11.5813V11.0657H8.89045C9.02719 11.0657 9.15834 11.0114 9.25503 10.9147C9.35173 10.818 9.40605 10.6868 9.40605 10.5501V9.51888H9.92165C10.0584 9.51888 10.1895 9.46456 10.2862 9.36787C10.3829 9.27117 10.4372 9.14003 10.4372 9.00328V8.48768C10.4372 8.35094 10.3829 8.2198 10.2862 8.1231C10.1895 8.02641 10.0584 7.97209 9.92165 7.97209H7.34366V6.94089C7.34366 6.80415 7.28933 6.673 7.19264 6.57631C7.09595 6.47961 6.9648 6.42529 6.82806 6.42529H5.28126C5.14452 6.42529 5.01337 6.47961 4.91668 6.57631C4.81999 6.673 4.76567 6.80415 4.76567 6.94089V7.97209H3.73447C3.59772 7.97209 3.46658 8.02641 3.36989 8.1231C3.27319 8.2198 3.21887 8.35094 3.21887 8.48768V9.00328C3.21887 9.14003 3.27319 9.27117 3.36989 9.36787C3.46658 9.46456 3.59772 9.51888 3.73447 9.51888H4.76567V10.5501C4.76567 10.6868 4.81999 10.818 4.91668 10.9147C5.01337 11.0114 5.14452 11.0657 5.28126 11.0657H5.79686V11.5813C5.79686 11.718 5.85118 11.8492 5.94788 11.9459C6.04457 12.0425 6.17571 12.0969 6.31246 12.0969V13.1281H5.79686C5.66012 13.1281 5.52897 13.1824 5.43228 13.2791C5.33559 13.3758 5.28126 13.5069 5.28126 13.6437V14.1593C5.28126 14.296 5.33559 14.4272 5.43228 14.5238C5.52897 14.6205 5.66012 14.6749 5.79686 14.6749H6.31246V15.7061C6.31246 15.8428 6.36678 15.9739 6.46348 16.0706C6.56017 16.1673 6.69131 16.2217 6.82806 16.2217H7.34366V18.284Z" fill="#E9FF26"/>
    <path d="M16.6239 13.1281H18.1707V6.94092H13.5303C13.3936 6.94092 13.2624 6.99524 13.1657 7.09193C13.069 7.18863 13.0147 7.31977 13.0147 7.45652V8.48771C13.0147 8.62446 13.069 8.7556 13.1657 8.85229C13.2624 8.94899 13.3936 9.00331 13.5303 9.00331H14.0459V10.0345H12.4991C12.3625 10.0349 12.2316 10.0893 12.135 10.186C12.0384 10.2826 11.9839 10.4135 11.9835 10.5501V11.0657C11.9839 11.2023 12.0384 11.3332 12.135 11.4299C12.2316 11.5265 12.3625 11.5809 12.4991 11.5813H13.0147V13.1281H12.4991C12.3624 13.1281 12.2312 13.1824 12.1345 13.2791C12.0378 13.3758 11.9835 13.5069 11.9835 13.6437V14.1593C11.9835 14.296 12.0378 14.4272 12.1345 14.5239C12.2312 14.6206 12.3624 14.6749 12.4991 14.6749H13.0147V15.7061C13.0147 15.8428 13.069 15.974 13.1657 16.0707C13.2624 16.1674 13.3936 16.2217 13.5303 16.2217H14.0459V17.2529C14.0463 17.3895 14.1008 17.5204 14.1974 17.617C14.294 17.7136 14.4249 17.7681 14.5615 17.7685H16.1083C16.2449 17.7681 16.3758 17.7136 16.4725 17.617C16.5691 17.5204 16.6235 17.3895 16.6239 17.2529V15.7061H17.1395C17.2762 15.7061 17.4074 15.6518 17.5041 15.5551C17.6008 15.4584 17.6551 15.3272 17.6551 15.1905V14.6749C17.6551 14.5381 17.6008 14.407 17.5041 14.3103C17.4074 14.2136 17.2762 14.1593 17.1395 14.1593H16.6239V13.1281Z" fill="#E9FF26"/>
  </svg>
);

// const PolygonIcon = () => (
//   <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M17.3272 6.54011C17.1071 6.41709 16.8591 6.35251 16.607 6.35251C16.3549 6.35251 16.1069 6.41709 15.8868 6.54011L12.5823 8.45677L10.337 9.70677L7.03267 11.6234C6.81254 11.7463 6.56462 11.8109 6.3125 11.8109C6.06038 11.8109 5.81246 11.7463 5.59233 11.6234L2.96563 10.1234C2.75191 10.0009 2.5734 9.8253 2.44734 9.61364C2.32127 9.40198 2.2519 9.16139 2.24593 8.91511V5.95677C2.24297 5.70862 2.30861 5.46447 2.4356 5.25125C2.5626 5.03803 2.74602 4.86403 2.96563 4.74844L5.54991 3.29011C5.77004 3.1672 6.01796 3.10268 6.27008 3.10268C6.52219 3.10268 6.77012 3.1672 6.99025 3.29011L9.57453 4.74844C9.78824 4.87099 9.96675 5.04658 10.0928 5.25824C10.2189 5.4699 10.2883 5.71049 10.2942 5.95677V7.87344L12.5395 6.58177V4.66511C12.5424 4.41695 12.4768 4.1728 12.3498 3.95958C12.2228 3.74637 12.0394 3.57237 11.8198 3.45677L7.03267 0.706963C6.81254 0.584056 6.56462 0.519531 6.3125 0.519531C6.06038 0.519531 5.81246 0.584056 5.59233 0.706963L0.719793 3.45696C0.500212 3.57254 0.316814 3.74651 0.189821 3.95969C0.0628281 4.17287 -0.00282692 4.41698 9.57185e-05 4.66511V10.2068C-0.00286197 10.4549 0.0627765 10.6991 0.189771 10.9123C0.316766 11.1255 0.500183 11.2995 0.719793 11.4151L5.59176 14.1651C5.81189 14.288 6.05981 14.3525 6.31193 14.3525C6.56405 14.3525 6.81197 14.288 7.0321 14.1651L10.3365 12.2901L12.5817 10.9984L15.8863 9.12344C16.1064 9.00043 16.3543 8.93584 16.6064 8.93584C16.8586 8.93584 17.1065 9.00043 17.3266 9.12344L19.9109 10.5818C20.1246 10.7043 20.3031 10.8799 20.4292 11.0916C20.5552 11.3032 20.6246 11.5438 20.6306 11.7901V14.7484C20.6335 14.9966 20.5679 15.2407 20.4409 15.454C20.3139 15.6672 20.1305 15.8412 19.9109 15.9568L17.3266 17.4568C17.1065 17.5797 16.8586 17.6442 16.6064 17.6442C16.3543 17.6442 16.1064 17.5797 15.8863 17.4568L13.302 15.9984C13.0883 15.8759 12.9098 15.7003 12.7837 15.4886C12.6577 15.277 12.5883 15.0364 12.5823 14.7901V12.8733L10.337 14.1649V16.0816C10.3341 16.3297 10.3997 16.5739 10.5267 16.7871C10.6537 17.0003 10.8371 17.1743 11.0567 17.2899L15.9287 20.0399C16.1488 20.1628 16.3967 20.2274 16.6489 20.2274C16.901 20.2274 17.1489 20.1628 17.369 20.0399L22.241 17.2899C22.4547 17.1674 22.6332 16.9918 22.7593 16.7801C22.8853 16.5684 22.9547 16.3279 22.9607 16.0816V10.5401C22.9637 10.292 22.898 10.0478 22.771 9.83458C22.644 9.62137 22.4606 9.44737 22.241 9.33177L17.3272 6.54011Z" fill="#E9FF26"/>
//   </svg>
// );

// const OpenSeaIcon = () => (
//   <svg width="23" height="27" viewBox="0 0 23 27" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <g clip-path="url(#clip0_6785_421667)">
//       <path d="M22.5 11C22.5 17.0748 17.5748 22 11.5 22C5.42521 22 0.5 17.0748 0.5 11C0.5 4.92521 5.42521 0 11.5 0C17.5761 0 22.5 4.92521 22.5 11Z" fill="#212121"/>
//       <path d="M5.92685 11.3699L5.9743 11.2953L8.83584 6.81875C8.87767 6.75321 8.97598 6.75999 9.00762 6.83118C9.48568 7.90256 9.89818 9.23501 9.70493 10.0645C9.62243 10.4058 9.3964 10.8681 9.14211 11.2953C9.10935 11.3574 9.07318 11.4185 9.03475 11.4772C9.01666 11.5044 8.98615 11.5202 8.95337 11.5202H6.01047C5.93136 11.5202 5.88503 11.4343 5.92685 11.3699Z" fill="#C3FF50"/>
//       <path d="M18.6816 12.2008V12.9094C18.6816 12.9501 18.6568 12.9863 18.6206 13.0021C18.3991 13.097 17.6408 13.4451 17.3255 13.8836C16.5208 15.0036 15.906 16.605 14.5317 16.605H8.79849C6.76651 16.605 5.11987 14.9527 5.11987 12.9139V12.8484C5.11987 12.7942 5.16394 12.7501 5.21819 12.7501H8.41426C8.47754 12.7501 8.52387 12.8088 8.51824 12.871C8.49562 13.0789 8.53405 13.2914 8.63237 13.4847C8.82223 13.8701 9.21553 14.1108 9.64046 14.1108H11.2227V12.8755H9.65854C9.57831 12.8755 9.53085 12.7828 9.57718 12.7173C9.59412 12.6913 9.61335 12.6642 9.63368 12.6337C9.78174 12.4235 9.99307 12.0969 10.2033 11.725C10.3468 11.4742 10.4858 11.2063 10.5977 10.9373C10.6203 10.8887 10.6384 10.839 10.6565 10.7904C10.687 10.7045 10.7186 10.6243 10.7412 10.544C10.7638 10.4762 10.7819 10.405 10.8 10.3383C10.8531 10.11 10.8757 9.8682 10.8757 9.61731C10.8757 9.51899 10.8712 9.41614 10.8622 9.31782C10.8576 9.21046 10.8441 9.10308 10.8305 8.99572C10.8215 8.90079 10.8045 8.80698 10.7864 8.70866C10.7638 8.56514 10.7322 8.42275 10.696 8.2792L10.6836 8.22497C10.6565 8.12663 10.6339 8.03285 10.6022 7.93453C10.5129 7.62598 10.4101 7.32537 10.3016 7.04397C10.262 6.93208 10.2168 6.82472 10.1716 6.71736C10.105 6.55574 10.0371 6.40883 9.97499 6.26981C9.94335 6.20652 9.91622 6.14888 9.8891 6.09011C9.85858 6.02343 9.82695 5.95675 9.79529 5.89348C9.7727 5.84488 9.74669 5.79967 9.72861 5.75446L9.53536 5.39733C9.50824 5.34874 9.55345 5.2911 9.60655 5.30579L10.8158 5.63353H10.8192C10.8215 5.63353 10.8226 5.63467 10.8237 5.63467L10.9831 5.67874L11.1583 5.72848L11.2227 5.74654V5.02778C11.2227 4.68082 11.5007 4.39941 11.8443 4.39941C12.016 4.39941 12.172 4.46948 12.2839 4.58362C12.3958 4.69778 12.4658 4.85374 12.4658 5.02778V6.09465L12.5947 6.13079C12.6048 6.1342 12.615 6.13871 12.6241 6.14549C12.6557 6.16923 12.7009 6.20425 12.7585 6.24722C12.8037 6.28336 12.8523 6.32745 12.9111 6.37266C13.0275 6.46645 13.1665 6.58738 13.3191 6.7264C13.3598 6.76142 13.3993 6.79759 13.4355 6.83376C13.6322 7.01684 13.8525 7.23156 14.0627 7.4689C14.1215 7.53558 14.1791 7.60338 14.2379 7.67458C14.2967 7.74691 14.3588 7.8181 14.4131 7.88932C14.4843 7.98425 14.5611 8.08257 14.6278 8.18542C14.6594 8.23401 14.6956 8.28373 14.7261 8.33233C14.812 8.46229 14.8877 8.59679 14.9601 8.73128C14.9906 8.79343 15.0222 8.86123 15.0494 8.92792C15.1296 9.10761 15.1929 9.2907 15.2336 9.47378C15.246 9.51334 15.255 9.55628 15.2596 9.59471V9.60376C15.2731 9.65799 15.2776 9.71563 15.2822 9.77439C15.3002 9.962 15.2912 10.1496 15.2505 10.3383C15.2336 10.4186 15.211 10.4943 15.1838 10.5746C15.1567 10.6514 15.1296 10.7316 15.0946 10.8074C15.0268 10.9644 14.9465 11.1215 14.8516 11.2685C14.8211 11.3227 14.7849 11.3803 14.7487 11.4346C14.7092 11.4922 14.6685 11.5465 14.6323 11.5996C14.5826 11.6674 14.5295 11.7386 14.4752 11.8019C14.4266 11.8686 14.3769 11.9353 14.3227 11.994C14.2469 12.0833 14.1746 12.1681 14.0989 12.2494C14.0537 12.3025 14.0051 12.3568 13.9554 12.4054C13.9068 12.4596 13.857 12.5082 13.8118 12.5534C13.7361 12.6292 13.6728 12.6879 13.6197 12.7365L13.4954 12.8507C13.4773 12.8665 13.4536 12.8755 13.4287 12.8755H12.4658V14.1108H13.6773C13.9486 14.1108 14.2063 14.0147 14.4142 13.8384C14.4854 13.7763 14.7962 13.5073 15.1635 13.1016C15.1759 13.088 15.1918 13.0778 15.2098 13.0733L18.5562 12.1059C18.6184 12.0878 18.6816 12.1353 18.6816 12.2008Z" fill="#C3FF50"/>
//     </g>
//     <defs>
//       <clipPath id="clip0_6785_421667">
//         <rect width="22" height="27" fill="white" transform="translate(0.5)"/>
//       </clipPath>
//     </defs>
//   </svg>
// );
