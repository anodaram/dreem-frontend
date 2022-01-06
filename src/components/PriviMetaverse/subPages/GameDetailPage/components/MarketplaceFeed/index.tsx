import React from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";

import { marketplaceFeedStyles } from "./index.styles";
import Stats from "../Stats";
import List from "../List";

// TODO: mock data delete and change for real data
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

export default function MarketplaceFeed() {
  const classes = marketplaceFeedStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box className={classes.root} width={1}>
        <Stats title="Total Stats" items={totalStatsItems} />
        <Stats title="Weekly Stats" items={weeklyStatsItems} />
      </Box>

      <Box width={1}>
        <List />
      </Box>
    </>
  );
}
