import React, { useState, useEffect, useRef, useMemo } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-elastic-carousel";

import { useTheme, useMediaQuery} from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import {
  setTokenList,
  setCollectionNFTList,
  setScrollPositionInCollection,
  setScrollPositionInAllNFT,
} from "store/actions/MarketPlace";
import { setRealmsList, setScrollPositionInRealms } from "store/actions/Realms";
import Box from "shared/ui-kit/Box";
import { SecondaryButton } from "shared/ui-kit";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { NftStates } from "shared/constants/constants";
import HowWorksOfMarketPlaceModal from "../../modals/HowWorksOfMarketPlaceModal";
import { useNFTOptionsStyles } from "./index.styles";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";

import { ReactComponent as BinanceIcon } from "assets/icons/bsc.svg";
import { ReactComponent as PolygonIcon } from "assets/icons/polygon.svg";
import { userTrackMarketPlace } from "shared/services/API";
import { GameSlider } from "components/PriviMetaverse/components/GameSlider";
import ExploreCard from "components/PriviMetaverse/components/cards/ExploreCard";
import { Skeleton } from "@material-ui/lab";
import FeaturedGameCard from "components/PriviMetaverse/components/cards/FeatureGameCard";

const isProd = process.env.REACT_APP_ENV === "prod";

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  650: 2,
  1200: 3,
  1440: 4,
};

const SECONDS_PER_HOUR = 3600;


const filterChainOptions = ["All", "BSC", "Polygon"];
const filterStatusOptions = ["All", ...NftStates];

const gameList = [
  {
    title: 'Game Name 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis risus sapien, vitae consectetur odio faucibus vitae. Phasellus viverra nibh tortor, id venenatis nisl placerat eget.',
    image: require("assets/backgrounds/community.jpeg")
  },
  {
    title: 'Game Name 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis risus sapien, vitae consectetur odio faucibus vitae. Phasellus viverra nibh tortor, id venenatis nisl placerat eget.',
    image: require("assets/backgrounds/social.jpeg")
  },
  {
    title: 'Game Name 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis risus sapien, vitae consectetur odio faucibus vitae. Phasellus viverra nibh tortor, id venenatis nisl placerat eget.',
    image: require("assets/backgrounds/workInProgress.jpeg")
  }
]

const getChainImage = chain => {
  if (chain === filterChainOptions[1]) {
    return <BinanceIcon />;
  } else if (chain === filterChainOptions[2]) {
    return <PolygonIcon />;
  } else {
    return null;
  }
};

export const ArrowIcon = func => () =>
  (
    <Box style={{ fill: "white", cursor: "pointer" }} onClick={() => func(true)}>
      <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.10303 1.06644L5.29688 5.26077L9.71878 0.838867"
          stroke="#2D3047"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );

