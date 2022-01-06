import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import axios from "axios";

import {
  Dialog,
  Popper,
  ClickAwayListener,
  Grow,
  Paper,
  MenuList,
  MenuItem,
  Hidden,
  Box,
} from "@material-ui/core";

import { socket } from "components/Login/Auth";
import SignInModal from "components/Login/SignInModal";
import MediaSellingOfferModal from "shared/ui-kit/Modal/Modals/MediaSellingOfferModal";
import { useNotifications } from "shared/contexts/NotificationsContext";
import URL from "shared/functions/getURL";
import { getUser, getUsersInfoList } from "store/selectors/user";
import { setUser, signOut } from "store/actions/User";
import CreateMediaModal from "shared/ui-kit/Modal/Modals/CreateMediaModal";
import PodCreateNFTMediaModal from "shared/ui-kit/Modal/Modals/Pod-Create-NFTMedia-Modal/PodCreateNFTMediaModal";
import CreateCommunityModal from "shared/ui-kit/Modal/Modals/CreateCommunity";
import CreateImportSocialTokenModal from "shared/ui-kit/Modal/Modals/Create-social-token/CreateImportSocialTokenModal";
import { CreatePriviWalletModal } from "shared/ui-kit/Modal/Modals";
import { capitalize } from "shared/helpers/string";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { createUserInfo, setUsersInfoList } from "store/actions/UsersInfo";
import CommunityContributionModal from "shared/ui-kit/Modal/Modals/CommunityContributionModal";
import ShareContributionModal from "shared/ui-kit/Modal/Modals/ShareContributionModal";
import { useAuth } from "shared/contexts/AuthContext";
import { _signPayload } from "shared/services/WalletSign";

import { IconNotifications } from "./components/Toolbar/IconNotifications";
import { IconNotificationsWhite } from "./components/Toolbar/IconNotificationsWhite";
import { ToolbarButtonWithPopper } from "./components/Toolbar/ToolbarButtonWithPopper";
import { NotificationsPopperContent } from "./components/Notifications/NotificationsPopperContent";
import { SecondaryButton } from "../Buttons";
import PriviAppIcon from "./components/PriviAppIcon";
import { headerStyles } from "./Header.styles";

import PriviMetaverseAppNavigation from "./components/PriviMetaverseAppNavigation";
import useIPFS from "../../utils-IPFS/useIPFS";
import getPhotoIPFS from "../../functions/getPhotoIPFS";
import { usePageRefreshContext } from "shared/contexts/PageRefreshContext";
import { RootState } from "../../../store/reducers/Reducer";
import { injected } from "shared/connectors";
import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import * as API from "shared/services/API/WalletAuthAPI";
import { setLoginBool } from "store/actions/LoginBool";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { CircularLoadingIndicator } from "shared/ui-kit";

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

const APP_ENV = process.env.REACT_APP_ENV || "dev";

