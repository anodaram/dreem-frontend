import React, { useEffect, useState } from "react";

import { Skeleton } from "@material-ui/lab";

import Box from "shared/ui-kit/Box";
import { getLockedNFTsByOwner } from "shared/services/API/ReserveAPI";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import RentededByMeNFT from "./RentedByMeNFT";
import { RentedByMeStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  650: 2,
  1200: 3,
  1420: 4,
};

const RentedByMe = () => {
  const classes = RentedByMeStyles();
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
        type: "Rented",
      });
      const nfts = response.nfts.map(item => {
        const histories = item?.rentHistories;
        const activeHistory = histories && histories.length && histories[0];
        return {
          ...item,
          history: activeHistory,
        };
      });
      setActivedNfts(
        nfts.filter(
          item => item?.history?.rentalTime * 3600 * 24 * 1000 + item?.history?.created - Date.now() > 0
        )
      );
      setExpiredNfts(
        nfts.filter(
          item => item?.history?.rentalTime * 3600 * 24 * 1000 + item?.history?.created - Date.now() <= 0
        )
      );
      setIsLoading(false);
    }
  };

  const handleFinish = item => {
    const actives = [...activedNfts];
    const index = actives.findIndex(a => a.id === item.id);
    actives.splice(index, 1);
    setActivedNfts([...actives]);
    setExpiredNfts([...expiredNfts, item]);
  };

  const loadingCount = React.useMemo(() => (width > 1000 ? 4 : width > 600 ? 1 : 2), [width]);

  return isLoading ? (
    <div
      style={{
        marginTop: 32,
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
  ) : (
    <Box mb={8}>
      <Box className={classes.title}>Active</Box>
      {activedNfts.length > 0 ? (
        activedNfts.map(item => <RentededByMeNFT item={item} onFinished={handleFinish} />)
      ) : (
        <Box className={classes.content}>No Items</Box>
      )}
      <Box className={classes.title}>Expired</Box>
      {expiredNfts.length > 0 ? (
        expiredNfts.map(item => <RentededByMeNFT item={item} isExpired />)
      ) : (
        <Box className={classes.content}>No Items</Box>
      )}
    </Box>
  );
};

export default RentedByMe;
