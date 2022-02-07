import React, { useEffect, useState } from "react";

import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { useStyles } from "./index.styles";
import { getNftGameFeed } from "shared/services/API/DreemAPI";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toDecimals } from "shared/functions/web3";
import { RootState } from "store/reducers/Reducer";
import { listenerSocket } from "components/Login/Auth";

export default function RecentTransactions() {
  const classes = useStyles();
  const isProd = process.env.REACT_APP_ENV === "prod";
  const { collection_id }: { collection_id: string } = useParams();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionloading, setTransactionLoading] = useState<boolean>(false);
  const [transactionHasMore, setTransactionHasMore] = useState<boolean>(false);
  const [lastTransactionId, setLastTransactionId] = useState<any>();

  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    loadTransactions(true);
  }, []);

  useEffect(() => {
    if (listenerSocket) {
      const updateMarketPlaceFeedHandler = _transaction => {
        if (transactions && transactions.length) {
          const _transactions = transactions.map(transaction => (_transaction.id === transaction.id ? _transaction : transaction));
          setTransactions(_transactions);
        }
      };

      listenerSocket.on("updateMarketPlaceFeed", updateMarketPlaceFeedHandler);

      return () => {
        listenerSocket.removeListener("updateMarketPlaceFeed", updateMarketPlaceFeedHandler);
      };
    }
  }, [listenerSocket]);

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals;
  };

  const loadTransactions = async (init = false) => {
    if (transactionloading) return;
    try {
      setTransactionLoading(true);

      const response = await getNftGameFeed({
        gameId: collection_id,
        lastId: init ? undefined : lastTransactionId,
        searchValue: undefined,
        mode: isProd ? "main" : "test",
        status: undefined,
      });
      if (response.success) {
        const newCharacters = response.data.list;
        const newLastId = response.data.lastId;
        const newhasMore = response.data.hasMore;

        setTransactions(prev => (init ? newCharacters : [...prev, ...newCharacters]));
        setLastTransactionId(newLastId);
        setTransactionHasMore(newhasMore);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTransactionLoading(false);
    }
  };
  
  return (
    <Box className={classes.root}>
      <div className={classes.title}>Recent Transactions</div>
      <Box className={classes.content}>
        {transactions && transactions.length > 0 ? (
          transactions.map((item, index) => (
            <Box className={classes.nftItem}>
              <Avatar size={40} rounded={false} radius={4} image={item?.image || getDefaultAvatar()} />
              <Box className={classes.typo1}>{item.name}</Box>
              <Box className={classes.typo1}>{+toDecimals(item.price || (item.pricePerSecond * item.rentalTime), getTokenDecimal(item.paymentToken || item.fundingToken))} {getTokenSymbol(item.paymentToken || item.fundingToken)}</Box>
              <Box
                className={classes.typeTag}
                style={{
                  background:
                    item.type && item.type.toLowerCase() === "rented"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)"
                      : item.type && item.type.toLowerCase() === "sold"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #91D502 -25.18deg, #E5FF46 15deg, rgba(186, 252, 0, 0.76) 103.13deg, #A3CC00 210deg, #91D502 334.82deg, #E5FF46 375deg)"
                      : item.type && item.type.toLowerCase() === "blocked"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #F24A25 -73.13deg, #FF3124 15deg, rgba(202, 36, 0, 0.76) 103.13deg, #F2724A 210deg, #F24A25 286.87deg, #FF3124 375deg)"
                      : item.type && item.type.toLowerCase() === "transfer"
                      ? "conic-gradient(from 180deg at 50% 50%, #C7CAFE 0deg, rgba(196, 214, 250, 0.92) 135deg, rgba(238, 239, 244, 0.75) 230.62deg, rgba(114, 145, 255, 0.87) 303.75deg, #C7CAFE 360deg)"
                      : "",
                }}
              >
                {item.type}
              </Box>
              <Box style={{ cursor: "pointer" }}>
                <ArrowIcon />
              </Box>
            </Box>
          ))
        ) : (
          <Box></Box>
        )}
      </Box>
    </Box>
  );
}

const ArrowIcon = () => (
  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.45693 15L8.09668 8.36102L1.09668 1.36102"
      stroke="white"
      stroke-opacity="0.5"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
