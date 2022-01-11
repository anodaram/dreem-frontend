import React from "react";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useSelector } from "react-redux";
import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import { toDecimals } from "shared/functions/web3";
import { RootState } from "store/reducers/Reducer";
import { RentSuccessModalStyles } from "./index.style";

export default function RentSuccessModal({ open, nft, handleClose = () => {} }) {
  const classes = RentSuccessModalStyles();
  const { chainId } = useWeb3React();

  const chain = React.useMemo(() => BlockchainNets.find(net => net.chainId === chainId), [chainId]);
  const rentHistory = nft?.rentHistories?.length ? nft.rentHistories[0] : {};
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  const getAmount = () => {
    const a =
      +toDecimals(rentHistory?.pricePerSecond, getTokenDecimal(rentHistory?.fundingToken)) *
      rentHistory.rentalTime;
    return Math.round(a * 100) / 100;
  };

  const handleOpenToken = () => {
    window.open(`${chain?.scan?.url}/token/${nft.Address}?a=${nft.tokenId}`, "_blank");
  };

  const getTokenSymbol = addr => {
    if (tokenList.length == 0 || !addr) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return null;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals ?? 1;
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box className={classes.borderBox} mb={5}>
        <Box className={classes.box}>
          <img src={nft.Image} alt="nft" />
          <Box className={classes.tag}>RENTED</Box>
          <Box className={classes.gameName} mt={2}>
            {nft.CollectionName}
          </Box>
        </Box>
      </Box>
      <Box className={classes.title} mb={1}>
        You’ve rented {nft.CollectionName}.
      </Box>
      <Box className={classes.description} mb={5}>
        Congrat’s you’ve succesfully rented <span>{nft.CollectionName}</span> at{" "}
        <span>
          {rentHistory?.pricePerSecond && `${getAmount()} ${getTokenSymbol(rentHistory.fundingToken)}`}.{" "}
          <span onClick={handleOpenToken} style={{ cursor: "pointer" }}>
            You can go to
          </span>
        </span>{" "}
        Management and enjoy your Synthetic GAME
      </Box>
      <PrimaryButton size="medium" onClick={() => handleClose()}>
        done
      </PrimaryButton>
    </Modal>
  );
}
