import React, { useEffect, useState } from "react";

import BlockedByMeNFT from "./RentedByMeNFT";

import Box from "shared/ui-kit/Box";
import { getLockedNFTsByOwner } from "shared/services/API/ReserveAPI";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { useAuth } from "shared/contexts/AuthContext";

import { RentedByMeStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const RentedByMe = () => {
  const classes = RentedByMeStyles();
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
        type: "Rented",
      });
      const nfts = response.nfts.map(item => {
        const histories = item?.rentHistories;
        const activeHistory = histories[0];
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

  const handleFinish = (item) => {
    const actives = [...activedNfts];
    const index = actives.findIndex(a => a.id === item.id)
    actives.splice(index, 1);
    setActivedNfts([...actives]);
    setExpiredNfts([
      ...expiredNfts,
      item
    ])
  }

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
        activedNfts.map(item => <BlockedByMeNFT item={item} onFinished={handleFinish} />)
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

export default RentedByMe;
