import React, { useState, useEffect } from "react";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { exploreOptionDetailPageStyles } from "../../index.styles";
import RangeSlider from "shared/ui-kit/RangeSlider";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import AddCollateralModal from "components/PriviMetaverse/modals/AddCollateralModal";

export default ({ isOwnership, nft, refresh }) => {
  const [range, setRange] = useState(0);
  const classes = exploreOptionDetailPageStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const [openCollateralModal, setOpenCollateralModal] = useState<boolean>(false);

  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    if (nft && nft?.blockingSalesHistories) {
      setBlockingInfo(nft?.blockingSalesHistories[nft?.blockingSalesHistories?.length - 1]);
    }
  }, [nft]);

  useEffect(() => {
    setRange(blockingInfo?.CollateralPercent);
  }, [blockingInfo]);

  const getTokenSymbol = addr => {
    if (tokens.length == 0) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const getTokenImageUrl = addr => {
    if (tokens.length == 0) return null;
    let token = tokens.find(token => token.Address === addr);
    return token?.ImageUrl ?? "";
  };

  const collateralPercent = blockingInfo?.TotalCollateralPercent || blockingInfo?.CollateralPercent;

  return (
    <Box
      className={classes.gradientBorder}
      display="flex"
      flexDirection="column"
      p={4}
      pl={4.5}
      width="100%"
      borderRadius="20px"
      fontFamily="Rany"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="column" color="white">
          <Box className={classes.gradientText} fontFamily="GRIFTER" fontSize={20} fontWeight="700">
            Manage Collateral
          </Box>
          <Box fontSize={14}>
            Make sure your’e collateral is above the liquidation level, otherwise you’ll loos your NFT and
            whole collateral.
          </Box>
        </Box>
        {blockingInfo?.PaidAmount !== blockingInfo?.Price && (
          <PrimaryButton
            size="medium"
            className={classes.addCollateral}
            onClick={() => setOpenCollateralModal(true)}
          >
            ADD COLLATERAL
          </PrimaryButton>
        )}
      </Box>

      <Box mt={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <span>
            Your Collateral Percentage
            <span style={{ color: "#E9FF26", marginLeft: 6 }}>
              {Number(collateralPercent).toFixed(2)}%
            </span>
          </span>
          <span>
            Liquadation LTV<span style={{ color: "#E9FF26", marginLeft: 6 }}>80%</span>
          </span>
        </Box>
        <RangeSlider value={range} variant="transparent" onChange={(event, newValue) => {}} />
        <Box display="flex" alignItems="center" mt={1}>
          <Box flex="0.125">
            <strong>0%</strong>
          </Box>
          <Box flex="0.1875">
            <strong>10% Liquidation</strong>
          </Box>
          <Box flex="0.3125">25% High Risk</Box>
          <Box flex="0.375">50% Medium Risk</Box>
          <Box>
            <strong>80% Low Risk</strong>
          </Box>
        </Box>
      </Box>

      <Box className={classes.gradientText} fontFamily="GRIFTER" fontSize={20} fontWeight="700" mt={4.5}>
        Collateral deposited
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
          <img src={getTokenImageUrl(blockingInfo?.PaymentToken)} width={24} />
        </Box>
        <Box flex={0.2}>{Number(collateralPercent).toFixed(2)} %</Box>
        <Box flex={0.2}>{`${
          (blockingInfo?.Price * (blockingInfo?.TotalCollateralPercent || blockingInfo?.CollateralPercent)) /
          100
        } ${getTokenSymbol(blockingInfo?.PaymentToken)}`}</Box>
      </Box>
      <AddCollateralModal
        open={openCollateralModal}
        handleClose={() => setOpenCollateralModal(false)}
        nft={nft}
        refresh={refresh}
      />
    </Box>
  );
};
