import React from "react";
import { useSelector } from "react-redux";

import Box from "shared/ui-kit/Box";
import { toDecimals } from "shared/functions/web3";
import { RootState } from "store/reducers/Reducer";
import { useStyles } from "./index.styles";

export default function TotalStats({ gameInfo }) {
  const classes = useStyles();

  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const totalStats = React.useMemo(() => gameInfo?.total_stats_count, [gameInfo]);
  const weeklyStats = React.useMemo(() => gameInfo?.weekly_stats_price, [gameInfo]);

  const tokenDecimal = React.useMemo(() => {
    if (tokenList.length > 0) {
      let token = tokenList.find(token => token.Network === gameInfo.Chain);
      return token?.Decimals || 0;
    }
    return 0;
  }, [tokenList, gameInfo]);

  return (
    <Box className={classes.root}>
      <div className={classes.title}>Total Stats</div>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"80%"} mt={3}>
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>{totalStats?.RENTED || 0}</Box>
          <Box className={classes.typo2} mt={0.5}>
            Rented
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>{totalStats?.BLOCKED || 0}</Box>
          <Box className={classes.typo2} mt={0.5}>
            Blocked
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>{totalStats?.SOLD || 0}</Box>
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
            {tokenDecimal ? +toDecimals(weeklyStats?.RENTED || 0, tokenDecimal) : weeklyStats?.RENTED || 0}{" "}
            USDT
          </Box>
          <Box className={classes.typo2} mt={0.5}>
            Rented
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo3}>
            {tokenDecimal ? +toDecimals(weeklyStats?.BLOCKED || 0, tokenDecimal) : weeklyStats?.BLOCKED || 0}{" "}
            USDT
          </Box>
          <Box className={classes.typo2} mt={0.5}>
            Blocked
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo3}>
            {tokenDecimal ? +toDecimals(weeklyStats?.SOLD || 0, tokenDecimal) : weeklyStats?.SOLD || 0} USDT
          </Box>
          <Box className={classes.typo2} mt={0.5}>
            On Sold
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
