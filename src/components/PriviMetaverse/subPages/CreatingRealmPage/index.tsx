import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";

import InfiniteScroll from "react-infinite-scroll-component";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { PrimaryButton } from "shared/ui-kit";
import CollectionCard from "components/PriviMetaverse/components/cards/CollectionCard";
import CreateRealm from "./components/CreateRealm";
import TransactionProcessing from "./components/TransactionProcessing";
import { RootState } from "../../../../store/reducers/Reducer";
import { usePageStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 3,
};

export default function CreatingRealmPage() {
  const history = useHistory();
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);

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

  const [currentCollection, setCurrentCollection] = useState<any>();
  const [collections, setCollections] = useState<any[]>([1, 2, 3, 4, 5, 6, 7]);
  const [curPage, setCurPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(0);
  const [loadingCollection, setLoadingCollection] = React.useState<boolean>(false);

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
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const loadMore = () => {
    setLoadingCollection(true);
    // MetaverseAPI.getWorlds(12, curPage, "timestamp", ["DRAFT_WORLD", "NFT_WORLD"], true)
    //   .then(res => {
    //     if (res.success) {
    //       const items = res.data.items;
    //       if (items && items.length > 0) {
    //         setCollections([...collections, ...res.data.items]);
    //         if (res.data.page && curPage <= res.data.page.max) {
    //           setCurPage(curPage => curPage + 1);
    //           setLastPage(res.data.page.max);
    //         }
    //       }
    //     }
    //   })
    //   .finally(() => setLoadingCollection(false));
  };

  return (
    <>
      <div className={classes.root} id="scrollContainer">
        {step === 0 && (
          <div className={classes.content}>
            <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
              <div className={classes.backBtn} onClick={() => history.goBack()}>
                <img src={require("assets/metaverseImages/back_arrow.png")} />
                <span>BACK</span>
              </div>
              <div className={classes.typo1}>Creating new realm</div>
              <Box minWidth={"100px"} />
            </Box>
            <Box className={classes.typo3} mt={"12px"} mb={"24px"}>
              Select or create a collection
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
              <Box className={classes.typo4}>All of your collections</Box>
              <div className={classes.createCollectionBtn} onClick={() => setStep(2)}>
                <PlusIcon />
                create new collection
              </div>
            </Box>
            {collections.length ? (
              <Box width={1}>
                <InfiniteScroll
                  hasChildren={collections.length > 0}
                  dataLength={collections.length}
                  scrollableTarget={"scrollContainer"}
                  next={loadMore}
                  hasMore={!!lastPage && curPage < lastPage}
                  loader={
                    lastPage && curPage === lastPage ? (
                      <Box mt={2}>
                        <MasonryGrid
                          gutter={"16px"}
                          data={Array(loadingCount).fill(0)}
                          renderItem={(item, _) => <CollectionCard isLoading={true} />}
                          columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                        />
                      </Box>
                    ) : (
                      <></>
                    )
                  }
                >
                  <Box mt={4} mb={15}>
                    <MasonryGrid
                      gutter={"16px"}
                      data={collections}
                      renderItem={(item, _) => (
                        <CollectionCard
                          item={item}
                          isLoading={loadingCollection}
                          onClick={() => setCurrentCollection(item)}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  </Box>
                </InfiniteScroll>
              </Box>
            ) : (
              <>
                <Box display="flex" alignItems="center" mt={6} mb={3}>
                  <Box border="2px dashed #FFFFFF40" borderRadius={12} className={classes.sideBox} />
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="2px dashed #FFFFFF"
                    borderRadius={12}
                    mx={"30px"}
                    className={classes.centerBox}
                  >
                    <img src={require("assets/metaverseImages/dreem_fav_icon.png")} />
                  </Box>
                  <Box border="2px dashed #FFFFFF40" borderRadius={12} className={classes.sideBox} />
                </Box>
                <Box className={classes.typo3}>
                  No collections created yet, Create Collection with the button above.
                </Box>
              </>
            )}
          </div>
        )}
        {step === 1 && (
          <div className={classes.content}>
            <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
              <div className={classes.backBtn} onClick={() => history.goBack()}>
                <img src={require("assets/metaverseImages/back_arrow.png")} />
                <span>BACK</span>
              </div>
              <div className={classes.typo1}>Creating new realm</div>
              <Box minWidth={"100px"} />
            </Box>
            <Box className={classes.typo3} my={2}>
              Fill all the details of your new collection
            </Box>
            <CreateRealm metaData={metaDataForModal} handleNext={() => {}} handleCancel={() => {}} />
          </div>
        )}
        {step === 2 && (
          <div className={classes.content}>
            <TransactionProcessing
              hash={"0xf273a38fec99acf1e....eba"}
              status="progress"
              backToHome={() => setStep(0)}
            />
          </div>
        )}
        {(step === 0 || step === 1) && (
          <Box className={classes.footer}>
            <div className={classes.cancelBtn} onClick={handlePrev}>
              back
            </div>
            <PrimaryButton
              size="medium"
              className={classes.nextBtn}
              disabled={step === 0 && !currentCollection}
              onClick={handleNext}
            >
              next
            </PrimaryButton>
          </Box>
        )}
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
