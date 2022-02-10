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
import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { NFT_STATUS_COLORS, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { getAllGames } from "shared/services/API/ReserveAPI";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { toDecimals } from "shared/functions/web3";
import SkeletonBox from "shared/ui-kit/SkeletonBox";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { NftStates } from "shared/constants/constants";
import HowWorksOfMarketPlaceModal from "../../modals/HowWorksOfMarketPlaceModal";
import { useFilterSelectWithCommingSoonStyles, useNFTOptionsStyles } from "./index.styles";

import { ReactComponent as BinanceIcon } from "assets/icons/bsc.svg";
import { ReactComponent as PolygonIcon } from "assets/icons/polygon.svg";
import { ReactComponent as SolanaIcon } from "assets/icons/solana.svg";
import { userTrackMarketPlace } from "shared/services/API";
import Axios, { CancelTokenSource } from "axios";
import FeaturedGameCard from "components/PriviMetaverse/components/cards/FeatureGameCard";

const isProd = process.env.REACT_APP_ENV === "prod";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4,
};

const SECONDS_PER_HOUR = 3600;
const PAGE_SIZE = 8;

const filterChainOptions = ["All", "BSC", "Polygon", "SOLANA"];

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

const ExploreGamesPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isSignedin } = useAuth();
  const classes = useNFTOptionsStyles();
  const filterWithComingSoonClasses = useFilterSelectWithCommingSoonStyles();

  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const user = useSelector((state: RootState) => state.user);
  const allNFTList = useSelector((state: RootState) => state.marketPlace.allNFTList);
  const scrollPosition = useSelector((state: RootState) => state.marketPlace.scrollPositionInAllNFT);

  const width = useWindowDimensions().width;
  const loadingCount = useMemo(() => (width > 1440 ? 4 : width > 700 ? 3 : width > 400 ? 2 : 1), [width]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const breakTwo = useMediaQuery(theme.breakpoints.up(700));
  const breakThree = useMediaQuery(theme.breakpoints.up(1200));
  const breakFour = useMediaQuery(theme.breakpoints.up(1440));
  const [games, setGames] = useState<any[]>([]);

  const lastGameId = useRef();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListView, setIsListView] = useState<boolean>(false);

  const [showSearchBox, setShowSearchBox] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const [filterChain, setFilterChain] = useState<string>(filterChainOptions[0]);
  const [isFilterChain, setIsFilterChain] = useState<boolean>(false);
  const [openChainSelect, setOpenChainSelect] = useState<boolean>(false);
  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);

  const getAllGamesRef = useRef<CancelTokenSource | undefined>();

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
    setHasMore(true);
    getData(true);
  }, [filterChain, debouncedSearchValue]);

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

    if (getAllGamesRef.current) {
      getAllGamesRef.current.cancel();
    }

    const network = filterChain !== filterChainOptions[0] ? filterChain : undefined;
    const search = debouncedSearchValue ? debouncedSearchValue : undefined;

    try {
      setLoading(true);

      getAllGamesRef.current = Axios.CancelToken.source();
      const response = await getAllGames(
        {
          mode: isProd ? "main" : "test",
          network,
          search,
          lastGameId: isInit ? undefined : lastGameId.current,
          pageSize: PAGE_SIZE,
        },
        getAllGamesRef?.current?.token
      );

      const newGames = response.data;

      if (!lastGameId.current || isInit) {
        setGames([...newGames]);
      } else {
        setGames([...games, ...newGames]);
      }
      dispatch(setAllNFTList([...allNFTList, ...newGames]));
      setHasMore(newGames.length == PAGE_SIZE);
      if (newGames.length) {
        lastGameId.current = newGames[newGames.length - 1].Address;
      }
    } catch (err) {}
    setLoading(false);
  };

  const tableData = useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (games && games.length) {
      data = games.map(row => {
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
  }, [games]);

  const handleScroll = e => {
    dispatch(setScrollPositionInAllNFT(e.target.scrollTop));
  };

  const handleFilterChain = e => {
    if (e.target.value === "SOLANA") {
      return;
    }
    setIsFilterChain(true);
    setFilterChain(e.target.value);
    setHasMore(true);
    setGames([]);
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
        addedCount = 4 - (games.length % 4);
      } else if (breakThree) {
        addedCount = 3 - (games.length % 3);
      } else if (breakTwo) {
        addedCount = 2 - (games.length % 2);
      }

      const result = [...games];
      for (let index = 0; index < addedCount; index++) {
        result.push({});
      }

      return result;
    } else {
      return games;
    }
  }, [games, hasMore, breakTwo, breakThree, breakFour]);

  return (
    <>
      <Box className={classes.main}>
        <img src={require("assets/metaverseImages/gamenft_explorer_bg.png")} className={classes.imageBg} />
        <img src={require("assets/metaverseImages/rectangle_yellow_left.png")} className={classes.image1} />
        <img src={require("assets/metaverseImages/rectangle_yellow_top.png")} className={classes.image2} />
        <Box className={classes.limitedContent}>
          <div className={classes.content} id={"scrollContainer"} onScroll={handleScroll}>
            <Box className={classes.title}>Explore all games</Box>
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
              </Box>
            </Box>
            <div className={classes.explorerContent}>
              <InfiniteScroll
                hasChildren={games?.length > 0}
                dataLength={games?.length}
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
                            <Skeleton variant="rect" width="40%" height={24} style={{ marginLeft: "8px" }} />
                            <Skeleton variant="rect" width="20%" height={24} style={{ marginLeft: "8px" }} />
                            <Skeleton variant="rect" width="20%" height={24} style={{ marginLeft: "8px" }} />
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
                        <FeaturedGameCard game={item} isLoading={Object.entries(item).length === 0} />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  </Box>
                )}
              </InfiniteScroll>
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

