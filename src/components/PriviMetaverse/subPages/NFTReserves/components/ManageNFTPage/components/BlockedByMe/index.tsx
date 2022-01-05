import React, { useEffect, useState } from "react";
import BlockedByMeNFT from "./BlockedByMeNFT";

import Box from "shared/ui-kit/Box";
import { getLockedNFTsByOwner } from "shared/services/API/ReserveAPI";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { useAuth } from "shared/contexts/AuthContext";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { BlockedByMeStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  650: 2,
  1200: 3,
  1420: 4,
};

const BlockedByMe = () => {
  const classes = BlockedByMeStyles();
  const { isSignedin } = useAuth();
  const width = useWindowDimensions().width;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activedNfts, setActivedNfts] = useState<any>([]);
  const [expiredNfts, setExpiredNfts] = useState<any>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (isSignedin) {
      setIsLoading(true);

      const response = await getLockedNFTsByOwner({
        mode: isProd ? "main" : "test",
        type: "Blocked",
      });
      const nfts = response.nfts.map(item => {
        const histories = item?.blockingSalesHistories;
        const activeHistory = histories[0];
        return {
          ...item,
          history: activeHistory,
        };
      });
      setActivedNfts(
        nfts.filter(
          item => item?.history?.ReservePeriod * 3600 * 24 * 1000 + item?.history?.created - Date.now() > 0
        )
      );
      setExpiredNfts(
        nfts.filter(
          item => item?.history?.ReservePeriod * 3600 * 24 * 1000 + item?.history?.created - Date.now() <= 0
        )
      );
      setIsLoading(false);
    }
  };

  const loadingCount = React.useMemo(() => (width > 1000 ? 4 : width > 600 ? 1 : 2), [width]);

  return isLoading ? (
    <Box mt={2}>
      <MasonryGrid
        gutter={"40px"}
        data={Array(loadingCount).fill(0)}
        renderItem={(_, index) => <BlockedByMeNFT isLoading={true} item={{}} />}
        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
      />
    </Box>
  ) : (
    <Box mb={8}>
      <Box className={classes.title}>Active</Box>
      {activedNfts.length > 0 ? (
        activedNfts.map(item => <BlockedByMeNFT item={item} />)
      ) : (
        <Box className={classes.content}>No Items</Box>
      )}
      <Box className={classes.title}>Expired</Box>
      {expiredNfts.length > 0 ? (
        expiredNfts.map(item => <BlockedByMeNFT item={item} />)
      ) : (
        <Box className={classes.content}>No Items</Box>
      )}
    </Box>
  );
};

export default BlockedByMe;
