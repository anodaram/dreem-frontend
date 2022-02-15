import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Carousel from "react-spring-3d-carousel";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import { Grid, useMediaQuery } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { CircularLoadingIndicator } from "shared/ui-kit";
import RealmExtensionProfileCard from "../../components/cards/RealmExtensionProfileCard";
import Footer from "../../components/Footer";
import BecomeCreatorModal from "../../modals/BecomeCreatorModal";
import ContentPreviewModal from "../../modals/ContentPreviewModal";
import { homePageStyles } from "./index.styles";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4,
};

const NewCreatorsData = (trendingContents: any[]) => {
  const artistData: any[] = [];

  let list: any = [];
  if (trendingContents && trendingContents.length > 0) {
    if (trendingContents.length < 3) {
      list = trendingContents.slice(0, 1);
    } else if (trendingContents.length >= 3 && trendingContents.length < 5) {
      list = trendingContents.slice(0, 3);
    } else {
      list = trendingContents.slice(0, 5);
    }
  }

  list.slice(0, 5).map((content, index) => {
    artistData.push({
      key: `trending-content-${index}`,
      content: <RealmExtensionProfileCard nft={content} isHomePage />,
    });
  });

  return artistData;
};

export default function HomePage() {
  const classes = homePageStyles();
  const history = useHistory();

  const { nftId } = useParams<{ nftId?: string }>();
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");

  const [loadingTrending, setLoadingTrending] = useState<boolean>(false);
  const [trendingContents, setTrendingContents] = useState<any[]>([]);

  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [loadingNewest, setLoadingNewest] = useState<boolean>(false);
  const [newestContents, setNewestContents] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [openBecomeCreatorModal, setOpenBecomeCreatorModal] = useState<boolean>(false);
  const [openContentPreview, setOpenContentPreview] = React.useState<boolean>(false);

  const [curPage, setCurPage] = React.useState<number>(1);

  React.useEffect(() => {
    if (!underMaintenanceSelector.underMaintenance) {
      setLoadingTrending(true);
      MetaverseAPI.getAssets(5, 1, "rating", ["WORLD"], true)
        .then(res => {
          if (res.success) {
            setTrendingContents(res.data.elements);
          }
        })
        .finally(() => setLoadingTrending(false));

      getContents(curPage);
    }
  }, []);

  React.useEffect(() => {
    if (nftId) {
      setOpenContentPreview(true);
    }
  }, [nftId]);

  const getContents = curPage => {
    setLoadingNewest(true);
    MetaverseAPI.getAssets(12, curPage, "DESC", ["WORLD"], true)
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          const pageInfo = res.data.page;
          if (items && items.length > 0) {
            setNewestContents([...newestContents, ...res.data.elements]);
          }
          setCurPage(pageInfo.cur + 1);
          setHasMore(pageInfo.cur < pageInfo.max);
        }
      })
      .finally(() => setLoadingNewest(false));
  };

  const loadMore = () => {
    if (loadingNewest) return;
    getContents(curPage + 1);
  };

  if (underMaintenanceSelector.underMaintenance) {
    return null;
  }

  return (
    <>
      <div className={classes.root} id={"scrollContainer"}>
        {!isTablet && (
          <img src={require("assets/metaverseImages/large_planet.png")} className={classes.largePlanetImg} />
        )}
        <img src={require("assets/metaverseImages/small_planet.png")} className={classes.smallPlanetImg} />
        <div className={classes.mainContent}>
          <div className={classes.title}>
            <span>Explore</span> Dreem
          </div>
          <div className={classes.subTitle}>
            Your gateway to limitless opportunities.
            <br />
            Build your world as you imagine it.
          </div>
          <Box display="flex" justifyContent="center">
            <div className={classes.becomeCreatorBtn} onClick={() => history.push("/create")}>
              Become Creator
            </div>
          </Box>
          <div className={classes.newestContentsSection}>
            <div className={classes.headerSection}>
              <div className={classes.subTitle1}>Trending Content</div>
            </div>
            <Box width="100%" mb={10}>
              {loadingTrending ? (
                <Box display="flex" justifyContent="center" mb={10}>
                  <CircularLoadingIndicator theme="green" />
                </Box>
              ) : trendingContents && trendingContents.length >= 5 ? (
                <>
                  <div className={classes.carouselContainer}>
                    <div className={classes.carouselBox}>
                      <Carousel
                        slides={NewCreatorsData(trendingContents)}
                        goToSlide={currentSlider}
                        showNavigation={false}
                        offsetRadius={isMobile ? 1 : isTablet ? 2 : 3}
                      />
                    </div>
                  </div>
                  <div className={classes.arrowBoxContent}>
                    <div className={classes.arrowBox}>
                      <Box
                        style={{ cursor: "pointer" }}
                        mr={3}
                        onClick={() => setCurrentSlider(prev => prev - 1)}
                      >
                        <ArrowIcon />
                      </Box>
                      <Box bgcolor="#FEF4EF" width={"1px"} height={1} mb={"5px"} />
                      <Box
                        style={{ transform: "scaleX(-1)", cursor: "pointer" }}
                        ml={3}
                        onClick={() => setCurrentSlider(prev => prev + 1)}
                      >
                        <ArrowIcon />
                      </Box>
                    </div>
                    <Box display="flex" alignItems="center">
                      <Box mr={2}>
                        {currentSlider % 5 === 0 ? <EllipseFillInIcon /> : <EllipseFillOutIcon />}
                      </Box>
                      <Box mr={2}>
                        {currentSlider % 5 === 1 ? <EllipseFillInIcon /> : <EllipseFillOutIcon />}
                      </Box>
                      <Box mr={2}>
                        {currentSlider % 5 === 2 ? <EllipseFillInIcon /> : <EllipseFillOutIcon />}
                      </Box>
                      <Box mr={2}>
                        {currentSlider % 5 === 3 ? <EllipseFillInIcon /> : <EllipseFillOutIcon />}
                      </Box>
                      <Box mr={2}>
                        {currentSlider % 5 === 4 ? <EllipseFillInIcon /> : <EllipseFillOutIcon />}
                      </Box>
                    </Box>
                  </div>
                </>
              ) : trendingContents && trendingContents.length > 1 ? (
                <Grid container spacing={3} style={{ marginBottom: 50 }}>
                  {newestContents.map((content, index) => (
                    <Grid item key={`newest-content-${index}`} lg={3} md={4} sm={6} xs={12}>
                      <RealmExtensionProfileCard nft={{ ...content }} isHomePage />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" width="100%" mb={10}>
                  No data
                </Box>
              )}
            </Box>
            <div className={classes.newestContentsSection}>
              <div className={classes.headerSection}>
                <div className={classes.subTitle1}>Newest Content</div>
              </div>
              <Box width="100%" mb={10}>
                <InfiniteScroll
                  hasChildren={newestContents.length > 0}
                  dataLength={newestContents.length}
                  scrollableTarget={"scrollContainer"}
                  next={loadMore}
                  hasMore={hasMore}
                  loader={null}
                >
                  <Box mt={4}>
                    <MasonryGrid
                      gutter={"16px"}
                      data={newestContents}
                      renderItem={(item, _) => <RealmExtensionProfileCard nft={{ ...item }} isHomePage />}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  </Box>
                </InfiniteScroll>
              </Box>
            </div>
          </div>
          {loadingNewest && (
            <Box display="flex" justifyContent="center" mb={10}>
              <CircularLoadingIndicator theme="green" />
            </Box>
          )}
        </div>
      </div>
      <div className={classes.footer}>
        <Footer />
      </div>
      {openBecomeCreatorModal && (
        <BecomeCreatorModal open={openBecomeCreatorModal} onClose={() => setOpenBecomeCreatorModal(false)} />
      )}
      {openContentPreview && (
        <ContentPreviewModal
          open={openContentPreview}
          nftId={nftId}
          onClose={() => setOpenContentPreview(false)}
        />
      )}
    </>
  );
}

const ArrowIcon = () => (
  <svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.6143 0.648438L1.24561 11.0171L11.6143 21.3858"
      stroke="#181818"
      stroke-width="0.93318"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const EllipseFillInIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5.5" cy="5.5" r="5.5" fill="url(#paint0_radial_3508:28270)" />
    <defs>
      <radialGradient
        id="paint0_radial_3508:28270"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(5.5203 6.18491) rotate(90.2415) scale(4.81514 8.57451)"
      >
        <stop offset="0.15625" stop-color="#ffffff" />
        <stop offset="0.96875" stop-color="#ffffff" stop-opacity="0.96" />
      </radialGradient>
    </defs>
  </svg>
);

const EllipseFillOutIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5.5" cy="5.5" r="5" stroke="#707582" />
  </svg>
);
