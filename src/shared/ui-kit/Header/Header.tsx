import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import axios from "axios";

import { Popper, ClickAwayListener, Grow, Paper, MenuList, MenuItem, Hidden, Box } from "@material-ui/core";

import { socket } from "components/Login/Auth";
import { useNotifications } from "shared/contexts/NotificationsContext";
import URL from "shared/functions/getURL";
import { getUser, getUsersInfoList } from "store/selectors/user";
import { setUser, signOut } from "store/actions/User";
import { capitalize } from "shared/helpers/string";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { createUserInfo, setUsersInfoList } from "store/actions/UsersInfo";
import { useAuth } from "shared/contexts/AuthContext";

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

import "shared/ui-kit/Global.module.css";

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
  const [openNotificationModal, setOpenNotificationModal] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<any>();
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

  const handleCreatePopup = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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

  const handleOpenContributionModal = () => {
    setOpenNotificationModal(false);
  };

  const handleCloseContributionModal = () => {};

  const handleOpenModalShareContribution = () => {};

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
          let data = res.data.user;
          data.infoImage = {
            avatarUrl: res.data.user.avatarUrl,
          };
          dispatch(setUser(data));
          localStorage.setItem("token", res.accessToken);
          localStorage.setItem("address", account);
          localStorage.setItem("userId", data.priviId);
          localStorage.setItem("userSlug", data.urlSlug ?? data.priviId);

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
        dispatch(setUser(res.data.user));
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("address", account);
        localStorage.setItem("userId", res.data.user.priviId);
        localStorage.setItem("userSlug", res.userData.urlSlug ?? res.data.user.priviId);

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
                  history.push("/gameNFTS/manage_nft");
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
  { name: "ASSETS", value: "assets", link: "/assets" },
  { name: "GAME NFTS", value: "gameNFTS", link: "/gameNFTS" },
  // { name: "METAVERSE", value: "metaverse", link: "/metaverse" },
  // { name: "Claim Dreem", value: "claim_dreem", link: "/claim_dreem", authorize: true },
];