const Header = props => {
  const classes = headerStyles();
  const location = useLocation();

  const pathName = window.location.href;
  const idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "" + localStorage.getItem("userId");
  const isGetStartedPage = location.pathname === "/become_creator";
  const isProfilePage = location.pathname.includes("/profile/");
  const isClaimPage = location.pathname.includes("/claim_dreem");
  const isLastMenu = index =>
    index < (isSignedin ? Navigator.length : Navigator.filter(n => !n.authorize).length) - 1;

  const { isSignedin, setSignedin, isOnSigning, setOnSigning } = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const userSelector = useSelector(getUser);
  const usersInfoList = useSelector(getUsersInfoList);
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);
  const publicy = useSelector((state: RootState) => state.underMaintenanceInfo?.publicy);

  const {
    unreadNotifications,
    notifications,
    dismissNotification,
    markAllNotificationsAsRead,
    removeNotification,
  } = useNotifications();

  const { activate, account, library } = useWeb3React();

  const [userId, setUserId] = useState<string>("");
  const [ownUser, setOwnUser] = useState<boolean>(idUrl === localStorage.getItem("userId"));
  const [userProfile, setUserProfile] = useState<any>({});
  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const [openMediaModal, setOpenMediaModal] = useState<boolean>(false);
  const [openPodCreateModal, setOpenPodCreateModal] = useState<boolean>(false);
  const [openCreateCommunityModal, setOpenCreateCommunityModal] = useState<boolean>(false);
  const [openCreateSocialTokenModal, setOpenCreateSocialTokenModal] = useState<boolean>(false);
  const [openNotificationModal, setOpenNotificationModal] = useState<boolean>(false);
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [openModalShareContribution, setOpenModalShareContribution] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityAddress, setCommunityAddress] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<any>();
  const [openPriviWalletDialog, setOpenPriviWalletDialog] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [arrowEl, setArrowEl] = React.useState<null | HTMLElement>(null);

  const [hideNotificationsModal, setHideNotificationsModal] = useState<boolean>(false);

  const popperOpen = Boolean(anchorEl);
  const popperId = popperOpen ? "spring-popper" : undefined;

  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const anchorMobileMenuRef = React.useRef<HTMLDivElement>(null);

  const { downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const { profileAvatarChanged } = usePageRefreshContext();

  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  const [hasUnderMaintenanceInfo, setHasUnderMaintenanceInfo] = useState(false);
  const underMaintenance = React.useMemo(
    () =>
      isOnSigning ||
      !hasUnderMaintenanceInfo ||
      (underMaintenanceSelector &&
        Object.keys(underMaintenanceSelector).length > 0 &&
        underMaintenanceSelector.underMaintenance &&
        APP_ENV !== "dev"),
    [isOnSigning, hasUnderMaintenanceInfo, underMaintenanceSelector]
  );

  React.useEffect(() => {
    if (hasUnderMaintenanceInfo && !isSignedin && !underMaintenanceSelector.underMaintenance) {
      signInWithMetamask();
    }
  }, [account, isSignedin]);

  useEffect(() => {
    if (underMaintenanceSelector && Object.keys(underMaintenanceSelector).length > 0) {
      setHasUnderMaintenanceInfo(true);
    }
  }, [underMaintenanceSelector]);

  useEffect(() => {
    getPhotoUser();
  }, [userSelector.id, profileAvatarChanged]);

  const getPhotoUser = async () => {
    if (userSelector?.infoImage?.newFileCID && userSelector?.infoImage?.metadata?.properties?.name) {
      setImageIPFS(
        await getPhotoIPFS(
          userSelector.infoImage.newFileCID,
          userSelector.infoImage.metadata.properties.name,
          downloadWithNonDecryption
        )
      );
    } else if (userSelector?.infoImage?.avatarUrl) {
      setImageIPFS(userSelector?.infoImage?.avatarUrl);
    }
  };

  const handleOpenMobileMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    setOpenMobileMenu(true);
  };

  const handleCloseMobileMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMobileMenuRef.current && anchorMobileMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenMobileMenu(false);
  };

  const handleListKeyDownMobileMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMobileMenu(false);
    }
  };

  const handleCloseWalletDialog = () => {
    setOpenPriviWalletDialog(false);
  };
  const handleCreatePopup = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMediaModal = () => {
    setOpenMediaModal(false);
  };

  const handleClosePodCreateModal = () => {
    setOpenPodCreateModal(false);
  };

  const handleCloseCreateCommunityModal = () => {
    setOpenCreateCommunityModal(false);
  };

  const handleCloseSocialTokenModal = () => {
    setOpenCreateSocialTokenModal(false);
  };

  const handleLogout = () => {
    setSignedin(false);
    dispatch(signOut());
    localStorage.removeItem("userSlug");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    history.push("/");
    window.location.reload();
  };

  const [openModalMediaSellingOffer, setOpenModalMediaSellingOffer] = useState<boolean>(false);

  const handleOpenModalMediaSellingOffer = () => {
    setOpenModalMediaSellingOffer(true);
  };

  const handleCloseModalMediaSellingOffer = () => {
    setOpenModalMediaSellingOffer(false);
  };

  const handleOpenContributionModal = () => {
    setOpenNotificationModal(false);
    setOpenContributionModal(true);
  };

  const handleCloseContributionModal = () => {
    setOpenContributionModal(false);
  };

  const handleOpenModalShareContribution = () => {
    setOpenModalShareContribution(true);
  };

  const handleCloseModalShareContribution = () => {
    setOpenModalShareContribution(false);
  };

  const handleShareCommunity = () => {
    handleCloseContributionModal();
    handleOpenModalShareContribution();
  };

  const viewMore = notification => {
    setOpenNotificationModal(false);
    switch (notification.type) {
      case 113:
        handleOpenModalMediaSellingOffer();
        break;
      case 115:
        history.push(`/communities/${notification.otherItemId}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setUserId(userSelector.id);
    setOwnUser(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUrl, userSelector]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      if (socket) {
        socket.on("user_connect_status", async connectStatus => {
          const users = usersInfoList;
          const index = users.findIndex(u => u.id === connectStatus.userId);
          if (index >= 0) {
            const user = users.find(u => u.id === connectStatus.userId);
            if (user) {
              user.connected = connectStatus.connected;
              const uList = [...usersInfoList.slice(0, index), user, ...usersInfoList.slice(index + 1)];

              for (let usr of uList) {
                if (
                  usr?.infoImage?.newFileCID &&
                  usr?.infoImage?.metadata?.properties?.name &&
                  (!usr.ipfsImage || usr.ipfsImage === "")
                ) {
                  usr.ipfsImage = await getPhotoIPFS(
                    usr.infoImage.newFileCID,
                    usr.infoImage.metadata.properties.name,
                    downloadWithNonDecryption
                  );
                }
              }

              dispatch(setUsersInfoList(uList));
            }
          }
          if (connectStatus.userId === userId) {
            let setterUser: any = { ...userProfile };
            setterUser.connected = connectStatus.connected;
            setUserProfile(setterUser);
          }
        });
      }
    }
  }, [userId, userProfile]);

  useEffect(() => {
    if ((!usersInfoList || usersInfoList?.length === 0) && userSelector.id) {
      axios
        .post(`${URL()}/chat/getUsers`)
        .then(response => {
          if (response.data.success) {
            const allUsers = response.data.data;
            const u = [] as any[];
            allUsers.forEach(user => {
              let image = "";
              if (
                user.anon != undefined &&
                user.anon === true &&
                user.anonAvatar &&
                user.anonAvatar?.length > 0
              ) {
                image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
              }
              user.assistances = user.assistances ?? 0;
              user.rate = user.rate ?? 0;

              u.push(
                createUserInfo(
                  user.id,
                  `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`,
                  user.address ?? "",
                  user.mnemonic ?? "",
                  image,
                  user.level ?? 1,
                  user.numFollowers || 0,
                  user.numFollowings || 0,
                  user.creds?.length ?? 0,
                  user.badges ?? [],
                  user.urlSlug ??
                    `${user.firstName ? user.firstName : ""}${user.lastName ? user.lastName : ""}`,
                  user.twitter ?? "",
                  user.anon ?? false,
                  user.verified ?? false,
                  user.MediaLikes?.length ?? 0,
                  user.profileViews ?? 0,
                  user.awards?.length ?? 0,
                  user.trustScore ?? 0,
                  user.endorsementScore ?? 0,
                  user.bio ?? "",
                  user.isExternalUser ?? false,
                  user.connected ?? false,
                  user.rate ?? 0,
                  user.imageUrl ?? "",
                  user.assistances ?? 0,
                  user.anonAvatar ?? "",
                  user.backgroundURL ?? "",
                  user.hasPhoto ?? false,
                  user.myMediasCount ?? 0,
                  user.url ?? "",
                  user.wallets ?? [],
                  user.email ?? "",
                  user.infoImage ?? {},
                  false,
                  user.ipfsImage ?? "",
                  user.urlIpfsImage ?? ""
                )
              );
            });
            allUsers.sort((user1, user2) => {
              const name1 = user1.firstName || user1.urlSlug;
              const name2 = user2.firstName || user2.urlSlug;
              if (name1?.startsWith("0x") && name2?.startsWith("0x")) return name1?.localeCompare(name2);
              if (name1?.startsWith("0x")) return 1;
              if (name2?.startsWith("0x")) return -1;
              return capitalize(name1).localeCompare(capitalize(name2));
            });

            dispatch(setUsersInfoList(u));
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      const allUsers = usersInfoList.filter(user => user.id !== userSelector.id) ?? [];
      allUsers.forEach(user => {
        let image = "";
        if (user.anon != undefined && user.anon === true && user.anonAvatar && user.anonAvatar?.length > 0) {
          image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
        } else {
          if (user.hasPhoto && user.url) {
            image = `${user.url}?${Date.now()}`;
          }
        }
        user.imageUrl = image;
        user.assistances = user.assistances ?? 0;
        user.rate = user.rate ?? 0;
      });
    }
  }, [usersInfoList, userSelector.id]);

  useEffect(() => {
    setIsHideHeader(true);
    setIsTransparent(true);
    setAppHeaderBackgroundColor("privi-app-header");
  }, []);

  const [isHideHeader, setIsHideHeader] = useState<boolean>(false);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);

  const [appHeaderBackgroundColor, setAppHeaderBackgroundColor] = useState<string>("privi-app-header");

  const handleProfile = e => {
    handleCloseMobileMenu(e);
    history.push(`/profile/${userSelector.urlSlug}`);
    setAnchorEl(null);
  };

  const timeLeftMaintenance = () => {
    let seconds = Math.floor(secondsLeft);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

    return `${hours}h ${minutes}min ${seconds}s `;
  };

  const signInWithMetamask = () => {
    if (!account) return;

    const web3 = new Web3(library.provider);
    setOnSigning(true);
    API.signInWithMetamaskWallet(account, web3, "Dreem")
      .then(res => {
        if (res.isSignedIn) {
          setSignedin(true);
          let data = res.privian.user;
          data.infoImage = {
            avatarUrl: res.privian.user.avatarUrl,
          };
          dispatch(setUser(data));
          localStorage.setItem("token", res.accessToken);
          localStorage.setItem("address", account);
          localStorage.setItem("userId", data.id);
          localStorage.setItem("userSlug", data.urlSlug ?? data.id);

          axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
          dispatch(setLoginBool(true));
          setOnSigning(false);
        } else {
          if (res.message) {
            if (res.message === "Wallet address doesn't exist" && publicy) {
              signUp(res.signature);
            } else {
              showAlertMessage(res.message, { variant: "error" });
              setOnSigning(false);
            }
          } else {
            showAlertMessage("Connect the metamask", { variant: "error" });
            setOnSigning(false);
          }
        }
      })
      .catch(e => {
        setOnSigning(false);
      });
  };

  const signUp = async signature => {
    if (account) {
      const res = await API.signUpWithAddressAndName(account, account, signature, "Dreem");
      if (res.isSignedIn) {
        setSignedin(true);
        dispatch(setUser(res.userData));
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("address", account);
        localStorage.setItem("userId", res.userData.id);
        localStorage.setItem("userSlug", res.userData.urlSlug ?? res.userData.id);

        axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
        dispatch(setLoginBool(true));
        setOnSigning(false);
      } else {
        showAlertMessage(res.message, { variant: "error" });
        setOnSigning(false);
      }
    }
  };

  const handleConnect = () => {
    activate(injected, undefined, true)
      .then(res => {
        signInWithMetamask();
      })
      .catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(injected).then(res => {
            signInWithMetamask();
          });
        } else {
          console.info("Connection Error - ", error);
          setNoMetamask(true);
        }
      });
  };

  return (
    <div
      className={classes.header}
      style={{
        background: isClaimPage || isGetStartedPage || isProfilePage ? "#00000000" : "",
      }}
    >
      <div className={isTransparent ? "transparent" : isHideHeader ? appHeaderBackgroundColor : ""}>
        <div className="header-left">
          <PriviAppIcon openTab={props.openTab} isTransparent={isTransparent} />
        </div>
        <Box
          className={classes.header_menus}
          display="flex"
          flexGrow="1"
          alignItems="center"
          justifyContent="space-between"
          ml={12.375}
        >
          <Hidden mdDown>
            <PriviMetaverseAppNavigation />
          </Hidden>
        </Box>
        <div className="header-right">
          {openPriviWalletDialog && (
            <CreatePriviWalletModal
              open={openPriviWalletDialog}
              handleClose={handleCloseWalletDialog}
              handleOk={() => {
                setOpenPriviWalletDialog(false);
                history.push("/create-wallet");
              }}
            />
          )}
          {isSignedin ? (
            <>
              <div className="header-icons">
                <ToolbarButtonWithPopper
                  theme={isTransparent ? "dark" : "light"}
                  tooltip="Notifications"
                  icon={
                    !props.openTab ||
                    !pathName.toLowerCase().includes("privi-music") ||
                    !pathName.toLowerCase().includes("pods") ||
                    (props.openTab &&
                      (props.openTab.type === OpenType.Search || props.openTab.type === OpenType.Home))
                      ? IconNotifications
                      : IconNotificationsWhite
                  }
                  badge={unreadNotifications > 0 ? unreadNotifications.toString() : undefined}
                  onIconClick={markAllNotificationsAsRead}
                  openToolbar={openNotificationModal}
                  handleOpenToolbar={setOpenNotificationModal}
                  hidden={hideNotificationsModal}
                >
                  <NotificationsPopperContent
                    theme={isTransparent ? "dark" : "light"}
                    notifications={notifications}
                    onDismissNotification={dismissNotification}
                    removeNotification={removeNotification}
                    onRefreshAllProfile={() => null}
                    viewMore={value => viewMore(value)}
                    setSelectedNotification={setSelectedNotification}
                    handleShowContributionModal={handleOpenContributionModal}
                    handleClosePopper={() => {
                      setOpenNotificationModal(false);
                      setHideNotificationsModal(false);
                    }}
                    handleHidePopper={() => {
                      setHideNotificationsModal(true);
                    }}
                  />
                </ToolbarButtonWithPopper>
              </div>
              <Hidden mdDown>
                {account && (
                  <Hidden mdDown>
                    <SecondaryButton size="medium" className={classes.accountInfo}>
                      <label>
                        {account.slice(0, 7)}...{account.slice(account.length - 7)}
                      </label>
                    </SecondaryButton>
                  </Hidden>
                )}
                <div className="avatar-container">
                  <div
                    id="header-popup-wallet"
                    aria-describedby={popperId}
                    onClick={handleCreatePopup}
                    className="avatar"
                    style={{
                      backgroundImage: imageIPFS ? `url(${imageIPFS})` : `url(${getDefaultAvatar()})`,
                      cursor: ownUser ? "pointer" : "auto",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </Hidden>
            </>
          ) : (
            <SecondaryButton
              size="medium"
              className={classes.accountInfo}
              disabled={underMaintenance}
              style={{
                pointerEvents: isOnSigning ? "none" : undefined,
                opacity: isOnSigning ? 0.4 : undefined,
              }}
              onClick={handleConnect}
            >
              {isOnSigning && <CircularLoadingIndicator size={16} />}
              <Box pt={0.5}>CONNECT WALLET</Box>
            </SecondaryButton>
          )}
          <Hidden lgUp>
            <div
              ref={anchorMobileMenuRef}
              onClick={handleOpenMobileMenu}
              style={{ marginLeft: isSignedin ? 0 : 16 }}
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <path
                  d="M1 1H17M1 6H17M1 11H17"
                  stroke={"#FFFFFF"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Popper
              open={openMobileMenu}
              anchorEl={anchorMobileMenuRef.current}
              transition
              disablePortal={false}
              placement="bottom-end"
              style={{ position: "inherit", zIndex: 9999 }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={classes.mobilePopup}>
                    <ClickAwayListener onClickAway={handleCloseMobileMenu}>
                      <MenuList
                        autoFocusItem={openMobileMenu}
                        id="header-right-menu-list-grow"
                        onKeyDown={handleListKeyDownMobileMenu}
                      >
                        <Hidden lgUp>
                          {Navigator.map((nav, index) => (
                            <>
                              {nav.authorize && !isSignedin ? (
                                <></>
                              ) : (
                                <MenuItem
                                  key={`nav-button-${index}`}
                                  onClick={() => {
                                    setOpenMobileMenu(false);
                                    history.push(nav.link);
                                  }}
                                >
                                  <div
                                    style={{
                                      textTransform: "uppercase",
                                      fontFamily: "Grifter",
                                      width: "100%",
                                      paddingBottom: isLastMenu(index) ? 8 : 0,
                                      borderBottom: isLastMenu(index) ? "1px solid #FFFFFF40" : "none",
                                    }}
                                  >
                                    {nav.name}
                                  </div>
                                </MenuItem>
                              )}
                            </>
                          ))}
                          {account && (
                            <SecondaryButton
                              size="medium"
                              className={classes.accountInfo}
                              style={{ margin: "8px 16px", minWidth: 200 }}
                            >
                              <label style={{ marginLeft: 8 }}>
                                {account.slice(0, 7)}...{account.slice(account.length - 7)}
                              </label>
                            </SecondaryButton>
                          )}
                        </Hidden>
                        {account && (
                          <>
                            <MenuItem onClick={handleProfile}>
                              <div className="avatar-container">
                                <div
                                  className="avatar"
                                  style={{
                                    backgroundImage: imageIPFS
                                      ? `url(${imageIPFS})`
                                      : `url(${getDefaultAvatar()})`,
                                    cursor: ownUser ? "pointer" : "auto",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: 44,
                                    height: 44,
                                    marginLeft: 0,
                                  }}
                                />
                              </div>
                              PROFILE
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleLogout();
                                setAnchorEl(null);
                              }}
                            >
                              <div
                                style={{
                                  textTransform: "uppercase",
                                  fontFamily: "Grifter",
                                  width: "100%",
                                  paddingTop: 16,
                                  borderTop: "1px solid #FFFFFF40",
                                }}
                              >
                                Log Out
                              </div>
                            </MenuItem>
                          </>
                        )}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Hidden>
        </div>
        <SignInModal open={openSignInModal} handleClose={() => setOpenSignInModal(false)} />
        <Popper
          id={popperId}
          open={popperOpen}
          anchorEl={anchorEl}
          transition
          modifiers={{
            arrow: {
              enabled: true,
              element: arrowEl,
            },
            offset: {
              enabled: true,
              offset: "20, 0",
            },
          }}
          placement="bottom-end"
          style={{ zIndex: 1000 }}
        >
          <span className={classes.header_popup_arrow} ref={setArrowEl} />
          <ClickAwayListener
            onClickAway={() => {
              setAnchorEl(null);
            }}
          >
            <div className={classes.header_popup_back}>
              <div className={classes.header_popup_back_item} onClick={handleProfile}>
                Account
              </div>
              <div
                className={classes.header_popup_back_item}
                onClick={() => {
                  history.push("/gameNFT/manage_nft");
                  setAnchorEl(null);
                }}
              >
                MY NFTs
              </div>
              <div
                className={classes.header_popup_back_item}
                onClick={() => {
                  handleLogout();
                  setAnchorEl(null);
                }}
              >
                Log Out
              </div>
            </div>
          </ClickAwayListener>
        </Popper>
        {isSignedin && openMediaModal && (
          <CreateMediaModal open={openMediaModal} handleClose={handleCloseMediaModal} />
        )}
        {isSignedin && openPodCreateModal && (
          <PodCreateNFTMediaModal
            onClose={handleClosePodCreateModal}
            type={"Digital NFT"}
            open={openPodCreateModal}
          />
        )}
        {isSignedin && openCreateCommunityModal && (
          <CreateCommunityModal
            open={openCreateCommunityModal}
            handleClose={handleCloseCreateCommunityModal}
          />
        )}
        {isSignedin && openCreateSocialTokenModal && (
          <CreateImportSocialTokenModal
            user={userSelector}
            handleClose={handleCloseSocialTokenModal}
            type={"FT"}
            handleRefresh={() => {}}
            open={openCreateSocialTokenModal}
          />
        )}
        {isSignedin && openContributionModal && (
          <>
            <Dialog
              className="modalCommunityContribution"
              open={openContributionModal}
              onClose={handleCloseContributionModal}
              fullWidth={true}
              maxWidth={"md"}
            >
              <CommunityContributionModal
                handleClose={handleCloseContributionModal}
                communityId={selectedNotification?.otherItemId}
                communityName={selectedNotification?.pod}
                token={selectedNotification?.token}
                amount={selectedNotification?.amount}
                shareOnCommunity={handleShareCommunity}
                userId={selectedNotification?.itemId}
              />
            </Dialog>
            <Dialog
              className="modalShareContribution"
              open={openModalShareContribution}
              onClose={handleOpenModalShareContribution}
              fullWidth={true}
              maxWidth={"md"}
            >
              <ShareContributionModal
                handleClose={handleCloseModalShareContribution}
                communityId={communityAddress}
                communityName={communityName}
              />
            </Dialog>
          </>
        )}
        <MediaSellingOfferModal
          open={openModalMediaSellingOffer}
          handleClose={handleCloseModalMediaSellingOffer}
          selectedNotification={selectedNotification}
        />
      </div>
      {APP_ENV !== "dev" && underMaintenanceSelector?.underMaintenance ? (
        <div
          style={{
            height: "62px",
            width: "100%",
            backgroundColor: "#FFCF24",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "15px",
              width: "100%",
              height: "100%",
              padding: "0",
              margin: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {underMaintenanceSelector?.message || "Maintenance in Progress."}
            {underMaintenanceSelector?.timestamp ? ` Estimated time left ${timeLeftMaintenance()}` : null}
          </p>
        </div>
      ) : null}

      {noMetamask && <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />}
    </div>
  );
};

export default Header;

type NavItem = {
  name: string;
  value: string;
  link: string;
  authorize?: boolean;
};

const Navigator: NavItem[] = [
  { name: "PLAY", value: "play", link: "/play" },
  { name: "CREATE", value: "creations", link: "/create" },
  { name: "REALMS", value: "realms", link: "/realms" },
  { name: "AVATARS", value: "avatars", link: "/avatars" },
  { name: "GAME NFT", value: "gameNFT", link: "/gameNFT" },
  // { name: "METAVERSE", value: "metaverse", link: "/metaverse" },
  // { name: "Claim Dreem", value: "claim_dreem", link: "/claim_dreem", authorize: true },
];
