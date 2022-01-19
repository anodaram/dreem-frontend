import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import cls from "classnames";
import styled from "styled-components";

import { Grid, useTheme, useMediaQuery } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";

import { RootState } from "store/reducers/Reducer";
import { setSelTabMarket } from "store/actions/MarketPlace";
import ExploreCard from "components/PriviMetaverse/components/cards/ExploreCard";
import Box from "shared/ui-kit/Box";
import { CircularLoadingIndicator, PrimaryButton } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { getOwnedNFTs } from "shared/services/API/ReserveAPI";
import { toDecimals } from "shared/functions/web3";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { ownersPanelStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";
const filterChainOptions = ["All", "Ethereum", "Polygon"];
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  650: 2,
  1200: 3,
  1420: 4,
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

const OwnersPanel = () => {
  const classes = ownersPanelStyles();
  const theme = useTheme();
  const { isSignedin } = useAuth();
  const dispatch = useDispatch();

  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);
  const selTab = useSelector((state: RootState) => state.marketPlace.selectedTab);

  const width = useWindowDimensions().width;
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [filterChain, setFilterChain] = useState<string>(filterChainOptions[0]);
  const [isFilterChain, setIsFilterChain] = useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<number>(selTab || 0);
  const TABS = ["Owned NFTs", "Rented NFTs", "Blocked NFTs"];
  const { account } = useWeb3React();

  const getTokenDecimal = (chain, addr) => {
    if (tokens.length == 0) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Decimals;
  };

  useEffect(() => {
    refreshData();
  }, [filterChain, selectedTab]);

  const refreshData = () => {
    setUserNFTs([]);
    getData();
  };

  const getData = async () => {
    if (isSignedin) {
      try {
        const selectedChain =
          filterChain === filterChainOptions[0]
            ? undefined
            : filteredBlockchainNets.find(net => net.name === filterChain.toUpperCase())?.chainName;

        setLoading(true);
        const response = await getOwnedNFTs({
          mode: isProd ? "main" : "test",
          network: selectedChain,
          type: selectedTab === 2 ? "Blocking" : selectedTab === 1 ? "Rental" : "Owned",
        });

        let nfts = response.data ?? [];
        const loadNftStatus = nft =>
          !nft.status ? [] : Array.isArray(nft.status) ? nft.status : nft.status.split(", ");
        if (selectedTab === 0) {
          setUserNFTs(
            nfts.filter(
              nft =>
                !nft.status || Array.isArray(nft.status) && !nft.status?.length ||
                loadNftStatus(nft).filter(s => s !== "Rented" && s !== "Blocked").length
            )
          );
        } else if (selectedTab === 1) {
          setUserNFTs(nfts.filter(nft => loadNftStatus(nft).filter(s => s === "Rented").length));
        } else {
          setUserNFTs(nfts);
        }
      } catch (err) {}
      setLoading(false);
    }
  };

  const handleScroll = useCallback(
    async e => {
      if (loading) {
        return;
      }
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 100) {
        if (hasMore) {
          getData();
        }
      }
    },
    [hasMore, getData]
  );

  const totalSaleRevenue = useMemo(() => {
    return (userNFTs || []).reduce(
      (total, nft) => total + (nft.salesHistories || []).reduce((t, cur) => t + +cur.Price, 0),
      0
    );
  }, [userNFTs]);

  const monthSaleRevenue = useMemo(() => {
    const now = new Date();
    const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStart = monthStartDate.getTime();
    return userNFTs.reduce(
      (total, nft) =>
        total +
        (nft.salesHistories || [])
          .filter(offer => offer.created >= monthStart)
          .reduce((t, cur) => t + +cur.Price, 0),
      0
    );
  }, [userNFTs]);
  const totalRentRevenue = useMemo(() => {
    return userNFTs.reduce(
      (total, nft) =>
        total +
        (nft.rentHistories || []).reduce(
          (t, cur) =>
            t +
            +toDecimals(
              +cur.pricePerSecond * +cur.rentalTime,
              getTokenDecimal(nft.chainsFullName, cur.fundingToken)
            ),
          0
        ),
      0
    );
  }, [userNFTs]);
  const monthRentRevenue = useMemo(() => {
    const now = new Date();
    const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStart = monthStartDate.getTime();
    return userNFTs.reduce(
      (total, nft) =>
        total +
        (nft.rentHistories || [])
          .filter(offer => offer.created >= monthStart)
          .reduce(
            (t, cur) =>
              t +
              +toDecimals(
                +cur.pricePerSecond * +cur.rentalTime,
                getTokenDecimal(nft.chainsFullName, cur.fundingToken)
              ),
            0
          ),
      0
    );
  }, [userNFTs]);

  const loadingCount = React.useMemo(() => (width > 1000 ? 4 : width > 600 ? 1 : 2), [width]);

  return (
    <div className={classes.content} onScroll={handleScroll}>
      <Grid container className={classes.infoPanel}>
        <Grid item xs={12} sm={6} className={classes.subPanel}>
          <Box className={classes.infoRow}>
            <Box className={classes.infoSubPanel}>
              <span className={classes.infoLabel}>Total selling revenue</span>
              <span className={classes.infoValue}>{+totalSaleRevenue.toFixed(2)} USDT</span>
            </Box>
            <Box className={classes.infoSubPanel}>
              <span className={classes.infoLabel}>Selling revenue this month</span>
              <span className={classes.infoValue}>{+monthSaleRevenue.toFixed(2)} USDT</span>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.subPanel}>
          <Box className={classes.infoRow}>
            <Box className={classes.infoSubPanel}>
              <span className={classes.infoLabel}>Total Rent Revenue </span>
              <span className={classes.infoValue}>{+totalRentRevenue.toFixed(2)} USDT</span>
            </Box>
            <Box className={classes.infoSubPanel}>
              <span className={classes.infoLabel}>Rent revenue this month</span>
              <span className={classes.infoValue}>{+monthRentRevenue.toFixed(2)} USDT</span>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box
        mb={3}
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          rowGap: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
          paddingBottom: "16px",
          width: "100%",
        }}
      >
        {/* <Select
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
        </Select> */}
        <Box mt={isMobile ? 2 : 0} display="flex">
          {TABS.map((tab, index) => (
            <Box
              key={tab}
              className={cls({ [classes.selectedTabSection]: selectedTab === index }, classes.tabSection)}
              onClick={() => {
                setSelectedTab(index);
                dispatch(setSelTabMarket(index));
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>
        <Box>
          <PrimaryButton
            onClick={() => {
              refreshData();
            }}
            size="small"
            style={{
              background: "#3b4834",
              fontFamily: "Montserrat",
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: "12px",
              lineHeight: "15px",
              textAlign: "center",
              color: "#E9FF26",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 0,
            }}
          >
            <IconButtonWrapper style={{ marginLeft: -10 }} rotate={loading}>
              <RefreshIcon />
            </IconButtonWrapper>
            Sync NFTs
          </PrimaryButton>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, width: "100%", paddingBottom: isMobile ? 70 : isTablet ? 50 : 0 }}>
        {userNFTs && userNFTs.length ? (
          <>
            <MasonryGrid
              gutter={"24px"}
              data={userNFTs}
              renderItem={item => <ExploreCard nft={item} key={item.id} />}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
            {hasMore && (
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
        ) : loading ? (
          <Box mt={2}>
            <MasonryGrid
              gutter={"40px"}
              data={Array(loadingCount).fill(0)}
              renderItem={(_, index) => <ExploreCard isLoading={true} nft={{}} />}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </Box>
        ) : (
          <div></div>
        )}
      </Box>
    </div>
  );
};

export default OwnersPanel;

const RefreshIcon = () => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 8.25051C14.8166 6.93068 14.2043 5.70776 13.2575 4.77013C12.3107 3.83251 11.0818 3.2322 9.76025 3.06168C8.43869 2.89115 7.09772 3.15987 5.9439 3.82645C4.79009 4.49302 3.88744 5.52046 3.375 6.75051M3 3.75051V6.75051H6"
        stroke="#E9FF26"
        stroke-width="1.125"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 9.75C3.18342 11.0698 3.7957 12.2928 4.74252 13.2304C5.68934 14.168 6.91818 14.7683 8.23975 14.9388C9.56131 15.1094 10.9023 14.8406 12.0561 14.1741C13.2099 13.5075 14.1126 12.48 14.625 11.25M15 14.25V11.25H12"
        stroke="#E9FF26"
        stroke-width="1.125"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const IconButtonWrapper = styled.div<{ rotate: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${props => (props.rotate ? `rotate 1.5s linear 0s infinite` : "")};
  -webkit-animation: ${props => (props.rotate ? `rotate 1.5s linear 0s infinite` : "")};
  -moz-animation: ${props => (props.rotate ? `rotate 1.5s linear 0s infinite` : "")};
  @keyframes rotate {
    0% {
    }
    100% {
      -webkit-transform: rotate(-360deg);
      -moz-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
`;
