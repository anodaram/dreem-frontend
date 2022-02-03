import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import Carousel from "react-elastic-carousel";
import Moment from "react-moment";

import { useTheme, useMediaQuery, Hidden } from "@material-ui/core";

import { setTokenList, setScrollPositionInAllNFT } from "store/actions/MarketPlace";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton, Variant } from "shared/ui-kit";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { ReactComponent as BinanceIcon } from "assets/icons/bsc.svg";
import { ReactComponent as PolygonIcon } from "assets/icons/polygon.svg";
import { userTrackMarketPlace } from "shared/services/API";
import { GameSlider } from "components/PriviMetaverse/components/GameSlider";
import ExploreCard from "components/PriviMetaverse/components/cards/ExploreCard";
import { Skeleton } from "@material-ui/lab";
import FeaturedGameCard from "components/PriviMetaverse/components/cards/FeatureGameCard";
import { getAllGameNFTs } from "shared/services/API/ReserveAPI";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Tag from "../GameDetailPage/components/Tag";
import HowWorksOfMarketPlaceModal from "../../modals/HowWorksOfMarketPlaceModal";
import ActivityFeeds from "./components/ActivityFeeds";
import { MessageBox } from "components/PriviMetaverse/components/Message/MessageBox";
import { useNFTOptionsStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  650: 2,
  1200: 3,
  1440: 4,
};

const gameList = [
  {
    title: "Game Name 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis risus sapien, vitae consectetur odio faucibus vitae. Phasellus viverra nibh tortor, id venenatis nisl placerat eget.",
    image: require("assets/backgrounds/community.jpeg"),
  },
  {
    title: "Game Name 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis risus sapien, vitae consectetur odio faucibus vitae. Phasellus viverra nibh tortor, id venenatis nisl placerat eget.",
    image: require("assets/backgrounds/social.jpeg"),
  },
  {
    title: "Game Name 3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis risus sapien, vitae consectetur odio faucibus vitae. Phasellus viverra nibh tortor, id venenatis nisl placerat eget.",
    image: require("assets/backgrounds/workInProgress.jpeg"),
  },
];

const dummyRecentTransactions = [
  {
    image: "",
    name: "Game Name",
    type: "Rented",
    Chain: "Polygon",
    Price: "0.0834",
    Time: new Date().getTime() - 1200000,
  },
  {
    image: "",
    name: "Game Name 2",
    type: "Rented",
    Chain: "Polygon",
    Price: "0.0834",
    Time: new Date().getTime() - 1200000,
  },
  {
    image: "",
    name: "Game Name 5",
    type: "Rented",
    Chain: "BSC",
    Price: "0.834",
    Time: new Date().getTime() - 420000,
  },
  {
    image: "",
    name: "Game Name",
    type: "Rented",
    Chain: "Polygon",
    Price: "0.123",
    Time: new Date().getTime() - 120000,
  },
];

const getChainImage = chain => {
  if (chain === "BSC") {
    return <BinanceIcon />;
  } else if (chain === "Polygon") {
    return <PolygonIcon />;
  } else {
    return null;
  }
};

