import React, { useEffect, useState } from "react";
import BlockedByMeNFT from "./BlockedByMeNFT";

import Box from "shared/ui-kit/Box";
import { getLockedNFTsByOwner } from "shared/services/API/ReserveAPI";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { useAuth } from "shared/contexts/AuthContext";

import { BlockedByMeStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const BlockedByMe = () => {
  const classes = BlockedByMeStyles();
  const { isSignedin } = useAuth();

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

  return isLoading ? (
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
  ) : (
    <Box mb={8}>
      <Box className={classes.title}>Actived</Box>
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