const NFTReserves = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isSignedin } = useAuth();
  const classes = useNFTOptionsStyles();
  const carouselRef = useRef<any>();

  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [hasMoreCollections, setHasMoreCollections] = useState<boolean>(false);
  const [pagination, setPagination] = useState<number>(0);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(false);
  const [loadingFeaturedGames, setLoadingFeaturedGames] = useState<boolean>(false);
  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);

  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const allNFTList = useSelector((state: RootState) => state.marketPlace.allNFTList);

  const width = useWindowDimensions().width;

  const theme = useTheme();
  const isNormalScreen = useMediaQuery(theme.breakpoints.down(1800));
  const isTablet = useMediaQuery(theme.breakpoints.down(1420));
  const isNarrow = useMediaQuery(theme.breakpoints.down(860));
  const isMobile = useMediaQuery(theme.breakpoints.down(650));

  const itemsToShow = isMobile ? 1 : isNarrow ? 2 : isTablet ? 3 : isNormalScreen ? 4 : 5;
  const loadingCount = React.useMemo(() => (width > 1700 ? 5
    : width > 1420 ? 4
      : width > 1200 ? 3
        : width > 650 ? 2 : 1), [width]);

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

  useEffect(() => {
    // initialize store
    dispatch(setCollectionNFTList([]));
    dispatch(setRealmsList([]));
    dispatch(setScrollPositionInCollection(0));
    dispatch(setScrollPositionInRealms(0));
    getTokenList();
  }, []);

  useEffect(() => {
    getCollectionData()
  }, [])

  useEffect(() => {
    if (isSignedin) {
      userTrackMarketPlace();
    }
  }, [isSignedin]);
  
  const getCollectionData = () => {
    if (loadingFeaturedGames) return;

    setLoadingFeaturedGames(true);
    MetaverseAPI.getNftGames(
      "",
      "",
      "ALL"
    )
      .then(res => {
        if (res && res.success) {
          const items = res.data.items;
          setFeaturedGames(items)
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

  return (
    <>
      <Box className={classes.main}>
        <Box className={classes.limitedContent}>
          <div className={classes.content} id={"scrollContainer"} onScroll={handleScroll}>
            <div className={classes.titleBar}>
              <Box display="flex" alignItems="center" width="100%" justifyContent="space-between" maxWidth={1280}>
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
              <Box
                height={720}
                width={1280}
                position="relative"
                className={classes.gameslider}
                mt="38px"
              >
                <img src={require("assets/icons/slider_footer.svg")} className={classes.sliderFooter} />
                <img src={require("assets/icons/slider_left.svg")} className={classes.sliderLeft} />
                <img src={require("assets/icons/slider_right.svg")} className={classes.sliderRight} />
                {/* <img src={require("assets/icons/slider_rect.svg")} className={classes.sliderRect} /> */}
                <GameSlider
                  games={
                    gameList.map(game => {
                      return () => (
                        <Box position="relative" width="100%" height="100%">
                          <img src={game.image} width="100%" height="100%" className={classes.gameBgImage}/>
                          <Box
                            padding="100px 105px"
                            width="100%"
                            height="100%"
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="flex-end"
                            className={classes.gameContent}
                          >
                            <Box fontFamily="Rany" fontWeight={700} fontSize="18px" color="#E9FF26">COMING SOON</Box>
                            <Box fontFamily="GRIFTER" fontWeight={700} fontSize="72px" color="#fff" mt="11px">{game.title}</Box>
                            <Box fontFamily="Rany" fontWeight={500} textAlign="left" fontSize="20px" color="#fff" lineHeight="31px" mt="20px">{game.description}</Box>
                            <SecondaryButton
                              size="medium"
                              className={classes.gamePlayButton}
                              onClick={() => {}}
                            >
                              <GameIcon />
                              OPEN THE GAME
                            </SecondaryButton>
                          </Box>
                        </Box>
                      )
                    })
                  }
                  paginationColor="#E9FF26"
                />
              </Box>
            </div>
            <div className={classes.NFTSection}>
              {featuredGames && featuredGames.length ? (
                <div className={classes.topGamesWrapper}>
                  <Box className={`${classes.topGamesTitle} ${classes.fitContent}`} justifyContent="space-between">
                    <span>Featured Games</span>
                    {featuredGames &&
                      featuredGames.length && !isMobile &&
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
                          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.6" d="M7.61309 2L1.92187 7.69055L7.92187 13.6906" stroke="white" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round"/>
                          </svg>
                        </Box>
                        <Box
                          ml={3}
                          className={classes.carouselNav}
                          onClick={() => {
                            carouselRef.current.slideNext();
                          }}
                        >
                          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.6" d="M2.38691 14L8.07813 8.30945L2.07813 2.30945" stroke="white" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round"/>
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
                          <Box style={{ marginBottom: '24px' }}>
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
                        renderItem={(_) => (
                          <Skeleton variant="rect" width={60} height={60} />
                        )}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                  {(featuredGames &&
                    featuredGames.length &&
                    (isMobile && featuredGames.length > 1)) ? (
                    <Box display="flex" justifyContent="flex-end" pr={3} pb={3}>
                      <Box display="flex" alignItems="center">
                        <Box
                          className={classes.carouselNav}
                          onClick={() => {
                            carouselRef.current.slidePrev();
                          }}
                        >
                          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.6" d="M7.61309 2L1.92187 7.69055L7.92187 13.6906" stroke="white" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round"/>
                          </svg>
                        </Box>
                        <Box
                          ml={3}
                          className={classes.carouselNav}
                          onClick={() => {
                            carouselRef.current.slideNext();
                          }}
                        >
                          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.6" d="M2.38691 14L8.07813 8.30945L2.07813 2.30945" stroke="white" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round"/>
                          </svg>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <></>
                  )}

                </div>
              ) : null}
              {/* <div className={`${classes.allNFTWrapper} ${classes.fitContent}`}>
                <div className={classes.allNFTTitle}>
                  <span>New Listings</span>
                </div>
                <div className={classes.allNFTSection}>
                {loading || hasMoreCollections || () ? (
                    <>
                      <MasonryGrid
                        gutter={"24px"}
                        data={collectionsWithSkeleton}
                        renderItem={(item, index) => <ExploreCard nft={item}  key={`item-${index}`} />}
                          columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                      />
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div> */}
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

export const SearchIcon = ({ color = "white" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.9056 14.3199C11.551 15.3729 9.84871 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 9.84871 15.3729 11.551 14.3199 12.9056L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L12.9056 14.3199ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      fill={color}
    />
  </svg>
);

export const UnionIcon = () => (
  <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.8"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.5 1.75C0.5 1.19772 0.947715 0.75 1.5 0.75H11.5C12.0523 0.75 12.5 1.19772 12.5 1.75C12.5 2.30228 12.0523 2.75 11.5 2.75H1.5C0.947715 2.75 0.5 2.30228 0.5 1.75ZM0.5 5.75C0.5 5.19772 0.947715 4.75 1.5 4.75H11.5C12.0523 4.75 12.5 5.19772 12.5 5.75C12.5 6.30228 12.0523 6.75 11.5 6.75H1.5C0.947715 6.75 0.5 6.30228 0.5 5.75ZM1.5 8.75C0.947715 8.75 0.5 9.19771 0.5 9.75C0.5 10.3023 0.947715 10.75 1.5 10.75H11.5C12.0523 10.75 12.5 10.3023 12.5 9.75C12.5 9.19771 12.0523 8.75 11.5 8.75H1.5Z"
    />
  </svg>
);

export const DetailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6.5" y="0.625" width="6" height="6" rx="1" transform="rotate(90 6.5 0.625)" />
    <rect x="6.5" y="7.625" width="6" height="6" rx="1" transform="rotate(90 6.5 7.625)" />
    <rect x="13.5" y="0.625" width="6" height="6" rx="1" transform="rotate(90 13.5 0.625)" />
    <rect x="13.5" y="7.625" width="6" height="6" rx="1" transform="rotate(90 13.5 7.625)" />
  </svg>
);

export const GameIcon = () => (
  <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.8333 1.70412C9.27875 0.182038 5.655 -0.430045 3.61292 1.75829C1.61417 3.89245 0 9.03775 0 13.8916C0 19.7476 4.9075 20.5601 7.58333 17.6833C9.1325 16.015 9.27875 15.7544 10.2917 14.4333H15.7083C16.7267 15.7544 16.8675 16.015 18.4167 17.6833C21.092 20.5601 26 19.7476 26 13.8916C26 9.03775 24.3858 3.89245 22.3871 1.75829C20.345 -0.430045 16.7267 0.182038 15.1667 1.70412C14.5654 2.28912 13 2.51662 13 2.51662C13 2.51662 11.4346 2.28912 10.8333 1.70412ZM8.66667 5.27912V6.84941H10.2375C10.8658 6.84941 11.375 7.33691 11.375 7.93329C11.375 8.52912 10.8658 9.01662 10.2375 9.01662H8.66667V10.5869C8.66667 11.2158 8.17917 11.725 7.58333 11.725C6.9875 11.725 6.5 11.2163 6.5 10.5869V9.01662H4.92917C4.30083 9.01662 3.79167 8.52912 3.79167 7.93329C3.79167 7.33691 4.30083 6.84941 4.92917 6.84941H6.5V5.27912C6.5 4.65079 6.9875 4.14162 7.58333 4.14162C8.17917 4.14162 8.66667 4.65079 8.66667 5.27912ZM18.4167 6.03745C18.4167 5.28995 19.0233 4.68329 19.7708 4.68329C20.5183 4.68329 21.125 5.28995 21.125 6.03745C21.125 6.78495 20.5183 7.39162 19.7708 7.39162C19.0233 7.39162 18.4167 6.78495 18.4167 6.03745ZM15.7083 9.28745C15.7083 8.53941 16.315 7.93329 17.0625 7.93329C17.81 7.93329 18.4167 8.53941 18.4167 9.28745C18.4167 10.0344 17.81 10.6416 17.0625 10.6416C16.315 10.6416 15.7083 10.0344 15.7083 9.28745Z" fill="black"/>
  </svg>
)