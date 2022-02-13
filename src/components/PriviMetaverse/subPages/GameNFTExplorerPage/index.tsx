import React, { useState, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce/lib";
import InfiniteScroll from "react-infinite-scroll-component";

import { useTheme, useMediaQuery, Select, MenuItem } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { RootState } from "store/reducers/Reducer";
import {
  setTokenList,
  setCollectionNFTList,
  setAllNFTList,
  setScrollPositionInCollection,
  setScrollPositionInAllNFT,
} from "store/actions/MarketPlace";
import { setRealmsList, setScrollPositionInRealms } from "store/actions/Realms";
import MetaverseCard from "components/PriviMetaverse/components/cards/MetaverseCard";
import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { NFT_STATUS_COLORS, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { getAllGameNFTs } from "shared/services/API/ReserveAPI";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { toDecimals } from "shared/functions/web3";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import SkeletonBox from "shared/ui-kit/SkeletonBox";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import TabsView, { TabItem } from "shared/ui-kit/TabsView";
import { NftStates } from "shared/constants/constants";
import ExploreCard from "../../components/cards/ExploreCard";
import HowWorksOfMarketPlaceModal from "../../modals/HowWorksOfMarketPlaceModal";
import {
  useFilterSelectStyles,
  useFilterSelectWithCommingSoonStyles,
  useNFTOptionsStyles,
  useTabsStyles,
} from "./index.styles";

import { ReactComponent as BinanceIcon } from "assets/icons/bsc.svg";
import { ReactComponent as PolygonIcon } from "assets/icons/polygon.svg";
import { ReactComponent as SolanaIcon } from "assets/icons/solana.svg";
import { userTrackMarketPlace } from "shared/services/API";
import { GameSlider } from "components/PriviMetaverse/components/GameSlider";
import Axios, { CancelTokenSource } from "axios";

const isProd = process.env.REACT_APP_ENV === "prod";

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  400: 1,
  700: 2,
  1200: 3,
};

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4,
};

const SECONDS_PER_HOUR = 3600;
const PAGE_SIZE = 8;

const TAB_NFTS = "nfts";
const TAB_EXPLORE_COLLECTIONS = "explore_collections";

const FilterOptionsTabs: TabItem[] = [
  {
    key: TAB_NFTS,
    title: "All NFTs",
  },
  {
    key: TAB_EXPLORE_COLLECTIONS,
    title: "explore by collections",
  },
];

const filterChainOptions = ["All", "BSC", "Polygon", "SOLANA"];
const filterStatusOptions = ["All", ...NftStates];

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

const getChainImage = chain => {
  if (chain === filterChainOptions[1]) {
    return <BinanceIcon />;
  } else if (chain === filterChainOptions[2]) {
    return <PolygonIcon />;
  } else if (chain === filterChainOptions[3]) {
    return <SolanaIcon />;
  } else {
    return null;
  }
};

