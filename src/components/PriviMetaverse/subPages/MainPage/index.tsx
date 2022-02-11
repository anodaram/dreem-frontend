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
        MetaverseAPI.getAssets(9, 1, "timestamp", filters, true, undefined, undefined, false)
          .then(res => {
            if (res.success) {
              const items = res.data.elements;
              if (items && items.length > 0) {
                setExploreReamls(res.data.elements);
              }
            }
          })
          .finally(() => setLoadingExplore(false));

        setLoadingExploreCharacters(true);
        MetaverseAPI.getCharacters(null, true, null, true)
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
      "https://metaverse-2.gitbook.io/metaverse-creator-manual/05OugTkVduc9hQ7Ajmqc/quick-start",
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

  const handleCreate = () => {
    if (isSignedin) {
      history.push("/create");
    } else {
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
          <Box className={classes.description} mb={7}>
            Build and tokenize your own 3D realm and characters, co-create with others, and offer metaverse
            native services and goods to realm communities. From an art gallery to 3D storefront, a concert or
            video stream - there is no limit to your imagination.
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
            <Box display="flex" flexDirection="row" mt={10} whiteSpace="nowrap" overflow="hidden">
              <span className={`${classes.gradientText} ${classes.gradient1} ${classes.fitSize}`}>
                featured realms
              </span>
              <span className={`${classes.shadowText}  ${classes.fitSize}`}>featured realms</span>
            </Box>
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
                                      backgroundImage: featuredRealms[page]?.worldImage
                                        ? `url("${sanitizeIfIpfsUrl(featuredRealms[page]?.worldImage)}")`
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
                data={loadingExploreCharacters ? Array(loadingCount).fill(0) : exploreCharacters}
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
                <Grid item xs={12} sm={6}>
                  <Box className={classes.supportedNetworkBtn}>
                    <PolygonIcon />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className={classes.supportedNetworkBtn}>
                    <SolanaIcon />
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
