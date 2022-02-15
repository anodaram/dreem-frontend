import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

import { Grid, useTheme, useMediaQuery, CircularProgress } from "@material-ui/core";

import * as UserConnectionsAPI from "shared/services/API/UserConnectionsAPI";
import { useTypedSelector } from "store/reducers/Reducer";
import { setUser } from "store/actions/User";
import { setSelTabProfile } from "store/actions/SelectedProfilePage";
import { RootState } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Avatar from "shared/ui-kit/Avatar";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import URL from "shared/functions/getURL";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import { usePageRefreshContext } from "shared/contexts/PageRefreshContext";
import TabsView from "shared/ui-kit/TabsView";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import RealmCard from "components/PriviMetaverse/components/cards/RealmCard";
import NFTCard from "components/PriviMetaverse/subPages/CreatorPage/NFTCard";
import AvatarCard from "components/PriviMetaverse/components/cards/AvatarCard";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import ImageCropModal from "components/PriviMetaverse/modals/ImageCropModal";
import CollectionCard from "components/PriviMetaverse/components/cards/CollectionCard";
import { FilterAssetTypeOptionValues } from "shared/constants/constants";
import EditProfileModal from "../../modals/EditProfileModal";
import VerifyProfileModal from "../../modals/VerifyProfileModal";
import RealmExtensionProfileCard from "../../components/cards/RealmExtensionProfileCard";
import WorldCard from "../../components/cards/WorldCard";
import FollowProfileModal from "../../modals/FollowProfileModal";
import { creatorPageStyles } from "./index.styles";

const ProfileTabs = [
  {
    key: "drafts",
    title: "Drafts",
  },
  {
    key: "liked",
    title: "Liked Content",
  },
  {
    key: "wip",
    title: "WIP",
  },
];
const MAX_NAME_LENGTH = 20;

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 3,
};

