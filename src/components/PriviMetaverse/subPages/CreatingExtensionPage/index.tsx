import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";

import InfiniteScroll from "react-infinite-scroll-component";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import CollectionCard from "components/PriviMetaverse/components/cards/CollectionCard";
import { PrimaryButton } from "shared/ui-kit";
import TransactionProcessing from "./components/TransactionProcessing";
import DepositRequiredModal from "components/PriviMetaverse/modals/DepositRequiredModal";
import { RootState } from "../../../../store/reducers/Reducer";
import { usePageStyles } from "./index.styles";
import CollectionList from "./CollectionList";
import WorldList from "./WorldList";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 3,
};

export default function CreatingRealmPage() {
  const history = useHistory();
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);

  const { id: realmId } = useParams<{ id: string }>();
  const { activate, chainId, account, library } = useWeb3React();
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
    // getSettings()
    loadMore()
  }, []);

  const loadRealm = realmId => {
    MetaverseAPI.getWorld(realmId)
      .then(res => {
        setRealmData(res.data);
      })
  };
  const getSettings = () => {
    MetaverseAPI.getMetaverseSetting()
      .then(res => {
        console.log(res)
      })
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
    if(step == 0){
      setStep(prev => prev + 1);
    } else {
      setShowDepositRequireModal(true)
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const loadMore = () => {
    setLoadingCollection(true);
    MetaverseAPI.getCollections(12, curPage, "DESC")
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
    if(!library) {
      showAlertMessage("Please check your network", { variant: "error" });
      return;
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    console.log('---', web3APIHandler.RealmFactory)
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
      console.log(contractRes);
      // await MetaverseAPI.realmMint(
      //   savingDraft.instance.hashId,
      //   contractRes.txHash,
      //   targetChain.name,
      //   contractRes.proposalId,
      //   contractRes.owner,
      //   contractRes.proposalType,
      // );
      setTxSuccess('success');
      showAlertMessage(`Successfully applied extension`, { variant: "success" });
    } else {
      setTxSuccess('failed');
    }
  }

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
                  onClose={()=>setShowDepositRequireModal(false)}
                  onApprove={()=>{}}
                  onConfirm={()=>handleConfirm()}
                />
              ) :
              (<>
                <Box className={classes.typo4}>Apply extension</Box>
                <Box className={classes.typo3}>Select one of your works on that collection to apply for and extension</Box>
                <WorldList
                  handleNext={() => {}}
                  handleCancel={() => {}}
                  handleSelect={(hash, address, id) => {
                    setWorldHash(hash);
                    setNFTAddress(address);
                    setNFTId(id);
                  }}
                />
              </>)}
            </>
          )}
          {txModalOpen && 
            <TransactionProcessing
              hash={txHash}
              status={txSuccess}
              backToHome={setStep(1)}
  />
          }
          <Box className={classes.footer}>
            <div className={classes.cancelBtn} onClick={handlePrev}>
              back
            </div>
            <PrimaryButton
              size="medium"
              className={classes.nextBtn}
              disabled={false}
              onClick={
                handleNext
              }
            >
              next
            </PrimaryButton>
          </Box>
        </div>
      </div>
      {noMetamask && <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />}
    </>
  );
}

const PlusIcon = () => (
  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 12.0488V2.04883M1.5 7.04883L11.5 7.04883"
      stroke="#151515"
      strokeWidth="2.5"
      strokeLinecap="square"
    />
  </svg>
);

const PolygonIcon = () => (
  <svg width="39" height="34" viewBox="0 0 39 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M29.0273 10.2004C28.3273 9.80039 27.4273 9.80039 26.6273 10.2004L21.0273 13.5004L17.2273 15.6004L11.7273 18.9004C11.0273 19.3004 10.1273 19.3004 9.32734 18.9004L5.02734 16.3004C4.32734 15.9004 3.82734 15.1004 3.82734 14.2004V9.20039C3.82734 8.40039 4.22734 7.60039 5.02734 7.10039L9.32734 4.60039C10.0273 4.20039 10.9273 4.20039 11.7273 4.60039L16.0273 7.20039C16.7273 7.60039 17.2273 8.40039 17.2273 9.30039V12.6004L21.0273 10.4004V7.00039C21.0273 6.20039 20.6273 5.40039 19.8273 4.90039L11.8273 0.200391C11.1273 -0.199609 10.2273 -0.199609 9.42734 0.200391L1.22734 5.00039C0.427344 5.40039 0.0273438 6.20039 0.0273438 7.00039V16.4004C0.0273438 17.2004 0.427344 18.0004 1.22734 18.5004L9.32734 23.2004C10.0273 23.6004 10.9273 23.6004 11.7273 23.2004L17.2273 20.0004L21.0273 17.8004L26.5273 14.6004C27.2273 14.2004 28.1273 14.2004 28.9273 14.6004L33.2273 17.1004C33.9273 17.5004 34.4273 18.3004 34.4273 19.2004V24.2004C34.4273 25.0004 34.0273 25.8004 33.2273 26.3004L29.0273 28.8004C28.3273 29.2004 27.4273 29.2004 26.6273 28.8004L22.3273 26.3004C21.6273 25.9004 21.1273 25.1004 21.1273 24.2004V21.0004L17.3273 23.2004V26.5004C17.3273 27.3004 17.7273 28.1004 18.5273 28.6004L26.6273 33.3004C27.3273 33.7004 28.2273 33.7004 29.0273 33.3004L37.1273 28.6004C37.8273 28.2004 38.3273 27.4004 38.3273 26.5004V17.0004C38.3273 16.2004 37.9273 15.4004 37.1273 14.9004L29.0273 10.2004Z"
      fill="white"
    />
  </svg>
);
