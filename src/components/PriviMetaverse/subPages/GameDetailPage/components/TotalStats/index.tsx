import React from "react";
import { useSelector } from "react-redux";

import Box from "shared/ui-kit/Box";
import { toDecimals } from "shared/functions/web3";
import { RootState } from "store/reducers/Reducer";
import { listenerSocket } from "components/Login/Auth";
import { useStyles } from "./index.styles";

export default function TotalStats({ gameInfo }) {
  const classes = useStyles();
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const totalStats = React.useMemo(() => gameInfo?.total_stats_count, [gameInfo]);
  const weeklyStats = React.useMemo(() => gameInfo?.weekly_stats_price, [gameInfo]);
  const [totalRents, setTotalRents] = React.useState<number>(0);
  const [totalBlocks, setTotalBlocks] = React.useState<number>(0);
  const [totalSales, setTotalSales] = React.useState<number>(0);
  const [weeklyRents, setWeeklyRents] = React.useState<number>(0);
  const [weeklyBlocks, setWeeklyBlocks] = React.useState<number>(0);
  const [weeklySales, setWeeklySales] = React.useState<number>(0);

  React.useEffect(() => {
    if (totalStats) {
      setTotalRents(totalStats.RENTED);
      setTotalBlocks(totalStats.BLOCKED);
      setTotalSales(totalStats.SOLD);
    }
  }, [totalStats]);

  React.useEffect(() => {
    if (weeklyStats) {
      setWeeklyRents(weeklyStats.RENTED);
      setWeeklyBlocks(weeklyStats.BLOCKED);
      setWeeklySales(weeklyStats.SOLD);
    }
  }, [weeklyStats]);

  const tokenDecimal = React.useMemo(() => {
    if (tokenList.length > 0) {
      let token = tokenList.find(token => token.Network === gameInfo?.Chain);
      return token?.Decimals || 0;
    }
    return 0;
  }, [tokenList, gameInfo]);

  React.useEffect(() => {
    if (listenerSocket) {
      const updateMarketPlaceFeedHandler = _nft => {
        console.log("updateMarketPlaceFeed:", _nft);
        if (_nft.type === "SOLD") {
          setTotalSales(totalSales + 1);
          if (_nft.price) {
            setWeeklySales(weeklySales + Number(_nft.price));
          }
        } else if (_nft.type === "RENTED") {
          setTotalRents(totalRents + 1);
          if (_nft.price) {
            const rentedPrice = Number(_nft.price) * Number(_nft.rentalTime || 0);
            setWeeklyRents(weeklyRents + rentedPrice);
          }
        } else if (_nft.type === "BLOCKED") {
          setTotalBlocks(totalBlocks + 1);
          if (_nft.price) {
            setWeeklyBlocks(weeklyBlocks + Number(_nft.price));
          }
        }
      };

      listenerSocket.on("updateMarketPlaceFeed", updateMarketPlaceFeedHandler);

      return () => {
        listenerSocket.removeListener("updateMarketPlaceFeed", updateMarketPlaceFeedHandler);
      };
    }
  }, [listenerSocket]);

  return (
    <Box className={classes.root}>
      <div className={classes.title}>Total Stats</div>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"80%"} mt={3}>
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>{totalRents}</Box>
          <Box className={classes.typo2} mt={0.5}>
            Rented
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>{totalBlocks}</Box>
          <Box className={classes.typo2} mt={0.5}>
            Blocked
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>{totalSales}</Box>
          <Box className={classes.typo2} mt={0.5}>
            Sold
          </Box>
        </Box>
      </Box>
      <Box className={classes.typo1} mt={5.5}>
        Weekly Stats
      </Box>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"90%"} mt={3}>
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo3}>
            {tokenDecimal ? +toDecimals(weeklyRents, tokenDecimal) : weeklyRents} USDT
          </Box>
          <Box className={classes.typo2} mt={0.5}>
            Rented
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo3}>
            {tokenDecimal ? +toDecimals(weeklyBlocks, tokenDecimal) : weeklyBlocks} USDT
          </Box>
          <Box className={classes.typo2} mt={0.5}>
            Blocked
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo3}>
            {tokenDecimal ? +toDecimals(weeklySales, tokenDecimal) : weeklySales} USDT
          </Box>
          <Box className={classes.typo2} mt={0.5}>
            On Sold
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
