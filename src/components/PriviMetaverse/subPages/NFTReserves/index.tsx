import { Hidden, useMediaQuery, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-elastic-carousel";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { ReactComponent as BinanceIcon } from "assets/icons/bsc.svg";
import { ReactComponent as PolygonIcon } from "assets/icons/polygon.svg";
import ExploreCard from "components/PriviMetaverse/components/cards/ExploreCard";
import FeaturedGameCard from "components/PriviMetaverse/components/cards/FeatureGameCard";
import { GameSlider } from "components/PriviMetaverse/components/GameSlider";
import { MessageBox } from "components/PriviMetaverse/components/Message/MessageBox";
import { useAuth } from "shared/contexts/AuthContext";
import { toDecimals } from "shared/functions/web3";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { userTrackMarketPlace } from "shared/services/API";
import { getNftGameFeed } from "shared/services/API/DreemAPI";
import { getPopularGames, getTrendingGameNfts } from "shared/services/API/ReserveAPI";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import { PrimaryButton, SecondaryButton, Variant } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { setScrollPositionInAllNFT, setTokenList } from "store/actions/MarketPlace";
import { RootState } from "store/reducers/Reducer";

import HowWorksOfMarketPlaceModal from "../../modals/HowWorksOfMarketPlaceModal";
import Tag from "../GameDetailPage/components/Tag";
import ActivityFeeds from "./components/ActivityFeeds";
import { listenerSocket } from "components/Login/Auth";
import { GLOBAL_CHAT_ROOM } from "shared/constants/constants";
import { useNFTOptionsStyles } from "./index.styles";
import InfiniteScroll from "react-infinite-scroll-component";

const isProd = process.env.REACT_APP_ENV === "prod";

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  650: 2,
  1200: 3,
  1440: 4,
};

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
  const carouselRef = useRef<any>();

  const [popularGames, setPopularGames] = useState<any[]>([]);
  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [loadingPopularGames, setLoadingPopularGames] = useState<boolean>(false);
  const [loadingNewListings, setLoadingNewListings] = useState<boolean>(false);
  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);
  const [newListings, setNewListings] = useState<any[]>([]);
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionloading, setTransactionLoading] = useState<boolean>(false);
  const [transactionHasMore, setTransactionHasMore] = useState<boolean>(false);
  const [lastTransactionId, setLastTransactionId] = useState<any>();

  const width = useWindowDimensions().width;

  const theme = useTheme();
  const isNormalScreen = useMediaQuery(theme.breakpoints.between(1421, 1800));
  const isTablet = useMediaQuery(theme.breakpoints.between(861, 1420));
  const isNarrow = useMediaQuery(theme.breakpoints.between(651, 860));
  const isMobile = useMediaQuery(theme.breakpoints.down(650));

  const classes = useNFTOptionsStyles({ openSideBar });

  const itemsToShow = isMobile ? 1 : isNarrow ? 2 : isTablet ? 3 : isNormalScreen ? openSideBar ? 3 : 4 : 4;
  const MAX_NEW_LIST_LENGTH = 10

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    { headerName: "NFT" },
    { headerName: "Type", headerAlign: "center" },
    { headerName: "Chain", headerAlign: "center" },
    { headerName: "Price", headerAlign: "center" },
    { headerName: "Time", headerAlign: "center" },
    { headerName: "", headerAlign: "center" },
  ];

  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    // initialize store
    getTokenList();
  }, []);

  useEffect(() => {
    setTransactions([]);
    setTransactionHasMore(true);
    setLastTransactionId(undefined);
    getPopularGameData();
    getNewListings();
    loadTransactions(true);
  }, []);

  useEffect(() => {
    if (isSignedin) {
      userTrackMarketPlace();
    }
  }, [isSignedin]);

  useEffect(() => {
    if (listenerSocket) {
      const newNFTHandler = data => {
        let _newNFT = data?.nftData;
        if (_newNFT && !loadingNewListings) {
          setNewListings((prev) => {
            const _newListings = prev.filter(nft => (_newNFT.collectionId !== nft.collectionId || _newNFT.tokenId !== nft.tokenId));
            if (_newListings.length >= MAX_NEW_LIST_LENGTH) {
              _newListings.pop();
            }
            return [_newNFT].concat(_newListings);
          });
        }
      };

      const updateMarketPlaceFeedHandler = _transaction => {
        if (transactions && transactions.length) {
          const _transactions = transactions.map(transaction =>
            _transaction.id === transaction.id ? _transaction : transaction
          );
          setTransactions(_transactions);
        }
      };

      listenerSocket.on("newNFT", newNFTHandler);
      listenerSocket.on("updateMarketPlaceFeed", updateMarketPlaceFeedHandler);

      return () => {
        listenerSocket.removeListener("newNFT", newNFTHandler);
        listenerSocket.removeListener("updateMarketPlaceFeed", updateMarketPlaceFeedHandler);
      };
    }
  }, [listenerSocket]);

  const loadTransactions = async (init = false) => {
    if (transactionloading) return;
    try {
      setTransactionLoading(true);

      const response = await getNftGameFeed({
        gameId: undefined,
        lastId: init ? undefined : lastTransactionId,
        searchValue: undefined,
        mode: isProd ? "main" : "test",
        status: undefined,
      });
      if (response.success) {
        const newCharacters = response.data.list;
        const newLastId = response.data.lastId;
        const newhasMore = response.data.hasMore;

        setTransactions(prev => (init ? newCharacters : [...prev, ...newCharacters]));
        setLastTransactionId(newLastId);
        setTransactionHasMore(newhasMore);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTransactionLoading(false);
    }
  };

  const getNewListings = async () => {
    if (loadingNewListings) return;

    try {
      setLoadingNewListings(true);

      const response = await getTrendingGameNfts({
        mode: isProd ? "main" : "test",
      });
      if (response.success) {
        const nfts = response.data;
        setNewListings(nfts);
      }
    } catch (err) { }
    setLoadingNewListings(false);
  };

  const getPopularGameData = () => {
    if (loadingPopularGames) return;

    setLoadingPopularGames(true);
    getPopularGames({ mode: isProd ? "main" : "test" })
      .then(res => {
        if (res && res.success) {
          const items = res.data;
          setPopularGames(items);
          setFeaturedGames(items);
        }
      })
      .finally(() => setLoadingPopularGames(false));
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

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals;
  };

  const goToNft = row => {
    history.push(`/P2E/${row.Slug}/${row.tokenId}`);
  };

  const tableData = React.useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (transactions && transactions.length) {
      data = transactions.map(row => [
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
          cell: <div>{getChainImage(row.chain)}</div>,
        },
        {
          cell: (
            <p className={classes.whiteText}>
              {
                +toDecimals(
                  row.price || row.pricePerSecond * row.rentalTime,
                  getTokenDecimal(row.paymentToken || row.fundingToken)
                )
              }{" "}
              {getTokenSymbol(row.paymentToken || row.fundingToken)}
            </p>
          ),
        },
        {
          cell: (
            <p className={classes.whiteText}>
              <Moment fromNow>{+row.id}</Moment>
            </p>
          ),
        },
        {
          cell: (
            <PrimaryButton
              onClick={() => {
                goToNft(row);
              }}
              size="medium"
              className={classes.viewButton}
              isRounded
            >
              View
            </PrimaryButton>
          ),
        },
      ]);
    }

    return data;
  }, [transactions]);

  return (
    <>
      <Box className={classes.main}>
        {isTablet && !isMobile && (
          <Box className={classes.sideBar}>
            <Box display="flex" flexDirection="column">
              <ActivityFeeds onClose={() => setOpenSideBar(false)} />
              <MessageBox roomId={GLOBAL_CHAT_ROOM} />
            </Box>
          </Box>
        )}
        {!isTablet && !isMobile && (
          <>
            <Box className={classes.sideBar}>
              {openSideBar ? (
                <Box display="flex" flexDirection="column">
                  <ActivityFeeds onClose={() => setOpenSideBar(false)} />
                  <MessageBox roomId={GLOBAL_CHAT_ROOM} />
                </Box>
              ) : (
                <Box className={classes.expandIcon} onClick={() => setOpenSideBar(true)}>
                  <ExpandIcon />
                </Box>
              )}
            </Box>
          </>
        )}
        <img src={require("assets/metaverseImages/nft_reserve_bg.png")} className={classes.imageBg} />
        <Box className={classes.limitedContent}>
          <div className={classes.content}>
            <div className={classes.titleBar}>
              <Box className={classes.titleSection}>
                <div className={classes.title}>Not your average NFT marketplace</div>
                <Box className={classes.headerButtonGroup}>
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
                        history.push("/P2E/manage_nft");
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
              <Box className={classes.gameslider}>
                <img src={require("assets/icons/slider_footer.svg")} className={classes.sliderFooter} />
                <img src={require("assets/icons/slider_left.svg")} className={classes.sliderLeft} />
                <img src={require("assets/icons/slider_right.svg")} className={classes.sliderRight} />
                {/* <img src={require("assets/icons/slider_rect.svg")} className={classes.sliderRect} /> */}
                <GameSlider
                  games={featuredGames.map((game: any) => {
                    return () => (
                      <Box position="relative" width="100%" height="100%">
                        <img
                          src={game?.Image}
                          className={classes.gameBgImage}
                          style={{ width: openSideBar ? "auto" : "1280px !important", objectFit: "cover" }}
                        />
                        <Box
                          className={classes.gameContent}
                          style={{ width: openSideBar ? "auto" : "1280px" }}
                        >
                          <Box className={classes.popularGames}>
                            <GameIcon />
                            Featured Games
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            mt={isTablet ? 2 : 0}
                          >
                            <Box
                              fontFamily="GRIFTER"
                              fontWeight={700}
                              fontSize={isTablet ? 26 : 72}
                              color="#fff"
                              mt="11px"
                            >
                              {game.title}
                            </Box>
                            <Box
                              fontFamily="Rany"
                              fontWeight={500}
                              textAlign="left"
                              fontSize={isTablet ? 12 : 20}
                              color="#fff"
                              lineHeight="31px"
                              mt="20px"
                              maxWidth={isMobile ? 350 : "unset"}
                            >
                              {game.Description}
                            </Box>
                            <Box display="flex" mt={3}>
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                className={classes.gameInfoSection}
                              >
                                <span>{game.Transfers || 0}</span>
                                <span>Transfers</span>
                              </Box>
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                className={classes.gameInfoSection}
                              >
                                <span>{game.owners_count || 0}</span>
                                <span>New Owners</span>
                              </Box>
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                className={classes.gameInfoSection}
                              >
                                <span>{game.transaction_count || 0}</span>
                                <span>marketplace transactions</span>
                              </Box>
                            </Box>
                            <SecondaryButton
                              size="medium"
                              className={classes.gamePlayButton}
                              onClick={() => history.push(`/P2E/${game.Slug}`)}
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
              {popularGames && popularGames.length ? (
                <div className={classes.topGamesWrapper}>
                  <Box
                    className={`${classes.topGamesTitle} ${classes.fitContent}`}
                    justifyContent="space-between"
                  >
                    <span>Popular Games</span>
                    {popularGames &&
                      popularGames.length &&
                      !isMobile &&
                      ((isTablet && popularGames.length > 2) ||
                        (isNormalScreen && popularGames.length > 3) ||
                        popularGames.length > 4) ? (
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
                    {loadingPopularGames ? (
                      <div className={classes.allNFTSection}>
                        <MasonryGrid
                          gutter={"24px"}
                          data={Array(itemsToShow).fill(0)}
                          renderItem={item => (
                            <FeaturedGameCard game={{}} isLoading={loadingPopularGames} />
                          )}
                          columnsCountBreakPoints={{
                            ...COLUMNS_COUNT_BREAK_POINTS,
                            1440: openSideBar ? 3 : 4,
                            1800: 4,
                          }}
                        />
                      </div>
                    ) : popularGames && popularGames.length ? (
                      !isMobile &&
                        (popularGames.length === 1 ||
                          popularGames.length === 2 ||
                          popularGames.length === 3) ? (
                        <div className={classes.allNFTSection}>
                          <Box style={{ marginBottom: "24px" }}>
                            <MasonryGrid
                              gutter={"24px"}
                              data={popularGames}
                              renderItem={item => (
                                <FeaturedGameCard game={item} isLoading={Object.entries(item).length === 0} />
                              )}
                              columnsCountBreakPoints={{
                                ...COLUMNS_COUNT_BREAK_POINTS,
                                1440: openSideBar ? 3 : 4,
                                1800: 4,
                              }}
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
                          {popularGames.map((item: any, i: Number) => (
                            <div
                              key={item.id}
                              style={{
                                width: "100%",
                                paddingBottom: "15px",
                                display: "flex",
                                justifyContent: isMobile
                                  ? "center"
                                  : popularGames.length === 2 && i === 1
                                    ? "flex-end"
                                    : popularGames.length === 3 && i === 1
                                      ? "center"
                                      : popularGames.length === 3 && i === 2
                                        ? "flex-end"
                                        : "flex-start",
                              }}
                            >
                              <FeaturedGameCard game={item} />
                            </div>
                          ))}
                        </Carousel>
                      )
                    ) : (
                      <div></div>
                    )}
                  </div>
                  {popularGames && popularGames.length && isMobile && popularGames.length > 1 ? (
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
                      onClick={() => history.push("/P2E/explorer")}
                    >
                      Show All
                    </SecondaryButton>
                  </Hidden>
                </div>
                <div className={classes.allNFTSection}>
                  {loadingNewListings ? (
                    <MasonryGrid
                      gutter={"24px"}
                      data={Array(itemsToShow).fill(0)}
                      renderItem={(item, index) => <ExploreCard nft={item} key={`item-${index}`} isLoading />}
                      columnsCountBreakPoints={{
                        ...COLUMNS_COUNT_BREAK_POINTS,
                        1440: openSideBar ? 3 : 4,
                        1800: 4,
                      }}
                    />
                  ) : newListings.length > 0 ? (
                    <>
                      <MasonryGrid
                        gutter={"24px"}
                        data={newListings}
                        renderItem={(item, index) => <ExploreCard nft={item} key={`item-${index}`} />}
                        columnsCountBreakPoints={{
                          ...COLUMNS_COUNT_BREAK_POINTS,
                          1440: openSideBar ? 3 : 4,
                          1800: 4,
                        }}
                      />
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <Box padding={isTablet || isNarrow || isMobile ? 0 : "0 32px"}>
                <div className={classes.allNFTTitle}>
                  <span>Recent Transactions</span>
                </div>
                <Box>
                  <InfiniteScroll
                    hasChildren={transactions?.length > 0}
                    dataLength={transactions?.length}
                    scrollableTarget={"scrollContainer"}
                    next={loadTransactions}
                    hasMore={transactionHasMore}
                    loader={
                      transactionloading &&
                      (
                        <div
                          style={{
                            paddingTop: 8,
                            paddingBottom: 8,
                          }}
                        >
                          {Array(5)
                            .fill(0)
                            .map((_, index) => (
                              <Box className={classes.listLoading} mb={1.5} key={`listLoading_${index}`}>
                                <Skeleton variant="rect" width={60} height={60} />
                                <Skeleton variant="rect" width="40%" height={24} style={{ marginLeft: "8px" }} />
                                <Skeleton variant="rect" width="20%" height={24} style={{ marginLeft: "8px" }} />
                                <Skeleton variant="rect" width="20%" height={24} style={{ marginLeft: "8px" }} />
                              </Box>
                            ))}
                        </div>
                      )
                    }
                  >
                    {
                      tableData.length > 0 && (
                        <Box className={classes.table}>
                          <CustomTable
                            variant={Variant.Transparent}
                            headers={tableHeaders}
                            rows={tableData}
                            placeholderText=""
                            sorted={{}}
                            theme="game transaction"
                          />
                        </Box>
                      )
                    }
                  </InfiniteScroll>
                  {!transactionloading && transactions?.length < 1 && (
                    <Box textAlign="center" width="100%" mb={10} mt={2}>
                      No Transactions
                    </Box>
                  )}
                </Box>
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
