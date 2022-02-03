import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

import { useMediaQuery, useTheme, Select, MenuItem, IconButton } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { getGameInfo, getCharactersByGame } from "shared/services/API/DreemAPI";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import TabsView, { TabItem } from "shared/ui-kit/TabsView";
import Owners from "./components/Owners";
import ExploreCard from "components/PriviMetaverse/components/cards/ExploreCard";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { NFT_STATUS_COLORS, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import SkeletonBox from "shared/ui-kit/SkeletonBox";
import { RootState } from "store/reducers/Reducer";
import { toDecimals } from "shared/functions/web3";
import MarketplaceFeed from "./components/MarketplaceFeed";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import {
  setTokenList,
  setCollectionNFTList,
  setScrollPositionInCollection,
  setAllNFTList,
  setScrollPositionInAllNFT,
} from "store/actions/MarketPlace";
import { setRealmsList, setScrollPositionInRealms } from "store/actions/Realms";
import { NftStates } from "shared/constants/constants";
import { getDefaultBGImage } from "shared/services/user/getUserAvatar";
import TotalStats from "./components/TotalStats";
import RecentTransactions from "./components/RecentTransactions";
import { gameDetailPageStyles, gameDetailTabsStyles, useFilterSelectStyles } from "./index.styles";

const SECONDS_PER_HOUR = 3600;

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4,
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
const filterStatusOptions = ["All", ...NftStates];

const tableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Name",
    headerAlign: "left",
  },
  {
    headerName: "Owner",
    headerAlign: "center",
  },
  {
    headerName: "Status",
    headerAlign: "center",
  },
  {
    headerName: "Direct Purchase",
    headerAlign: "center",
  },
  {
    headerName: "Block to Buy Later",
    headerAlign: "center",
  },
  {
    headerName: "Rental Fee (per hour)",
    headerAlign: "center",
  },
];

const isProd = process.env.REACT_APP_ENV === "prod";