export default function CreatorPage() {
  const classes = creatorPageStyles();
  const dispatch = useDispatch();
  const selTab = useSelector((state: RootState) => state.selectedProfilePage.selectedTabProfile);

  const width = useWindowDimensions().width;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { creatorAddress } = useParams<{ creatorAddress: string }>();
  const userSelector = useTypedSelector(state => state.user);
  const [userInfo, setUserInfo] = useState<any>({ ...userSelector });
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [nftContents, setNftContents] = useState<any[]>([]);
  const [likedRealms, setLikedRealms] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [likedAvatars, setLikedAvatars] = useState<any[]>([]);
  const [openFollowProfileModal, setOpenFollowProfileModal] = useState<boolean>(false);
  const [followsList, setFollowsList] = useState<any[]>([]);
  const [isLoadingFollows, setIsLoadingFollows] = useState<boolean>(false);
  const [isFollowingList, setIsFollowingList] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean | undefined>();
  const [selectedTab, setSelectedTab] = useState<string>(selTab || "drafts");
  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const [isFollowing, setIsFollowing] = useState<number>(-1);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openVerifyProfileModal, setOpenVerifyProfileModal] = useState<boolean>(false);
  const [openAvartaImageCropModal, setOpenAvartaImageCropModal] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<any>();
  const { shareMedia } = useShareMedia();
  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const { profileAvatarChanged, setProfileAvatarChanged } = usePageRefreshContext();
  const [openActionBox, setOpenActionBox] = useState<boolean>(false);
  const inputRef = useRef<any>();

  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    // check owner
    setUserInfo({ ...userSelector });
    if (userSelector && userSelector.address) {
      setIsOwner(userSelector.address === userInfo?.address);
    }
  }, [userInfo?.address, userSelector.address]);

  useEffect(() => {
    setSelectedTab("");
    (async () => {
      try {
        setLoadingProfile(true);
        const userResp = await axios.get(`${URL()}/user/getBasicInfo/${creatorAddress}/`);
        const userData = userResp.data.data;

        if (userResp.data.success) {
          setUserInfo({ ...userData });
          setSelectedTab(selTab || "drafts");
        } else {
          throw new Error("Can't find user from privi database");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [creatorAddress]);

  useEffect(() => {
    if (isOwner === false && userInfo?.id) {
      setIsFollowing(isUserFollowed(userInfo.id));
    }
  }, [userInfo?.id, isOwner]);

  useEffect(() => {
    if (userInfo.id) {
      loadData(true);
    }
  }, [selectedTab, userInfo]);

  const loadData = async (init = false) => {
    try {
      setLoading(true);
      if (selectedTab === "drafts") {
        const page = init ? 1 : curPage;
        const resCollections = await MetaverseAPI.getAssets(
          12,
          page,
          "DESC",
          ["COLLECTION"],
          undefined,
          userInfo?.id
        );
        if (resCollections.success) {
          const newCollectionData = resCollections.data.elements;
          setCollections(prev => (init ? newCollectionData : [...prev, ...newCollectionData]));
          setCurPage(page + 1);
          setHasMore(resCollections.data.page.cur < resCollections.data.page.max);
        }

        const resDrafts = await MetaverseAPI.getAssets(
          12,
          page,
          "DESC",
          FilterAssetTypeOptionValues,
          undefined,
          userInfo?.id,
          undefined,
          undefined,
          false,
          false,
          undefined
        );

        if (resDrafts.success) {
          const newDraftData = resDrafts.data.elements;
          setNftContents(prev => (init ? newDraftData : [...prev, ...newDraftData]));
          setCurPage(page + 1);
          setHasMore(resCollections.data.page.cur < resCollections.data.page.max);
        }
      } else if (selectedTab === "liked") {
        let itemIds: Number[] = [];
        // get liked realms
        const respRealmIds = await axios.get(`${URL()}/dreemRealm/getLikedRealms`, {
          params: {
            userId: userInfo?.id,
          },
        });
        if (respRealmIds?.data?.data?.length > 0) {
          for (let id of respRealmIds.data.data) {
            itemIds.push(parseInt(id));
          }
          const realmsResp = await MetaverseAPI.getAssets(
            12,
            1,
            "DESC",
            undefined,
            true,
            undefined,
            itemIds,
            undefined,
            false
          );
          if (realmsResp.success) {
            setLikedRealms([...realmsResp.data.elements]);
          }
        } else {
          setLikedRealms([]);
        }

        // get liked avatars
        itemIds = [];
        const respAvatarIds = await axios.get(`${URL()}/dreemRealm/characterGetLiked`, {
          params: {
            userId: userInfo?.id,
          },
        });
        if (respAvatarIds?.data?.data?.length > 0) {
          for (let id of respAvatarIds.data.data) {
            itemIds.push(parseInt(id));
          }
          const avatarResp = await MetaverseAPI.getCharacters(undefined, undefined, itemIds);
          setLikedAvatars(avatarResp.data.elements);
        } else {
          setLikedAvatars([]);
        }

        setHasMore(false);
        return;
      } else if (selectedTab === "wip") {
        MetaverseAPI.getUnfinishedNFTs().then(res => {
          if (res.success) {
            const items = res.data.elements;
            if (items && items.length > 0) {
              setNfts(res.data.elements);
            }
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    loadData(true);
  };

  const handleProfileRefresh = async () => {
    try {
      setLoadingProfile(true);
      const userResp = await axios.get(`${URL()}/user/getBasicInfo/${userInfo.id}`);
      if (userResp.data.success) {
        setUserInfo(prev => ({ ...prev, ...userResp.data.data }));
        return true;
      } else {
        throw new Error("update failed");
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const fileInput = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      setImageFile(files[0]);
      setOpenAvartaImageCropModal(true);
    }
  };

  const handleImage = async (file: any) => {
    // image to file
    let metadataID = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file));

    axios
      .post(`${URL()}/user/changeProfilePhoto/saveMetadata/${userSelector.id}`, metadataID)
      .then(res => {
        if (res.data.data) {
          let setterUser: any = {
            ...userSelector,
            infoImage: res.data.data.body,
            urlIpfsImage: res.data.data.urlIpfsImage,
          };
          setterUser.hasPhoto = true;
          if (setterUser.id) {
            dispatch(setUser(setterUser));
            setUserInfo(prev => ({
              ...prev,
              infoImage: setterUser.infoImage,
              urlIpfsImage: setterUser.urlIpfsImage,
            }));
          }
          setProfileAvatarChanged(Date.now());
        }
      })
      .catch(error => {
        console.log("Error", error);
      });
  };

  const getCreatorName = useMemo(() => {
    const creatorName = userInfo?.name;
    if (!creatorName) {
      return "";
    } else if (creatorName > MAX_NAME_LENGTH) {
      return `${creatorName?.substring(0, 6)}...${creatorName?.substring(
        creatorName?.length - 11,
        creatorName.length
      )} `;
    } else {
      return creatorName;
    }
  }, [userInfo]);

  const getCreatorSlug = useMemo(() => {
    const creatorSlug = userInfo?.urlSlug || "";
    if (creatorSlug > MAX_NAME_LENGTH) {
      return `${creatorSlug?.substring(0, 6)}...${creatorSlug?.substring(
        creatorSlug?.length - 11,
        creatorSlug.length
      )} `;
    } else {
      return creatorSlug;
    }
  }, [userInfo]);

  const onVerifyProfileClicked = () => {
    setOpenVerifyProfileModal(true);
  };

  const openFollowProfileClicked = isFollowing => {
    setOpenFollowProfileModal(true);
    setIsFollowingList(isFollowing);

    if (isFollowing) {
      getFollowing();
    } else {
      getFollowers();
    }
  };

  const getFollowing = async () => {
    try {
      setIsLoadingFollows(true);
      const following = (await UserConnectionsAPI.getFollowings(userInfo?.id, !!isOwner)) as any[];
      setFollowsList(following.filter(item => item.isFollowing === 2) || []);
    } catch (error) {
      console.log("error", error);
      setFollowsList([]);
    }
    setIsLoadingFollows(false);
  };

  const getFollowers = async () => {
    try {
      setIsLoadingFollows(true);
      const followers = (await UserConnectionsAPI.getFollowers(userInfo?.id, !!isOwner)) as any[];
      setFollowsList(followers.filter(item => item.isFollower === 2) || []);
    } catch (error) {
      console.log("error", error);
      setFollowsList([]);
    }
    setIsLoadingFollows(false);
  };

  const onFollowUser = e => {
    e.stopPropagation();
    e.preventDefault();

    const userId = userInfo?.id;
    if (isFollowing < 0 || !userId || isOwner !== false) return;

    setIsLoading(true);
    if (!isFollowing) {
      followUser(userId).then(_ => {
        setIsFollowing(1);
        setIsLoading(false);
      });
    } else {
      unfollowUser(userId).then(_ => {
        setIsFollowing(0);
        setIsLoading(false);
      });
    }
  };

  const loadingCount = React.useMemo(() => (width > 1000 ? 6 : width > 600 ? 3 : 6), [width]);

  return (
    <>
      <div className={classes.root}>
        <Box className={classes.container} id="scrollContainer">
          <Box position="relative" width={1} minHeight={1}>
            <img
              src={require("assets/metaverseImages/profile_decoration_image_1.png")}
              alt="decoration_1"
              className={classes.decorationImage1}
            />
            <img
              src={require("assets/metaverseImages/profile_decoration_image_2.png")}
              alt="decoration_2"
              className={classes.decorationImage2}
            />
            <Box className={classes.fitContent}>
              <div className={classes.profileSection}>
                <LoadingWrapper loading={loadingProfile} theme="light dark">
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box className={classes.avatarBox}>
                      <Avatar
                        size={isMobile ? 83 : 126}
                        image={userInfo?.urlIpfsImage || getDefaultAvatar()}
                        onClick={() => {
                          if (isOwner) {
                            if (inputRef && inputRef.current) {
                              inputRef.current.value = "";
                              inputRef.current.click();
                            }
                          }
                        }}
                      />
                      <InputWithLabelAndTooltip
                        hidden
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                        onInputValueChange={fileInput}
                        reference={inputRef}
                      />
                    </Box>
                    <Box className={classes.actionButtonContainer}>
                      <PrimaryButton
                        size="medium"
                        isRounded
                        style={{
                          background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                          borderRadius: 10,
                          minWidth: 160,
                          textTransform: "uppercase",
                          fontSize: 16,
                          fontWeight: 700,
                          fontFamily: "GRIFTER",
                          color: "#212121",
                          paddingTop: 3,
                        }}
                        onClick={() => setOpenActionBox(true)}
                      >
                        ACTIONS{" "}
                        <span style={{ marginLeft: 16 }}>
                          <ActionsIcon />
                        </span>
                      </PrimaryButton>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box className={classes.profileContent}>
                      <Box display="flex" flexDirection="column" maxWidth={1}>
                        {userInfo?.twitterVerified && (
                          <Box display="flex" alignItems="center">
                            <img
                              src={require("assets/icons/verified_filled_yellow.png")}
                              style={{ marginRight: "4px" }}
                            />
                            <div className={classes.verify}>VERIFIED PROFILE</div>
                          </Box>
                        )}
                        <div className={classes.typo2}>{getCreatorName}</div>
                      </Box>
                      <Box className={classes.actionButtonsContainer}>
                        <Box className={classes.profileContentButtons}>
                          <PrimaryButton
                            size="medium"
                            isRounded
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#fff",
                              borderRadius: 10,
                              padding: "7px 10px",
                              minWidth: 43,
                            }}
                            onClick={() => shareMedia("Creator", `profile/${userInfo?.address}`)}
                          >
                            <ShapeIcon />
                          </PrimaryButton>
                          {isOwner === undefined ? null : isOwner ? (
                            <>
                              {!userSelector?.twitterVerified && (
                                <PrimaryButton
                                  size="medium"
                                  isRounded
                                  style={{
                                    background: "#fff",
                                    borderRadius: 10,
                                    minWidth: 187,
                                    textTransform: "uppercase",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    fontFamily: "GRIFTER",
                                    color: "#212121",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <VerifyIcon />
                                  <Box ml={1} mt={0.5} onClick={onVerifyProfileClicked}>
                                    Verify Profile
                                  </Box>
                                </PrimaryButton>
                              )}
                              <PrimaryButton
                                size="medium"
                                isRounded
                                style={{
                                  background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                                  borderRadius: 10,
                                  minWidth: 160,
                                  textTransform: "uppercase",
                                  fontSize: 16,
                                  fontWeight: 700,
                                  fontFamily: "GRIFTER",
                                  color: "#212121",
                                  paddingTop: 3,
                                }}
                                onClick={() => setOpenEditModal(true)}
                              >
                                Edit Profile
                              </PrimaryButton>
                            </>
                          ) : (
                            isFollowing > -1 &&
                            (isLoading ? (
                              <CircularProgress size={24} style={{ color: "#FF5954", marginLeft: 16 }} />
                            ) : (
                              <PrimaryButton
                                size="medium"
                                isRounded
                                style={{
                                  background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                                  borderRadius: 10,
                                  minWidth: 160,
                                  textTransform: "uppercase",
                                  fontSize: 16,
                                  fontWeight: 700,
                                  fontFamily: "GRIFTER",
                                  color: "#212121",
                                  paddingTop: 3,
                                }}
                                onClick={onFollowUser}
                              >
                                {isFollowing === 0
                                  ? "Follow"
                                  : isFollowing === 1
                                  ? "Cancel request"
                                  : "Unfollow"}
                              </PrimaryButton>
                            ))
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <Box className={classes.profileMetaBox} mt={2}>
                      <Box className={classes.typo3}>{`@${getCreatorSlug}`}</Box>
                      <Box className={classes.metaBoxDivider} />
                      {userInfo?.address && (
                        <Box display="flex" alignItems="center">
                          <img src={require("assets/walletImages/metamask.svg")} width={25} />
                          <Box ml={1} className={classes.typo4}>
                            {`${userInfo?.address?.substring(0, 6)}...${userInfo?.address?.substring(
                              userInfo?.address?.length - 11,
                              userInfo?.address.length
                            )} `}
                          </Box>
                        </Box>
                      )}
                      <Box className={classes.metaBoxDivider} />
                    </Box>
                    <Box mt={3} width={1} className={classes.typo3} style={{ color: "#fff" }}>
                      {userInfo ? userInfo.bio : ""}
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-start" mt={3}>
                      {userInfo?.twitter && (
                        <Box
                          className={classes.socialLinkButton}
                          style={{ background: "#1DA1F2" }}
                          onClick={() => {
                            window.open(`https://twitter.com/${userInfo?.twitter}`, "_blank");
                          }}
                        >
                          <TwitterIcon />
                        </Box>
                      )}
                      {userInfo?.instagram && (
                        <Box
                          className={classes.socialLinkButton}
                          style={{
                            background:
                              "linear-gradient(0deg, #FA347C, #FA347C), radial-gradient(93.71% 93.71% at -0.18% 88.78%, #FFC050 0%, #AE3AA3 57%, #5459CA 100%)",
                          }}
                          ml={1}
                          onClick={() => {
                            window.open(`https://www.instagram.com/${userInfo?.instagram}`, "_blank");
                          }}
                        >
                          <InstagramIcon />
                        </Box>
                      )}
                      {userInfo?.facebook && (
                        <Box
                          className={classes.socialLinkButton}
                          style={{
                            background:
                              "linear-gradient(0deg, #3B5998, #3B5998), radial-gradient(93.71% 93.71% at -0.18% 88.78%, #FFC050 0%, #AE3AA3 57%, #5459CA 100%)",
                          }}
                          ml={1}
                          onClick={() => {
                            window.open(`https://www.facebook.com/${userInfo?.facebook}`, "_blank");
                          }}
                        >
                          <FacebookIcon />
                        </Box>
                      )}
                    </Box>
                    <Box className={classes.profileMetaBox} mt={3} maxWidth="460px" width="fit-content">
                      <Box className={classes.followingBox}>
                        <Box display="flex" flexDirection="column" flex="1">
                          <div className={classes.typo5}>{userInfo?.numFollowers || "0"}</div>
                          <Box
                            className={classes.typo6}
                            mt={1}
                            style={{ cursor: "pointer" }}
                            onClick={() => !!isOwner && openFollowProfileClicked(false)}
                          >
                            Followers
                          </Box>
                        </Box>
                        <Box className={classes.metaBoxDivider1} />
                        <Box display="flex" flexDirection="column" flex="1">
                          <div className={classes.typo5}>{userInfo?.numFollowings || "0"}</div>
                          <Box
                            className={classes.typo6}
                            mt={1}
                            style={{ cursor: "pointer" }}
                            onClick={() => !!isOwner && openFollowProfileClicked(true)}
                          >
                            Following
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </LoadingWrapper>
              </div>
              <div className={classes.nftContentSection}>
                <TabsView
                  tabs={isOwner ? ProfileTabs : ProfileTabs.filter(t => t.key != "wip")}
                  onSelectTab={tab => {
                    setSelectedTab(tab.key);
                    dispatch(setSelTabProfile(tab.key));
                  }}
                  equalTab
                  mt={4}
                  seletedTabIndex={ProfileTabs.findIndex(tab => tab.key === selectedTab)}
                />
                <div className={classes.nftContent}>
                  <Box display="flex" flexDirection="column">
                    {selectedTab === "drafts" && (
                      <>
                        <Box mt={3} mb={2} className={classes.typo7}>
                          Collections
                        </Box>
                        <InfiniteScroll
                          hasChildren={collections?.length > 0}
                          dataLength={collections?.length}
                          scrollableTarget={"scrollContainer"}
                          next={loadData}
                          hasMore={hasMore}
                          loader={
                            loading && (
                              <Box mt={2}>
                                <MasonryGrid
                                  gutter={"16px"}
                                  data={Array(loadingCount).fill(0)}
                                  renderItem={(item, _) => (
                                    <RealmExtensionProfileCard nft={{}} isLoading={true} />
                                  )}
                                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                                />
                              </Box>
                            )
                          }
                        >
                          <Grid container spacing={3} style={{ marginBottom: 24 }}>
                            {collections?.map((item, index) => (
                              <Grid item key={`trending-pod-${index}`} md={4} sm={6} xs={12}>
                                <CollectionCard item={{ ...item }} hideInfo handleRefresh={handleRefresh} />
                              </Grid>
                            ))}
                          </Grid>
                        </InfiniteScroll>
                        {!loading && collections?.length < 1 && (
                          <Box textAlign="center" width="100%" mb={10} mt={2}>
                            No Collections
                          </Box>
                        )}
                        <Box mt={3} mb={2} className={classes.typo7}>
                          Created Drafts
                        </Box>
                        <InfiniteScroll
                          hasChildren={nftContents?.length > 0}
                          dataLength={nftContents?.length}
                          scrollableTarget={"scrollContainer"}
                          next={loadData}
                          hasMore={hasMore}
                          loader={
                            loading && (
                              <Box mt={2}>
                                <MasonryGrid
                                  gutter={"16px"}
                                  data={Array(loadingCount).fill(0)}
                                  renderItem={(item, _) => (
                                    <RealmExtensionProfileCard nft={{}} isLoading={true} />
                                  )}
                                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                                />
                              </Box>
                            )
                          }
                        >
                          <Grid container spacing={3} style={{ marginBottom: 24 }}>
                            {nftContents?.map((nft, index) => (
                              <Grid item key={`trending-pod-${index}`} md={4} sm={6} xs={12}>
                                <WorldCard
                                  nft={{ ...nft }}
                                  hideInfo
                                  handleRefresh={handleRefresh}
                                  selectable={false}
                                  selected={false}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </InfiniteScroll>
                        {!loading && nftContents?.length < 1 && (
                          <Box textAlign="center" width="100%" mb={10} mt={2}>
                            No drafts
                          </Box>
                        )}
                      </>
                    )}
                    {selectedTab === "liked" && (
                      <>
                        <Box mt={3} mb={2} className={classes.typo7}>
                          Liked Realms
                        </Box>
                        <InfiniteScroll
                          hasChildren={likedRealms?.length > 0}
                          dataLength={likedRealms?.length}
                          scrollableTarget={"scrollContainer"}
                          next={loadData}
                          hasMore={hasMore}
                          loader={
                            loading && (
                              <Box mt={2}>
                                <MasonryGrid
                                  gutter={"16px"}
                                  data={Array(loadingCount).fill(0)}
                                  renderItem={(item, _) => <RealmCard isLoading={true} />}
                                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                                />
                              </Box>
                            )
                          }
                        >
                          <Grid container spacing={3} style={{ marginBottom: 24 }}>
                            {likedRealms?.map((item, index) => (
                              <Grid item key={`liked-realm-${index}`} md={4} sm={6} xs={12}>
                                <RealmCard item={item} disableEffect popup isLoading={loading} />
                              </Grid>
                            ))}
                          </Grid>
                        </InfiniteScroll>
                        {!loading && likedRealms?.length < 1 && (
                          <Box textAlign="center" width="100%" mb={10} mt={2}>
                            No realms
                          </Box>
                        )}

                        <Box mt={3} mb={2} className={classes.typo7}>
                          Liked Avatars
                        </Box>
                        <InfiniteScroll
                          hasChildren={likedAvatars?.length > 0}
                          dataLength={likedAvatars?.length}
                          scrollableTarget={"scrollContainer"}
                          next={loadData}
                          hasMore={hasMore}
                          loader={
                            loading && (
                              <Box mt={2}>
                                <MasonryGrid
                                  gutter={"16px"}
                                  data={Array(loadingCount).fill(0)}
                                  renderItem={(item, _) => <AvatarCard isLoading={true} />}
                                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                                />
                              </Box>
                            )
                          }
                        >
                          <Grid container spacing={3} style={{ marginBottom: 24 }}>
                            {likedAvatars?.map((item, index) => (
                              <Grid item key={`liked-realm-${index}`} lg={3} md={4} sm={6} xs={12}>
                                <AvatarCard item={item} isLoading={loading} />
                              </Grid>
                            ))}
                          </Grid>
                        </InfiniteScroll>
                        {!loading && likedAvatars?.length < 1 && (
                          <Box textAlign="center" width="100%" mb={10} mt={2}>
                            No avatars
                          </Box>
                        )}
                      </>
                    )}
                    {selectedTab === "wip" && (
                      <>
                        <Box mt={3} mb={2} className={classes.typo7}>
                          Unfinished Minting
                        </Box>
                        {nfts?.length > 0 && <NFTCard items={nfts} disableEffect popup isLoading={loading} />}
                        {!loading && nfts?.length < 1 && (
                          <Box textAlign="center" width="100%" mb={10} mt={2}>
                            No unfinished nfts
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </div>
              </div>
            </Box>
          </Box>
        </Box>
        {openActionBox && (
          <Box className={classes.actionBox}>
            <Box width={1} position="relative">
              <Box className={classes.typo1} pt={1}>
                ACTIONS
              </Box>
              <Box
                position="absolute"
                right={0}
                top={0}
                style={{ cursor: "pointer" }}
                onClick={() => setOpenActionBox(false)}
              >
                <CloseIcon />
              </Box>
            </Box>
            <PrimaryButton
              size="medium"
              isRounded
              style={{
                background: "#fff",
                borderRadius: 10,
                minWidth: 187,
                textTransform: "uppercase",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "GRIFTER",
                color: "#212121",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => shareMedia("Creator", `profile/${userInfo?.urlSlug}`)}
            >
              <ShapeIcon />
              <Box ml={1} mt={0.5}>
                Share
              </Box>
            </PrimaryButton>
            {isOwner === undefined ? null : isOwner ? (
              <>
                {!userSelector?.twitterVerified && (
                  <PrimaryButton
                    size="medium"
                    isRounded
                    style={{
                      background: "#fff",
                      borderRadius: 10,
                      minWidth: 187,
                      textTransform: "uppercase",
                      fontSize: 16,
                      fontWeight: 700,
                      fontFamily: "GRIFTER",
                      color: "#212121",
                      display: "flex",
                      marginLeft: 0,
                      alignItems: "center",
                    }}
                  >
                    <VerifyIcon />
                    <Box ml={1} mt={0.5} onClick={onVerifyProfileClicked}>
                      Verify Profile
                    </Box>
                  </PrimaryButton>
                )}
                <PrimaryButton
                  size="medium"
                  isRounded
                  style={{
                    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                    borderRadius: 10,
                    minWidth: 160,
                    textTransform: "uppercase",
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "GRIFTER",
                    marginLeft: 0,
                    color: "#212121",
                    paddingTop: 3,
                  }}
                  onClick={() => setOpenEditModal(true)}
                >
                  Edit Profile
                </PrimaryButton>
              </>
            ) : (
              isFollowing > -1 &&
              (isLoading ? (
                <CircularProgress size={24} style={{ color: "#FF5954", marginLeft: 16 }} />
              ) : (
                <PrimaryButton
                  size="medium"
                  isRounded
                  style={{
                    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                    borderRadius: 10,
                    minWidth: 160,
                    textTransform: "uppercase",
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "GRIFTER",
                    marginLeft: 0,
                    color: "#212121",
                    paddingTop: 3,
                  }}
                  onClick={onFollowUser}
                >
                  {isFollowing === 0 ? "Follow" : isFollowing === 1 ? "Cancel request" : "Unfollow"}
                </PrimaryButton>
              ))
            )}
          </Box>
        )}
      </div>

      {openEditModal && (
        <EditProfileModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onRefresh={handleProfileRefresh}
        />
      )}
      {openVerifyProfileModal && (
        <VerifyProfileModal open={openVerifyProfileModal} onClose={() => setOpenVerifyProfileModal(false)} />
      )}
      {openFollowProfileModal && (
        <FollowProfileModal
          list={followsList}
          onClose={() => setOpenFollowProfileModal(false)}
          open={openFollowProfileModal}
          header={isFollowingList ? "Followings" : "Followers"}
          isLoadingFollows={isLoadingFollows}
          isOwner={!!isOwner}
        />
      )}
      {openAvartaImageCropModal && (
        <ImageCropModal
          imageFile={imageFile}
          open={openAvartaImageCropModal}
          aspect={3 / 3}
          onClose={() => setOpenAvartaImageCropModal(false)}
          setCroppedImage={file => {
            handleImage(file);
          }}
        />
      )}
    </>
  );
}

const ShapeIcon = props => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.8245 14.7963L6.44794 11.608M6.43889 9.01847L12.8215 5.82718M18.2984 16.0887C18.2984 17.6842 17.005 18.9776 15.4095 18.9776C13.814 18.9776 12.5206 17.6842 12.5206 16.0887C12.5206 14.4932 13.814 13.1998 15.4095 13.1998C17.005 13.1998 18.2984 14.4932 18.2984 16.0887ZM18.2984 4.53318C18.2984 6.12867 17.005 7.42207 15.4095 7.42207C13.814 7.42207 12.5206 6.12867 12.5206 4.53318C12.5206 2.93769 13.814 1.64429 15.4095 1.64429C17.005 1.64429 18.2984 2.93769 18.2984 4.53318ZM6.7428 10.311C6.7428 11.9064 5.44941 13.1998 3.85392 13.1998C2.25843 13.1998 0.965027 11.9064 0.965027 10.311C0.965027 8.71546 2.25843 7.42207 3.85392 7.42207C5.44941 7.42207 6.7428 8.71546 6.7428 10.311Z"
      stroke="#081831"
      stroke-width="1.5"
    />
  </svg>
);

const VerifyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask
      id="path-1-outside-1_2927_252"
      maskUnits="userSpaceOnUse"
      x="0.451416"
      y="-0.0488281"
      width="21"
      height="22"
      fill="black"
    >
      <rect fill="white" x="0.451416" y="-0.0488281" width="21" height="22" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.9311 10.1756L18.0426 9.18903C17.8089 8.92963 17.6964 8.58323 17.733 8.23605L17.8721 6.91573C17.9381 6.28854 17.5196 5.71283 16.9026 5.58221L15.6048 5.30746C15.2626 5.235 14.9673 5.02037 14.7928 4.71718L14.1314 3.56834C13.8164 3.0211 13.1385 2.80087 12.562 3.05851L11.3519 3.59934C11.0322 3.74221 10.6668 3.74221 10.3471 3.59934L9.13697 3.05851C8.56049 2.80087 7.88256 3.0211 7.56754 3.56834L6.90621 4.71718C6.73168 5.02037 6.43641 5.235 6.09415 5.30746L4.79636 5.58221C4.17938 5.71283 3.76085 6.28853 3.82691 6.91572L3.96598 8.23605C4.00255 8.58324 3.89001 8.92963 3.65638 9.18902L2.76779 10.1756C2.34596 10.6439 2.34596 11.3552 2.76779 11.8236L3.65635 12.8101C3.88998 13.0695 4.00251 13.4159 3.96595 13.7631L3.82688 15.0834C3.76082 15.7106 4.17935 16.2863 4.79633 16.4169L6.09412 16.6917C6.43637 16.7641 6.73164 16.9788 6.90618 17.282L7.5675 18.4308C7.88252 18.978 8.56046 19.1983 9.13694 18.9406L10.3471 18.3998C10.6668 18.2569 11.0322 18.2569 11.3518 18.3998L12.562 18.9406C13.1384 19.1983 13.8164 18.978 14.1314 18.4308L14.7927 17.282C14.9673 16.9788 15.2625 16.7641 15.6048 16.6917L16.9026 16.4169C17.5196 16.2863 17.9381 15.7106 17.872 15.0834L17.7329 13.7631C17.6964 13.4159 17.8089 13.0695 18.0425 12.8101L18.9311 11.8236C19.353 11.3552 19.353 10.6439 18.9311 10.1756ZM14.6123 9.46572C14.9904 9.09701 14.9904 8.49921 14.6123 8.1305C14.2341 7.76179 13.621 7.76179 13.2428 8.1305L9.40857 11.8689L8.1566 10.6482C7.77843 10.2795 7.16531 10.2795 6.78715 10.6482C6.40898 11.0169 6.40898 11.6147 6.78715 11.9834L8.72384 13.8717C8.90544 14.0488 9.15175 14.1482 9.40857 14.1482C9.66539 14.1482 9.9117 14.0488 10.0933 13.8717L14.6123 9.46572Z"
      />
    </mask>
    <path
      d="M18.0426 9.18903L19.5287 7.85054L19.5287 7.85053L18.0426 9.18903ZM18.9311 10.1756L17.4451 11.5141L18.9311 10.1756ZM17.733 8.23605L19.722 8.44557V8.44557L17.733 8.23605ZM17.8721 6.91573L15.8831 6.70621V6.70621L17.8721 6.91573ZM16.9026 5.58221L17.3168 3.62558V3.62558L16.9026 5.58221ZM15.6048 5.30746L16.0191 3.35083L16.0191 3.35083L15.6048 5.30746ZM14.7928 4.71718L16.5261 3.71939L16.5261 3.71939L14.7928 4.71718ZM14.1314 3.56834L12.3981 4.56612L12.3981 4.56613L14.1314 3.56834ZM12.562 3.05851L11.746 1.23256V1.23256L12.562 3.05851ZM11.3519 3.59934L12.1679 5.42529L11.3519 3.59934ZM10.3471 3.59934L9.53108 5.42529L9.53108 5.42529L10.3471 3.59934ZM9.13697 3.05851L9.95301 1.23256L9.95301 1.23256L9.13697 3.05851ZM7.56754 3.56834L5.83421 2.57055V2.57055L7.56754 3.56834ZM6.90621 4.71718L8.63954 5.71497V5.71497L6.90621 4.71718ZM6.09415 5.30746L5.67992 3.35083L5.67992 3.35083L6.09415 5.30746ZM4.79636 5.58221L5.2106 7.53884H5.2106L4.79636 5.58221ZM3.82691 6.91572L1.83791 7.12522L1.83791 7.12522L3.82691 6.91572ZM3.96598 8.23605L1.97698 8.44555L1.97698 8.44555L3.96598 8.23605ZM3.65638 9.18902L5.14245 10.5275L5.14245 10.5275L3.65638 9.18902ZM2.76779 10.1756L1.28172 8.83708L1.28172 8.83709L2.76779 10.1756ZM2.76779 11.8236L4.25388 10.4851L4.25388 10.4851L2.76779 11.8236ZM3.65635 12.8101L2.17026 14.1486L2.17026 14.1486L3.65635 12.8101ZM3.96595 13.7631L5.95494 13.9726L5.95494 13.9726L3.96595 13.7631ZM3.82688 15.0834L5.81587 15.2929V15.2929L3.82688 15.0834ZM4.79633 16.4169L5.21056 14.4603H5.21056L4.79633 16.4169ZM6.09412 16.6917L5.67989 18.6483H5.67989L6.09412 16.6917ZM6.90618 17.282L8.6395 16.2842L8.6395 16.2842L6.90618 17.282ZM7.5675 18.4308L5.83417 19.4286L5.83417 19.4286L7.5675 18.4308ZM9.13694 18.9406L9.953 20.7666L9.953 20.7666L9.13694 18.9406ZM10.3471 18.3998L9.53102 16.5738L9.53102 16.5738L10.3471 18.3998ZM11.3518 18.3998L12.1679 16.5738L12.1679 16.5738L11.3518 18.3998ZM12.562 18.9406L11.7459 20.7666L11.7459 20.7666L12.562 18.9406ZM14.1314 18.4308L15.8647 19.4286L15.8647 19.4286L14.1314 18.4308ZM14.7927 17.282L16.5261 18.2798V18.2798L14.7927 17.282ZM15.6048 16.6917L16.019 18.6483L15.6048 16.6917ZM16.9026 16.4169L16.4883 14.4603H16.4883L16.9026 16.4169ZM17.872 15.0834L15.883 15.2929L17.872 15.0834ZM17.7329 13.7631L15.7439 13.9726V13.9726L17.7329 13.7631ZM18.0425 12.8101L19.5286 14.1486L19.5286 14.1486L18.0425 12.8101ZM18.9311 11.8236L20.4172 13.1621L20.4172 13.1621L18.9311 11.8236ZM14.6123 8.1305L16.0085 6.6985L16.0085 6.6985L14.6123 8.1305ZM14.6123 9.46572L13.2161 8.03372L14.6123 9.46572ZM13.2428 8.1305L14.639 9.5625L14.639 9.5625L13.2428 8.1305ZM9.40857 11.8689L8.01237 13.3009L9.40857 14.6622L10.8048 13.3009L9.40857 11.8689ZM8.1566 10.6482L9.5528 9.21621L9.5528 9.21621L8.1566 10.6482ZM6.78715 10.6482L5.39095 9.21621L5.39095 9.21621L6.78715 10.6482ZM6.78715 11.9834L8.18335 10.5514H8.18335L6.78715 11.9834ZM8.72384 13.8717L10.12 12.4397L10.12 12.4397L8.72384 13.8717ZM10.0933 13.8717L8.6971 12.4397L8.69709 12.4397L10.0933 13.8717ZM16.5565 10.5275L17.4451 11.5141L20.4172 8.83707L19.5287 7.85054L16.5565 10.5275ZM15.744 8.02652C15.648 8.93769 15.9433 9.84676 16.5565 10.5275L19.5287 7.85053C19.6745 8.0125 19.7448 8.22878 19.722 8.44557L15.744 8.02652ZM15.8831 6.70621L15.744 8.02653L19.722 8.44557L19.861 7.12525L15.8831 6.70621ZM16.4884 7.53884C16.1031 7.45728 15.8418 7.09782 15.8831 6.70621L19.861 7.12525C20.0344 5.47926 18.936 3.96838 17.3168 3.62558L16.4884 7.53884ZM15.1906 7.26409L16.4884 7.53884L17.3168 3.62558L16.0191 3.35083L15.1906 7.26409ZM13.0594 5.71496C13.5175 6.51066 14.2924 7.07394 15.1906 7.26409L16.0191 3.35083C16.2328 3.39607 16.4171 3.53008 16.5261 3.71939L13.0594 5.71496ZM12.3981 4.56613L13.0594 5.71497L16.5261 3.71939L15.8648 2.57055L12.3981 4.56613ZM13.378 4.88446C13.0181 5.04532 12.5948 4.90782 12.3981 4.56612L15.8648 2.57055C15.038 1.13438 13.2589 0.556427 11.746 1.23256L13.378 4.88446ZM12.1679 5.42529L13.378 4.88446L11.746 1.23256L10.5358 1.7734L12.1679 5.42529ZM9.53108 5.42529C10.37 5.80023 11.3289 5.80023 12.1679 5.42529L10.5358 1.7734C10.7354 1.68419 10.9636 1.68419 11.1632 1.7734L9.53108 5.42529ZM8.32093 4.88446L9.53108 5.42529L11.1632 1.7734L9.95301 1.23256L8.32093 4.88446ZM9.30087 4.56613C9.10417 4.90782 8.68088 5.04532 8.32093 4.88446L9.95301 1.23256C8.44011 0.556428 6.66094 1.13438 5.83421 2.57055L9.30087 4.56613ZM8.63954 5.71497L9.30087 4.56613L5.83421 2.57055L5.17288 3.71939L8.63954 5.71497ZM6.50839 7.26409C7.40659 7.07394 8.1815 6.51066 8.63954 5.71497L5.17288 3.71939C5.28186 3.53008 5.46622 3.39607 5.67992 3.35083L6.50839 7.26409ZM5.2106 7.53884L6.50839 7.26409L5.67992 3.35083L4.38213 3.62558L5.2106 7.53884ZM5.81591 6.70622C5.85716 7.09783 5.59583 7.45729 5.2106 7.53884L4.38213 3.62558C2.76294 3.96837 1.66454 5.47924 1.83791 7.12522L5.81591 6.70622ZM5.95498 8.02655L5.81591 6.70622L1.83791 7.12522L1.97698 8.44555L5.95498 8.02655ZM5.14245 10.5275C5.75561 9.84676 6.05095 8.9377 5.95498 8.02655L1.97698 8.44555C1.95415 8.22877 2.02442 8.01249 2.1703 7.85053L5.14245 10.5275ZM4.25387 11.5141L5.14245 10.5275L2.1703 7.85053L1.28172 8.83708L4.25387 11.5141ZM4.25388 10.4851C4.51727 10.7775 4.51726 11.2216 4.25387 11.5141L1.28172 8.83709C0.174659 10.0662 0.174647 11.9329 1.2817 13.1621L4.25388 10.4851ZM5.14244 11.4716L4.25388 10.4851L1.2817 13.1621L2.17026 14.1486L5.14244 11.4716ZM5.95494 13.9726C6.05091 13.0614 5.75558 12.1524 5.14244 11.4716L2.17026 14.1486C2.02438 13.9866 1.95412 13.7704 1.97695 13.5536L5.95494 13.9726ZM5.81587 15.2929L5.95494 13.9726L1.97695 13.5536L1.83788 14.8739L5.81587 15.2929ZM5.21056 14.4603C5.59579 14.5419 5.85712 14.9013 5.81587 15.2929L1.83788 14.8739C1.66451 16.5199 2.7629 18.0308 4.3821 18.3736L5.21056 14.4603ZM6.50835 14.7351L5.21056 14.4603L4.38209 18.3736L5.67989 18.6483L6.50835 14.7351ZM8.6395 16.2842C8.18146 15.4885 7.40655 14.9252 6.50835 14.7351L5.67989 18.6483C5.46619 18.6031 5.28183 18.4691 5.17285 18.2798L8.6395 16.2842ZM9.30083 17.433L8.6395 16.2842L5.17285 18.2798L5.83417 19.4286L9.30083 17.433ZM8.32089 17.1147C8.68083 16.9538 9.10413 17.0913 9.30082 17.433L5.83417 19.4286C6.66091 20.8648 8.44009 21.4427 9.953 20.7666L8.32089 17.1147ZM9.53102 16.5738L8.32088 17.1147L9.953 20.7666L11.1631 20.2257L9.53102 16.5738ZM12.1679 16.5738C11.3289 16.1989 10.37 16.1989 9.53102 16.5738L11.1631 20.2257C10.9635 20.3149 10.7354 20.3149 10.5358 20.2257L12.1679 16.5738ZM13.378 17.1147L12.1679 16.5738L10.5358 20.2257L11.7459 20.7666L13.378 17.1147ZM12.3981 17.433C12.5948 17.0913 13.0181 16.9538 13.378 17.1147L11.7459 20.7666C13.2588 21.4427 15.038 20.8648 15.8647 19.4286L12.3981 17.433ZM13.0594 16.2842L12.3981 17.433L15.8647 19.4286L16.5261 18.2798L13.0594 16.2842ZM15.1906 14.7351C14.2924 14.9252 13.5174 15.4885 13.0594 16.2842L16.5261 18.2798C16.4171 18.4691 16.2327 18.6031 16.019 18.6483L15.1906 14.7351ZM16.4883 14.4603L15.1906 14.7351L16.019 18.6483L17.3168 18.3736L16.4883 14.4603ZM15.883 15.2929C15.8418 14.9013 16.1031 14.5419 16.4883 14.4603L17.3168 18.3736C18.936 18.0308 20.0344 16.5199 19.861 14.8739L15.883 15.2929ZM15.7439 13.9726L15.883 15.2929L19.861 14.8739L19.7219 13.5536L15.7439 13.9726ZM16.5565 11.4716C15.9433 12.1524 15.648 13.0615 15.7439 13.9726L19.7219 13.5536C19.7448 13.7704 19.6745 13.9867 19.5286 14.1486L16.5565 11.4716ZM17.4451 10.4851L16.5565 11.4716L19.5286 14.1486L20.4172 13.1621L17.4451 10.4851ZM17.4451 11.5141C17.1817 11.2216 17.1817 10.7775 17.4451 10.4851L20.4172 13.1621C21.5243 11.933 21.5243 10.0662 20.4172 8.83707L17.4451 11.5141ZM13.2161 9.5625C12.7892 9.14628 12.7892 8.44995 13.2161 8.03372L16.0085 10.8977C17.1917 9.74407 17.1917 7.85215 16.0085 6.6985L13.2161 9.5625ZM14.639 9.5625C14.2404 9.95113 13.6146 9.95113 13.2161 9.56251L16.0085 6.6985C14.8535 5.57246 13.0015 5.57246 11.8466 6.6985L14.639 9.5625ZM10.8048 13.3009L14.639 9.5625L11.8466 6.6985L8.01237 10.4369L10.8048 13.3009ZM6.7604 12.0802L8.01237 13.3009L10.8048 10.4369L9.5528 9.21621L6.7604 12.0802ZM8.18334 12.0802C7.78476 12.4688 7.15899 12.4688 6.7604 12.0802L9.5528 9.21621C8.39788 8.09017 6.54586 8.09017 5.39095 9.21621L8.18334 12.0802ZM8.18335 10.5514C8.61025 10.9677 8.61025 11.664 8.18335 12.0802L5.39095 9.21621C4.20771 10.3699 4.20771 12.2618 5.39095 13.4154L8.18335 10.5514ZM10.12 12.4397L8.18335 10.5514L5.39095 13.4154L7.32764 15.3037L10.12 12.4397ZM9.40857 12.1482C9.66607 12.1482 9.92291 12.2475 10.12 12.4397L7.32764 15.3037C7.88798 15.85 8.63742 16.1482 9.40857 16.1482V12.1482ZM8.69709 12.4397C8.89423 12.2475 9.15107 12.1482 9.40857 12.1482V16.1482C10.1797 16.1482 10.9292 15.85 11.4895 15.3037L8.69709 12.4397ZM13.2161 8.03372L8.6971 12.4397L11.4895 15.3037L16.0085 10.8977L13.2161 8.03372Z"
      fill="#2D3047"
      mask="url(#path-1-outside-1_2927_252)"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M24.5 2.93365C23.6177 3.32562 22.6681 3.5896 21.6722 3.70879C22.6889 3.09923 23.4697 2.1345 23.8368 0.984974C22.8865 1.54974 21.8314 1.95851 20.7107 2.1801C19.8123 1.22336 18.5316 0.625 17.1165 0.625C14.3975 0.625 12.1928 2.82965 12.1928 5.54867C12.1928 5.93424 12.2368 6.31022 12.3208 6.671C8.22829 6.46621 4.60053 4.50554 2.17189 1.52654C1.74792 2.25369 1.50553 3.09924 1.50553 4.00158C1.50553 5.70947 2.37347 7.21657 3.69579 8.09971C2.88784 8.07411 2.12949 7.85252 1.46473 7.48375V7.54534C1.46473 9.93158 3.16302 11.921 5.41407 12.3746C5.0013 12.4866 4.56613 12.5474 4.11736 12.5474C3.79978 12.5474 3.491 12.5162 3.19022 12.4586C3.81658 14.4145 5.63566 15.8384 7.78991 15.8784C6.10523 17.1983 3.98217 17.9862 1.67512 17.9862C1.27675 17.9862 0.884774 17.963 0.5 17.9166C2.67905 19.3134 5.26688 20.1293 8.0475 20.1293C17.1037 20.1293 22.0562 12.6266 22.0562 6.12063C22.0562 5.90704 22.0522 5.69427 22.0418 5.48388C23.0049 4.78793 23.84 3.92078 24.5 2.93365Z"
      fill="white"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2.84184C15.2041 2.84184 15.5837 2.85408 16.849 2.91181C18.019 2.96516 18.6544 3.16065 19.0773 3.32499C19.6374 3.54268 20.0371 3.80271 20.457 4.2226C20.877 4.64254 21.137 5.04229 21.3547 5.60241C21.519 6.02526 21.7145 6.66065 21.7679 7.83063C21.8256 9.09598 21.8378 9.47553 21.8378 12.6796C21.8378 15.8838 21.8256 16.2633 21.7679 17.5287C21.7145 18.6986 21.519 19.334 21.3547 19.7569C21.137 20.317 20.877 20.7167 20.4571 21.1366C20.0371 21.5566 19.6374 21.8166 19.0773 22.0343C18.6544 22.1986 18.019 22.3941 16.849 22.4475C15.5839 22.5052 15.2044 22.5175 12 22.5175C8.79563 22.5175 8.41618 22.5052 7.15097 22.4475C5.98098 22.3941 5.34559 22.1986 4.92274 22.0343C4.36261 21.8166 3.96287 21.5566 3.54297 21.1366C3.12308 20.7167 2.863 20.317 2.64531 19.7569C2.48097 19.334 2.28548 18.6986 2.23213 17.5287C2.1744 16.2633 2.16216 15.8838 2.16216 12.6796C2.16216 9.47553 2.1744 9.09598 2.23213 7.83063C2.28548 6.66065 2.48097 6.02526 2.64531 5.60241C2.863 5.04229 3.12303 4.64254 3.54297 4.22265C3.96287 3.80271 4.36261 3.54268 4.92274 3.32499C5.34559 3.16065 5.98098 2.96516 7.15097 2.91181C8.41632 2.85408 8.79587 2.84184 12 2.84184ZM12 0.679688C8.741 0.679688 8.33234 0.693501 7.05241 0.751901C5.77516 0.810157 4.90283 1.01303 4.13954 1.30965C3.35044 1.61631 2.68123 2.02663 2.01406 2.69374C1.34695 3.3609 0.936629 4.03011 0.630008 4.81922C0.333343 5.5825 0.13047 6.45482 0.0722133 7.73208C0.0138139 9.012 0 9.42065 0 12.6796C0 15.9386 0.0138139 16.3473 0.0722133 17.6272C0.13047 18.9045 0.333343 19.7768 0.630008 20.5401C0.936629 21.3292 1.34695 21.9984 2.01406 22.6655C2.68123 23.3327 3.35044 23.743 4.13954 24.0496C4.90283 24.3463 5.77516 24.5491 7.05241 24.6074C8.33234 24.6658 8.741 24.6796 12 24.6796C15.259 24.6796 15.6677 24.6658 16.9476 24.6074C18.2248 24.5491 19.0972 24.3463 19.8605 24.0496C20.6496 23.743 21.3188 23.3327 21.9859 22.6655C22.653 21.9984 23.0634 21.3292 23.37 20.5401C23.6667 19.7768 23.8695 18.9045 23.9278 17.6272C23.9862 16.3473 24 15.9386 24 12.6796C24 9.42065 23.9862 9.012 23.9278 7.73208C23.8695 6.45482 23.6667 5.5825 23.37 4.81922C23.0634 4.03011 22.653 3.3609 21.9859 2.69374C21.3188 2.02663 20.6496 1.61631 19.8605 1.30965C19.0972 1.01303 18.2248 0.810157 16.9476 0.751901C15.6677 0.693501 15.259 0.679688 12 0.679688Z"
      fill="white"
    />
    <path
      d="M12.0057 6.52344C8.60238 6.52344 5.84351 9.2823 5.84351 12.6856C5.84351 16.0889 8.60238 18.8477 12.0057 18.8477C15.409 18.8477 18.1678 16.0889 18.1678 12.6856C18.1678 9.2823 15.409 6.52344 12.0057 6.52344ZM12.0057 16.6856C9.79651 16.6856 8.00566 14.8947 8.00566 12.6856C8.00566 10.4764 9.79651 8.68559 12.0057 8.68559C14.2148 8.68559 16.0057 10.4764 16.0057 12.6856C16.0057 14.8947 14.2148 16.6856 12.0057 16.6856Z"
      fill="white"
    />
    <path
      d="M19.8507 6.27596C19.8507 7.07121 19.206 7.71594 18.4107 7.71594C17.6154 7.71594 16.9707 7.07121 16.9707 6.27596C16.9707 5.48066 17.6154 4.83594 18.4107 4.83594C19.206 4.83594 19.8507 5.48066 19.8507 6.27596Z"
      fill="white"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.5 11.7491C23.5 5.3978 18.3513 0.249079 12 0.249079C5.64872 0.249079 0.5 5.3978 0.5 11.7491C0.5 17.4891 4.70538 22.2466 10.2031 23.1094V15.0733H7.2832V11.7491H10.2031V9.21549C10.2031 6.3333 11.92 4.74127 14.5468 4.74127C15.805 4.74127 17.1211 4.96588 17.1211 4.96588V7.79595H15.671C14.2424 7.79595 13.7969 8.68242 13.7969 9.59186V11.7491H16.9863L16.4765 15.0733H13.7969V23.1094C19.2946 22.2466 23.5 17.4891 23.5 11.7491Z"
      fill="white"
    />
  </svg>
);

const ActionsIcon = () => (
  <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.28491 1.75H13.539M1.28491 5.84239H13.539M7.83572 9.93477H13.539"
      stroke="#151515"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.4266 2.77344L2.63525 14.5648M2.63527 2.77344L14.4266 14.5648"
      stroke="white"
      stroke-width="3"
      stroke-linecap="square"
    />
  </svg>
);
