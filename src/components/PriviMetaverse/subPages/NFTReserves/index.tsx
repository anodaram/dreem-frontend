import React, { useState, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce/lib";

import { useTheme, useMediaQuery, Select, MenuItem } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { setTokenList } from "store/actions/MarketPlace";
import ExploreCard from "../../components/cards/ExploreCard";
import HowWorksOfMarketPlaceModal from "../../modals/HowWorksOfMarketPlaceModal";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { getAllNFTs } from "shared/services/API/ReserveAPI";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { toDecimals } from "shared/functions/web3";

import { useFilterSelectStyles, useNFTOptionsStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4,
};

const PAGE_SIZE = 8;

const filterTagOptions = ["All NFTs"];
const filterChainOptions = ["All", "Ethereum", "Polygon"];
const filterStatusOptions = ["All", "On Sale", "For Rental", "Blocked", "Rented"];

import { ReactComponent as EthereumIcon } from "assets/icons/ETHToken.svg";
import { ReactComponent as PolygonIcon } from "assets/icons/polygon.svg";
import SkeletonBox from "shared/ui-kit/SkeletonBox";
import { useAuth } from "shared/contexts/AuthContext";

const getChainImage = chain => {
  if (chain === filterChainOptions[1]) {
    return <EthereumIcon />;
  } else if (chain === filterChainOptions[2]) {
    return <PolygonIcon />;
  } else {
    return null;
  }
};

export const ArrowIcon = func => () =>
  (
    <Box style={{ cursor: "pointer" }} onClick={() => func(true)}>
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
  const { id } = useParams<{ id: string }>();
  const classes = useNFTOptionsStyles();
  const filterClasses = useFilterSelectStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [selectedTab, setSelectedTab] = useState<"explore">("explore");
  const [reservedNftList, setReservedNftList] = useState<any[]>([]);
  const lastNFTId = React.useRef();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListView, setIsListView] = useState<boolean>(false);

  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const [filterOption, setFilterOption] = useState<string>(filterTagOptions[0]);
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
      headerName: "Selling Price",
      headerAlign: "center",
    },
    {
      headerName: "Blocking Price",
      headerAlign: "center",
    },
    {
      headerName: "Rental Price",
      headerAlign: "center",
    },
  ];

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || '';
  };

  const getTokenDecimal = (addr) => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals;
  };

  useEffect(() => {
    getTokenList();
  }, []);

  useEffect(() => {
    if (id === "explore") {
      setSelectedTab("explore");
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [filterOption, filterChain, filterStatus, debouncedSearchValue]);

  const getTokenList = async () => {
    getAllTokenInfos().then(res => {
      if (res.success) {
        dispatch(setTokenList(res.tokens));
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
      if (nft.owner_of.toLowerCase() === user.address.toLowerCase()) {
        return user.firstName || user.lastName
          ? `${user.firstName} ${user.lastName}`
          : nft.owner_of.substr(0, 5) + "..." + nft.owner_of.substr(nft.owner_of.length - 5, 5) ?? "";
      }
      return nft.owner_of.substr(0, 5) + "..." + nft.owner_of.substr(nft.owner_of.length - 5, 5) ?? "";
    } else {
      let name: string = "";
      name =
        nft.owner.firstName || nft.owner.lastName
          ? `${nft.owner.firstName} ${nft.owner.lastName}`
          : nft.owner_of.substr(0, 5) + "..." + nft.owner_of.substr(nft.owner_of.length - 5, 5) ?? "";

      return name;
    }
  };

  const getData = async () => {
    if (!hasMore || loading) return;

    const network =
      !filterOption && filterChain !== filterChainOptions[0] && isFilterChain ? filterChain : undefined;
    const status =
      !filterOption && isFilterStatus && filterStatus !== filterStatusOptions[0] ? filterStatus : undefined;
    const search = debouncedSearchValue ? debouncedSearchValue : undefined;

    try {
      setLoading(true);
      const response = await getAllNFTs({
        mode: isProd ? "main" : "test",
        network,
        status,
        search,
        lastNFTId: lastNFTId.current,
        pageSize: PAGE_SIZE,
      });

      const newNfts = response.nfts;
      if (!lastNFTId.current) {
        setReservedNftList([...response.nfts]);
      } else {
        setReservedNftList([...reservedNftList, ...newNfts]);
      }
      setHasMore(newNfts.length === PAGE_SIZE);
      if (newNfts.length) {
        lastNFTId.current = newNfts[newNfts.length - 1].id;
      }
      setLoading(false);
    } catch (err) {}
    setLoading(false);
  };

  const tableData = useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (reservedNftList && reservedNftList.length) {
      data = reservedNftList.map(row => {
        return [
          {
            cell: (
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box className={classes.listNFTImage}>
                  <SkeletonBox
                    width="100%"
                    height="100%"
                    image={row.content_url}
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
            cell: <Box color="#ffffff70" textAlign="center">{userName(row)}</Box>,
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
                  ? `${row.sellingOffer.Price} ${getTokenSymbol(
                      row.sellingOffer.PaymentToken
                    )}`
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
                    )} for ${row.blockingSaleOffer.ReservePeriod} Days`
                  : "_"}
              </Box>
            ),
          },
          {
            cell: (
              <Box textAlign="center">
                {row?.rentSaleOffer?.pricePerSecond
                  ? `${(
                      +toDecimals(
                        row.rentSaleOffer.pricePerSecond,
                        getTokenDecimal(row.rentSaleOffer.fundingToken)
                      ) * 86400
                    ).toFixed(3)} ${getTokenSymbol(row.rentSaleOffer.fundingToken)} / day`
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
      getData();
    }
  };

  const onClickFilterTag = tag => {
    lastNFTId.current = undefined;
    setIsFilterStatus(false);
    setIsFilterChain(false);
    setFilterOption(tag);
    setHasMore(true);
    setReservedNftList([]);
  };

  const handleFilterChain = e => {
    lastNFTId.current = undefined;
    setFilterOption("");
    setIsFilterStatus(false);
    setIsFilterChain(true);
    setFilterChain(e.target.value);
    setHasMore(true);
    setReservedNftList([]);
  };

  const handleFilterStatus = e => {
    lastNFTId.current = undefined;
    setFilterOption("");
    setIsFilterStatus(true);
    setIsFilterChain(false);
    setFilterStatus(e.target.value);
    setHasMore(true);
    setReservedNftList([]);
  };

  return (
    <>
      <Box className={classes.main}>
        <div className={classes.content} onScroll={handleScroll}>
          <img src={require("assets/metaverseImages/dreem.svg")} className={classes.pixImage} />
          <img src={require("assets/metaverseImages/camera.png")} className={classes.cameraImage} />
          <div className={classes.titleBar}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <div className={classes.title}>Not your average NFT marketplace</div>
              <div className={classes.subTitle}>Rent, borrow and reserve to buy later.</div>
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
                style={{
                  border: "1px solid #4218B5",
                  color: "#4218B5",
                  height: 41,
                  borderRadius: 74,
                  padding: "0px 30px",
                  fontSize: 16,
                  fontFamily: "Agrandir",
                  fontWeight: 800,
                  width: isMobile ? "100%" : "auto",
                  margin: "0 8px",
                }}
                onClick={() => setOpenHowWorksModal(true)}
              >
                How it works?
              </SecondaryButton>
              {isSignedin && (
                <SecondaryButton
                  size="medium"
                  className={classes.manageButton}
                  onClick={() => {
                    history.push("/reserve/manage_nft");
                  }}
                  style={{
                    width: isMobile ? "100%" : "auto",
                    marginTop: isMobile ? 10 : 0,
                    marginLeft: isMobile ? 0 : "inherit",
                  }}
                >
                  Manage Your NFTs
                </SecondaryButton>
              )}
            </Box>
          </div>
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
              pt={1}
              flexWrap="wrap"
              width={isMobile ? 1 : "auto"}
              justifyContent={isMobile ? "flex-end" : "flex-start"}
            >
              {filterTagOptions.map(tag => (
                <>
                  <Box
                    className={`${classes.filterTag} ${filterOption === tag ? classes.filterActive : ""}`}
                    onClick={() => {
                      onClickFilterTag(tag);
                    }}
                  >
                    {tag}
                  </Box>
                </>
              ))}
              <Select
                open={openChainSelect}
                onClose={() => setOpenChainSelect(false)}
                value={filterChain}
                onChange={handleFilterChain}
                className={`${classes.select} ${isFilterChain ? classes.filterActive : ""}`}
                renderValue={(value: any) => (
                  <Box display="flex" alignItems="center" onClick={() => setOpenChainSelect(true)}>
                    Chain:&nbsp;&nbsp;
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
                    {getChainImage(chain)}
                    {chain}
                  </MenuItem>
                ))}
              </Select>
              <Select
                open={openStatusSelect}
                onClose={() => setOpenStatusSelect(false)}
                value={filterStatus}
                onChange={handleFilterStatus}
                className={`${classes.select} ${isFilterStatus ? classes.filterActive : ""}`}
                renderValue={(value: any) => (
                  <Box display="flex" alignItems="center" onClick={() => setOpenStatusSelect(true)}>
                    Status:&nbsp;&nbsp;<span>{value}</span>
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
                      padding: 0,
                      border: "none",
                      height: "auto",
                    }}
                    theme="music dao"
                  />
                )}
                <Box
                  onClick={() => setShowSearchBox(prev => !prev)}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{ cursor: "pointer" }}
                >
                  <SearchIcon color={"#2D3047"} />
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
          <div className={classes.explorerContent}>
            {isListView ? (
              <div className={classes.table}>
                <CustomTable headers={tableHeaders} rows={tableData} placeholderText="" theme="normal" />
                {loading && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: 16,
                      paddingBottom: 16,
                    }}
                  >
                    <CircularLoadingIndicator theme="blue" />
                  </div>
                )}
              </div>
            ) : (
              <Box sx={{ flexGrow: 1, width: "100%" }}>
                <>
                  <MasonryGrid
                    gutter={"24px"}
                    data={reservedNftList}
                    renderItem={item => <ExploreCard nft={item} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                  {loading && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: 16,
                        paddingBottom: 16,
                      }}
                    >
                      <CircularLoadingIndicator theme="blue" />
                    </div>
                  )}
                </>
              </Box>
            )}
          </div>
        </div>
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
      fill="#2D3047"
    />
  </svg>
);

export const DetailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6.5" y="0.625" width="6" height="6" rx="1" transform="rotate(90 6.5 0.625)" fill="#2D3047" />
    <rect x="6.5" y="7.625" width="6" height="6" rx="1" transform="rotate(90 6.5 7.625)" fill="#2D3047" />
    <rect x="13.5" y="0.625" width="6" height="6" rx="1" transform="rotate(90 13.5 0.625)" fill="#2D3047" />
    <rect x="13.5" y="7.625" width="6" height="6" rx="1" transform="rotate(90 13.5 7.625)" fill="#2D3047" />
  </svg>
);
