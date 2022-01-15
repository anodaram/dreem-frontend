import React, { useState, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce/lib";

import { useTheme, useMediaQuery, Select, MenuItem } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { RootState } from "store/reducers/Reducer";
import { setTokenList } from "store/actions/MarketPlace";
import ExploreCard from "../../components/cards/ExploreCard";
import MetaverseCard from "components/PriviMetaverse/components/cards/MetaverseCard";
import HowWorksOfMarketPlaceModal from "../../modals/HowWorksOfMarketPlaceModal";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
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

import { ReactComponent as BinanceIcon } from "assets/icons/bsc.svg";
import { ReactComponent as PolygonIcon } from "assets/icons/polygon.svg";

import { useFilterSelectStyles, useNFTOptionsStyles, useTabsStyles } from "./index.styles";

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

const filterChainOptions = ["All", "BSC", "Polygon"];
const filterStatusOptions = ["All", "On Sale", "For Rental", "Blocked", "Rented"];

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
  const filterClasses = useFilterSelectStyles();
  const tabsClasses = useTabsStyles();

  const width = useWindowDimensions().width;
  const loadingCount = useMemo(() => (width > 1440 ? 4 : width > 700 ? 3 : width > 400 ? 2 : 1), [width]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const breakTwo = useMediaQuery(theme.breakpoints.up(700));
  const breakThree = useMediaQuery(theme.breakpoints.up(1200));
  const breakFour = useMediaQuery(theme.breakpoints.up(1440));

  const [exploreMetaverses, setExploreMetaverses] = useState<any[]>([]);
  const [reservedNftList, setReservedNftList] = useState<any[]>([]);

  const lastNFTId = useRef();
  const lastCollectionId = useRef();
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreCollections, setHasMoreCollections] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(false);
  const [isListView, setIsListView] = useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<string>(TAB_NFTS);

  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const [filterChain, setFilterChain] = useState<string>(filterChainOptions[0]);
  const [filterStatus, setFilterStatus] = useState<string>(filterStatusOptions[0]);

  const [isFilterChain, setIsFilterChain] = useState<boolean>(false);
  const [isFilterStatus, setIsFilterStatus] = useState<boolean>(false);
  const [openChainSelect, setOpenChainSelect] = useState<boolean>(false);
  const [openStatusSelect, setOpenStatusSelect] = useState<boolean>(false);

  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);

  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const user = useSelector((state: RootState) => state.user);

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
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals;
  };

  useEffect(() => {
    getTokenList();
  }, []);

  useEffect(() => {
    lastNFTId.current = undefined;
    lastNFTId.current = undefined;
    if (selectedTab === TAB_NFTS) {
      setHasMore(true);
      getData();
    } else {
      setHasMoreCollections(true);
      setExploreMetaverses([]);
      getCollectionData(true);
    }
  }, [filterChain, filterStatus, debouncedSearchValue]);

  useEffect(() => {
    lastNFTId.current = undefined;
    if (selectedTab === TAB_NFTS) {
      setHasMore(true);
      getData(true);
    } else {
      setHasMoreCollections(true);
      setExploreMetaverses([]);
      getCollectionData(true);
    }
  }, [selectedTab]);

  const getTokenList = async () => {
    getAllTokenInfos().then(res => {
      if (res.success) {
        dispatch(setTokenList(res.tokens.filter(t => t.Symbol === "USDT")));
      }
    });
  };

  const nftStatus = nft => {
    if (!nft) {
      return "";
    }
    if (nft.status) {
      return nft.status.toUpperCase();
    }
    if (nft.sellingOffer?.Price || nft.blockingSaleOffer?.Price || nft.rentSaleOffer?.pricePerSecond) {
      return "LISTED";
    }
    if (nft.blockingBuyOffers?.length || nft.buyingOffers?.length || nft.rentBuyOffers?.length) {
      return "LISTED";
    }
    return "";
  };

  const userName = nft => {
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

  const getData = async (isInit = false) => {
    if (!isInit && (!hasMore || loading)) return;

    const network = filterChain !== filterChainOptions[0] && isFilterChain ? filterChain : undefined;
    const status = isFilterStatus && filterStatus !== filterStatusOptions[0] ? filterStatus : undefined;
    const search = debouncedSearchValue ? debouncedSearchValue : undefined;

    try {
      setLoading(true);
      const response = await getAllGameNFTs({
        mode: isProd ? "main" : "test",
        network,
        status,
        search,
        lastNFTId: lastNFTId.current,
        lastCollectionId: lastCollectionId.current,
        pageSize: PAGE_SIZE,
      });

      const newNfts = response.nfts;
      if (!lastNFTId.current) {
        setReservedNftList([...response.nfts]);
      } else {
        setReservedNftList([...reservedNftList, ...newNfts]);
      }
      setHasMore(newNfts.length);
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
          setExploreMetaverses(prev => [...prev, ...items]);
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
              <Box
                textAlign="center"
                padding={"5px 8px"}
                bgcolor={nftStatus(row) ? "#8D65FF" : "transparent"}
                fontSize={12}
                borderRadius={6}
              >
                {nftStatus(row)}
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
                {row?.blockingSaleOffer?.Price
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
                {row?.rentSaleOffer?.pricePerSecond * SECONDS_PER_HOUR
                  ? `${(
                      +toDecimals(
                        row.rentSaleOffer.pricePerSecond,
                        getTokenDecimal(row.rentSaleOffer.fundingToken)
                      ) * SECONDS_PER_HOUR
                    ).toFixed(3)} ${getTokenSymbol(row.rentSaleOffer.fundingToken)}`
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
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 100) {
      if (selectedTab === TAB_NFTS) getData();
      else getCollectionData();
    }
  };

  const handleFilterChain = e => {
    lastNFTId.current = undefined;
    lastCollectionId.current = undefined;
    setIsFilterStatus(false);
    setIsFilterChain(true);
    setFilterChain(e.target.value);
    setHasMore(true);
    setReservedNftList([]);
  };

  const handleFilterStatus = e => {
    lastNFTId.current = undefined;
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
    history.push(`/gameNFTS/${nft.collectionId}/${nft.tokenId}`);
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
        {!isMobile && !isTablet && (
          <>
            <img
              src={require("assets/metaverseImages/shape_home_green_circle.png")}
              className={classes.image1}
            />
            <img src={require("assets/metaverseImages/shape_home_2.png")} className={classes.image2} />
          </>
        )}
        <Box className={classes.limitedContent}>
          <div className={classes.content} onScroll={handleScroll}>
            <div className={classes.titleBar}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <div className={classes.title}>Not your average NFT marketplace</div>
                <div className={classes.subTitle}>
                  Explore Gaming NFTs across Polygon, BSC (and soon Solana). Buy, Rent or Block and Reserve to
                  Buy at a Later Date
                </div>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                mt={"36px"}
                flexDirection={isMobile ? "column" : "row"}
                style={isMobile ? { width: "100%" } : {}}
              >
                <SecondaryButton
                  size="medium"
                  className={classes.primaryButton}
                  onClick={() => setOpenHowWorksModal(true)}
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
            </div>

            <Box width={1} mt={4}>
              <TabsView
                tabs={FilterOptionsTabs}
                onSelectTab={tab => {
                  setSelectedTab(tab.key);
                }}
                extendedClasses={tabsClasses}
              />
            </Box>

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
                {selectedTab === TAB_NFTS && (
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
                        lastNFTId.current = undefined;
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
                isListView ? (
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
                )
              ) : (
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
              )}
              {loading && selectedTab === TAB_NFTS && isListView && (
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
                        <Skeleton variant="rect" width="40%" height={24} style={{ marginLeft: "8px" }} />
                        <Skeleton variant="rect" width="20%" height={24} style={{ marginLeft: "8px" }} />
                        <Skeleton variant="rect" width="20%" height={24} style={{ marginLeft: "8px" }} />
                      </Box>
                    ))}
                </div>
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
