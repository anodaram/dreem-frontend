import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-elastic-carousel";
import { Hidden, useMediaQuery, useTheme, Grid } from "@material-ui/core";
import Web3 from "web3";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import axios from "axios";

import RealmCard from "components/PriviMetaverse/components/cards/RealmCard";
import OpenDesktopModal from "components/PriviMetaverse/modals/OpenDesktopModal";
import ConnectWalletModal from "components/PriviMetaverse/modals/ConnectWalletModal";
import AvatarCard from "components/PriviMetaverse/components/cards/AvatarCard";
import { RootState } from "store/reducers/Reducer";
import { setUser } from "store/actions/User";
import { setLoginBool } from "store/actions/LoginBool";

import Box from "shared/ui-kit/Box";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { CircularLoadingIndicator, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { detectMob, sanitizeIfIpfsUrl } from "shared/helpers";
import { forceDownload } from "shared/helpers/file_download";
import { getDefaultImageUrl } from "shared/services/user/getUserAvatar";
import { useAuth } from "shared/contexts/AuthContext";
import { injected } from "shared/connectors";
import * as API from "shared/services/API/WalletAuthAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import seedImg from "assets/metaverseImages/dreem_seed_image.png";
import shapeImgTriangle from "assets/metaverseImages/shape_home_2.png";
import shapeImgGreenCircle from "assets/metaverseImages/shape_home_green_circle.png";
import roadmapImage from "assets/metaverseImages/shape_roadmap.png";

import { homePageStyles, DotContainer, Dot } from "./index.styles";
import { getOperatingSystem } from "shared/helpers/platform";
import Footer from "components/PriviMetaverse/components/Footer";
import { userTrackDownload } from "shared/services/API/UserAPI";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 3,
  1000: 3,
  1440: 3,
};

const COLUMNS_COUNT_BREAK_POINTS_FOUR_AVATAR = {
  375: 1,
  600: 3,
  1000: 3,
  1440: 4,
};

const RoadMap = {
  data: [
    {
      milestone: "2021",
      deadline: "",
    },
    {
      milestone: "Initial realms w/ customization components & dynamic placeholder NFTs",
      deadline: "DEC 2021",
    },
    {
      milestone: "Alpha version with first testers",
      deadline: "DEC 2021",
    },
    {
      milestone: "Multiplayer and autoupdate",
      deadline: "DEC 2021",
    },
    {
      milestone: "Realm creator tools",
      deadline: "DEC 2021",
    },
    {
      milestone: "Beta version launch, with featured realms and custom parameters",
      deadline: "DEC 2021",
    },
    {
      milestone: "2022",
      deadline: "",
    },
    {
      milestone: "Game asset NFT marketplace",
      deadline: "Q1",
    },
    {
      milestone: "Realm maps + Generative avatars",
      deadline: "Q1",
    },
    {
      milestone: "Realm creation + on-chain realm extensions editor",
      deadline: "Q1",
    },
    {
      milestone: "Realm monetization: events, objects, experiences, taxation, etc.",
      deadline: "Q2",
    },
    {
      milestone: "Integration of blockchain based music and video streaming",
      deadline: "Q2",
    },
    {
      milestone: "Live collaboration tools",
      deadline: "Q3",
    },
    {
      milestone: (
        <>
          &#8226;&nbsp;Mobile/tablet support
          <br />
          &#8226;&nbsp;Live collaboration tools
          <br />
          &#8226;&nbsp;VR support
          <br />
          &#8226;&nbsp;Solana integration
          <br />
          &#8226;&nbsp;Governance decentralization
        </>
      ),
      deadline: "2022 Q2 & beyond:",
    },
  ],
  current: 6,
};

const FILE_LINK_MAC = "https://dreem.fra1.digitaloceanspaces.com/Dreem.dmg";
const FILE_LINK_WINDOWS = "https://dreem.fra1.digitaloceanspaces.com/Dreem.msi";

const filters = ["REALM"];