export default ExploreGamesPage;

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
    <path
      d="M10.8333 1.70412C9.27875 0.182038 5.655 -0.430045 3.61292 1.75829C1.61417 3.89245 0 9.03775 0 13.8916C0 19.7476 4.9075 20.5601 7.58333 17.6833C9.1325 16.015 9.27875 15.7544 10.2917 14.4333H15.7083C16.7267 15.7544 16.8675 16.015 18.4167 17.6833C21.092 20.5601 26 19.7476 26 13.8916C26 9.03775 24.3858 3.89245 22.3871 1.75829C20.345 -0.430045 16.7267 0.182038 15.1667 1.70412C14.5654 2.28912 13 2.51662 13 2.51662C13 2.51662 11.4346 2.28912 10.8333 1.70412ZM8.66667 5.27912V6.84941H10.2375C10.8658 6.84941 11.375 7.33691 11.375 7.93329C11.375 8.52912 10.8658 9.01662 10.2375 9.01662H8.66667V10.5869C8.66667 11.2158 8.17917 11.725 7.58333 11.725C6.9875 11.725 6.5 11.2163 6.5 10.5869V9.01662H4.92917C4.30083 9.01662 3.79167 8.52912 3.79167 7.93329C3.79167 7.33691 4.30083 6.84941 4.92917 6.84941H6.5V5.27912C6.5 4.65079 6.9875 4.14162 7.58333 4.14162C8.17917 4.14162 8.66667 4.65079 8.66667 5.27912ZM18.4167 6.03745C18.4167 5.28995 19.0233 4.68329 19.7708 4.68329C20.5183 4.68329 21.125 5.28995 21.125 6.03745C21.125 6.78495 20.5183 7.39162 19.7708 7.39162C19.0233 7.39162 18.4167 6.78495 18.4167 6.03745ZM15.7083 9.28745C15.7083 8.53941 16.315 7.93329 17.0625 7.93329C17.81 7.93329 18.4167 8.53941 18.4167 9.28745C18.4167 10.0344 17.81 10.6416 17.0625 10.6416C16.315 10.6416 15.7083 10.0344 15.7083 9.28745Z"
      fill="black"
    />
  </svg>
);
