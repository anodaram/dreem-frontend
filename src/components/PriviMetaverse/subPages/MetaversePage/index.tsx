import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IconButton, InputAdornment, MenuItem, OutlinedInput, Select } from "@material-ui/core";

import MetaverseCard from "components/PriviMetaverse/components/cards/MetaverseCard";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";

import shapeImgBg from "assets/metaverseImages/metaverse_bg.png";
import shapeImgBgCover from "assets/metaverseImages/metaverse_bg_cover.png";
import shapeImgBgTop from "assets/metaverseImages/metaverse_bg_top.png";

import { metaversePageStyles, useFilterSelectStyles } from "./index.styles";
import { useDebounce } from "use-debounce/lib";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 3,
};

const filterChainOptions = ["ALL", "BSC", "Polygon", "Solana"];

const getChainImage = chain => {
  if (chain === filterChainOptions[1]) {
    return <img src={require("assets/metaverseImages/bsc_yellow.png")} />;
  } else if (chain === filterChainOptions[2]) {
    return <img src={require("assets/metaverseImages/polygon_yellow.png")} />;
  } else if (chain === filterChainOptions[3]) {
    return <img src={require("assets/metaverseImages/solana_yellow.png")} />;
  } else {
    return null;
  }
};

export const ArrowIcon = func => () =>
  (
    <Box style={{ cursor: "pointer" }} onClick={() => func(true)}>
      <svg width="11" height="7" viewBox="0 0 11 7" fill="#E9FF26" xmlns="http://www.w3.org/2000/svg">
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

export default function MetaversePage() {
  const classes = metaversePageStyles();

  const width = useWindowDimensions().width;

  const [exploreMetaverses, setExploreMetaverses] = React.useState<any[]>([]);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const [selectedTab, setSelectedTab] = React.useState<string>("featured");
  const [lastId, setLastId] = React.useState<string>("");

  const [searchWord, setSearchWord] = React.useState<string>("");
  const [filterChain, setFilterChain] = React.useState<string>(filterChainOptions[0]);
  const [openChainSelect, setOpenChainSelect] = React.useState<boolean>(false);
  const [isFilterChain, setIsFilterChain] = React.useState<boolean>(false);
  const filterClasses = useFilterSelectStyles();

  const [debouncedSearch] = useDebounce(searchWord, 500);

  React.useEffect(() => {
    setExploreMetaverses([]);
    setHasMore(true);
    setLastId("");

    loadMore(true);
  }, [debouncedSearch, filterChain]);

  const onChangeSearchWord = e => {
    setSearchWord(e.target.value);
  };

  const handleFilterChain = e => {
    setFilterChain(e.target.value);
  };

  const loadMore = (isInit = false) => {
    MetaverseAPI.getNftGames(isInit ? "" : lastId, debouncedSearch, filterChain).then(res => {
      if (res && res.success) {
        const items = res.data.items;
        setExploreMetaverses(prev => [...prev, ...items]);
        setHasMore(res.data.hasMore);
        setLastId(res.data.lastId);
      }
    });
  };

  const loadingCount = React.useMemo(() => (width > 1000 ? 6 : width > 600 ? 3 : 6), [width]);

  return (
    <Box className={classes.root} id="scrollContainer">
      <div className={classes.bgContainer}>
        <img className={classes.bg} src={shapeImgBg} alt="seedImg" />
        <img className={classes.bgCover} src={shapeImgBgCover} alt="seedImg" />
        <img className={classes.bgTop} src={shapeImgBgTop} alt="seedImg" />
        <div className={classes.bgBotom}></div>
      </div>
      <Box className={classes.mainContainer}>
        <Box className={classes.fitContent}>
          <Box mb={8}>
            <div className={classes.topbar}>
              <Box display="flex" flexDirection="column" whiteSpace="nowrap" overflow="hidden">
                <div className={`${classes.title} ${classes.fitSize}`}>Explore The Metaverse</div>
                <div className={`${classes.description}  ${classes.fitSize}`}>
                  Immerse yourself within the vast number of fun experiences built by Web 3 communities
                </div>
              </Box>
              <div className={classes.searchBarContainer}>
                <OutlinedInput
                  className={classes.searchBar}
                  placeholder="Search for collection"
                  type="text"
                  value={searchWord}
                  onChange={onChangeSearchWord}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <img
                          src={require("assets/metaverseImages/searchIcon.png")}
                          className={classes.searchIcon}
                        />
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={100}
                />
              </div>
            </div>
            <div className={classes.tabSection}>
              <div
                className={selectedTab === "featured" ? classes.selectedTab : classes.tab}
                onClick={() => setSelectedTab("featured")}
              >
                Featured
              </div>
              <div
                className={selectedTab === "popular games" ? classes.selectedTab : classes.tab}
                onClick={() => setSelectedTab("popular games")}
              >
                Popular Game
              </div>
              <div
                className={selectedTab === "dreem realms" ? classes.selectedTab : classes.tab}
                onClick={() => setSelectedTab("dreem realms")}
              >
                Dreem Realms
              </div>
              <div
                className={selectedTab === "all" ? classes.selectedTab : classes.tab}
                onClick={() => setSelectedTab("all")}
              >
                All
              </div>
            </div>
            <div className={classes.selectSection}>
              <Select
                open={openChainSelect}
                onClose={() => setOpenChainSelect(false)}
                value={filterChain}
                onChange={handleFilterChain}
                className={`${classes.select} ${isFilterChain ? classes.filterActive : ""}`}
                renderValue={(value: any) => (
                  <Box display="flex" alignItems="center" onClick={() => setOpenChainSelect(true)}>
                    CHAIN:&nbsp;&nbsp;
                    {getChainImage(value)}
                    &nbsp;&nbsp;<span>{value}</span>
                  </Box>
                )}
                MenuProps={{
                  classes: filterClasses,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  getContentAnchorEl: null,
                }}
                IconComponent={ArrowIcon(setOpenChainSelect)}
              >
                {filterChainOptions.map((chain, index) => (
                  <MenuItem key={`filter-chain-${index}`} value={chain}>
                    <div className={classes.chainImage}>{getChainImage(chain)}</div>
                    {chain}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Box>
          <Box>
            <InfiniteScroll
              hasChildren={exploreMetaverses.length > 0}
              dataLength={exploreMetaverses.length}
              scrollableTarget={"scrollContainer"}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <Box mt={2}>
                  <MasonryGrid
                    gutter={"40px"}
                    data={Array(loadingCount).fill(0)}
                    renderItem={(_, index) => <MetaverseCard isLoading={true} key={`game_${index}`} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </Box>
              }
            >
              <Box mt={4}>
                <MasonryGrid
                  gutter={"40px"}
                  data={exploreMetaverses}
                  renderItem={(item, index) => <MetaverseCard item={item} key={`game_${index}`} />}
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
