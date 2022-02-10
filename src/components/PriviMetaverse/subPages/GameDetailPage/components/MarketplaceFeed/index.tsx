import React from "react";
import { useMediaQuery, useTheme, Select, MenuItem, IconButton } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

import { marketplaceFeedStyles } from "./index.styles";
import { useFilterSelectStyles } from "../../index.styles";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import Stats from "../Stats";
import List, { ExploreIcon } from "../List";
import { useParams } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";
import { PrimaryButton, SecondaryButton, Variant } from "shared/ui-kit";
import { getNftGameFeed } from "shared/services/API/DreemAPI";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@material-ui/lab";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Tag from "../Tag";
import { toDecimals } from "shared/functions/web3";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import { useHistory } from "react-router-dom";
import { listenerSocket } from "components/Login/Auth";
import Moment from "react-moment";
// TODO: mock data delete and change for real data

const filterStatusOptions = ["All", "RENTED", "SOLD", "BLOCKED"];

const totalStatsItems = [
  { title: "rented", number: 5 },
  { title: "blocked", number: 124 },
  { title: "sold", number: 12 },
];
const weeklyStatsItems = [
  { title: "rented", number: "2242 USDT" },
  { title: "blocked", number: "22 432 USDT" },
  { title: "on sale", number: "7842 USDT" },
];

const isProd = process.env.REACT_APP_ENV === "prod";