export default function HomePage() {
  const classes = homePageStyles();

  const dispatch = useDispatch();
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);
  const publicy = useSelector((state: RootState) => state.underMaintenanceInfo?.publicy);

  const history = useHistory();
  const theme = useTheme();
  const width = useWindowDimensions().width;
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { isSignedin, setSignedin, isOnSigning, setOnSigning } = useAuth();
  const { activate, account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [loadingFeatured, setLoadingFeatured] = React.useState<boolean>(false);
  const [featuredRealms, setFeaturedRealms] = React.useState<any[]>([]);
  const [loadingExplore, setLoadingExplore] = React.useState<boolean>(false);
  const [exploreRealms, setExploreReamls] = React.useState<any[]>([]);
  const [loadingExploreCharacters, setLoadingExploreCharacters] = React.useState<boolean>(false);
  const [exploreCharacters, setExploreCharacters] = React.useState<any[]>([]);
  const [showDownloadModal, setShowDownloadModal] = React.useState<boolean>(false);
  const [openConnectWalletModal, setOpenConnectWalletModal] = React.useState<boolean>(false);

  const [hasUnderMaintenanceInfo, setHasUnderMaintenanceInfo] = React.useState(false);

  const carouselRef = React.useRef<any>();
  const carouselRef1 = React.useRef<any>();
  const [curPageIndex, setCurPageIndex] = React.useState<number>(0);

  const [breakPoints] = React.useState<any[]>([
    { width: theme.breakpoints.values.xs, itemsToShow: 2 },
    { width: theme.breakpoints.values.sm, itemsToShow: 3 },
    { width: theme.breakpoints.values.md, itemsToShow: 4 },
    // { width: theme.breakpoints.values.lg, itemsToShow: 3 },
  ]);

  const loadingCount = React.useMemo(() => (width > 1000 ? 3 : width > 600 ? 2 : 1), [width]);

  React.useEffect(() => {
    if (hasUnderMaintenanceInfo && !isSignedin && !underMaintenanceSelector.underMaintenance) {
      signInWithMetamask();
    }
  }, [hasUnderMaintenanceInfo, isSignedin, underMaintenanceSelector?.underMaintenance]);

  React.useEffect(() => {
    if (underMaintenanceSelector && Object.keys(underMaintenanceSelector).length > 0) {
      setHasUnderMaintenanceInfo(true);
    }
  }, [underMaintenanceSelector]);

  React.useEffect(() => {
    if (isSignedin) {
      setOpenConnectWalletModal(false);
    }
  }, [isSignedin])

  React.useEffect(() => {
    try {
      if (!underMaintenanceSelector.underMaintenance) {
        setLoadingFeatured(true);
        MetaverseAPI.getFeaturedWorlds(filters)
          .then(res => {
            if (res.success) {
              setFeaturedRealms(res.data.elements);
            }
          })
          .finally(() => setLoadingFeatured(false));

        setLoadingExplore(true);
        MetaverseAPI.getAssets(9, 1, "DESC", filters, true, undefined, undefined, false)
          .then(res => {
            console.log(res);
            if (res.success) {
              const items = res.data.elements;
              if (items && items.length > 0) {
                setExploreReamls(res.data.elements);
              }
            }
          })
          .finally(() => setLoadingExplore(false));

        setLoadingExploreCharacters(true);
        MetaverseAPI.getCharacters(null, true, null, true, 12)
          .then(res => {
            setExploreCharacters(res.data.elements);
          })
          .finally(() => setLoadingExploreCharacters(false));
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const openLearnToCreator = () => {
    window.open(
      "https://dreem.gitbook.io/metaverse-creator-manual/05OugTkVduc9hQ7Ajmqc/quick-start",
      "_blank"
    );
  };

  const handleDownload = () => {
    if (isSignedin) {
      userTrackDownload();
    }

    if (detectMob()) {
      setShowDownloadModal(true);
    } else {
      const os = getOperatingSystem(window);
      if (os === "Mac") {
        forceDownload(FILE_LINK_MAC);
      } else if (os === "Windows") {
        forceDownload(FILE_LINK_WINDOWS);
      }
    }
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
          dispatch(
            setUser({
              ...data,
              id: data.priviId,
              infoImage: {
                ...data.infoImage,
                avatarUrl: res.data.user.avatarUrl,
              },
              urlSlug: data.name,
              name: `${data.firstName} ${data.lastName}`,
            })
          );
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
        showAlertMessage(res.message, { variant: "error" });
        setOnSigning(false);
      }
    }
  };

  const handleMetaMaskConnect = () => {
    activate(injected, undefined, true)
    .then(res => {
      console.log("connected");
      signInWithMetamask();
    })
    .catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected).then(res => {
          signInWithMetamask();
        });
      } else {
        console.info("Connection Error - ", error);
      }
    });
  }

  const handleCreate = () => {
    if (isSignedin) {
      history.push("/create");
    } else {
      setOpenConnectWalletModal(true);
    }
  };

  const handlePrevSlide = () => {
    if (curPageIndex === 0) {
      carouselRef.current.goTo(featuredRealms.length - 1);
      if (!isMobile) carouselRef1?.current.goTo(featuredRealms.length - 1);
      setCurPageIndex(0);
    } else {
      carouselRef.current.slidePrev();
      if (!isMobile) carouselRef1?.current.slidePrev();
    }
  };

  const handlePrevSlideEnd = (nextItem, curPage) => {
    setCurPageIndex(curPage);
  };

  const handleNextSlide = () => {
    if (curPageIndex === featuredRealms.length - 1) {
      carouselRef.current.goTo(0);
      if (!isMobile) carouselRef1?.current.goTo(0);
      setCurPageIndex(0);
    } else {
      carouselRef.current.slideNext();
      if (!isMobile) carouselRef1?.current.slideNext();
    }
  };

  const handleNextSlideEnd = (nextItem, curPage) => {
    setCurPageIndex(curPage);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.container} id="scrollContainer">
        <img src={seedImg} alt="seedImg" />
        <Box className={classes.mainContent} mb={2} pb={3}>
          <Box className={classes.title} mb={2.5}>
            <span>enter the Dreem</span>
            <br />A WORLD OF PURE IMAGINATION
          </Box>
          <Box className={classes.description} mb={1}>
          Enhance your communities experience with immersive 3D virtual spaces that you can create, customize and self-govern, all for free. 
          Built on Solana, Polygon and BSC.
          </Box>
          <Box display="flex" justifyContent="flex-start" alignItems="center" mb={6}>
            <Box className={classes.typo1}>Currently supporting </Box>
            <Box ml={2}>
              <SolanaSmallIcon />
            </Box>
            <Box ml={2}>
              <PolygonSmallIcon />
            </Box>
            <Box ml={2}>
              <BNBSmallIcon />
            </Box>
          </Box>
          <Box className={classes.buttons}>
            <PrimaryButton
              size="medium"
              className={classes.button}
              onClick={handleDownload}
              style={{ minWidth: 250, paddingTop: 6 }}
            >
              Download NOW
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={`${classes.button} ${classes.createButton}`}
              disabled={
                isOnSigning ||
                !hasUnderMaintenanceInfo ||
                (underMaintenanceSelector &&
                  Object.keys(underMaintenanceSelector).length > 0 &&
                  underMaintenanceSelector.underMaintenance)
              }
              style={{
                minWidth: 250,
                paddingTop: 6,
                pointerEvents: isOnSigning ? "none" : undefined,
                opacity: isOnSigning ? 0.4 : undefined,
                marginLeft: 30,
              }}
              onClick={handleCreate}
            >
              {isSignedin ? (
                "create"
              ) : isOnSigning ? (
                <CircularLoadingIndicator size={16} />
              ) : (
                <>
                  <MetamaskIcon />
                  log in to create
                </>
              )}
            </PrimaryButton>
          </Box>
        </Box>
        <Box className={classes.realmContainer}>
          <img className={classes.bgImgTriangle} src={shapeImgTriangle} alt="seedImg" />
          <img className={classes.bgImgGreenCircle} src={shapeImgGreenCircle} alt="seedImg" />
          {/* <img className={classes.bgImgPinkCircle} src={shapeImgPinkCircle} alt="seedImg" /> */}
          <Box className={classes.fitContent}>
            <Grid container style={{marginTop: 10, overflow: "hidden"}}>
              <Grid item xs={12} sm={6}>
                <span className={`${classes.gradientText} ${classes.gradient1} ${classes.fitSize}`}>
                  featured realms
                </span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span className={`${classes.shadowText}  ${classes.fitSize}`}>featured realms</span>
              </Grid>
            </Grid>
            <Box className={classes.carousel} mt={4}>
              {!loadingFeatured && (
                <Box className={classes.arrowBox} mr={isTablet ? "-58px" : "20px"} onClick={handlePrevSlide}>
                  <LeftIcon />
                </Box>
              )}
              <Carousel
                ref={carouselRef}
                itemsToShow={1}
                isRTL={false}
                showArrows={false}
                itemPadding={[0, 8, 0, 8]}
                onNextEnd={handleNextSlideEnd}
                onPrevEnd={handlePrevSlideEnd}
                renderPagination={({ pages, activePage, onClick }) => {
                  return (
                    <Box mt={2} width="100%">
                      {isMobile ? (
                        <Box display="flex" alignItems="center" justifyContent="center">
                          {pages.map(page => {
                            const isActivePage = activePage === page;
                            return (
                              <React.Fragment key={`page_${page}`}>
                                {!loadingFeatured && (
                                  <Box
                                    style={{
                                      width: 8,
                                      height: 8,
                                      margin: "0 5px",
                                      borderRadius: "100vh",
                                      background: isActivePage ? "#fff" : "rgba(255, 255, 255, 0.5)",
                                    }}
                                    onClick={() => {
                                      onClick(page.toString());
                                    }}
                                  ></Box>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </Box>
                      ) : (
                        <Carousel
                          ref={carouselRef1}
                          enableTilt={false}
                          breakPoints={breakPoints}
                          isRTL={false}
                          showArrows={false}
                          pagination={false}
                          itemPadding={[0, 8, 0, 8]}
                        >
                          {pages.map(page => {
                            const isActivePage = activePage === page;
                            return (
                              <React.Fragment key={`page_${page}`}>
                                {!loadingFeatured && (
                                  <Box
                                    className={classes.carouselItem}
                                    style={{
                                      backgroundImage: featuredRealms[page]?.realmImage
                                        ? `url("${sanitizeIfIpfsUrl(featuredRealms[page]?.realmImage)}")`
                                        : `url(${getDefaultImageUrl()})`,
                                      border: isActivePage ? "2px solid #E1E736" : "none",
                                    }}
                                    onClick={() => {
                                      onClick(page.toString());
                                    }}
                                  ></Box>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </Carousel>
                      )}
                    </Box>
                  );
                }}
              >
                {(loadingFeatured ? Array(3).fill(0) : featuredRealms).map((item, index) => (
                  <RealmCard
                    key={`top-album-${index}`}
                    item={item}
                    disableEffect
                    isFeature
                    isLoading={loadingFeatured}
                  />
                ))}
              </Carousel>
              {!loadingFeatured && (
                <Box className={classes.arrowBox} ml={isTablet ? "-58px" : "20px"} onClick={handleNextSlide}>
                  <RightIcon />
                </Box>
              )}
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={10}>
              <Box className={`${classes.gradientText}`} style={{ fontSize: 34 }}>
                other realms
              </Box>
              <Hidden xsDown>
                <SecondaryButton
                  size="medium"
                  className={classes.showAll}
                  onClick={() => history.push("/realms")}
                >
                  Show All
                </SecondaryButton>
              </Hidden>
            </Box>
            <Box mt={4}>
              <MasonryGrid
                gutter={"16px"}
                data={loadingExplore ? Array(loadingCount).fill(0) : exploreRealms}
                renderItem={(item, _) => <RealmCard item={item} isLoading={loadingExplore} />}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={10}>
              <Box className={`${classes.gradientText}`} style={{ fontSize: 34 }}>
                new avatars
              </Box>
              <Hidden xsDown>
                <SecondaryButton
                  size="medium"
                  className={classes.showAll}
                  onClick={() => history.push("/avatars")}
                >
                  Show All
                </SecondaryButton>
              </Hidden>
            </Box>
            <Box mt={4}>
              <MasonryGrid
                gutter={"16px"}
                data={exploreCharacters}
                renderItem={(item, _) => <AvatarCard item={item} isLoading={loadingExploreCharacters} />}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR_AVATAR}
              />
            </Box>
            <Box className={classes.gradientText} mt={10}>
              BUILD YOUR
              <br />
              OWN DREEM
            </Box>
            <Box className={classes.description} mb={6} style={{ maxWidth: 520 }}>
              Use our editor to make your first steps in creating 3D realms or upload existing extensive 3D
              worlds created with popular tools such as unity.
            </Box>
            <Box className={classes.buttons}>
              <PrimaryButton
                size="medium"
                className={`${classes.button} ${classes.createButton}`}
                disabled={
                  isOnSigning ||
                  !hasUnderMaintenanceInfo ||
                  (underMaintenanceSelector &&
                    Object.keys(underMaintenanceSelector).length > 0 &&
                    underMaintenanceSelector.underMaintenance)
                }
                style={{
                  pointerEvents: isOnSigning ? "none" : undefined,
                  opacity: isOnSigning ? 0.4 : undefined,
                  minWidth: 250,
                  paddingTop: 6,
                }}
                onClick={handleCreate}
              >
                {isSignedin ? (
                  "create Realm"
                ) : isOnSigning ? (
                  <CircularLoadingIndicator size={16} />
                ) : (
                  <>
                    <MetamaskIcon />
                    log in to create
                  </>
                )}
              </PrimaryButton>
              <PrimaryButton
                onClick={openLearnToCreator}
                size="medium"
                className={`${classes.button} ${classes.learnButton}`}
                style={{ paddingTop: 6, marginLeft: 20 }}
              >
                Learn how to create
              </PrimaryButton>
            </Box>

            <Box className={classes.supportedNetworkTitle}>supported networks</Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginTop: 40 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Box className={classes.supportedNetworkBtn}>
                    <PolygonIcon />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className={classes.supportedNetworkBtn}>
                    <SolanaIcon />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className={classes.supportedNetworkBtn}>
                    <BNBIcon />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
        <Box className={classes.roadmapContainer}>
          <img src={roadmapImage} alt="roadmap" />
          <Box className={classes.fitContent} display="flex" flexDirection="column" alignItems="center">
            <Box className={`${classes.gradientText}`} style={{ fontSize: 34 }}>
              our roadmap
            </Box>
            <Box className={classes.roadmap}>
              {RoadMap.data.map((road, index) => {
                const yearCount = RoadMap.data.reduce(
                  (prev, cur, yIdx) => (yIdx < index && !cur.deadline ? prev + 1 : prev),
                  0
                );
                const isLeft = isTablet ? false : (index + yearCount) % 2 === 0 ? true : false;
                const completed = index < RoadMap.current;
                const isLast = index === RoadMap.data.length - 1;

                return (
                  <Box
                    className={`${classes.row} ${index <= RoadMap.current && classes.completeRow}`}
                    key={`road-${index}`}
                  >
                    <Box width={1} height={1}></Box>
                    <Box width={1} height={1}></Box>
                    <DotContainer
                      isLeft={isLeft}
                      type={index === RoadMap.current ? "progress" : completed ? "complete" : "dot"}
                    >
                      {!isLeft && (
                        <Dot
                          isLeft={false}
                          type={index === RoadMap.current ? "progress" : completed ? "complete" : "dot"}
                        />
                      )}
                      <Box>
                        <Box position="relative" width={1} height={1}>
                          <Box className={classes.timeline} style={{ marginTop: isLast ? 70 : undefined }}>
                            {/* {!isLeft && !completed && !!road.deadline && ( */}
                            {!isLeft && isLast && (
                              <Box className={`${classes.deadline} ${classes.deadlineLeft}`}>
                                {road.deadline}
                              </Box>
                            )}
                            {/* )} */}
                            <Box
                              className={`${classes.milestone} ${!road.deadline && classes.yearMilestone}`}
                              display="flex"
                              flexDirection="column"
                              alignItems="flex-end"
                              textAlign={isLeft ? "right" : "left"}
                            >
                              {road.milestone}
                              {completed && !!road.deadline && (
                                <Box
                                  className={classes.completeBox}
                                  style={{
                                    left: isLeft ? undefined : 0,
                                    right: isLeft ? 0 : undefined,
                                  }}
                                >
                                  Complete
                                </Box>
                              )}
                            </Box>
                            {/* {isLeft && !completed && !!road.deadline && ( */}
                            {isLeft && isLast && (
                              <Box className={`${classes.deadline} ${classes.deadlineRight}`}>
                                {road.deadline}
                              </Box>
                            )}
                            {/* )} */}
                          </Box>
                        </Box>
                      </Box>
                      {isLeft && (
                        <Dot
                          isLeft={true}
                          type={index === RoadMap.current ? "progress" : completed ? "complete" : "dot"}
                        />
                      )}
                    </DotContainer>
                  </Box>
                );
              })}
              <Box className={classes.border} style={{ height: 90 * RoadMap.current }} />
            </Box>
          </Box>
        </Box>
        <Footer />
      </Box>
      {showDownloadModal && (
        <OpenDesktopModal open={showDownloadModal} onClose={() => setShowDownloadModal(false)} />
      )}
      {openConnectWalletModal && (
        <ConnectWalletModal 
          open={openConnectWalletModal} 
          onClose={() => setOpenConnectWalletModal(false)}
          handleMetaMaskConnect={handleMetaMaskConnect}
        />
      )}
    </Box>
  );
}

const RightIcon = () => (
  <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.2485 18.9332L10.3694 10.8123L2.24851 2.69141"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

const LeftIcon = () => (
  <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.69354 2.85449L1.57265 10.9754L9.69354 19.0963"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

const MetamaskIcon = () => (
  <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.22168 16.4517L8.84206 17.1437V16.2388L9.05597 16.0259H10.5533V17.0904V17.8356H8.94901L6.97035 16.984L6.22168 16.4517Z"
      fill="#CDBDB2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.7783 16.4516L12.2115 17.1436V16.2387L11.9976 16.0258H10.5002V17.0904V17.8355H12.1045L14.0831 16.9839L14.7783 16.4516Z"
      fill="#CDBDB2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.0557 14.4824L8.8418 16.2388L9.10913 16.0259H11.8899L12.2107 16.2388L11.9968 14.4824L11.569 14.2162L9.42999 14.2695L9.0557 14.4824Z"
      fill="#393939"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.7783 16.4514L11.9976 14.4821L12.2115 16.1853V17.1434L14.1366 16.7708L14.7783 16.4514Z"
      fill="#DFCEC3"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.99733 9.15979L0.5 13.4711L4.24333 13.2582H6.64971V11.3953L6.54276 7.56299L6.008 7.9888L1.99733 9.15979Z"
      fill="#F89D35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.6123 2.61255L8.89573 5.59324L9.48402 14.2692H11.5695L12.2113 5.59324L13.3877 2.61255H7.6123Z"
      fill="#F89C35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.83203 9.63861L9.21708 9.74506L8.73584 11.9806L6.65022 11.4483L4.83203 9.63861Z"
      fill="#D87C30"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.83203 9.69189L6.65022 11.3951V13.0984L4.83203 9.69189Z"
      fill="#EA8D3A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.64941 11.4483L8.78846 11.9806L9.4837 14.2694L9.00237 14.5355L6.64941 13.1516V11.4483Z"
      fill="#F89D35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.64949 13.1515L6.22168 16.4515L9.05597 14.4822L6.64949 13.1515Z"
      fill="#EB8F35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.18945 13.2048L6.64936 13.1515L6.22155 16.4515L4.18945 13.2048Z"
      fill="#D87C30"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.67648 17.8887L6.2219 16.4516L4.18981 13.2048L0.5 13.4709L1.67648 17.8887Z"
      fill="#EB8F35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.22168 16.4515L9.05597 14.4821L8.84206 16.1854V17.1434L6.91692 16.7708L6.22168 16.4515Z"
      fill="#DFCEC3"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.04062 10.7032L8.62891 11.9275L6.54329 11.3952L8.04062 10.7032Z"
      fill="#393939"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.2164 9.74518L9.48383 14.2695L8.68164 11.9541L9.2164 9.74518Z"
      fill="#EA8E3A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.89622 5.59344L6.59679 7.5096L4.83203 9.63867L9.21708 9.7984L8.89622 5.59344Z"
      fill="#E8821E"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.0027 9.15979L20.5 13.4711L16.7567 13.2582H14.3503V11.3953L14.4572 7.56299L14.992 7.9888L19.0027 9.15979Z"
      fill="#F89D35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.3235 17.8886L14.7781 16.4514L16.8102 13.2047L20.5 13.4707L19.3235 17.8886Z"
      fill="#EB8F35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.1689 9.63904L11.7839 9.74549L12.2651 11.981L14.3508 11.4487L16.1689 9.63904Z"
      fill="#D87C30"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.1689 9.69183L14.3508 11.3951V13.0983L16.1689 9.69183Z"
      fill="#EA8D3A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.3506 11.4484L12.2115 11.9806L11.5163 14.2694L11.9976 14.5355L14.3506 13.1516V11.4484Z"
      fill="#F89D35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.3505 13.1519L14.7783 16.4519L11.9976 14.5357L14.3505 13.1519Z"
      fill="#EB8F35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.8105 13.2051L14.3506 13.1519L14.7785 16.4519L16.8105 13.2051Z"
      fill="#D87C30"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.7836 9.74506L11.5162 14.2694L12.3184 11.954L11.7836 9.74506Z"
      fill="#EA8E3A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.9594 10.7033L12.3711 11.9276L14.4567 11.3953L12.9594 10.7033Z"
      fill="#393939"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.1048 5.59344L14.4042 7.5096L16.1689 9.63867L11.7839 9.7984L12.1048 5.59344Z"
      fill="#E8821E"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.377 0.111084L12.1042 5.59338L13.3341 2.61269L19.377 0.111084Z"
      fill="#E88F35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.3773 0.111084L20.3398 3.03855L19.8051 6.23215L20.1794 6.44506L19.6447 6.9241L20.0725 7.29668L19.4842 7.82895L19.8586 8.14831L19.0029 9.21284L14.9922 7.98863C13.0314 6.42731 12.0689 5.62891 12.1045 5.59343C12.1402 5.55795 14.5644 3.7305 19.3773 0.111084Z"
      fill="#8E5A30"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.62305 0.111084L8.89581 5.59338L7.6659 2.61269L1.62305 0.111084Z"
      fill="#E88F35"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.62273 0.111084L0.660156 3.03855L1.19492 6.23215L0.820585 6.44506L1.35535 6.9241L0.927537 7.29668L1.51578 7.82895L1.14144 8.14831L1.99706 9.21284L6.00777 7.98863C7.96857 6.42731 8.93114 5.62891 8.89549 5.59343C8.85984 5.55795 6.43558 3.7305 1.62273 0.111084Z"
      fill="#8E5A30"
    />
  </svg>
);

const PolygonIcon = () => (
  <svg width="156" height="33" viewBox="0 0 156 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_7042_130987)">
      <path
        d="M27.399 9.93564C26.7291 9.52308 25.8582 9.52308 25.1214 9.93564L19.8961 13.0985L16.3456 15.1612L11.1204 18.3242C10.4505 18.7367 9.57961 18.7367 8.84272 18.3242L4.68932 15.8489C4.01942 15.4364 3.55048 14.68 3.55048 13.8548V8.97301C3.55048 8.14791 3.95242 7.39157 4.68932 6.97901L8.77573 4.57245C9.44563 4.1599 10.3165 4.1599 11.0534 4.57245L15.1398 6.97901C15.8097 7.39157 16.2786 8.14791 16.2786 8.97301V12.1359L19.8291 10.0044V6.84149C19.8291 6.01639 19.4272 5.26005 18.6903 4.84749L11.1204 0.309415C10.4505 -0.103138 9.57961 -0.103138 8.84272 0.309415L1.13884 4.84749C0.401942 5.26005 0 6.01639 0 6.84149V15.9864C0 16.8115 0.401942 17.5678 1.13884 17.9804L8.84272 22.5184C9.51263 22.9311 10.3835 22.9311 11.1204 22.5184L16.3456 19.4243L19.8961 17.2928L25.1214 14.1987C25.7912 13.7861 26.6621 13.7861 27.399 14.1987L31.4854 16.6053C32.1554 17.0178 32.6243 17.7742 32.6243 18.5992V23.4811C32.6243 24.3062 32.2223 25.0625 31.4854 25.4751L27.399 27.9505C26.7291 28.363 25.8582 28.363 25.1214 27.9505L21.035 25.5439C20.365 25.1313 19.8961 24.375 19.8961 23.5498V20.387L16.3456 22.5184V25.6814C16.3456 26.5064 16.7476 27.2628 17.4845 27.6753L25.1884 32.2135C25.8582 32.626 26.7291 32.626 27.466 32.2135L35.1699 27.6753C35.8398 27.2628 36.3087 26.5064 36.3087 25.6814V16.5365C36.3087 15.7114 35.9068 14.955 35.1699 14.5425L27.399 9.93564Z"
        fill="#7950DD"
      />
      <path
        d="M50.4534 29.5985V22.0065C51.2703 23.0431 52.7528 23.6225 54.4776 23.6225C58.8648 23.6225 61.8301 20.482 61.8301 15.695C61.8301 10.908 59.1069 7.76755 54.8406 7.76755C52.8739 7.76755 51.3611 8.49931 50.4534 9.68843V8.01147H46.2476V29.5985H50.4534ZM53.9632 19.9636C51.6939 19.9636 50.2113 18.2562 50.2113 15.695C50.2113 13.1033 51.6939 11.3959 53.9632 11.3959C56.1719 11.3959 57.6848 13.1033 57.6848 15.695C57.6848 18.2562 56.1719 19.9636 53.9632 19.9636Z"
        fill="white"
      />
      <path
        d="M71.3799 23.6225C76.0698 23.6225 79.4284 20.2685 79.4284 15.695C79.4284 11.1215 76.0698 7.76755 71.3799 7.76755C66.6901 7.76755 63.3315 11.1215 63.3315 15.695C63.3315 20.2685 66.6901 23.6225 71.3799 23.6225ZM71.3799 19.9636C69.1107 19.9636 67.5675 18.2257 67.5675 15.695C67.5675 13.1338 69.1107 11.3959 71.3799 11.3959C73.6493 11.3959 75.1924 13.1338 75.1924 15.695C75.1924 18.2257 73.6493 19.9636 71.3799 19.9636Z"
        fill="white"
      />
      <path d="M86.1769 23.3784V1.33398H81.9712V23.3784H86.1769Z" fill="white" />
      <path
        d="M98.8195 8.01102L95.6425 17.9203L92.4352 8.01102H88.1387L93.6758 23.2561L91.4368 29.5981H95.461L97.6092 23.3171L103.146 8.01102H98.8195Z"
        fill="white"
      />
      <path
        d="M114.958 9.53598C114.111 8.46882 112.598 7.76755 110.753 7.76755C106.304 7.76755 103.612 10.908 103.612 15.695C103.612 20.482 106.304 23.6225 110.813 23.6225C112.598 23.6225 114.201 22.9517 114.989 21.8235V23.8359C114.989 25.2689 114.051 26.2751 112.779 26.2751H105.759V29.5985H113.445C116.894 29.5985 119.194 27.4947 119.194 24.2932V8.01147H114.958V9.53598ZM111.478 19.9636C109.239 19.9636 107.756 18.2867 107.756 15.695C107.756 13.1033 109.239 11.3959 111.478 11.3959C113.748 11.3959 115.231 13.1033 115.231 15.695C115.231 18.2867 113.748 19.9636 111.478 19.9636Z"
        fill="white"
      />
      <path
        d="M129.797 23.6225C134.487 23.6225 137.845 20.2685 137.845 15.695C137.845 11.1215 134.487 7.76755 129.797 7.76755C125.107 7.76755 121.748 11.1215 121.748 15.695C121.748 20.2685 125.107 23.6225 129.797 23.6225ZM129.797 19.9636C127.527 19.9636 125.984 18.2257 125.984 15.695C125.984 13.1338 127.527 11.3959 129.797 11.3959C132.066 11.3959 133.609 13.1338 133.609 15.695C133.609 18.2257 132.066 19.9636 129.797 19.9636Z"
        fill="white"
      />
      <path
        d="M144.382 23.3785V14.9632C144.382 12.9814 145.683 11.5483 147.529 11.5483C149.283 11.5483 150.463 12.8899 150.463 14.7498V23.3785H154.699V13.8046C154.699 10.2677 152.46 7.76755 149.011 7.76755C146.923 7.76755 145.229 8.65176 144.382 10.1458V8.01147H140.146V23.3785H144.382Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_7042_130987">
        <rect width="155.5" height="32.5229" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const SolanaIcon = () => (
  <svg width="215" height="33" viewBox="0 0 215 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M35.5516 25.4808L29.6518 31.8067C29.5242 31.9441 29.3696 32.0538 29.1978 32.1288C29.0259 32.2039 28.8405 32.2427 28.6529 32.2429H0.685482C0.552094 32.2428 0.421619 32.2039 0.310035 32.1308C0.198455 32.0577 0.110611 31.9536 0.0572561 31.8314C0.00390157 31.7091 -0.0126458 31.574 0.00964155 31.4425C0.0319289 31.311 0.0920789 31.1888 0.182733 31.0909L6.07588 24.7649C6.20349 24.6275 6.35801 24.5179 6.52988 24.4428C6.70171 24.3678 6.8872 24.329 7.07471 24.3288H35.0422C35.1767 24.326 35.3092 24.3631 35.4227 24.4354C35.5363 24.5077 35.6262 24.612 35.6804 24.7351C35.735 24.8583 35.7517 24.9948 35.7287 25.1275C35.7057 25.2602 35.6441 25.3831 35.5516 25.4808ZM29.6518 12.7389C29.5237 12.6022 29.369 12.493 29.1973 12.4179C29.0256 12.343 28.8403 12.3038 28.6529 12.3028H0.685482C0.552094 12.3029 0.421619 12.3418 0.310035 12.4149C0.198455 12.488 0.110611 12.5921 0.0572561 12.7143C0.00390157 12.8366 -0.0126458 12.9717 0.00964155 13.1032C0.0319289 13.2348 0.0920789 13.3569 0.182733 13.4548L6.07588 19.7841C6.20396 19.9209 6.35861 20.0301 6.53035 20.1051C6.70208 20.1801 6.88733 20.2193 7.07471 20.2202H35.0422C35.1753 20.2195 35.3052 20.1801 35.4164 20.1068C35.5276 20.0334 35.6148 19.9293 35.6678 19.8072C35.7207 19.6851 35.737 19.5502 35.7144 19.419C35.6921 19.2877 35.6321 19.1659 35.5416 19.0683L29.6518 12.7389ZM0.685482 8.19422H28.6529C28.8405 8.19405 29.0259 8.1552 29.1978 8.08015C29.3696 8.00514 29.5242 7.89547 29.6518 7.75806L35.5516 1.43211C35.6441 1.33439 35.7057 1.21147 35.7287 1.07879C35.7517 0.946116 35.735 0.809618 35.6804 0.686475C35.6262 0.563332 35.5363 0.459045 35.4227 0.386738C35.3092 0.314431 35.1767 0.277334 35.0422 0.280114H7.07471C6.8872 0.280311 6.70171 0.319141 6.52988 0.394182C6.35801 0.469223 6.20349 0.578866 6.07588 0.716273L0.182733 7.04223C0.0920789 7.14008 0.0319289 7.26227 0.00964155 7.39379C-0.0126458 7.5253 0.00390157 7.66044 0.0572561 7.7827C0.110611 7.90496 0.198455 8.009 0.310035 8.08208C0.421619 8.1552 0.552094 8.19415 0.685482 8.19422Z"
      fill="url(#paint0_linear_7042_130997)"
    />
    <path
      d="M69.6487 13.7978H54.6861V8.87024H73.5375V3.94264H54.6361C53.9902 3.93914 53.3503 4.06286 52.7523 4.30675C52.1544 4.55066 51.61 4.90995 51.1512 5.36412C50.6921 5.81829 50.3268 6.35846 50.0764 6.95373C49.8261 7.54904 49.6952 8.18783 49.6919 8.83361V13.8278C49.6946 14.4741 49.8244 15.1137 50.0745 15.7097C50.3245 16.3058 50.6894 16.8467 51.1485 17.3016C51.608 17.7565 52.1524 18.1164 52.7507 18.3607C53.349 18.605 53.9899 18.7289 54.6361 18.7254H69.6187V23.653H50.0481V28.5806H69.6487C70.2946 28.5842 70.9345 28.4604 71.5325 28.2165C72.1305 27.9726 72.6745 27.6133 73.1336 27.1592C73.5927 26.705 73.958 26.1648 74.2084 25.5695C74.4587 24.9742 74.5896 24.3354 74.5929 23.6897V18.6955C74.5903 18.0491 74.4604 17.4096 74.2104 16.8136C73.9603 16.2175 73.5954 15.6765 73.1363 15.2217C72.6768 14.7668 72.1324 14.4069 71.5341 14.1626C70.9358 13.9183 70.2949 13.7943 69.6487 13.7978Z"
      fill="white"
    />
    <path
      d="M98.635 3.9423H83.6158C82.9689 3.93704 82.3273 4.05946 81.7276 4.30258C81.1283 4.5457 80.5826 4.90468 80.1222 5.35905C79.6614 5.81339 79.2951 6.35413 79.0441 6.9503C78.7927 7.54647 78.6615 8.18636 78.6582 8.83328V23.6893C78.6615 24.3362 78.7927 24.9761 79.0441 25.5723C79.2951 26.1685 79.6614 26.7092 80.1222 27.1635C80.5826 27.6179 81.1283 27.9769 81.7276 28.22C82.3273 28.4631 82.9689 28.5856 83.6158 28.5803H98.635C99.2809 28.5838 99.9208 28.4601 100.519 28.2162C101.117 27.9723 101.661 27.613 102.12 27.1588C102.579 26.7046 102.944 26.1645 103.195 25.5692C103.445 24.9739 103.576 24.3351 103.579 23.6893V8.83328C103.576 8.18749 103.445 7.5487 103.195 6.9534C102.944 6.35812 102.579 5.81795 102.12 5.36378C101.661 4.90961 101.117 4.55033 100.519 4.30641C99.9208 4.06253 99.2809 3.93881 98.635 3.9423ZM98.5983 23.6527H83.6524V8.8699H98.5917L98.5983 23.6527Z"
      fill="white"
    />
    <path
      d="M151.24 3.9425H136.591C135.945 3.93901 135.305 4.06273 134.707 4.30661C134.109 4.55053 133.565 4.90981 133.106 5.36398C132.647 5.81815 132.281 6.35832 132.031 6.9536C131.781 7.54891 131.65 8.1877 131.646 8.83348V28.5805H136.641V20.4866H151.224V28.5805H156.218V8.83348C156.215 8.18487 156.083 7.54334 155.83 6.94584C155.578 6.34837 155.21 5.80673 154.747 5.3521C154.284 4.89749 153.736 4.53891 153.134 4.29699C152.533 4.05507 151.889 3.93461 151.24 3.9425ZM151.204 15.559H136.621V8.8701H151.204V15.559Z"
      fill="white"
    />
    <path
      d="M209.556 3.94264H194.906C194.26 3.93914 193.62 4.06286 193.022 4.30675C192.424 4.55066 191.88 4.90995 191.421 5.36412C190.962 5.81829 190.597 6.35846 190.346 6.95373C190.096 7.54904 189.965 8.18783 189.962 8.83361V28.5806H194.956V20.4867H209.506V28.5806H214.5V8.83361C214.497 8.18783 214.366 7.54904 214.115 6.95373C213.865 6.35846 213.5 5.81829 213.041 5.36412C212.582 4.90995 212.038 4.55066 211.44 4.30675C210.842 4.06286 210.202 3.93914 209.556 3.94264ZM209.506 15.5591H194.923V8.87024H209.506V15.5591Z"
      fill="white"
    />
    <path
      d="M180.539 23.653H178.542L171.4 6.00687C171.155 5.39808 170.734 4.87632 170.191 4.50855C169.647 4.14074 169.006 3.94367 168.35 3.94261H163.919C163.488 3.94041 163.061 4.02308 162.663 4.18586C162.264 4.34867 161.901 4.58839 161.595 4.89137C161.289 5.19439 161.045 5.55467 160.879 5.95174C160.712 6.34878 160.625 6.77481 160.623 7.20548V28.5806H165.617V8.87021H167.614L174.753 26.5163C175.001 27.124 175.426 27.6436 175.972 28.0089C176.517 28.3742 177.159 28.5686 177.816 28.5673H182.247C182.678 28.5695 183.105 28.4868 183.504 28.324C183.902 28.1613 184.265 27.9215 184.571 27.6185C184.877 27.3155 185.121 26.9552 185.288 26.5582C185.454 26.1611 185.541 25.7351 185.544 25.3044V3.94261H180.539V23.653Z"
      fill="white"
    />
    <path
      d="M112.985 3.94257H107.991V23.6896C107.994 24.3368 108.126 24.977 108.377 25.5733C108.628 26.1697 108.995 26.7106 109.456 27.165C109.916 27.6194 110.463 27.9783 111.062 28.2212C111.662 28.4642 112.304 28.5863 112.952 28.5806H127.934V23.653H112.985V3.94257Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_7042_130997"
        x1="3.0161"
        y1="33.0054"
        x2="32.342"
        y2="-0.0561604"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.08" stop-color="#9945FF" />
        <stop offset="0.3" stop-color="#8752F3" />
        <stop offset="0.5" stop-color="#5497D5" />
        <stop offset="0.6" stop-color="#43B4CA" />
        <stop offset="0.72" stop-color="#28E0B9" />
        <stop offset="0.97" stop-color="#19FB9B" />
      </linearGradient>
    </defs>
  </svg>
);

const BNBIcon = () => (
  <svg width="227" height="58" viewBox="0 0 227 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_7543_132132)">
    <path d="M65.5 18.0044H75.3422C77.8438 18.0044 79.6782 18.6715 80.8456 19.8416C81.3767 20.2925 81.8016 20.8552 82.0899 21.4895C82.3783 22.1238 82.5228 22.8139 82.5134 23.5105C82.5407 24.0716 82.4845 24.6337 82.3466 25.1782C82.0073 26.049 81.4969 26.8429 80.8456 27.5131C80.5531 27.7915 80.2146 28.0172 79.845 28.1801C80.9856 28.5259 82.0189 29.1573 82.8469 30.0146C83.514 30.8485 83.8475 31.8491 83.8475 33.35C83.8592 34.2099 83.6887 35.0624 83.3472 35.8516C82.9309 36.5776 82.3619 37.2044 81.6795 37.6888C80.879 38.1458 80.0424 38.5362 79.1779 38.8562C78.1773 39.1897 77.0099 39.1897 75.8425 39.1897H65.6587V18.0044H65.5ZM74.5083 26.6792C75.3666 26.6744 76.2159 26.5045 77.0099 26.1789C77.3162 26.0226 77.5725 25.7834 77.7494 25.4885C77.9263 25.1937 78.0168 24.855 78.0105 24.5112C78.0131 24.1871 77.9389 23.867 77.7939 23.5771C77.649 23.2873 77.4375 23.0359 77.1767 22.8435C76.8455 22.5988 76.4659 22.4276 76.0633 22.3413C75.6607 22.255 75.2443 22.2557 74.8419 22.3431H70.1723V26.846H74.5083V26.6792ZM75.6757 35.1845C76.534 35.1797 77.3833 35.0098 78.1773 34.6842C78.5079 34.5231 78.772 34.2518 78.9242 33.917C79.0764 33.5822 79.1071 33.2048 79.0112 32.8497C79.0137 32.5257 78.9395 32.2056 78.7946 31.9157C78.6496 31.6258 78.4381 31.3744 78.1773 31.182C77.3645 30.7227 76.4423 30.4921 75.509 30.5149H70.0055V35.1845H75.6757Z" fill="#F3BA2F"/>
    <path d="M110.863 18H120.705C123.207 18 125.041 18.6671 126.208 19.8372C126.74 20.2881 127.164 20.8508 127.453 21.4851C127.741 22.1194 127.886 22.8095 127.876 23.5061C127.903 24.0672 127.847 24.6293 127.709 25.1739C127.37 26.0446 126.86 26.8385 126.208 27.5087C125.916 27.7871 125.577 28.0128 125.208 28.1757C126.348 28.5215 127.382 29.1529 128.21 30.0102C128.877 30.8441 129.21 31.8447 129.21 33.3457C129.222 34.2055 129.051 35.058 128.71 35.8472C128.294 36.5732 127.725 37.2 127.042 37.6844C126.242 38.1414 125.405 38.5318 124.541 38.8518C123.54 39.1853 122.373 39.1853 121.205 39.1853H111.021V18H110.863ZM119.871 26.6748C120.729 26.67 121.579 26.5001 122.373 26.1745C122.679 26.0182 122.935 25.779 123.112 25.4841C123.289 25.1893 123.38 24.8506 123.373 24.5068C123.376 24.1827 123.302 23.8626 123.157 23.5728C123.012 23.2829 122.8 23.0315 122.539 22.8391C122.208 22.5944 121.829 22.4232 121.426 22.3369C121.023 22.2506 120.607 22.2513 120.205 22.3387H115.535V26.8416H119.871V26.6748ZM121.039 35.1801C121.897 35.1753 122.746 35.0055 123.54 34.6798C123.871 34.5187 124.135 34.2474 124.287 33.9126C124.439 33.5778 124.47 33.2004 124.374 32.8453C124.377 32.5213 124.302 32.2012 124.157 31.9113C124.012 31.6215 123.801 31.37 123.54 31.1776C122.727 30.7183 121.805 30.4877 120.872 30.5105H115.368V35.1801H121.039Z" fill="#F3BA2F"/>
    <path d="M87.8481 18.0044H92.1869L102.193 31.182V18.0044H106.863V39.3565H102.86L92.3537 25.8453V39.3565H87.8481V18.0044Z" fill="#F3BA2F"/>
    <path d="M145.272 38.5222C143.897 38.5482 142.535 38.2459 141.3 37.6403C138.874 36.5379 136.89 34.774 136.008 32.3486C135.567 31.0257 135.126 29.6992 135.346 28.3763C135.351 27.0263 135.574 25.686 136.008 24.4076C136.484 23.1856 137.196 22.0697 138.104 21.1237C139.012 20.1778 140.098 19.4206 141.3 18.8954C142.623 18.4545 143.945 18.0135 145.492 18.0135C146.307 17.9669 147.125 18.0412 147.918 18.234L149.902 18.8954C150.564 19.1159 151.005 19.5569 151.68 19.7774C152.121 20.2184 152.783 20.6593 153.224 21.1003L151.019 23.7461C150.307 23.0321 149.489 22.4323 148.593 21.968C147.628 21.5167 146.572 21.2906 145.507 21.3066C144.609 21.3457 143.719 21.4938 142.857 21.7475C142.04 22.1324 141.294 22.6544 140.652 23.2909C140.01 23.8842 139.55 24.6494 139.329 25.4958C139.076 26.3566 138.928 27.2451 138.888 28.1416C138.928 29.0382 139.076 29.9266 139.329 30.7874C139.55 31.6351 140.009 32.4017 140.652 32.9959C141.294 33.6324 142.04 34.1544 142.857 34.5393C143.657 35.0034 144.599 35.1602 145.507 34.9802C146.572 34.9962 147.628 34.77 148.593 34.3188C149.576 33.8032 150.469 33.1332 151.239 32.3344L153.444 34.5393L151.901 36.0827C151.239 36.5236 150.798 36.9646 150.123 37.1851C149.447 37.4056 148.8 37.8465 147.918 37.8465C147.036 38.508 146.14 38.508 145.272 38.508V38.5222Z" fill="#F3BA2F"/>
    <path d="M156.958 18.4546H160.265V26.6126H169.749V18.4546H173.277V38.3019H169.749V29.9199H160.265V38.3019H156.958V18.4546Z" fill="#F3BA2F"/>
    <path d="M185.404 18.2344H188.711L197.313 38.0817H193.565L191.581 33.231H182.335L180.35 38.0817H176.823L185.404 18.2344ZM190.254 30.3611L186.947 22.4236L183.64 30.3611H190.254Z" fill="#F3BA2F"/>
    <path d="M200.841 18.4546H204.369V38.3019H200.841V18.4546Z" fill="#F3BA2F"/>
    <path d="M209.661 18.4546H212.748L223.335 32.1247V18.4546H226.862V38.3019H223.996L213.189 24.1872V38.3019H209.661V18.4546Z" fill="#F3BA2F"/>
    <path d="M30.3578 48.2052V54.7228L24.6849 58.0582L19.1814 54.7228V48.2052L24.6849 51.5407L30.3578 48.2052ZM0 25.6857L5.50346 29.0238V40.1975L15.0121 45.8704V52.3745L0 43.5329V25.6857ZM49.3724 25.6857V43.5329L34.1935 52.3745V45.8704L43.6995 40.1975V29.0238L49.3724 25.6857ZM34.1935 16.8468L39.8637 20.1823V26.689L30.3578 32.3593V43.6943L24.8516 47.0298L19.3482 43.6943V32.3593L9.50866 26.689V20.1823L15.1789 16.8468L24.6849 22.5171L34.1935 16.8468ZM9.50866 31.3586L15.0121 34.6941V41.1982L9.50866 37.8627V31.3586ZM39.8637 31.3586V37.8627L34.3603 41.1982V34.6941L39.8637 31.3586ZM5.50346 11.1847L11.1844 14.512L5.51153 17.8475V24.3515L0.00806926 21.0161V14.512L5.50346 11.1847ZM43.8663 11.1847L49.5392 14.5201V21.0242L43.8663 24.3596V17.8475L38.352 14.512L43.8663 11.1847ZM24.6849 11.1847L30.3578 14.5201L24.6849 17.8555L19.1814 14.5201L24.6849 11.1847ZM24.6849 0.00830078L39.8637 8.84987L34.3603 12.1853L24.8516 6.51238L15.1681 12.1853L9.66467 8.84987L24.6849 0.00830078Z" fill="#F3BA2F"/>
    </g>
    <defs>
    <clipPath id="clip0_7543_132132">
    <rect width="226" height="58" fill="white" transform="translate(0.5)"/>
    </clipPath>
    </defs>
  </svg>
);

const SolanaSmallIcon = () => (
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.1656 13.7107L15.151 16.9431C15.0858 17.0133 15.0069 17.0693 14.9191 17.1077C14.8313 17.146 14.7365 17.1659 14.6407 17.1659H0.350258C0.282101 17.1659 0.215433 17.146 0.158417 17.1087C0.101404 17.0713 0.0565183 17.0181 0.0292559 16.9557C0.00199357 16.8932 -0.0064616 16.8242 0.0049265 16.757C0.0163146 16.6898 0.0470492 16.6273 0.0933705 16.5773L3.10456 13.345C3.16977 13.2748 3.24873 13.2187 3.33655 13.1804C3.42435 13.1421 3.51912 13.1222 3.61494 13.1221H17.9053C17.9741 13.1207 18.0418 13.1396 18.0998 13.1766C18.1578 13.2135 18.2037 13.2668 18.2315 13.3297C18.2594 13.3927 18.2679 13.4624 18.2561 13.5302C18.2444 13.598 18.2129 13.6608 18.1656 13.7107ZM15.151 7.20009C15.0856 7.1302 15.0066 7.0744 14.9188 7.03607C14.8311 6.99776 14.7364 6.97774 14.6407 6.97724H0.350258C0.282101 6.97728 0.215433 6.99718 0.158417 7.03454C0.101404 7.07188 0.0565183 7.12505 0.0292559 7.18752C0.00199357 7.24999 -0.0064616 7.31904 0.0049265 7.38624C0.0163146 7.45344 0.0470492 7.51587 0.0933705 7.56587L3.10456 10.7999C3.17001 10.8698 3.24903 10.9256 3.33678 10.9639C3.42453 11.0023 3.51919 11.0223 3.61494 11.0228H17.9053C17.9734 11.0224 18.0397 11.0023 18.0966 10.9648C18.1534 10.9273 18.198 10.8741 18.225 10.8117C18.2521 10.7493 18.2604 10.6804 18.2488 10.6134C18.2374 10.5463 18.2068 10.484 18.1605 10.4342L15.151 7.20009ZM0.350258 4.8779H14.6407C14.7365 4.87781 14.8313 4.85796 14.9191 4.81961C15.0069 4.78128 15.0858 4.72524 15.151 4.65503L18.1656 1.42269C18.2129 1.37276 18.2444 1.30995 18.2561 1.24216C18.2679 1.17436 18.2594 1.10462 18.2315 1.0417C18.2037 0.978773 18.1578 0.925487 18.0998 0.88854C18.0418 0.851594 17.9741 0.832638 17.9053 0.834059H3.61494C3.51912 0.83416 3.42435 0.854 3.33655 0.892344C3.24873 0.930687 3.16977 0.986711 3.10456 1.05692L0.0933705 4.28927C0.0470492 4.33927 0.0163146 4.4017 0.0049265 4.4689C-0.0064616 4.5361 0.00199357 4.60515 0.0292559 4.66762C0.0565183 4.73009 0.101404 4.78326 0.158417 4.8206C0.215433 4.85796 0.282101 4.87786 0.350258 4.8779Z" fill="#E9FF26"/>
  </svg>
)

const PolygonSmallIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5864 6.46164C15.2118 6.23089 14.7246 6.23089 14.3125 6.46164L11.3898 8.23074L9.40389 9.38451L6.48125 11.1537C6.10657 11.3844 5.61944 11.3844 5.20727 11.1537L2.88413 9.76914C2.50943 9.5384 2.24714 9.11534 2.24714 8.65379V5.92321C2.24714 5.4617 2.47196 5.03866 2.88413 4.8079L5.1698 3.46183C5.5445 3.23107 6.03158 3.23107 6.44379 3.46183L8.72945 4.8079C9.10413 5.03866 9.36642 5.4617 9.36642 5.92321V7.69233L11.3523 6.5001V4.73098C11.3523 4.26947 11.1276 3.84642 10.7154 3.61567L6.48125 1.07736C6.10657 0.846608 5.61944 0.846608 5.20727 1.07736L0.898223 3.61567C0.486051 3.84642 0.26123 4.26947 0.26123 4.73098V9.84605C0.26123 10.3075 0.486051 10.7306 0.898223 10.9613L5.20727 13.4996C5.58197 13.7304 6.0691 13.7304 6.48125 13.4996L9.40389 11.769L11.3898 10.5768L14.3125 8.84611C14.6872 8.61536 15.1743 8.61536 15.5864 8.84611L17.8721 10.1922C18.2468 10.4229 18.5091 10.846 18.5091 11.3075V14.0381C18.5091 14.4996 18.2843 14.9226 17.8721 15.1534L15.5864 16.538C15.2118 16.7687 14.7246 16.7687 14.3125 16.538L12.0268 15.1919C11.6521 14.9611 11.3898 14.5381 11.3898 14.0765V12.3074L9.40389 13.4996V15.2688C9.40389 15.7303 9.62872 16.1533 10.0409 16.3841L14.35 18.9224C14.7246 19.1532 15.2118 19.1532 15.6239 18.9224L19.933 16.3841C20.3077 16.1533 20.57 15.7303 20.57 15.2688V10.1537C20.57 9.69223 20.3451 9.26917 19.933 9.03842L15.5864 6.46164Z" fill="#E9FF26"/>
  </svg>
)

const BNBSmallIcon = () => (
  <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.8261 19.7403V22.3716L10.5359 23.7182L8.314 22.3716V19.7403L10.5359 21.0869L12.8261 19.7403ZM0.570068 10.6487L2.79193 11.9964V16.5075L6.63077 18.7977V21.4236L0.570068 17.854V10.6487ZM20.5027 10.6487V17.854L14.3747 21.4236V18.7977L18.2125 16.5075V11.9964L20.5027 10.6487ZM14.3747 7.08029L16.6639 8.42688V11.0538L12.8261 13.343V17.9192L10.6032 19.2658L8.38133 17.9192V13.343L4.40891 11.0538V8.42688L6.6981 7.08029L10.5359 9.36948L14.3747 7.08029ZM4.40891 12.939L6.63077 14.2856V16.9114L4.40891 15.5648V12.939ZM16.6639 12.939V15.5648L14.442 16.9114V14.2856L16.6639 12.939ZM2.79193 4.79436L5.08546 6.13769L2.79519 7.48427V10.1101L0.573326 8.76352V6.13769L2.79193 4.79436ZM18.2798 4.79436L20.5701 6.14095V8.76678L18.2798 10.1134V7.48427L16.0536 6.13769L18.2798 4.79436ZM10.5359 4.79436L12.8261 6.14095L10.5359 7.48753L8.314 6.14095L10.5359 4.79436ZM10.5359 0.282227L16.6639 3.85175L14.442 5.19834L10.6032 2.90806L6.69376 5.19834L4.4719 3.85175L10.5359 0.282227Z" fill="#E9FF26"/>
  </svg>
)