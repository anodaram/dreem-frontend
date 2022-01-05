import React from "react";
import { useHistory, useParams } from "react-router-dom";
// import { useDebounce } from "use-debounce/lib";
import InfiniteScroll from "react-infinite-scroll-component";

import { useMediaQuery, useTheme } from "@material-ui/core";
import { IconButton } from "@material-ui/core";

import GameMediaCard from "components/PriviMetaverse/components/cards/GameMediaCard";
import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { getGameInfo, getCharactersByGame } from "shared/services/API/DreemAPI";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import TabsView, { TabItem } from "shared/ui-kit/TabsView";
import { gameDetailPageStyles, gameDetailTabsStyles } from "./index.styles";
import MarketplaceFeed from "./components/MarketplaceFeed";
import Owners from "./components/Owners";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  900: 3,
  1200: 4,
};

const TAB_NFTS = "nfts";
const TAB_MARKETPLACE_FEED = "marketplace_feed";
const TAB_OWNERS = "owners";

const GameDetailTabs: TabItem[] = [
  {
    key: TAB_NFTS,
    title: "NFTs",
  },
  {
    key: TAB_MARKETPLACE_FEED,
    title: "MARKETPLACE FEED",
  },
  {
    key: TAB_OWNERS,
    title: "owners",
  },
];

export default function GameDetailPage() {
  const classes = gameDetailPageStyles();
  const tabsClasses = gameDetailTabsStyles();

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

  // const [debouncedKeyword] = useDebounce(keyword, 500);

  const loadingCount = React.useMemo(() => (width > 1000 ? 4 : width > 600 ? 1 : 2), [width]);

  React.useEffect(() => {
    loadGameInfo();
  }, []);

  React.useEffect(
    () => {
      setNfts([]);
      setLastId(undefined);
      setHasMore(true);
      loadNfts(true);
    },
    [
      /*debouncedKeyword*/
    ]
  );

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
      const response = await getCharactersByGame({
        gameId: collection_id,
        lastId: init ? undefined : lastId,
        searchValue: "", // debouncedKeyword,
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
                    renderItem={(item, index) => (
                      <GameMediaCard item={item} gameInfo={gameInfo} key={`game_${index}`} />
                    )}
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
          {selectedTab === TAB_MARKETPLACE_FEED && <MarketplaceFeed />}
          {selectedTab === TAB_OWNERS && <Owners />}
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
