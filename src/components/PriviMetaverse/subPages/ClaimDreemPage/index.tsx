import React, { useState, useEffect, useMemo } from "react";
import Moment from "react-moment";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import config from "shared/connectors/web3/config";
import { getClaims, claimToken } from "shared/services/API/DreemClaimAPI";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { claimPageStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Asset",
  },
  {
    headerName: "Amount",
  },
  {
    headerName: "Total Value",
  },
  {
    headerName: "Time",
    sortable: true,
  },
  {
    headerName: "Polygon Scan",
    headerAlign: "center",
  },
];

export default function ClaimDreemPage() {
  const classes = claimPageStyles();
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [releasableAmount, setReleasableAmount] = useState(0);

  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");

  const contractAddress = config["Polygon"].CONTRACT_ADDRESSES.DREEM_LAUNCHPAD_VESTING;

  useEffect(() => {
    if (!account) {
      return;
    }
    (async () => {
      try {
        const response = await getClaims(account);
        setTransactionsList(response?.claims ?? []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [account]);

  const totalValue = useMemo(() => {
    return transactionsList.reduce((total, cur) => total + (cur.amount ? +cur.amount : 0), 0);
  }, [transactionsList]);

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    transactionsList.map(transaction => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" alignItems="center" justifyContent="center">
            <img src={require(`assets/tokens/dreem_token.png`)} alt="token" width={28} />
            <Box ml={1} fontSize={13} fontWeight={800} fontFamily="Rany" color="#fff">
              Dreem
            </Box>
          </Box>
        ),
        cellAlign: "left",
      });
      row.push({
        cell: (
          <Box fontSize={13} fontWeight={800} fontFamily="Rany" color="#fff">
            {+(transaction.amount ?? 0).toFixed(2)} DREEM
          </Box>
        ),
        cellAlign: "left",
      });
      row.push({
        cell: (
          <Box fontSize={13} fontWeight={800} fontFamily="Rany" color="#fff">
            $74.03k
          </Box>
        ),
        cellAlign: "left",
      });
      row.push({
        cell: <Moment fromNow>{transaction.createdAt}</Moment>,
        cellAlign: "left",
      });
      row.push({
        cell: (
          <a
            href={`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${transaction.hash}`}
            target="_blank"
          >
            <img src={require("assets/walletImages/polygon_scan.png")} alt="polygonscan" width={15} />
          </a>
        ),
        cellAlign: "center",
      });
      tableData.push(row);
    });

    return tableData;
  };

  useEffect(() => {
    if (!library?.provider || !account) {
      return;
    }
    (async () => {
      const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const response = await web3APIHandler.DreemLaunchpadVesting.getReleasableAmount(web3, account);
      if (response.success) {
        setReleasableAmount(+response.releasableAmount);
      }
    })();
  }, [library, account]);

  const handleClaimToken = async () => {
    try {
      const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");

      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Network switch failed or was not confirmed on user wallet, please try again", { variant: "error" });
          return;
        }
      }
      const web3 = new Web3(library.provider);
      const web3APIHandler = targetChain.apiHandler;
      const contractRes = await web3APIHandler.DreemLaunchpadVesting.claimToken(
        web3,
        account,
        setTxModalOpen,
        setTxHash
      );
      if (contractRes.success) {
        setTxSuccess(true);
        const { success, ...payload } = contractRes;
        const response = await claimToken(payload);
        if (response.success) {
          setTransactionsList([response.data, ...transactionsList]);
          showAlertMessage(`Successfully claimed tokens`, { variant: "success" });
        } else {
          showAlertMessage(`Transaction is succeed, but there is some issue with database operation`, {
            variant: "error",
          });
        }
      } else {
        setTxSuccess(false);
        showAlertMessage(`Claim token is failed`, { variant: "error" });
      }
    } catch (err) {
      showAlertMessage(`Claim token is failed`, { variant: "error" });
    }
  };

  return (
    <>
      <div className={classes.root}>
        <img
          src={require("assets/metaverseImages/getting_start_page_image.png")}
          alt="decoration_1"
          className={classes.decorationImage1}
        />
        <img
          src={require("assets/metaverseImages/profile_decoration_image_2.png")}
          alt="decoration_2"
          className={classes.decorationImage2}
        />
        <Box className={classes.fitContent}>
          <Box className={classes.typo1}>Claim Dreem</Box>
          <Box className={classes.claimTokenSection}>
            <Box display="flex" alignItems="center">
              <img
                src={require("assets/metaverseImages/claim_token_image.png")}
                alt="claim_token"
                className={classes.claimTokenImg}
              />
              <Box display="flex" flexDirection="column" ml={isTablet || isMobile ? 2 : 4}>
                <Box className={classes.typo2} mb={1}>
                  Contract
                </Box>
                <Box display="flex">
                  <Box className={classes.typo3} mr={1}>
                    {contractAddress}
                  </Box>
                  <img
                    src={require("assets/walletImages/etherscan_yellow.png")}
                    alt="claim_token"
                    width={19}
                    height="100%"
                  />
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mt={isMobile ? 2 : 0}>
              <Box display="flex" flexDirection="column" mr={4}>
                <Box className={classes.typo4} mb={1}>
                  Claimable
                </Box>
                <Box className={classes.typo5} mr={1}>
                  {`${+releasableAmount.toFixed(2)} DREEM`}
                </Box>
              </Box>
              <PrimaryButton
                size="medium"
                style={{
                  background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                  borderRadius: 10,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "Grifter",
                  color: "#212121",
                  minWidth: isMobile || isTablet ? 149 : 252,
                  textTransform: "uppercase",
                  height: 40,
                  paddingTop: 2,
                }}
                onClick={handleClaimToken}
              >
                Claim token
              </PrimaryButton>
            </Box>
          </Box>
          <Box className={classes.typo6} mt={isTablet || isMobile ? 6 : 9}>
            Transactions
          </Box>
          <Box className={classes.transactionInfoSection}>
            <Box display="flex" flexDirection="column">
              <Box className={classes.typo7} mb={1}>
                Total Claimed
              </Box>
              <Box className={classes.typo5} style={{ fontWeight: 700 }}>
                {transactionsList.length}
              </Box>
            </Box>
            <Box height={49} width={2} bgcolor="#FFFFFF10" />
            <Box display="flex" flexDirection="column">
              <Box className={classes.typo7} mb={1}>
                Total Value
              </Box>
              <Box className={classes.typo5} style={{ fontWeight: 700 }}>
                {+totalValue.toFixed(2)} <span>DREEM</span>
              </Box>
            </Box>
          </Box>
          <Box className={classes.transactionsTable}>
            <CustomTable
              headers={TABLEHEADER}
              rows={getTableData()}
              placeholderText="No transactions"
              theme="transaction"
              sorted={{}}
            />
          </Box>
        </Box>
        {txModalOpen && (
          <TransactionProgressModal
            open={txModalOpen}
            title="CLAIMING DREEM"
            transactionSuccess={txSuccess}
            hash={txHash}
            onClose={() => {
              setTxSuccess(null);
              setTxModalOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
}
