import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-elastic-carousel";
import { Hidden, useMediaQuery, useTheme } from "@material-ui/core";
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
import { detectMob } from "shared/helpers";
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
      milestone: "2022 Q1-Q2",
      deadline: "",
    },
    {
      milestone: "Realm creation + on-chain realm extensions",
      deadline: "Q1",
    },
    {
      milestone: "Realm maps + customization",
      deadline: "Q1",
    },
    {
      milestone: "Generative characters",
      deadline: "Q1",
    },
    {
      milestone: "Integration of blockchain based music and video streaming",
      deadline: "Q1",
    },
    {
      milestone: "NFT marketplace",
      deadline: "Q2/Q1",
    },
    {
      milestone: "Realm monetization: events, objects, experiences, taxation, etc.",
      deadline: "Q2",
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

const filters = ["DRAFT_WORLD", "NFT_WORLD"];

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
    if (!underMaintenanceSelector.underMaintenance) {
      setLoadingFeatured(true);
      MetaverseAPI.getFeaturedWorlds(filters)
        .then(res => {
          if (res.success) {
            setFeaturedRealms(res.data.items);
          }
        })
        .finally(() => setLoadingFeatured(false));

      setLoadingExplore(true);
      MetaverseAPI.getWorlds(9, 1, "timestamp", filters, true, undefined, undefined, false)
        .then(res => {
          if (res.success) {
            const items = res.data.items;
            if (items && items.length > 0) {
              setExploreReamls(res.data.items);
            }
          }
        })
        .finally(() => setLoadingExplore(false));

      setLoadingExploreCharacters(true);
      MetaverseAPI.getCharacters(null, true)
        .then(res => {
          setExploreCharacters(res.data);
        })
        .finally(() => setLoadingExploreCharacters(false));
    }
  }, []);

  const openLearnToCreator = () => {
    window.open(
      "https://metaverse-2.gitbook.io/metaverse-creator-manual/05OugTkVduc9hQ7Ajmqc/quick-start",
      "_blank"
    );
  };

  const handleDownload = () => {
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
                                      backgroundImage: featuredRealms[page]?.worldImages
                                        ? `url("${featuredRealms[page]?.worldImages}")`
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
