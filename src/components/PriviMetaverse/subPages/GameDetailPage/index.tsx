import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";
import InfiniteScroll from "react-infinite-scroll-component";

import { useMediaQuery, useTheme, Select, MenuItem } from "@material-ui/core";
import { IconButton } from "@material-ui/core";

import GameMediaCard from "components/PriviMetaverse/components/cards/GameMediaCard";
import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { getGameInfo, getCharactersByGame } from "shared/services/API/DreemAPI";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import TabsView, { TabItem } from "shared/ui-kit/TabsView";
import ExploreCard from "components/PriviMetaverse/components/cards/ExploreCard";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
// import MarketplaceFeed from "./components/MarketplaceFeed";
// import Owners from "./components/Owners";
import { gameDetailPageStyles, gameDetailTabsStyles, useFilterSelectStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1200: 3,
  1440: 4,
};

const TAB_NFTS = "nfts";
// const TAB_MARKETPLACE_FEED = "marketplace_feed";
// const TAB_OWNERS = "owners";
const GameDetailTabs: TabItem[] = [
  {
    key: TAB_NFTS,
    title: "NFTs",
  },
  // {
  //   key: TAB_MARKETPLACE_FEED,
  //   title: "MARKETPLACE FEED",
  // },
  // {
  //   key: TAB_OWNERS,
  //   title: "owners",
  // },
];
const filterStatusOptions = ["All", "On Sale", "For Rental", "Blocked", "Rented"];

const isProd = process.env.REACT_APP_ENV === "prod";