export default function MarketplaceFeed() {
  const classes = marketplaceFeedStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const width = useWindowDimensions().width;
  const { collection_id }: { collection_id: string } = useParams();
  const filterClasses = useFilterSelectStyles();

  const [nfts, setNfts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [lastId, setLastId] = React.useState<any>(undefined);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [filterStatus, setFilterStatus] = React.useState<string>(filterStatusOptions[0]);
  const [openStatusSelect, setOpenStatusSelect] = React.useState<boolean>(false);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const loadingCount = React.useMemo(() => (width > 1000 ? 4 : width > 600 ? 1 : 2), [width]);
  const history = useHistory();
  const tableHeaders: Array<CustomTableHeaderInfo> = [
    { headerName: "NFT" },
    { headerName: "Account" },
    { headerName: "Price", sortable: true, headerAlign: "center" },
    { headerName: "Date", headerAlign: "center" },
    { headerName: "Transaction type", headerAlign: "center" },
    { headerName: "Explorer", headerAlign: "center" },
    { headerName: "", headerAlign: "center" },
  ];

  React.useEffect(() => {
    setNfts([]);
    setLastId(undefined);
    setHasMore(true);
    loadNfts(true);
  }, [filterStatus, debouncedSearchValue]);

  React.useEffect(() => {
    if (listenerSocket) {
      const updateMarketPlaceFeedHandler = _transaction => {
        setNfts(prev => {
          let _transactions = prev.map(transaction => (_transaction.id === transaction.id ? _transaction : transaction));
          if (_transactions.length === 0 || _transactions[0].id < _transaction.id){
            _transactions = [_transaction].concat(_transactions);
          }
          return _transactions;
        });
      };

      listenerSocket.on("updateMarketPlaceFeed", updateMarketPlaceFeedHandler);

      return () => {
        listenerSocket.removeListener("updateMarketPlaceFeed", updateMarketPlaceFeedHandler);
      };
    }
  }, [listenerSocket]);

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

  const loadNfts = async (init = false) => {
    if (loading) return;
    try {
      setLoading(true);

      const status = filterStatus !== filterStatusOptions[0] ? filterStatus : undefined;
      const search = debouncedSearchValue ? debouncedSearchValue : undefined;

      const response = await getNftGameFeed({
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

  // const handleFilterStatus = e => {
  //   setLastId(undefined);
  //   setFilterStatus(e.target.value);
  //   setHasMore(true);
  //   setNfts([]);
  // };

  const handleFilterStatus = status => {
    setLastId(undefined);
    setFilterStatus(status);
    setHasMore(true);
    setNfts([]);
  };

  const goToScan = (hash, chain) => {
    if (chain.toLowerCase() === "polygon") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
    } else if (chain.toLowerCase() === "bsc") {
      window.open(`https://${!isProd ? "testnet." : ""}bscscan.com/tx/${hash}`, "_blank");
    }
  };

  const goToNft = row => {
    history.push(`/P2E/${row.collectionId}/${row.tokenId}`);
  };

  const tableData = React.useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    const accTitle = item => {
      const info = item.operator ||
      item.seller ||
      item.fromSeller ||
      item.toSeller ||
      item.Address || undefined;
  
      if (info){ 
        return info.substring(0, 6) + "..." + info.substring(info.length - 4, info.length);
      }
      return "";
    }

    if (nfts && nfts.length) {
      data = nfts.map(row => [
        {
          cell: (
            <div className={classes.titleWrapper}>
              <img className={classes.titleImg} src={row.image} />
              <div className={classes.textBox}>
                <p className={classes.textTitle}>{row.name}</p>
                <p className={classes.description}>{`${row.collection.substring(
                  0,
                  6
                )}...${row.collection.substring(row.collection.length - 4, row.collection.length)}`}</p>
              </div>
            </div>
          ),
        },
        {
          cell: (
            <p className={classes.accTitle}>{accTitle(row)}</p>
          ),
        },
        {
          cell: (
            <p className={classes.whiteText}>{`${+toDecimals(
              row.price || row.pricePerSecond * row.rentalTime,
              getTokenDecimal(row.paymentToken || row.fundingToken)
            )} ${getTokenSymbol(row.paymentToken || row.fundingToken)}`}</p>
          ),
        },
        {
          cell: <p className={classes.whiteText}><Moment fromNow format="DD/MMM/YYYY">{+row.id}</Moment></p>
        },
        {
          cell: <Box className={classes.typeTag}
            style={{
              background:
                row.type && row.type.toLowerCase() === "rented"
                  ? "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)"
                  : row.type && row.type.toLowerCase() === "sold"
                    ? "conic-gradient(from 31.61deg at 50% 50%, #91D502 -25.18deg, #E5FF46 15deg, rgba(186, 252, 0, 0.76) 103.13deg, #A3CC00 210deg, #91D502 334.82deg, #E5FF46 375deg)"
                    : row.type && row.type.toLowerCase() === "blocked"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #F24A25 -73.13deg, #FF3124 15deg, rgba(202, 36, 0, 0.76) 103.13deg, #F2724A 210deg, #F24A25 286.87deg, #FF3124 375deg)"
                      : row.type && row.type.toLowerCase() === "transfer"
                        ? "conic-gradient(from 180deg at 50% 50%, #C7CAFE 0deg, rgba(196, 214, 250, 0.92) 135deg, rgba(238, 239, 244, 0.75) 230.62deg, rgba(114, 145, 255, 0.87) 303.75deg, #C7CAFE 360deg)"
                        : "",
            }}
          >
            {row.type}
          </Box>
        },
        {
          cell: <div onClick={() => { goToScan(row.transactionHash, row.chain) }}>{
            <img src={getChainImageUrl(row.chain)} width={"22px"} />
          }
          </div>
        },
        {
          cell: (
            <PrimaryButton
              onClick={() => {
                goToNft(row);
              }}
              size="medium"
              className={classes.button}
              isRounded
            >
              View
            </PrimaryButton>
          ),
        },
      ]);
    }

    return data;
  }, [nfts]);

  return (
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
          <Box className={classes.tabTitle} mb={2}>
            marketplace feed
          </Box>
        </Box>
        <Box className={classes.optionSection} mt={isMobile ? 1 : 0}>
          <Box className={classes.statusButtonBox} mt={1} mb={1}>
            {filterStatusOptions.map((status, index) => (
              <PrimaryButton
                onClick={() => {
                  handleFilterStatus(status);
                }}
                size="medium"
                className={filterStatus === status ? classes.statusSelectedButton : classes.statusButton}
              >
                {status}
              </PrimaryButton>
            ))}
          </Box>
        </Box>
      </Box>
      {/* <Box className={classes.root} width={1}>
        <Stats title="Total Stats" items={totalStatsItems} />
        <Stats title="Weekly Stats" items={weeklyStatsItems} />
      </Box> */}
      <Box>
        <InfiniteScroll
          hasChildren={nfts?.length > 0}
          dataLength={nfts?.length}
          scrollableTarget={"scrollContainer"}
          next={loadNfts}
          hasMore={hasMore}
          loader={
            loading && (
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
          {tableData.length > 0 && (
            <div className={classes.table}>
              <CustomTable
                variant={Variant.Transparent}
                headers={tableHeaders}
                rows={tableData}
                placeholderText="No data"
                sorted={{}}
              />
            </div>
          )}
        </InfiniteScroll>
        {!loading && nfts?.length < 1 && (
          <Box textAlign="center" width="100%" mb={10} mt={2}>
          </Box>
        )}
      </Box>
    </>
  );
}

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
