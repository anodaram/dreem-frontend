import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import { exploreOptionDetailPageStyles } from "../../index.styles";

export default ({ nft }) => {
  const classes = exploreOptionDetailPageStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    setBlockingInfo(nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1]);
  }, []);

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token?.Symbol || "";
  };

  const getTokenImage = addr => {
    if (tokens.length == 0) return "";
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token?.ImageUrl;
  };

  return (
    <Box className={classes.gradientBorder} display="flex" flexDirection="column" p={4} pl={4.5} width="100%">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="column" color="#FF6868">
          <Box className={classes.dangerText} fontFamily="GRIFTER" fontSize={20}>
            Collateral Lost
          </Box>
          <Box fontFamily="Rany" fontSize={14}>
            Your collateral was lost because you didn’t manage to pay for NFT reserval on time.{" "}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        borderTop="1px solid #ffffff10"
        borderBottom="1px solid #ffffff10"
        padding="8px 50px"
        mt={3}
      >
        <Box className={classes.tableHeader} flex={0.8}>
          token
        </Box>
        <Box className={classes.tableHeader} flex={0.2}>
          % of
        </Box>
        <Box className={classes.tableHeader} flex={0.2}>
          amount
        </Box>
      </Box>
      <Box display="flex" flex={1} alignItems="center" padding="15px 50px">
        <Box flex={0.8}>
          <img src={getTokenImage(blockingInfo?.PaymentToken)} width={24} />
        </Box>
        <Box flex={0.2}>{blockingInfo?.TotalCollateralPercent} %</Box>
        <Box flex={0.2}>{`${((Number(blockingInfo?.Price) * Number(blockingInfo?.TotalCollateralPercent)) / 100).toFixed(2)} ${getTokenSymbol(
          blockingInfo?.PaymentToken
        )}`}</Box>
      </Box>
    </Box>
  );
};