const NFTReserves = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isSignedin } = useAuth();
  const classes = useNFTOptionsStyles();
  const carouselRef = useRef<any>();

  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [loadingFeaturedGames, setLoadingFeaturedGames] = useState<boolean>(false);
  const [loadingNewListings, setLoadingNewListings] = useState<boolean>(false);
  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);
  const [newListings, setNewListings] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>(dummyRecentTransactions);
  const [loadingTransactions, setLoadingTransctions] = useState<boolean>(false);
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);

  const width = useWindowDimensions().width;

  const theme = useTheme();
  const isNormalScreen = useMediaQuery(theme.breakpoints.down(1800));
  const isTablet = useMediaQuery(theme.breakpoints.down(1420));
  const isNarrow = useMediaQuery(theme.breakpoints.down(860));
  const isMobile = useMediaQuery(theme.breakpoints.down(650));

  const itemsToShow = isMobile ? 1 : isNarrow ? 2 : isTablet ? 3 : isNormalScreen ? 4 : 5;
  const loadingCount = React.useMemo(
    () => (width > 1700 ? 5 : width > 1420 ? 4 : width > 1200 ? 3 : width > 650 ? 2 : 1),
    [width]
  );

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    { headerName: "NFT" },
    { headerName: "Type", headerAlign: "center" },
    { headerName: "Chain", headerAlign: "center" },
    { headerName: "Price", headerAlign: "center" },
    { headerName: "Time", headerAlign: "center" },
    { headerName: "", headerAlign: "center" },
  ];

  useEffect(() => {
    // initialize store
    getTokenList();
  }, []);

  useEffect(() => {
    getFeaturedGameData();
    getNewListings();
  }, []);

  useEffect(() => {
    if (isSignedin) {
      userTrackMarketPlace();
    }
  }, [isSignedin]);

  const getNewListings = async () => {
    if (loadingNewListings) return;

    try {
      setLoadingNewListings(true);

      const response = await getAllGameNFTs({
        mode: isProd ? "main" : "test",
        network: null,
        status: null,
        search: null,
        lastNFTId: null,
        lastCollectionId: null,
        pageSize: 8,
      });

      const nfts = response.nfts;

      setNewListings(nfts);
    } catch (err) {}
    setLoadingNewListings(false);
  };

  const getFeaturedGameData = () => {
    if (loadingFeaturedGames) return;

    setLoadingFeaturedGames(true);
    MetaverseAPI.getNftGames("", "", "ALL")
      .then(res => {
        if (res && res.success) {
          const items = res.data.items;
          setFeaturedGames(items);
        }
      })
      .finally(() => setLoadingFeaturedGames(false));
  };

  const getTokenList = async () => {
    getAllTokenInfos().then(res => {
      if (res.success) {
        dispatch(setTokenList(res.tokens.filter(t => t.Symbol === "USDT")));
      }
    });
  };

  const handleScroll = e => {
    dispatch(setScrollPositionInAllNFT(e.target.scrollTop));
  };

  const tableData = React.useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (recentTransactions && recentTransactions.length) {
      data = recentTransactions.map(row => [
        {
          cell: (
            <div className={classes.titleWrapper}>
              <img className={classes.titleImg} src={row.image} />
              <p className={classes.textTitle}>{row.name}</p>
            </div>
          ),
        },
        {
          cell: <Tag state={row.type.toLowerCase()} text={row.type} />,
        },
        {
          cell: <div>{getChainImage(row.Chain)}</div>,
        },
        {
          cell: <p className={classes.whiteText}>{row.Price}</p>,
        },
        {
          cell: (
            <p className={classes.whiteText}>
              <Moment fromNow>{row.Time}</Moment>
            </p>
          ),
        },
        {
          cell: (
            <PrimaryButton onClick={() => {}} size="medium" className={classes.viewButton} isRounded>
              View
            </PrimaryButton>
          ),
        },
      ]);
    }

    return data;
  }, [recentTransactions]);

  return (
    <>
      <Box className={classes.main}>
        <Box className={classes.sideBar}>
          {openSideBar ? (
            <Box display="flex" flexDirection="column">
              <ActivityFeeds onClose={() => setOpenSideBar(false)} />
              <MessageBox />
            </Box>
          ) : (
            <Box className={classes.expandIcon} onClick={() => setOpenSideBar(true)}>
              <ExpandIcon />
            </Box>
          )}
        </Box>
        <Box className={classes.limitedContent}>
          <div className={classes.content} id={"scrollContainer"} onScroll={handleScroll}>
            <div className={classes.titleBar}>
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
                maxWidth={1280}
              >
                <div className={classes.title}>Not your average NFT marketplace</div>
                <Box display="flex" alignItems="center">
                  <SecondaryButton
                    size="medium"
                    className={classes.primaryButton}
                    onClick={() => setOpenHowWorksModal(true)}
                    style={{ background: "#fff" }}
                  >
                    HOW IT WORKS
                  </SecondaryButton>
                  {isSignedin && (
                    <SecondaryButton
                      size="medium"
                      className={classes.primaryButton}
                      onClick={() => {
                        history.push("/gameNFTS/manage_nft");
                      }}
                      style={{
                        width: isMobile ? "100%" : "auto",
                        marginTop: isMobile ? 10 : 0,
                        marginLeft: isMobile ? 0 : 32,
                      }}
                    >
                      MANAGE YOUR NFTS
                    </SecondaryButton>
                  )}
                </Box>
              </Box>
              <Box height={720} width={1280} position="relative" className={classes.gameslider} mt="38px">
                <img src={require("assets/icons/slider_footer.svg")} className={classes.sliderFooter} />
                <img src={require("assets/icons/slider_left.svg")} className={classes.sliderLeft} />
                <img src={require("assets/icons/slider_right.svg")} className={classes.sliderRight} />
                {/* <img src={require("assets/icons/slider_rect.svg")} className={classes.sliderRect} /> */}
                <GameSlider
                  games={gameList.map(game => {
                    return () => (
                      <Box position="relative" width="100%" height="100%">
                        <img src={game.image} width="100%" height="100%" className={classes.gameBgImage} />
                        <Box
                          padding="30px 105px 100px 105px"
                          width="100%"
                          height="100%"
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                          justifyContent="space-between"
                          className={classes.gameContent}
                        >
                          <Box className={classes.featuredGames}>
                            <GameIcon />
                            Featured Games
                          </Box>
                          <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Box fontFamily="Rany" fontWeight={700} fontSize="18px" color="#E9FF26">
                              COMING SOON
                            </Box>
                            <Box fontFamily="GRIFTER" fontWeight={700} fontSize="72px" color="#fff" mt="11px">
                              {game.title}
                            </Box>
                            <Box
                              fontFamily="Rany"
                              fontWeight={500}
                              textAlign="left"
                              fontSize="20px"
                              color="#fff"
                              lineHeight="31px"
                              mt="20px"
                            >
                              {game.description}
                            </Box>
                            <SecondaryButton
                              size="medium"
                              className={classes.gamePlayButton}
                              onClick={() => {}}
                            >
                              OPEN THE GAME
                            </SecondaryButton>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                  paginationColor="#E9FF26"
                />
              </Box>
            </div>
            <div className={classes.NFTSection}>
              {featuredGames && featuredGames.length ? (
                <div className={classes.topGamesWrapper}>
                  <Box
                    className={`${classes.topGamesTitle} ${classes.fitContent}`}
                    justifyContent="space-between"
                  >
                    <span>Popular Games</span>
                    {featuredGames &&
                    featuredGames.length &&
                    !isMobile &&
                    ((isTablet && featuredGames.length > 2) ||
                      (isNormalScreen && featuredGames.length > 3) ||
                      featuredGames.length > 4) ? (
                      <Box display="flex" alignItems="center">
                        <Box
                          className={classes.carouselNav}
                          onClick={() => {
                            carouselRef.current.slidePrev();
                          }}
                        >
                          <svg
                            width="10"
                            height="16"
                            viewBox="0 0 10 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              opacity="0.6"
                              d="M7.61309 2L1.92187 7.69055L7.92187 13.6906"
                              stroke="white"
                              stroke-width="2.5"
                              stroke-linecap="square"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </Box>
                        <Box
                          ml={3}
                          className={classes.carouselNav}
                          onClick={() => {
                            carouselRef.current.slideNext();
                          }}
                        >
                          <svg
                            width="10"
                            height="16"
                            viewBox="0 0 10 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              opacity="0.6"
                              d="M2.38691 14L8.07813 8.30945L2.07813 2.30945"
                              stroke="white"
                              stroke-width="2.5"
                              stroke-linecap="square"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </Box>
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Box>
                  <div className={`${classes.topNFTContent} ${classes.fitContent}`}>
                    {featuredGames && featuredGames.length ? (
                      !isMobile && (featuredGames.length === 2 || featuredGames.length === 3) ? (
                        <div className={classes.allNFTSection}>
                          <Box style={{ marginBottom: "24px" }}>
                            <MasonryGrid
                              gutter={"24px"}
                              data={featuredGames}
                              renderItem={item => (
                                <FeaturedGameCard game={item} isLoading={Object.entries(item).length === 0} />
                              )}
                              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                            />
                          </Box>
                        </div>
                      ) : (
                        <Carousel
                          isRTL={false}
                          itemsToShow={itemsToShow}
                          pagination={false}
                          showArrows={false}
                          ref={carouselRef}
                          itemPadding={[0, 12]}
                        >
                          {featuredGames.map((item: any, i: Number) => (
                            <div
                              key={item.id}
                              style={{
                                width: "100%",
                                paddingBottom: "15px",
                                display: "flex",
                                justifyContent: isMobile
                                  ? "center"
                                  : featuredGames.length === 2 && i === 1
                                  ? "flex-end"
                                  : featuredGames.length === 3 && i === 1
                                  ? "center"
                                  : featuredGames.length === 3 && i === 2
                                  ? "flex-end"
                                  : "flex-start",
                              }}
                            >
                              <FeaturedGameCard game={item} />
                            </div>
                          ))}
                        </Carousel>
                      )
                    ) : loadingFeaturedGames ? (
                      <MasonryGrid
                        gutter={"24px"}
                        data={Array(loadingCount).fill(0)}
                        renderItem={_ => <Skeleton variant="rect" width={60} height={60} />}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                  {featuredGames && featuredGames.length && isMobile && featuredGames.length > 1 ? (
                    <Box display="flex" justifyContent="flex-end" pr={3} pb={3}>
                      <Box display="flex" alignItems="center">
                        <Box
                          className={classes.carouselNav}
                          onClick={() => {
                            carouselRef.current.slidePrev();
                          }}
                        >
                          <svg
                            width="10"
                            height="16"
                            viewBox="0 0 10 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              opacity="0.6"
                              d="M7.61309 2L1.92187 7.69055L7.92187 13.6906"
                              stroke="white"
                              stroke-width="2.5"
                              stroke-linecap="square"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </Box>
                        <Box
                          ml={3}
                          className={classes.carouselNav}
                          onClick={() => {
                            carouselRef.current.slideNext();
                          }}
                        >
                          <svg
                            width="10"
                            height="16"
                            viewBox="0 0 10 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              opacity="0.6"
                              d="M2.38691 14L8.07813 8.30945L2.07813 2.30945"
                              stroke="white"
                              stroke-width="2.5"
                              stroke-linecap="square"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <></>
                  )}
                </div>
              ) : null}
              <div className={`${classes.allNFTWrapper} ${classes.fitContent}`}>
                <div className={classes.allNFTTitle}>
                  <span>New Listings</span>
                  <Hidden xsDown>
                    <SecondaryButton
                      size="medium"
                      className={classes.showAll}
                      onClick={() => history.push("/gameNFTS/explorer")}
                    >
                      Show All
                    </SecondaryButton>
                  </Hidden>
                </div>
                <div className={classes.allNFTSection}>
                  {!loadingNewListings || newListings.length > 0 ? (
                    <>
                      <MasonryGrid
                        gutter={"24px"}
                        data={newListings}
                        renderItem={(item, index) => <ExploreCard nft={item} key={`item-${index}`} />}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                      />
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <Box>
                <div className={classes.allNFTTitle}>
                  <span>Recent Transactions</span>
                </div>
                {recentTransactions.length > 0 && (
                  <div className={classes.table}>
                    <CustomTable
                      variant={Variant.Transparent}
                      headers={tableHeaders}
                      rows={tableData}
                      placeholderText="No data"
                      sorted={{}}
                      theme="game transaction"
                    />
                  </div>
                )}
                {!loadingTransactions && recentTransactions?.length < 1 && (
                  <Box textAlign="center" width="100%" mb={10} mt={2}>
                    No NFTs
                  </Box>
                )}
              </Box>
            </div>
          </div>
        </Box>
      </Box>
      {openHowWorksModal && (
        <HowWorksOfMarketPlaceModal
          open={openHowWorksModal}
          handleClose={() => setOpenHowWorksModal(false)}
        />
      )}
    </>
  );
};

export default NFTReserves;

export const GameIcon = () => (
  <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.8333 1.70412C9.27875 0.182038 5.655 -0.430045 3.61292 1.75829C1.61417 3.89245 0 9.03775 0 13.8916C0 19.7476 4.9075 20.5601 7.58333 17.6833C9.1325 16.015 9.27875 15.7544 10.2917 14.4333H15.7083C16.7267 15.7544 16.8675 16.015 18.4167 17.6833C21.092 20.5601 26 19.7476 26 13.8916C26 9.03775 24.3858 3.89245 22.3871 1.75829C20.345 -0.430045 16.7267 0.182038 15.1667 1.70412C14.5654 2.28912 13 2.51662 13 2.51662C13 2.51662 11.4346 2.28912 10.8333 1.70412ZM8.66667 5.27912V6.84941H10.2375C10.8658 6.84941 11.375 7.33691 11.375 7.93329C11.375 8.52912 10.8658 9.01662 10.2375 9.01662H8.66667V10.5869C8.66667 11.2158 8.17917 11.725 7.58333 11.725C6.9875 11.725 6.5 11.2163 6.5 10.5869V9.01662H4.92917C4.30083 9.01662 3.79167 8.52912 3.79167 7.93329C3.79167 7.33691 4.30083 6.84941 4.92917 6.84941H6.5V5.27912C6.5 4.65079 6.9875 4.14162 7.58333 4.14162C8.17917 4.14162 8.66667 4.65079 8.66667 5.27912ZM18.4167 6.03745C18.4167 5.28995 19.0233 4.68329 19.7708 4.68329C20.5183 4.68329 21.125 5.28995 21.125 6.03745C21.125 6.78495 20.5183 7.39162 19.7708 7.39162C19.0233 7.39162 18.4167 6.78495 18.4167 6.03745ZM15.7083 9.28745C15.7083 8.53941 16.315 7.93329 17.0625 7.93329C17.81 7.93329 18.4167 8.53941 18.4167 9.28745C18.4167 10.0344 17.81 10.6416 17.0625 10.6416C16.315 10.6416 15.7083 10.0344 15.7083 9.28745Z"
      fill="black"
    />
  </svg>
);

export const ExpandIcon = () => (
  <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.9793 4L22.0645 4L22.0645 18.8085L18.9793 18.8085L18.9793 4Z"
      fill="white"
      fill-opacity="0.5"
    />
    <path
      d="M15 11.25H0.5M15 11.25L8.5 5M15 11.25L8.5 17.5"
      stroke="white"
      stroke-opacity="0.5"
      stroke-width="3"
    />
  </svg>
);