export default function GameDetailPage() {
  const classes = gameDetailPageStyles();
  const tabsClasses = gameDetailTabsStyles();
  const filterClasses = useFilterSelectStyles();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const collectionNFTList = useSelector((state: RootState) => state.marketPlace.collectionNFTList);
  const scrollPosition = useSelector((state: RootState) => state.marketPlace.scrollPositionInCollection);

  const history = useHistory();
  const width = useWindowDimensions().width;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const breakTwo = useMediaQuery(theme.breakpoints.up(700));
  const breakThree = useMediaQuery(theme.breakpoints.up(1200));
  const breakFour = useMediaQuery(theme.breakpoints.up(1440));

  const { collection_id }: { collection_id: string } = useParams();
  const [gameInfo, setGameInfo] = React.useState<any>(undefined);

  const [nfts, setNfts] = React.useState<any[]>(collectionNFTList || []);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [lastId, setLastId] = React.useState<any>(undefined);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const [selectedTab, setSelectedTab] = React.useState<string>(TAB_NFTS);
  const [filterStatus, setFilterStatus] = React.useState<string>(filterStatusOptions[0]);
  const [openStatusSelect, setOpenStatusSelect] = React.useState<boolean>(false);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [isListView, setIsListView] = React.useState<boolean>(false);
  const [openDescription, setOpenDescription] = React.useState<boolean>(false);
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const loadingCount = React.useMemo(() => (width > 1000 ? 4 : width > 600 ? 1 : 2), [width]);

  const getTokenList = async () => {
    getAllTokenInfos().then(res => {
      if (res.success) {
        dispatch(setTokenList(res.tokens.filter(t => t.Symbol === "USDT")));
      }
    });
  };

  React.useEffect(() => {
    //initialize store
    dispatch(setAllNFTList([]));
    dispatch(setRealmsList([]));
    dispatch(setScrollPositionInAllNFT(0));
    dispatch(setScrollPositionInRealms(0));
  }, []);

  React.useEffect(() => {
    loadGameInfo();
    getTokenList();
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
        const newLastId = response.data.list[response.data.list.length - 1].id;
        const newhasMore = response.data.hasMore;

        setNfts(prev => (init ? newCharacters : [...prev, ...newCharacters]));
        dispatch(setCollectionNFTList([...collectionNFTList, ...newCharacters]));
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

  const nftStatus = nft => {
    if (!nft) {
      return [];
    }
    if (nft.status) {
      return (Array.isArray(nft.status) ? nft.status : [nft.status]).filter(s => NftStates.includes(s));
    }

    return [];
  };

  const userName = nft => {
    if (!nft) "";

    if (!nft.owner) {
      if (nft.ownerAddress.toLowerCase() === user.address.toLowerCase()) {
        return user.firstName || user.lastName
          ? `${user.firstName} ${user.lastName}`
          : width > 700
          ? nft.ownerAddress
          : nft.ownerAddress.substr(0, 5) + "..." + nft.ownerAddress.substr(nft.ownerAddress.length - 5, 5) ??
            "";
      }
      return width > 700
        ? nft.ownerAddress
        : nft.ownerAddress.substr(0, 5) + "..." + nft.ownerAddress.substr(nft.ownerAddress.length - 5, 5) ??
            "";
    } else {
      let name: string = "";
      name =
        nft.owner.firstName || nft.owner.lastName
          ? `${nft.owner.firstName} ${nft.owner.lastName}`
          : width > 700
          ? nft.ownerAddress
          : nft.ownerAddress.substr(0, 5) + "..." + nft.ownerAddress.substr(nft.ownerAddress.length - 5, 5) ??
            "";

      return name;
    }
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

  const tableData = React.useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (nfts && nfts.length) {
      data = nfts.map(row => {
        return [
          {
            rawData: row,
            cell: (
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box className={classes.listNFTImage}>
                  <SkeletonBox
                    width="100%"
                    height="100%"
                    image={row.image}
                    style={{
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: isMobile ? "6px" : "8px",
                    }}
                  />
                </Box>
                <Box mx={isMobile ? 1 : 2} width={isMobile ? 120 : 245} fontSize={16} fontWeight={800}>
                  {row.name}
                </Box>
              </Box>
            ),
          },
          {
            cell: (
              <Box color="#ffffff70" textAlign="center">
                {userName(row)}
              </Box>
            ),
          },
          {
            cell: (
              <Box display="flex">
                {nftStatus(row).length > 0 &&
                  nftStatus(row).map(status => (
                    <span
                      className={classes.cardOptionButton}
                      style={{ background: NFT_STATUS_COLORS[status] }}
                    >
                      {status}
                    </span>
                  ))}
              </Box>
            ),
          },
          {
            cell: (
              <Box textAlign="center">
                {row?.sellingOffer?.Price
                  ? `${row.sellingOffer.Price} ${getTokenSymbol(row.sellingOffer.PaymentToken)}`
                  : "_"}
              </Box>
            ),
          },
          {
            cell: (
              <Box textAlign="center">
                {!nftStatus(row).includesrow?.blockingSaleOffer?.Price
                  ? `${row.blockingSaleOffer.Price} ${getTokenSymbol(
                      row.blockingSaleOffer.PaymentToken
                    )} for ${row.blockingSaleOffer.ReservePeriod} Day(s)`
                  : "_"}
              </Box>
            ),
          },
          {
            cell: (
              <Box textAlign="center">
                {row?.rentSaleOffer?.pricePerSecond * SECONDS_PER_HOUR
                  ? `${(
                      +toDecimals(
                        row.rentSaleOffer.pricePerSecond,
                        getTokenDecimal(row.rentSaleOffer.fundingToken)
                      ) * SECONDS_PER_HOUR
                    ).toFixed(2)} ${getTokenSymbol(row.rentSaleOffer.fundingToken)}`
                  : "_"}
              </Box>
            ),
          },
        ];
      });
    }

    return data;
  }, [nfts]);

  const handleFilterStatus = e => {
    setLastId(undefined);
    setFilterStatus(e.target.value);
    setHasMore(true);
    setNfts([]);
  };

  const nftListWithSkeleton = React.useMemo(() => {
    if (hasMore) {
      let addedCount = 1;
      if (breakFour) {
        addedCount = 4 - (nfts.length % 4);
      } else if (breakThree) {
        addedCount = 3 - (nfts.length % 3);
      } else if (breakTwo) {
        addedCount = 2 - (nfts.length % 2);
      }

      const result = [...nfts];
      for (let index = 0; index < addedCount; index++) {
        result.push({});
      }

      return result;
    } else {
      return nfts;
    }
  }, [nfts, hasMore, breakTwo, breakThree, breakFour]);

  const handleScroll = e => {
    dispatch(setScrollPositionInCollection(e.target.scrollTop));
  };

  const handleOpenExplore = row => {
    if (!row || !row[0].rawData) return;

    const nft = row[0].rawData;
    history.push(`/gameNFTS/${nft.collectionId}/${nft.tokenId}`);
  };

  return (
    <Box className={classes.root} id="scrollContainer" onScroll={handleScroll}>
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
          <Box display={"flex"} alignItems={"center"} mb={4}>
            <img
              src={gameInfo?.Image || getDefaultBGImage()}
              className={classes.gameInfoImg}
              alt="game info image"
            />
            <Box display={"flex"} flexDirection={"column"} ml={7}>
              <Box className={classes.title} mb={3}>
                {gameInfo?.CollectionName}
              </Box>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                maxWidth={580}
                mb={3}
              >
                <Box display={"flex"} alignItems={"center"}>
                  <Box mr={0.5}>{`Collection ID: ${gameInfo?.AddressShort || "xxx"}`}</Box>
                  <LinkIcon />
                </Box>
                <Box width={"1px"} height={"8px"} bgcolor={"rgba(255, 255, 255, 0.15)"} />
                <Box display={"flex"} alignItems={"center"}>
                  <CopyIcon />
                  <Box ml={0.5}>{`${gameInfo?.Count || 0} minted`}</Box>
                </Box>
                <Box width={"1px"} height={"8px"} bgcolor={"rgba(255, 255, 255, 0.15)"} />
                <Box display={"flex"} alignItems={"center"}>
                  <ProfileUserIcon />
                  <Box ml={0.5}>30 owners</Box>
                </Box>
              </Box>
              <Box width={"738px"} height={"2px"} bgcolor="#FFFFFF10" />
              {gameInfo?.Chain && (
                <>
                  <Box display="flex" alignItems="center" my={2}>
                    <IconButton aria-label="" style={{ cursor: "unset" }}>
                      <img src={getChainImageUrl(gameInfo?.Chain)} width={"22px"} />
                    </IconButton>
                    <span>{gameInfo?.Chain}</span>
                  </Box>
                  <Box width={"738px"} height={"2px"} bgcolor="#FFFFFF10" />
                </>
              )}
              <Box className={classes.description}>
                {gameInfo?.Description && gameInfo?.Description.length > 140
                  ? gameInfo?.Description.substr(0, 140) + " ..."
                  : gameInfo?.Description}
              </Box>
              <Box className={classes.fullDescItem} onClick={() => setOpenDescription(true)}>
                <Box mr={"10px"}>Full Description</Box>
                <DownArrowIcon />
              </Box>
              {openDescription && (
                <Box className={classes.fullDescPanel}>
                  <Box>{gameInfo?.Description}</Box>
                  <Box className={classes.fullDescItem} onClick={() => setOpenDescription(false)} mt={3}>
                    <Box mr={"10px"}>Hide Description</Box>
                    <UpArrowIcon />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box display={"flex"} alignItems={"center"} my={3.5}>
            <Box width={"55%"} mr={1.5}>
              <TotalStats />
            </Box>
            <Box width={"calc(45% - 12px)"}>
              <RecentTransactions />
            </Box>
          </Box>
          <TabsView
            tabs={GameDetailTabs}
            onSelectTab={tab => {
              setSelectedTab(tab.key);
            }}
            extendedClasses={tabsClasses}
          />
          {selectedTab === TAB_NFTS && (
            <>
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
                  initialScrollY={scrollPosition - 100}
                  loader={
                    loading &&
                    isListView && (
                      <div
                        style={{
                          paddingTop: 8,
                          paddingBottom: 8,
                        }}
                      >
                        {Array(loadingCount)
                          .fill(0)
                          .map((_, index) => (
                            <Box className={classes.listLoading} mb={1.5} key={`listLoading_${index}`}>
                              <Skeleton variant="rect" width={60} height={60} />
                              <Skeleton
                                variant="rect"
                                width="40%"
                                height={24}
                                style={{ marginLeft: "8px" }}
                              />
                              <Skeleton
                                variant="rect"
                                width="20%"
                                height={24}
                                style={{ marginLeft: "8px" }}
                              />
                              <Skeleton
                                variant="rect"
                                width="20%"
                                height={24}
                                style={{ marginLeft: "8px" }}
                              />
                            </Box>
                          ))}
                      </div>
                    )
                  }
                >
                  {isListView ? (
                    tableData.length > 0 && (
                      <div className={classes.table}>
                        <CustomTable
                          headers={tableHeaders}
                          rows={tableData}
                          placeholderText=""
                          theme="dreem"
                          onClickRow={handleOpenExplore}
                        />
                      </div>
                    )
                  ) : (
                    <Box mt={4} px={1}>
                      <MasonryGrid
                        gutter={"40px"}
                        data={nftListWithSkeleton}
                        renderItem={item => (
                          <ExploreCard nft={item} isLoading={Object.entries(item).length === 0} />
                        )}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                      />
                    </Box>
                  )}
                </InfiniteScroll>
                {!loading && nfts?.length < 1 && (
                  <Box textAlign="center" width="100%" mb={10} mt={2}>
                    No NFTs
                  </Box>
                )}
              </Box>
            </>
          )}
          {selectedTab === TAB_MARKETPLACE_FEED && <MarketplaceFeed Chain={gameInfo.Chain} />}
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

export const LinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.5 14.75H10C9.59 14.75 9.25 14.41 9.25 14C9.25 13.59 9.59 13.25 10 13.25H12.5C15.12 13.25 17.25 11.12 17.25 8.5C17.25 5.88 15.12 3.75 12.5 3.75H7.5C4.88 3.75 2.75 5.88 2.75 8.5C2.75 9.6 3.14 10.67 3.84 11.52C4.1 11.84 4.06 12.31 3.74 12.58C3.42 12.84 2.95 12.8 2.68 12.48C1.76 11.36 1.25 9.95 1.25 8.5C1.25 5.05 4.05 2.25 7.5 2.25H12.5C15.95 2.25 18.75 5.05 18.75 8.5C18.75 11.95 15.95 14.75 12.5 14.75Z"
      fill="white"
      stroke="white"
      stroke-width="0.5"
    />
    <path
      d="M16.5 21.75H11.5C8.05 21.75 5.25 18.95 5.25 15.5C5.25 12.05 8.05 9.25 11.5 9.25H14C14.41 9.25 14.75 9.59 14.75 10C14.75 10.41 14.41 10.75 14 10.75H11.5C8.88 10.75 6.75 12.88 6.75 15.5C6.75 18.12 8.88 20.25 11.5 20.25H16.5C19.12 20.25 21.25 18.12 21.25 15.5C21.25 14.4 20.86 13.33 20.16 12.48C19.9 12.16 19.94 11.69 20.26 11.42C20.58 11.15 21.05 11.2 21.32 11.52C22.25 12.64 22.76 14.05 22.76 15.5C22.75 18.95 19.95 21.75 16.5 21.75Z"
      fill="white"
      stroke="white"
      stroke-width="0.5"
    />
  </svg>
);

export const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.3337 10.7513V14.2513C13.3337 17.168 12.167 18.3346 9.25033 18.3346H5.75033C2.83366 18.3346 1.66699 17.168 1.66699 14.2513V10.7513C1.66699 7.83464 2.83366 6.66797 5.75033 6.66797H9.25033C12.167 6.66797 13.3337 7.83464 13.3337 10.7513Z"
      fill="white"
    />
    <path
      d="M14.2498 1.66797H10.7498C8.24635 1.66797 7.03822 2.53362 6.74575 4.61705C6.66834 5.16855 7.1298 5.6263 7.68671 5.6263H9.2498C12.7498 5.6263 14.3748 7.2513 14.3748 10.7513V12.3144C14.3748 12.8713 14.8326 13.3328 15.3841 13.2554C17.4675 12.9629 18.3331 11.7548 18.3331 9.2513V5.7513C18.3331 2.83464 17.1665 1.66797 14.2498 1.66797Z"
      fill="white"
    />
  </svg>
);

export const ProfileUserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.50033 1.66797C5.31699 1.66797 3.54199 3.44297 3.54199 5.6263C3.54199 7.76797 5.21699 9.5013 7.40033 9.5763C7.46699 9.56797 7.53366 9.56797 7.58366 9.5763C7.60033 9.5763 7.60866 9.5763 7.62533 9.5763C7.63366 9.5763 7.63366 9.5763 7.64199 9.5763C9.77533 9.5013 11.4503 7.76797 11.4587 5.6263C11.4587 3.44297 9.68366 1.66797 7.50033 1.66797Z"
      fill="white"
    />
    <path
      d="M11.7338 11.7914C9.40879 10.2414 5.61712 10.2414 3.27546 11.7914C2.21712 12.4997 1.63379 13.4581 1.63379 14.4831C1.63379 15.5081 2.21712 16.4581 3.26712 17.1581C4.43379 17.9414 5.96712 18.3331 7.50046 18.3331C9.03379 18.3331 10.5671 17.9414 11.7338 17.1581C12.7838 16.4497 13.3671 15.4997 13.3671 14.4664C13.3588 13.4414 12.7838 12.4914 11.7338 11.7914Z"
      fill="white"
    />
    <path
      d="M16.6588 6.11512C16.7921 7.73179 15.6421 9.14846 14.0505 9.34012C14.0421 9.34012 14.0421 9.34012 14.0338 9.34012H14.0088C13.9588 9.34012 13.9088 9.34012 13.8671 9.35679C13.0588 9.39845 12.3171 9.14012 11.7588 8.66512C12.6171 7.89845 13.1088 6.74846 13.0088 5.49846C12.9505 4.82346 12.7171 4.20679 12.3671 3.68179C12.6838 3.52346 13.0505 3.42346 13.4255 3.39012C15.0588 3.24846 16.5171 4.46512 16.6588 6.11512Z"
      fill="white"
    />
    <path
      d="M18.3249 13.8266C18.2582 14.635 17.7415 15.335 16.8749 15.81C16.0415 16.2683 14.9915 16.485 13.9499 16.46C14.5499 15.9183 14.8999 15.2433 14.9665 14.5266C15.0499 13.4933 14.5582 12.5016 13.5749 11.71C13.0165 11.2683 12.3665 10.9183 11.6582 10.66C13.4999 10.1266 15.8165 10.485 17.2415 11.635C18.0082 12.2516 18.3999 13.0266 18.3249 13.8266Z"
      fill="white"
    />
  </svg>
);

export const DownArrowIcon = () => (
  <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1.01663L5.19385 5.21097L9.61575 0.789062"
      stroke="#E9FF26"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const UpArrowIcon = () => (
  <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 4.98337L5.19385 0.789032L9.61575 5.21094"
      stroke="#E9FF26"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