export const ArrowIcon = func => () => (
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

const GameNFTExplorerPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isSignedin } = useAuth();
  const classes = useNFTOptionsStyles();
  const filterClasses = useFilterSelectStyles();
  const filterWithComingSoonClasses = useFilterSelectWithCommingSoonStyles();
  const tabsClasses = useTabsStyles();

  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const selTab = useSelector((state: RootState) => state.marketPlace.selectedTabMarketMain);
  const user = useSelector((state: RootState) => state.user);
  const allNFTList = useSelector((state: RootState) => state.marketPlace.allNFTList);
  const scrollPosition = useSelector((state: RootState) => state.marketPlace.scrollPositionInAllNFT);

  const width = useWindowDimensions().width;
  const loadingCount = useMemo(() => (width > 1440 ? 4 : width > 700 ? 3 : width > 400 ? 2 : 1), [width]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const breakTwo = useMediaQuery(theme.breakpoints.up(700));
  const breakThree = useMediaQuery(theme.breakpoints.up(1200));
  const breakFour = useMediaQuery(theme.breakpoints.up(1440));

  const [exploreMetaverses, setExploreMetaverses] = useState<any[]>([]);
  const [reservedNftList, setReservedNftList] = useState<any[]>(allNFTList || []);

  const lastNFTId = useRef();
  const lastCollectionId = useRef();
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreCollections, setHasMoreCollections] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(false);
  const [isListView, setIsListView] = useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<string>(selTab || TAB_NFTS);

  const [showSearchBox, setShowSearchBox] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const [filterChain, setFilterChain] = useState<string>(filterChainOptions[0]);
  const [filterStatus, setFilterStatus] = useState<string>(filterStatusOptions[0]);

  const [isFilterChain, setIsFilterChain] = useState<boolean>(false);
  const [isFilterStatus, setIsFilterStatus] = useState<boolean>(false);
  const [openChainSelect, setOpenChainSelect] = useState<boolean>(false);
  const [openStatusSelect, setOpenStatusSelect] = useState<boolean>(false);

  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);

  const getAllGameNFTsRef = useRef<CancelTokenSource | undefined>();

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

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const getTokenDecimal = addr => {
    if (tokenList.length == 0 || !addr) return 0;
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
    if (isSignedin) {
      userTrackMarketPlace();
    }
  }, [isSignedin]);

  useEffect(() => {
    if (selectedTab === TAB_NFTS) {
      setHasMore(true);
      getData(true);
    } else {
      setHasMoreCollections(true);
      setExploreMetaverses([]);
      getCollectionData(true);
    }
  }, [filterChain, filterStatus, debouncedSearchValue, selectedTab]);

  const getTokenList = async () => {
    getAllTokenInfos().then(res => {
      if (res.success) {
        dispatch(setTokenList(res.tokens.filter(t => t.Symbol === "USDT")));
      }
    });
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
    if (!nft.owner) {
      if (nft.ownerAddress?.toLowerCase() === user.address.toLowerCase()) {
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

  const getData = async (isInit = false) => {
    if (!isInit && (!hasMore || loading)) return;

    if (getAllGameNFTsRef.current) {
      getAllGameNFTsRef.current.cancel();
    }

    const network = filterChain !== filterChainOptions[0] ? filterChain : undefined;
    const status = filterStatus !== filterStatusOptions[0] ? filterStatus : undefined;
    const search = debouncedSearchValue ? debouncedSearchValue : undefined;

    try {
      setLoading(true);

      getAllGameNFTsRef.current = Axios.CancelToken.source();
      const response = await getAllGameNFTs(
        {
          mode: isProd ? "main" : "test",
          network,
          status,
          search,
          lastNFTId: isInit ? undefined : lastNFTId.current,
          lastCollectionId: lastCollectionId.current,
          pageSize: PAGE_SIZE,
        },
        getAllGameNFTsRef?.current?.token
      );

      const newNfts = response.nfts;

      if (!lastNFTId.current || isInit) {
        setReservedNftList([...newNfts]);
      } else {
        setReservedNftList([...reservedNftList, ...newNfts]);
      }
      dispatch(setAllNFTList([...allNFTList, ...newNfts]));
      setHasMore(newNfts.length == PAGE_SIZE);
      if (newNfts.length) {
        lastNFTId.current = newNfts[newNfts.length - 1].RandomId;
        lastCollectionId.current = newNfts[newNfts.length - 1].collectionId;
      }
    } catch (err) {}
    setLoading(false);
  };

  const getCollectionData = (isInit = false) => {
    if (!isInit && (!hasMoreCollections || loadingCollections)) return;

    setLoadingCollections(true);
    MetaverseAPI.getNftGames(
      isInit ? "" : lastNFTId.current ?? "",
      debouncedSearchValue,
      filterChain === "All" ? "ALL" : filterChain
    )
      .then(res => {
        if (res && res.success) {
          const items = res.data.items;
          setExploreMetaverses(prev => (isInit ? items : [...prev, ...items]));
          setHasMoreCollections(res.data.hasMore);
          lastNFTId.current = res.data.lastId;
        }
      })
      .finally(() => setLoadingCollections(false));
  };

  const tableData = useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (reservedNftList && reservedNftList.length) {
      data = reservedNftList.map(row => {
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
                {!nftStatus(row).includes("Blocked") && row?.sellingOffer?.Price
                  ? `${row.sellingOffer.Price} ${getTokenSymbol(row.sellingOffer.PaymentToken)}`
                  : "_"}
              </Box>
            ),
          },
          {
            cell: (
              <Box textAlign="center">
                {!nftStatus(row).includes("Blocked") && row?.blockingSaleOffer?.Price
                  ? `${row.blockingSaleOffer.Price} ${getTokenSymbol(
                      row.blockingSaleOffer.PaymentToken
                    )} for ${row.blockingSaleOffer.ReservePeriod} Hour(s)`
                  : "_"}
              </Box>
            ),
          },
          {
            cell: (
              <Box textAlign="center">
                {!nftStatus(row).includes("Blocked") && row?.rentSaleOffer?.pricePerSecond * SECONDS_PER_HOUR
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
  }, [reservedNftList]);

  const handleScroll = e => {
    dispatch(setScrollPositionInAllNFT(e.target.scrollTop));
  };

  const handleFilterChain = e => {
    if (e.target.value === "SOLANA") {
      return;
    }
    lastCollectionId.current = undefined;
    setIsFilterStatus(false);
    setIsFilterChain(true);
    setFilterChain(e.target.value);
    setHasMore(true);
    setReservedNftList([]);
  };

  const handleFilterStatus = e => {
    lastCollectionId.current = undefined;
    setIsFilterStatus(true);
    setIsFilterChain(false);
    setFilterStatus(e.target.value);
    setHasMore(true);
    setReservedNftList([]);
  };

  const handleOpenExplore = row => {
    if (!row || !row[0].rawData) return;

    const nft = row[0].rawData;
    history.push(`/P2E/${nft.collectionId}/${nft.tokenId}`);
  };

  const nftListWithSkeleton = useMemo(() => {
    if (hasMore) {
      let addedCount = 1;
      if (breakFour) {
        addedCount = 4 - (reservedNftList.length % 4);
      } else if (breakThree) {
        addedCount = 3 - (reservedNftList.length % 3);
      } else if (breakTwo) {
        addedCount = 2 - (reservedNftList.length % 2);
      }

      const result = [...reservedNftList];
      for (let index = 0; index < addedCount; index++) {
        result.push({});
      }

      return result;
    } else {
      return reservedNftList;
    }
  }, [reservedNftList, hasMore, breakTwo, breakThree, breakFour]);

  const collectionListWithSkeleton = useMemo(() => {
    if (hasMoreCollections) {
      let addedCount = 1;
      if (breakThree) {
        addedCount = 3 - (exploreMetaverses.length % 3);
      } else if (breakTwo) {
        addedCount = 2 - (exploreMetaverses.length % 2);
      }

      const result = [...exploreMetaverses];
      for (let index = 0; index < addedCount; index++) {
        result.push({});
      }

      return result;
    } else {
      return exploreMetaverses;
    }
  }, [exploreMetaverses, hasMoreCollections, breakTwo, breakThree]);

  return (
    <>
      <Box className={classes.main}>
        <img src={require("assets/metaverseImages/gamenft_explorer_bg.png")} className={classes.imageBg} />
        <img src={require("assets/metaverseImages/rectangle_yellow_left.png")} className={classes.image1} />
        <img src={require("assets/metaverseImages/rectangle_yellow_top.png")} className={classes.image2} />
        <Box className={classes.limitedContent}>
          <div className={classes.content} id={"scrollContainer"} onScroll={handleScroll}>
            {!isMobile && (
              <Box
                color="white"
                mb={4}
                style={{ width: "fit-content", cursor: "pointer" }}
                onClick={() => history.goBack()}
                display="flex"
                alignItems="center"
              >
                <ArrowSvgIcon />
                <Box ml={1}>Back</Box>
              </Box>
            )}
            <Box className={classes.title}>Explore all NFTS</Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width={1}
              mt={isMobile ? 3 : 6}
              flexDirection={isMobile ? "column" : "row"}
            >
              <Box
                display="flex"
                alignItems="flex-end"
                flexWrap="wrap"
                width={isMobile ? 1 : "auto"}
                justifyContent={isMobile ? "space-between" : "flex-start"}
              >
                <Select
                  open={openChainSelect}
                  onClose={() => setOpenChainSelect(false)}
                  value={filterChain}
                  onChange={handleFilterChain}
                  className={`${classes.select} ${isFilterChain ? classes.filterActive : ""}`}
                  renderValue={(value: any) => (
                    <Box display="flex" alignItems="center" onClick={() => setOpenChainSelect(true)}>
                      <Box component="label" display="flex" alignItems="center">
                        CHAIN:&nbsp;
                        {getChainImage(value)}
                        &nbsp;&nbsp;
                      </Box>
                      <span>{value}</span>
                    </Box>
                  )}
                  MenuProps={{
                    classes: filterWithComingSoonClasses,
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
                      {chain === "SOLANA" && <span className={classes.comingsoon}>coming soon</span>}
                    </MenuItem>
                  ))}
                </Select>
                {selectedTab === TAB_NFTS && (
                  <Select
                    open={openStatusSelect}
                    onClose={() => setOpenStatusSelect(false)}
                    value={filterStatus}
                    onChange={handleFilterStatus}
                    className={classes.select}
                    renderValue={(value: any) => (
                      <Box display="flex" alignItems="center" onClick={() => setOpenStatusSelect(true)}>
                        <label>TYPE&nbsp;&nbsp;</label>
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
                    IconComponent={ArrowIcon(setOpenStatusSelect)}
                  >
                    {filterStatusOptions.map((status, index) => (
                      <MenuItem key={`filter-status-${index}`} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Box>
              <Box className={classes.optionSection} mt={isMobile ? 1 : 0}>
                <div className={classes.filterButtonBox}>
                  {showSearchBox && (
                    <InputWithLabelAndTooltip
                      type="text"
                      inputValue={searchValue}
                      placeHolder="Search"
                      onInputValueChange={e => {
                        setSearchValue(e.target.value);
                        setHasMore(true);
                        setReservedNftList([]);
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
                {selectedTab === TAB_NFTS && (
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
                )}
              </Box>
            </Box>
            <div className={classes.explorerContent}>
              {selectedTab === TAB_NFTS ? (
                <InfiniteScroll
                  hasChildren={reservedNftList?.length > 0}
                  dataLength={reservedNftList?.length}
                  scrollableTarget={"scrollContainer"}
                  next={getData}
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
                    <Box sx={{ flexGrow: 1, width: "100%" }}>
                      <MasonryGrid
                        gutter={"24px"}
                        data={nftListWithSkeleton}
                        renderItem={item => (
                          <ExploreCard nft={item} isLoading={Object.entries(item).length === 0} />
                        )}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                      />
                    </Box>
                  )}
                </InfiniteScroll>
              ) : (
                <InfiniteScroll
                  hasChildren={exploreMetaverses?.length > 0}
                  dataLength={exploreMetaverses?.length}
                  scrollableTarget={"scrollContainer"}
                  next={getCollectionData}
                  hasMore={hasMoreCollections}
                  // initialScrollY={scrollPosition - 100}
                  loader={<></>}
                >
                  <Box sx={{ flexGrow: 1, width: "100%" }}>
                    <MasonryGrid
                      gutter={"40px"}
                      data={collectionListWithSkeleton}
                      renderItem={(item, index) => (
                        <MetaverseCard
                          item={item}
                          key={`game_${index}`}
                          isLoading={Object.entries(item).length === 0}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                    />
                  </Box>
                </InfiniteScroll>
              )}
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

export default GameNFTExplorerPage;

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

export const ArrowSvgIcon = ({ color = "white" }) => (
  <svg width="57" height="15" viewBox="0 0 57 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.29892 0.85612L7.15468 0.716853L7.01577 0.861441L0.855773 7.27344L0.72266 7.412L0.855773 7.55056L7.01577 13.9626L7.15218 14.1045L7.29628 13.9704L8.10828 13.2144L8.25661 13.0763L8.11656 12.9298L3.56791 8.172H55.756H55.956V7.972V6.852V6.652H55.756H3.56969L8.11618 1.92261L8.25449 1.77874L8.11092 1.64012L7.29892 0.85612Z"
      fill={color}
      stroke={color}
      strokeWidth="0.4"
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
    <path
      d="M10.8333 1.70412C9.27875 0.182038 5.655 -0.430045 3.61292 1.75829C1.61417 3.89245 0 9.03775 0 13.8916C0 19.7476 4.9075 20.5601 7.58333 17.6833C9.1325 16.015 9.27875 15.7544 10.2917 14.4333H15.7083C16.7267 15.7544 16.8675 16.015 18.4167 17.6833C21.092 20.5601 26 19.7476 26 13.8916C26 9.03775 24.3858 3.89245 22.3871 1.75829C20.345 -0.430045 16.7267 0.182038 15.1667 1.70412C14.5654 2.28912 13 2.51662 13 2.51662C13 2.51662 11.4346 2.28912 10.8333 1.70412ZM8.66667 5.27912V6.84941H10.2375C10.8658 6.84941 11.375 7.33691 11.375 7.93329C11.375 8.52912 10.8658 9.01662 10.2375 9.01662H8.66667V10.5869C8.66667 11.2158 8.17917 11.725 7.58333 11.725C6.9875 11.725 6.5 11.2163 6.5 10.5869V9.01662H4.92917C4.30083 9.01662 3.79167 8.52912 3.79167 7.93329C3.79167 7.33691 4.30083 6.84941 4.92917 6.84941H6.5V5.27912C6.5 4.65079 6.9875 4.14162 7.58333 4.14162C8.17917 4.14162 8.66667 4.65079 8.66667 5.27912ZM18.4167 6.03745C18.4167 5.28995 19.0233 4.68329 19.7708 4.68329C20.5183 4.68329 21.125 5.28995 21.125 6.03745C21.125 6.78495 20.5183 7.39162 19.7708 7.39162C19.0233 7.39162 18.4167 6.78495 18.4167 6.03745ZM15.7083 9.28745C15.7083 8.53941 16.315 7.93329 17.0625 7.93329C17.81 7.93329 18.4167 8.53941 18.4167 9.28745C18.4167 10.0344 17.81 10.6416 17.0625 10.6416C16.315 10.6416 15.7083 10.0344 15.7083 9.28745Z"
      fill="black"
    />
  </svg>
);
