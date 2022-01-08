import React, { useState, useEffect } from "react";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { exploreOptionDetailPageStyles } from "../../index.styles";
import RangeSlider from "shared/ui-kit/RangeSlider";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import AddCollateralModal from "components/PriviMetaverse/modals/AddCollateralModal";
import { useWeb3React } from "@web3-react/core";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getChainForNFT, switchNetwork } from "shared/functions/metamask";
import Web3 from "web3";
import { useParams } from "react-router-dom";
import { updateBlockingHistory } from "shared/services/API/ReserveAPI";
import { toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "components/PriviMetaverse/modals/TransactionProgressModal";

const isProd = process.env.REACT_APP_ENV === "prod";

export default ({ isOwnership, nft, refresh }) => {
  const [range, setRange] = useState(0);
  const classes = exploreOptionDetailPageStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const [openCollateralModal, setOpenCollateralModal] = useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const { collection_id, token_id } = useParams();
  const [selectedChain] = useState<any>(getChainForNFT(nft));
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    if (nft && nft?.blockingSalesHistories) {
      setBlockingInfo(nft?.blockingSalesHistories[nft?.blockingSalesHistories?.length - 1]);
    }
  }, [nft]);

  useEffect(() => {
    setRange(blockingInfo?.TotalCollateralPercent);
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

  const collateralPercent = blockingInfo?.TotalCollateralPercent;

  const onWithdraw = async () => {
    if (chainId && chainId !== selectedChain?.chainId) {
      const isHere = await switchNetwork(selectedChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
        return;
      }
    }
    setOpenTransactionModal(true);
    const web3Config = selectedChain.config;
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);

    const reservePriceToken = tokens.find(item => item.Address == blockingInfo?.PaymentToken)

    const activeReserveId = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ["address", "uint256", "address", "address"],
        [nft.Address, token_id, blockingInfo.from, blockingInfo.Beneficiary]
      )
    );

    const response = await web3APIHandler.ReservesManager.decreaseReserveCollateral(
      web3,
      account!,
      {
        activeReserveId,
        amount: toNDecimals(Number(blockingInfo?.Price) * Number(blockingInfo?.TotalCollateralPercent) / 100, reservePriceToken.Decimals),
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      
      await updateBlockingHistory({
        mode: isProd ? "main" : "test",
        CollectionId: collection_id,
        TokenId: token_id,
        OfferId: nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].id,
        TotalCollateralPercent: 0,
        PaidAmount: nft?.blockingSalesHistories[nft?.blockingSalesHistories.length - 1].PaidAmount || 0,
        notificationMode: 0
      });

      refresh();
      // handleClose();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

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
        {blockingInfo?.PaidAmount !== blockingInfo?.Price ? (
          <PrimaryButton
            size="medium"
            className={classes.addCollateral}
            onClick={() => setOpenCollateralModal(true)}
          >
            ADD COLLATERAL
          </PrimaryButton>
        ) : Number(collateralPercent) ? (
          <PrimaryButton
            size="medium"
            className={classes.addCollateral}
            onClick={() => {
              onWithdraw();
            }}
          >
            WITHDRAW YOUR COLLATERAL
          </PrimaryButton>
        ) : null}
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

      {Number(collateralPercent) ? (
        <>
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
              (blockingInfo?.Price * (blockingInfo?.TotalCollateralPercent)) /
              100
            } ${getTokenSymbol(blockingInfo?.PaymentToken)}`}</Box>
          </Box>
        </>
      ): (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontFamily="GRIFTER"
          fontSize={20}
          fontWeight={700}
          color="#E9FF26"
          mt={4}
          style={{
            textTransform: "uppercase"
          }}
        >
          <CheckIcon />
          <span>collateral withdrawn</span>
        </Box>
      )}
      
      <AddCollateralModal
        open={openCollateralModal}
        handleClose={() => setOpenCollateralModal(false)}
        nft={nft}
        refresh={refresh}
      />
      {openTranactionModal && (
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash("");
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
          network={selectedChain?.value.replace(" blockchain", "") || ""}
        />
      )}
    </Box>
  );
};

const CheckIcon = () => (
  <svg width="40" height="31" viewBox="0 0 40 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15.1543L15.2168 24.3711L33.5879 6" stroke="url(#paint0_linear_5033_87025)" stroke-width="8" stroke-linecap="square"/>
    <defs>
      <linearGradient id="paint0_linear_5033_87025" x1="5.1682" y1="6" x2="38.4456" y2="8.01924" gradientUnits="userSpaceOnUse">
        <stop stop-color="#EEFF21"/>
        <stop offset="1" stop-color="#B7FF5C"/>
      </linearGradient>
    </defs>
  </svg>
)