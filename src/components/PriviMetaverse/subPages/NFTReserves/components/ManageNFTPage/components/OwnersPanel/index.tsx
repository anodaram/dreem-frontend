import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import cls from "classnames";

import { Grid, useTheme, useMediaQuery } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";

import { RootState } from "store/reducers/Reducer";
import ExploreCard from "components/PriviMetaverse/components/cards/ExploreCard";

import Box from "shared/ui-kit/Box";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { getOwnedNFTs } from "shared/services/API/ReserveAPI";
import { toDecimals } from "shared/functions/web3";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { ReactComponent as EthereumIcon } from "assets/icons/ETHToken.svg";
import { ReactComponent as PolygonIcon } from "assets/icons/polygon.svg";

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

  const width = useWindowDimensions().width;
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [filterChain, setFilterChain] = useState<string>(filterChainOptions[0]);
  const [isFilterChain, setIsFilterChain] = useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const TABS = ["Owned NFTs", "Rented NFTs", "Blocked NFTs"];
  const { account } = useWeb3React();

  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);

  const getTokenDecimal = (chain, addr) => {
    if (tokens.length == 0) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Decimals;
  };

  useEffect(() => {
    setUserNFTs([]);
    getData();
  }, [filterChain]);

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
        });
        let nfts = response.data ?? [];
        setUserNFTs(nfts.filter(nft => nft.ownerAddress?.toLowerCase() === account?.toLowerCase()));
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

  const filteredNFTs = useMemo(() => {
    if (selectedTab === 0) {
      return userNFTs.filter(nft => nft.status !== "Rented" && nft.status !== "Blocked");
    } else if (selectedTab === 1) {
      return userNFTs.filter(nft => nft.status === "Rented");
    } else if (selectedTab === 2) {
      return userNFTs.filter(nft => nft.status === "Blocked");
    }
    return userNFTs;
  }, [userNFTs, selectedTab]);

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
              onClick={() => setSelectedTab(index)}
            >
              {tab}
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, width: "100%", paddingBottom: isMobile ? 70 : isTablet ? 50 : 0 }}>
        {filteredNFTs && filteredNFTs.length ? (
          <>
            <MasonryGrid
              gutter={"24px"}
              data={filteredNFTs}
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
