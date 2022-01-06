import React, { useState, useEffect } from 'react'
import Box from 'shared/ui-kit/Box'
import { PrimaryButton } from "shared/ui-kit";
import { exploreOptionDetailPageStyles } from '../../index.styles';
import RangeSlider from "shared/ui-kit/RangeSlider";
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers/Reducer';

export default ({isOwnership, nft, refresh}) => {
  const [range, setRange] = useState(0);
  const classes = exploreOptionDetailPageStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    if (nft && nft?.blockingSalesHistories) {
      setBlockingInfo(nft?.blockingSalesHistories[nft?.blockingSalesHistories?.length - 1])
    }
  }, [nft])

  useEffect(() => {
    setRange(blockingInfo?.CollateralPercent)
  }, [blockingInfo])

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address === addr);
    return token?.Symbol || '';
  };
  
  const getTokenAvatar = addr => {
    if (tokens.length == 0) return null;
    let token = tokens.find(token => token.Address === addr);
    return token?.ImageUrl || '';
  };

  return (
    <Box display="flex" flexDirection="column" p={4} pl={4.5} width="100%" style={{ border: "1px solid #9EACF2" }} borderRadius="20px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="column" color="#4218B5">
          <Box fontFamily='Agrandir GrandHeavy' fontSize={18}>Buyer status of reservance</Box>
          <Box fontSize={14}>If buyer is collateral is too small you can claim liquidation and cancel reservation.</Box>
        </Box>
        <PrimaryButton size="medium" className={classes.claimButton}>CLAIM LIQUIDATION</PrimaryButton>
      </Box>
      
      <Box mt={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <span>
            Collateral status<span style={{ color: "#431AB7", marginLeft: 6 }}>{blockingInfo?.TotalCollateralPercent || blockingInfo?.CollateralPercent}%</span>
          </span>
          <span>
            Collateral needed<span style={{ color: "#D30401", marginLeft: 6 }}>100%</span>
          </span>
        </Box>
        <RangeSlider value={range} onChange={(event, newValue) => {}} />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <span>
            <strong>0 %</strong>
          </span>
          <span>
            <strong>100 %</strong>
          </span>
        </Box>
      </Box>

      <Box color="#4218B5" fontFamily='Agrandir GrandHeavy' fontSize={18} mt={4.5}>Collateral available</Box>
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        borderTop="1px solid #00000010"
        borderBottom="1px solid #00000010"
        padding="8px 50px"
        mt={3}
      >
        <Box className={classes.tableHeader} flex={0.4}>account</Box>
        <Box className={classes.tableHeader} flex={0.6}>symbol</Box>
        <Box className={classes.tableHeader} flex={0.3}>% of</Box>
        <Box className={classes.tableHeader} flex={0.3}>amount</Box>
      </Box>
      <Box display="flex" flex={1} alignItems="center" padding="15px 50px">
        <Box flex={0.4} color="#4218B5">{blockingInfo?.Beneficiary?.substr(0, 6) + "..." + blockingInfo?.Beneficiary?.substr(blockingInfo?.Beneficiary?.length - 6, 6)}</Box>
        <Box flex={0.6}>
          <img src={getTokenAvatar(blockingInfo?.PaymentToken)} width={24} />
        </Box>
        <Box flex={0.3}>{blockingInfo?.TotalCollateralPercent || blockingInfo?.CollateralPercent} %</Box>
        <Box flex={0.3}>{`${blockingInfo?.Price * (blockingInfo?.TotalCollateralPercent || blockingInfo?.CollateralPercent) / 100} ${getTokenSymbol(blockingInfo?.PaymentToken)}`}</Box>
      </Box>
    </Box>
  )
}