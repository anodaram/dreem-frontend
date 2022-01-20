import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Carousel from "react-elastic-carousel";
import { useHistory } from "react-router-dom";

import { useMediaQuery, useTheme } from "@material-ui/core";
// import { useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import RealmCard from "components/PriviMetaverse/components/cards/RealmCard";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { getDefaultImageUrl } from "shared/services/user/getUserAvatar";
import { explorePageStyles } from "./index.styles";

import shapeImgTriangle from "assets/metaverseImages/shape_home_2.png";
import shapeImgBlueArc from "assets/metaverseImages/shape_explorer_blue_arc.png";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 3,
};

const filters = ["WORLD"];

export default function ExplorePage() {
  const classes = explorePageStyles();
  const history = useHistory();

  // const theme = useTheme();
  const width = useWindowDimensions().width;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [loadingFeatured, setLoadingFeatured] = React.useState<boolean>(false);
  const [featuredRealms, setFeaturedRealms] = React.useState<any[]>([]);

  const [curPage, setCurPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [loadingExplore, setLoadingExplore] = React.useState<boolean>(false);
  const [exploreRealms, setExploreReamls] = React.useState<any[]>([]);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const carouselRef = React.useRef<any>();
  const carouselRef1 = React.useRef<any>();
  const [curPageIndex, setCurPageIndex] = React.useState<number>(0);

  const [breakPoints] = React.useState<any[]>([
    { width: theme.breakpoints.values.xs, itemsToShow: 2 },
    { width: theme.breakpoints.values.sm, itemsToShow: 3 },
    { width: theme.breakpoints.values.md, itemsToShow: 4 },
    // { width: theme.breakpoints.values.lg, itemsToShow: 3 },
  ]);

  React.useEffect(() => {
    loadFeatured();
    loadMore();
  }, []);

  const loadMore = () => {
    MetaverseAPI.getWorlds(12, curPage, "timestamp", filters, true, undefined, undefined, false)
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          if (items && items.length > 0) {
            setExploreReamls([...exploreRealms, ...res.data.elements]);
            if (res.data.page && curPage <= res.data.page.max) {
              setCurPage(curPage => curPage + 1);
              setLastPage(res.data.page.max);
            }
          }
        }
      })
      .finally(() => setLoadingExplore(false));
  };

  const loadFeatured = () => {
    setLoadingFeatured(true);
    MetaverseAPI.getFeaturedWorlds(filters)
      .then(res => {
        if (res.success) {
          setFeaturedRealms(res.data.elements);
        }
      })
      .finally(() => setLoadingFeatured(false));

    setLoadingExplore(true);
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

  const loadingCount = React.useMemo(() => (width > 1000 ? 6 : width > 600 ? 3 : 6), [width]);

  return (
    <Box className={classes.root} id="scrollContainer">
      <Box className={classes.realmContainer}>
        <img className={classes.bgImgTriangle} src={shapeImgTriangle} alt="seedImg" />
        <img className={classes.bgImgGreenCircle} src={shapeImgBlueArc} alt="seedImg" />
        <Box className={classes.fitContent}>
          <Box mb={8}>
            <Box display="flex" flexDirection="row" whiteSpace="nowrap" overflow="hidden">
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
                              <>
                                {!loadingFeatured && (
                                  <Box
                                    key={page}
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
                              </>
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
                              <>
                                {!loadingFeatured && (
                                  <Box
                                    key={page}
                                    className={classes.carouselItem}
                                    style={{
                                      backgroundImage: featuredRealms[page]?.worldImage
                                        ? `url("${featuredRealms[page]?.worldImage}")`
                                        : `url(${getDefaultImageUrl()})`,
                                      border: isActivePage ? "2px solid #E1E736" : "none",
                                    }}
                                    onClick={() => {
                                      onClick(page.toString());
                                    }}
                                  ></Box>
                                )}
                              </>
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
          </Box>
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box className={classes.gradientText}>Explore realms</Box>
              {/* <PrimaryButton
                size="medium"
                style={{
                  background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                  height: 48,
                  minWidth: 249,
                  textTransform: "uppercase",
                  borderRadius: "100px",
                  color: "#121212",
                  paddingTop: 4,
                }}
                onClick={() => history.push("/creating_realm")}
              >
                Create Realm
              </PrimaryButton> */}
            </Box>

            <InfiniteScroll
              hasChildren={exploreRealms.length > 0}
              dataLength={exploreRealms.length}
              scrollableTarget={"scrollContainer"}
              next={loadMore}
              hasMore={hasMore}
              loader={
                lastPage && curPage === lastPage ? (
                  <Box mt={2}>
                    <MasonryGrid
                      gutter={"16px"}
                      data={Array(loadingCount).fill(0)}
                      renderItem={(item, _) => <RealmCard isLoading={true} />}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  </Box>
                ) : (
                  <></>
                )
              }
            >
              <Box mt={4}>
                <MasonryGrid
                  gutter={"16px"}
                  data={exploreRealms}
                  renderItem={(item, _) => <RealmCard item={item} isLoading={loadingExplore} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </Box>
            </InfiniteScroll>
          </Box>
        </Box>
      </Box>
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
