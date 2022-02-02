import React from "react";

import Box from "shared/ui-kit/Box";
import { useStyles } from "./index.styles";

export default function TotalStats() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div className={classes.title}>Total Stats</div>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"80%"} mt={3}>
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>5</Box>
          <Box className={classes.typo2} mt={0.5}>
            Rented
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>124</Box>
          <Box className={classes.typo2} mt={0.5}>
            Blocked
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>12</Box>
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
          <Box className={classes.typo1}>2242 USDT</Box>
          <Box className={classes.typo2} mt={0.5}>
            Rented
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>2456 USDT</Box>
          <Box className={classes.typo2} mt={0.5}>
            Blocked
          </Box>
        </Box>
        <Box width={"1px"} height={"46px"} bgcolor={"#ffffff10"} />
        <Box display={"flex"} flexDirection={"column"}>
          <Box className={classes.typo1}>22 425 USDT</Box>
          <Box className={classes.typo2} mt={0.5}>
            On Sold
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
