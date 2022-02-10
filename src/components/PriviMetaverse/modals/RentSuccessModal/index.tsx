import React from "react";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useSelector } from "react-redux";
import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import { toDecimals } from "shared/functions/web3";
import { RootState } from "store/reducers/Reducer";
import { formatDuration } from "shared/helpers/utils";

import { RentSuccessModalStyles } from "./index.style";
import Web3 from "web3";

export default function RentSuccessModal({ open, nft, setNft, handleClose = () => {} }) {
  const classes = RentSuccessModalStyles();
  const { library, account, chainId } = useWeb3React();
  const chain = React.useMemo(() => BlockchainNets.find(net => net.chainId === chainId), [chainId]);
  const rentHistory = React.useMemo(() => (nft?.rentHistories?.length ? nft.rentHistories[0] : {}), [nft]);
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);

  const getAmount = () => {
    const a =
      +toDecimals(rentHistory?.pricePerSecond, getTokenDecimal(rentHistory?.fundingToken)) *
      rentHistory.rentalTime;
    return Math.round(a * 100) / 100;
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


  const getSyntheticNftAddress = async () => {
    try {
      const web3APIHandler = chain.apiHandler;
      const web3 = new Web3(library.provider);
      const response = await web3APIHandler.RentalManager.getSyntheticNFTAddress(
        web3,
        {
          collectionId: nft.Address,
        },
      );
      return response;
    } catch (err) {
      return '';
    }
  };

  const handleOpenToken = async () => {
    let syntheticAddress: any = nft.syntheticAddress
    if (!syntheticAddress) {
      let response = await getSyntheticNftAddress();
      syntheticAddress = response.nftAddress;
      setNft({...nft, syntheticAddress})
    }
    window.open(`${chain?.scan?.url}/token/${syntheticAddress}?a=${nft.syntheticID}`, "_blank");
  };
  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box className={classes.borderBox} mb={5}>
        <Box className={classes.box}>
          <img src={nft.image} alt="nft" />
          <Box className={classes.tag}>RENTED</Box>
          <Box className={classes.gameName} mt={2}>
            {nft.name}
          </Box>
        </Box>
      </Box>
      <Box className={classes.title} mb={1}>
        You’ve rented {nft.name}.
      </Box>
      <Box className={classes.description} mb={5}>
        Congrat’s you’ve successfully rented <span>{nft.name}</span> at{" "}
        <span>
          {rentHistory?.pricePerSecond && `${getAmount()} ${getTokenSymbol(rentHistory.fundingToken)}`}{" "}
        </span>
        for{" "}
        <span>
          {formatDuration((rentHistory?.rentalTime || 0) * 1000)}.{" You received "}
          <span onClick={handleOpenToken} style={{ cursor: "pointer" }}>
            a synthetic NFT.
          </span>
        </span>
      </Box>
      <PrimaryButton size="medium" onClick={() => handleClose()}>
        done
      </PrimaryButton>
    </Modal>
  );
}