export default function GameDetailPage() {
  const classes = gameDetailPageStyles();
  const tabsClasses = gameDetailTabsStyles();
  const filterClasses = useFilterSelectStyles();

  const history = useHistory();
  const width = useWindowDimensions().width;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const { collection_id }: { collection_id: string } = useParams();
  const [gameInfo, setGameInfo] = React.useState<any>(undefined);
  // const [keyword, setKeyword] = React.useState<string>("");
  const [nfts, setNfts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [lastId, setLastId] = React.useState<any>(undefined);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const [selectedTab, setSelectedTab] = React.useState<string>(TAB_NFTS);
  const [filterStatus, setFilterStatus] = React.useState<string>(filterStatusOptions[0]);
  const [openStatusSelect, setOpenStatusSelect] = React.useState<boolean>(false);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [isListView, setIsListView] = React.useState<boolean>(false);
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const loadingCount = React.useMemo(() => (width > 1000 ? 4 : width > 600 ? 1 : 2), [width]);

  React.useEffect(() => {
    loadGameInfo();
  }, []);

  React.useEffect(() => {
    setNfts([]);
    setLastId(undefined);
    setHasMore(true);
    loadNfts(true);
  }, [filterStatus, debouncedSearchValue]);

  const loadGameInfo = async () => {
    try {
      const res = await getGameInfo({ gameId: collection_id });
      if (res.success) {
        let gf = res.data;
        if (gf.Address) {
          gf.AddressShort =
            gf.Address?.substring(0, 5) +
            "..." +
            gf.Address?.substring(gf.Address?.length - 5, gf.Address?.length);
        }
        setGameInfo(gf);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadNfts = async (init = false) => {
    if (loading) return;
    try {
      setLoading(true);

      const status = filterStatus !== filterStatusOptions[0] ? filterStatus : undefined;
      const search = debouncedSearchValue ? debouncedSearchValue : undefined;

      const response = await getCharactersByGame({
        gameId: collection_id,
        lastId: init ? undefined : lastId,
        searchValue: search,
        mode: isProd ? "main" : "test",
        status,
      });
      if (response.success) {
        const newCharacters = response.data.list;
        const newLastId = response.data.lastId;
        const newhasMore = response.data.hasMore;

        setNfts(prev => (init ? newCharacters : [...prev, ...newCharacters]));
        setLastId(newLastId);
        setHasMore(newhasMore);
      } else {
        setNfts([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickProject = () => {
    window.open(gameInfo?.Project, "_blank");
  };

  const handleFilterStatus = e => {
    setLastId(undefined);
    setFilterStatus(e.target.value);
    setHasMore(true);
    setNfts([]);
  };

  return (
    <Box className={classes.root} id="scrollContainer">
      <Box
        className={classes.headerBG}
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: gameInfo?.Image
            ? `linear-gradient(180deg, rgba(21,21,21,0) 15%, rgba(21,21,21,1) 60%), url(${gameInfo.Image})`
            : `linear-gradient(180deg, rgba(21,21,21,0) 15%, rgba(21,21,21,1) 60%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#151515",
        }}
      />
      <Box className={classes.container}>
        <Box className={classes.fitContent} mb={isTablet ? 6 : 12}>
          <Box
            color="#FFFFFF"
            mb={4}
            style={{ width: "fit-content", cursor: "pointer" }}
            onClick={() => history.goBack()}
            display="flex"
            alignItems="center"
          >
            <ArrowIcon />
            <Box ml={1}>Back</Box>
          </Box>
          <Box className={classes.title} mb={2}>
            {gameInfo?.CollectionName}
          </Box>
          {gameInfo?.Chain && (
            <Box display="flex" flexDirection={"row"} alignItems={"center"} fontSize={isMobile ? 14 : 20}>
              <Box
                display="flex"
                alignItems="center"
                style={{ cursor: "pointer" }}
                onClick={handleClickProject}
              >
                <IconButton aria-label="">
                  <img src={require("assets/icons/net_world.png")} />
                </IconButton>
                <span>{gameInfo?.Project}</span>
              </Box>
              <div
                style={{
                  width: 3,
                  height: 24,
                  background: "rgba(255, 255, 255, 0.5)",
                  marginLeft: 20,
                  marginRight: 10,
                }}
              />
              <Box display="flex" alignItems="center">
                <IconButton aria-label="" style={{ cursor: "unset" }}>
                  <img src={getChainImageUrl(gameInfo?.Chain)} width={"22px"} />
                </IconButton>
                <span>{gameInfo?.Chain}</span>
              </Box>
            </Box>
          )}
          {isMobile ? (
            <Box>
              <Box className={classes.description} style={{ flex: isTablet ? 3 : 2.5 }}>
                <p>{gameInfo?.Description}</p>
              </Box>
            </Box>
          ) : (
            <Box display="flex" justifyContent="space-between">
              <Box className={classes.description} style={{ flex: isTablet ? 3 : 2.5 }}>
                <p>{gameInfo?.Description}</p>
              </Box>
            </Box>
          )}

          <TabsView
            tabs={GameDetailTabs}
            onSelectTab={tab => {
              setSelectedTab(tab.key);
            }}
            extendedClasses={tabsClasses}
          />

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width={1}
            mt={4}
            flexDirection={isMobile ? "column" : "row"}
          >
            <Box
              display="flex"
              alignItems="flex-end"
              flexWrap="wrap"
              width={isMobile ? 1 : "auto"}
              justifyContent={isMobile ? "flex-end" : "flex-start"}
            >
              <Select
                open={openStatusSelect}
                onClose={() => setOpenStatusSelect(false)}
                value={filterStatus}
                onChange={handleFilterStatus}
                className={classes.select}
                renderValue={(value: any) => (
                  <Box display="flex" alignItems="center" onClick={() => setOpenStatusSelect(true)}>
                    <label>STATUS&nbsp;&nbsp;</label>
                    <span>{value}</span>
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
                IconComponent={ArrowIconComponent(setOpenStatusSelect)}
              >
                {filterStatusOptions.map((status, index) => (
                  <MenuItem key={`filter-status-${index}`} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box className={classes.optionSection} mt={isMobile ? 1 : 0}>
              <div className={classes.filterButtonBox}>
                {showSearchBox && (
                  <InputWithLabelAndTooltip
                    type="text"
                    inputValue={searchValue}
                    placeHolder="Search"
                    onInputValueChange={e => {
                      setLastId(undefined);
                      setSearchValue(e.target.value);
                      setHasMore(true);
                      setNfts([]);
                    }}
                    style={{
                      background: "transparent",
                      margin: 0,
                      marginRight: 8,
                      marginLeft: 8,
                      padding: 0,
                      border: "none",
                      height: "auto",
                    }}
                    theme="dark"
                  />
                )}
                <Box
                  onClick={() => setShowSearchBox(prev => !prev)}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{ cursor: "pointer" }}
                >
                  <SearchIcon />
                </Box>
              </div>
              <Box
                className={classes.controlBox}
                ml={2}
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <SecondaryButton
                  className={`${classes.showButton} ${isListView ? classes.showButtonSelected : ""}`}
                  size="small"
                  onClick={() => setIsListView(true)}
                  isRounded
                >
                  <UnionIcon />
                </SecondaryButton>
                <PrimaryButton
                  className={`${classes.showButton} ${!isListView ? classes.showButtonSelected : ""}`}
                  size="small"
                  onClick={() => setIsListView(false)}
                  isRounded
                  style={{ marginLeft: 0 }}
                >
                  <DetailIcon />
                </PrimaryButton>
              </Box>
            </Box>
          </Box>

          {selectedTab === TAB_NFTS && (
            <Box
              className={classes.fitContent}
              style={{ paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}
            >
              <InfiniteScroll
                hasChildren={nfts?.length > 0}
                dataLength={nfts?.length}
                scrollableTarget={"scrollContainer"}
                next={loadNfts}
                hasMore={hasMore}
                loader={
                  loading && (
                    <Box mt={2}>
                      <MasonryGrid
                        gutter={"40px"}
                        data={Array(loadingCount).fill(0)}
                        renderItem={(_, index) => <GameMediaCard isLoading={true} key={`game_${index}`} />}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                      />
                    </Box>
                  )
                }
              >
                <Box mt={4}>
                  <MasonryGrid
                    gutter={"40px"}
                    data={nfts}
                    renderItem={item => <ExploreCard nft={item} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </Box>
              </InfiniteScroll>
              {!loading && nfts?.length < 1 && (
                <Box textAlign="center" width="100%" mb={10} mt={2}>
                  No NFTs
                </Box>
              )}
            </Box>
          )}
          {/* {selectedTab === TAB_MARKETPLACE_FEED && <MarketplaceFeed />}
          {selectedTab === TAB_OWNERS && <Owners />} */}
        </Box>
      </Box>
    </Box>
  );
}

export const ArrowIcon = ({ color = "white" }) => (
  <svg width="57" height="15" viewBox="0 0 57 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.29892 0.85612L7.15468 0.716853L7.01577 0.861441L0.855773 7.27344L0.72266 7.412L0.855773 7.55056L7.01577 13.9626L7.15218 14.1045L7.29628 13.9704L8.10828 13.2144L8.25661 13.0763L8.11656 12.9298L3.56791 8.172H55.756H55.956V7.972V6.852V6.652H55.756H3.56969L8.11618 1.92261L8.25449 1.77874L8.11092 1.64012L7.29892 0.85612Z"
      fill={color}
      stroke={color}
      strokeWidth="0.4"
    />
  </svg>
);

export const ArrowIconComponent = func => () =>
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
