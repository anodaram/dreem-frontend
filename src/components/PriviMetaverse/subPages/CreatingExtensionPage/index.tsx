import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";

import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { PrimaryButton } from "shared/ui-kit";
import TransactionProcessing from "./components/TransactionProcessing";
import DepositRequiredModal from "components/PriviMetaverse/modals/DepositRequiredModal";
import { RootState } from "../../../../store/reducers/Reducer";
import { usePageStyles } from "./index.styles";
import CollectionList from "./CollectionList";
import WorldList from "./WorldList";

export default function CreatingRealmPage() {
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);

  const { id: realmId } = useParams<{ id: string }>();
  const { chainId, account, library } = useWeb3React();
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);
  const classes = usePageStyles();
  const { showAlertMessage } = useAlertMessage();
  const width = useWindowDimensions().width;

  const [step, setStep] = useState<number>(0);

  const [openCreateNftModal, setOpenCreateNftModal] = useState<boolean>(false);
  const [openCreateCollectionModal, setOpenCreateCollectionModal] = useState<boolean>(false);
  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [hasUnderMaintenanceInfo, setHasUnderMaintenanceInfo] = useState(false);
  const [metaDataForModal, setMetaDataForModal] = useState<any>(null);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);

  const loadingCount = React.useMemo(() => (width > 1000 ? 6 : width > 600 ? 3 : 6), [width]);

  const [networkName, setNetworkName] = useState<string>("");
  const [realmData, setRealmData] = useState<any>({});
  const [currentCollection, setCurrentCollection] = useState<any>();
  const [collections, setCollections] = useState<any[]>([]);
  const [worldHash, setWorldHash] = useState<any>(null);
  const [nftAddress, setNFTAddress] = useState<any>(null);
  const [nftId, setNFTId] = useState<any>(null);
  const [depositInfo, setDepositInfo] = useState<any>(null);
  const [protocolFee, setProtocolFee] = useState<any>(null);
  const [curPage, setCurPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(0);
  const [loadingCollection, setLoadingCollection] = React.useState<boolean>(false);
  const [showDepositRequireModal, setShowDepositRequireModal] = React.useState<boolean>(false);
  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<string>("progress");
  const [txHash, setTxHash] = useState<string>("");

  useEffect(() => {
    if (underMaintenanceSelector && Object.keys(underMaintenanceSelector).length > 0) {
      setHasUnderMaintenanceInfo(true);
    }
  }, [underMaintenanceSelector]);

  useEffect(() => {
    if (step === 2) {
      handleOpenCollectionModal();
    } else if (step === 3) {
      handleOpenRealmModal();
    }
  }, [step]);

  useEffect(() => {
    if (realmId) {
      loadRealm(realmId);
    }
    getSettings();
    loadMore();
  }, []);

  const loadRealm = realmId => {
    MetaverseAPI.getAsset(realmId).then(res => {
      setRealmData(res.data);
    });
  };
  const getSettings = () => {
    MetaverseAPI.getDepositInfo().then(res => {
      setDepositInfo(res.data);
    });
    MetaverseAPI.getProtocolFee().then(res => {
      setProtocolFee(res.data);
    });
  };

  const handleOpenRealmModal = async () => {
    setIsLoadingMetaData(true);
    const res = await MetaverseAPI.getUploadMetadata();
    if (res && res.success) {
      if (res.data.uploading?.enabled) {
        setMetaDataForModal(res.data);
        setIsLoadingMetaData(false);
        setOpenCreateNftModal(true);
      } else {
        setIsLoadingMetaData(false);
        showAlertMessage(`${res.data.uploading?.message}`, { variant: "error" });
      }
    } else {
      setIsLoadingMetaData(false);
      showAlertMessage(`Server is down. Please wait...`, { variant: "error" });
    }
  };

  const handleOpenCollectionModal = () => {
    setOpenCreateCollectionModal(true);
  };

  const handleNext = () => {
    if (step == 0) {
      setStep(prev => prev + 1);
    } else {
      setShowDepositRequireModal(true);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const loadMore = () => {
    setLoadingCollection(true);
    MetaverseAPI.getAssets(12, curPage, "DESC", ["COLLECTION"], true)
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          if (items && items.length > 0) {
            setCollections([...collections, ...res.data.elements]);
            if (res.data.page && curPage <= res.data.page.max) {
              setCurPage(curPage => curPage + 1);
              setLastPage(res.data.page.max);
            }
          }
        }
      })
      .finally(() => setLoadingCollection(false));
  };

  const handleConfirm = async () => {
    const targetChain = BlockchainNets.find(net => net.value === chain);
    setNetworkName(targetChain.name);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }
    if (!library) {
      showAlertMessage("Please check your network", { variant: "error" });
      return;
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    const contractRes = await web3APIHandler.RealmFactory.applyExtension(
      web3,
      account,
      {
        contractAddress: realmData?.realmAddress,
        amount: 1000000,
        nftToAttachAddress: nftAddress,
        nftToAttachId: nftId,
      },
      setTxModalOpen,
      setTxHash
    );

    if (contractRes.success) {
      setTxSuccess("success");
      showAlertMessage(`Successfully applied extension`, { variant: "success" });
    } else {
      setTxSuccess("failed");
    }
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.otherContent} id="scrollContainer">
          {step === 0 && (
            <>
              <Box className={classes.typo1}>Apply extension</Box>
              <Box className={classes.typo3}>Select nft from your minted NFTs</Box>
              <Box className={classes.typo4}>All of your collections</Box>
              <CollectionList
                handleNext={() => {}}
                handleCancel={() => {}}
                handleSelect={item => {
                  setCurrentCollection(item);
                }}
              />
            </>
          )}
          {step === 1 && (
            <>
              {showDepositRequireModal ? (
                <DepositRequiredModal
                  open={showDepositRequireModal}
                  depositInfo={depositInfo}
                  protocolFee={protocolFee}
                  realmTaxation={realmData.realmTaxation}
                  onClose={() => setShowDepositRequireModal(false)}
                  onApprove={() => {}}
                  onConfirm={() => handleConfirm()}
                />
              ) : (
                <>
                  <Box className={classes.typo4}>Apply extension</Box>
                  <Box className={classes.typo3}>
                    Select one of your works on that collection to apply for and extension
                  </Box>
                  <WorldList
                    handleNext={() => {}}
                    handleCancel={() => {}}
                    handleSelect={(hash, address, id) => {
                      setWorldHash(hash);
                      setNFTAddress(address);
                      setNFTId(id);
                    }}
                  />
                </>
              )}
            </>
          )}
          {txModalOpen && <TransactionProcessing hash={txHash} status={txSuccess} backToHome={setStep(1)} />}
          <Box className={classes.footer}>
            <div className={classes.cancelBtn} onClick={handlePrev}>
              back
            </div>
            <PrimaryButton size="medium" className={classes.nextBtn} disabled={false} onClick={handleNext}>
              next
            </PrimaryButton>
          </Box>
        </div>
      </div>
      {noMetamask && <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />}
    </>
  );
}
