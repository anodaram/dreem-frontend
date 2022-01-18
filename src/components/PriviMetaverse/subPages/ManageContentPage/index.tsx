import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress } from "@material-ui/core";

import { useAuth } from "shared/contexts/AuthContext";
import Box from "shared/ui-kit/Box";
import { CircularLoadingIndicator, PrimaryButton } from "shared/ui-kit";
import MetaMaskIcon from "assets/walletImages/metamask1.svg";
import * as API from "shared/services/API/WalletAuthAPI";
import { injected } from "shared/connectors";
import { setUser } from "store/actions/User";
import { setLoginBool } from "store/actions/LoginBool";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import InfiniteScroll from "react-infinite-scroll-component";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import CollectionCard from "components/PriviMetaverse/components/cards/CollectionCard";
import CreateCollection from "./components/CreateCollection";
import CreateNFT from "./components/CreateNFT";
import { RootState } from "../../../../store/reducers/Reducer";
import CreateRealmModal from "../../modals/CreateRealmModal";
import { manageContentPageStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 3,
};

export default function ManageContentPage() {
  const dispatch = useDispatch();
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);
  const publicy = useSelector((state: RootState) => state.underMaintenanceInfo?.publicy);

  const classes = manageContentPageStyles();
  const { activate, account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [openCreateNftModal, setOpenCreateNftModal] = useState<boolean>(false);
  const { isSignedin, setSignedin, isOnSigning, setOnSigning } = useAuth();
  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [metaDataForModal, setMetaDataForModal] = useState<any>(null);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);

  const width = useWindowDimensions().width;
  const [step, setStep] = useState<number>(0);
  const [hasUnderMaintenanceInfo, setHasUnderMaintenanceInfo] = useState(false);
  const [openCreateCollectionModal, setOpenCreateCollectionModal] = useState<boolean>(false);
  const loadingCount = React.useMemo(() => (width > 1000 ? 6 : width > 600 ? 3 : 6), [width]);
  const [currentCollection, setCurrentCollection] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
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
  
  useEffect(() => {
    loadMore()
  }, []);

  const signInWithMetamask = () => {
    if (!account) return;

    const web3 = new Web3(library.provider);
    setOnSigning(true);
    API.signInWithMetamaskWallet(account, web3, "Dreem")
      .then(res => {
        if (res.isSignedIn) {
          setSignedin(true);
          const data = res.data.user;
          dispatch(setUser(data));
          localStorage.setItem("token", res.accessToken);
          localStorage.setItem("address", account);
          localStorage.setItem("userId", data.priviId);
          localStorage.setItem("userSlug", data.urlSlug ?? data.priviId);

          axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
          dispatch(setLoginBool(true));
          setOnSigning(false);
        } else {
          if (res.message) {
            if (res.message === "Wallet address doesn't exist" && publicy) {
              signUp(res.signature);
            } else {
              showAlertMessage(res.message, { variant: "error" });
              setOnSigning(false);
            }
          } else {
            showAlertMessage("Connect the metamask", { variant: "error" });
            setOnSigning(false);
          }
        }
      })
      .catch(e => setOnSigning(false));
  };

  const signUp = async signature => {
    if (account) {
      const res = await API.signUpWithAddressAndName(account, account, signature, "Dreem");
      if (res.isSignedIn) {
        setSignedin(true);
        const data = res.data.user;
        dispatch(setUser(data));
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("address", account);
        localStorage.setItem("userId", data.priviId);
        localStorage.setItem("userSlug", data.urlSlug ?? data.priviId);

        axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
        dispatch(setLoginBool(true));
        setOnSigning(false);
      } else {
        showAlertMessage(res.message, { variant: "error" });
        setOnSigning(false);
      }
    }
  };

  const handleConnect = () => {
    activate(injected, undefined, true)
      .then(res => {
        console.log("connected");
        signInWithMetamask();
      })
      .catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(injected).then(res => {
            signInWithMetamask();
          });
        } else {
          console.info("Connection Error - ", error);
          setNoMetamask(true);
        }
      });
  };

  const openLearnToCreator = () => {
    window.open(
      "https://metaverse-2.gitbook.io/metaverse-creator-manual/05OugTkVduc9hQ7Ajmqc/quick-start",
      "_blank"
    );
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
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const loadMore = () => {
    setLoadingCollection(true);
    MetaverseAPI.getCollections(12, curPage, "ASC")
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

  return (
    <>
      {/* <div className={classes.root}>
        <div className={classes.mainContent}>
          <div className={classes.typo2}>Create your own Dreem</div>
          <Box className={classes.typo3} mt={"24px"} mb={"50px"}>
            Be part of the Dreem, mint your realm as an NFT and monetize on it
          </Box>
          <Box display="flex" alignItems="center">
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
          <Box mt={"45px"} mb={"28px"}></Box>
          {isSignedin ? (
            <Box pl={2} className={classes.buttons}>
              {isLoadingMetaData ? (
                <Box minWidth={250} display="flex" justifyContent="center">
                  <CircularProgress size={24} style={{ color: "#EEFF21" }} />
                </Box>
              ) : (
                <div className={classes.createBtn} onClick={handleOpenRealmModal}>
                  Create Realm
                </div>
              )}
              <Box mx={1}></Box>
              <div className={classes.howToCreateBtn} onClick={openLearnToCreator}>
                Learn how to create
              </div>
            </Box>
          ) : (
            <PrimaryButton
              onClick={handleConnect}
              size="medium"
              className={classes.button}
              disabled={isOnSigning || underMaintenanceSelector?.underMaintenance}
              style={{
                pointerEvents: isOnSigning ? "none" : undefined,
                opacity: isOnSigning ? 0.4 : undefined,
              }}
            >
              {isOnSigning && !underMaintenanceSelector?.underMaintenance ? (
                <CircularLoadingIndicator />
              ) : (
                <img src={MetaMaskIcon} alt="metamask" width={25} />
              )}
              <div style={{ marginTop: 4 }}>Log in</div>
            </PrimaryButton>
          )}
        </div>
      </div> */}
      <div className={classes.root} id="scrollContainer">
        {step === 0 && (
          <div className={classes.mainContent}>
            <div className={classes.typo2}>Create your own Dreem</div>
            <Box className={classes.typo3} mt={"24px"} mb={"50px"}>
              Be part of the Dreem, mint your realm as an NFT and monetize on it
            </Box>
            <Box display="flex" alignItems="center">
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
            <Box mt={"45px"} mb={"28px"}></Box>
            {isSignedin ? (
              <Box pl={2} className={classes.buttons}>
                {isLoadingMetaData ? (
                  <Box minWidth={250} display="flex" justifyContent="center">
                    <CircularProgress size={24} style={{ color: "#EEFF21" }} />
                  </Box>
                ) : (
                  <div className={classes.createBtn} onClick={() => setStep(1)}>
                    Create NFT
                  </div>
                )}
                <Box mx={1}></Box>
                <div className={classes.howToCreateBtn} onClick={openLearnToCreator}>
                  Learn how to create
                </div>
              </Box>
            ) : (
              <PrimaryButton
                onClick={handleConnect}
                size="medium"
                className={classes.button}
                disabled={
                  isOnSigning ||
                  !hasUnderMaintenanceInfo ||
                  (underMaintenanceSelector &&
                    Object.keys(underMaintenanceSelector).length > 0 &&
                    underMaintenanceSelector.underMaintenance)
                }
                style={{
                  pointerEvents: isOnSigning ? "none" : undefined,
                  opacity: isOnSigning ? 0.4 : undefined,
                }}
              >
                {isOnSigning && !underMaintenanceSelector?.underMaintenance ? (
                  <CircularLoadingIndicator />
                ) : (
                  <img src={MetaMaskIcon} alt="metamask" width={25} />
                )}
                <div style={{ marginTop: 4 }}>Log in</div>
              </PrimaryButton>
            )}
          </div>
        )}
        {step === 1 && (
          <div className={classes.otherContent}>
            <div className={classes.typo1}>Creating new NFT</div>
            <Box className={classes.typo3} mt={"12px"} mb={"24px"}>
              Select or create a collection to create NFT in
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
              <Box className={classes.typo4}>All of your collections</Box>
              <div className={classes.createCollectionBtn} onClick={() => setStep(2)}>
                <PlusIcon />
                create new collection
              </div>
            </Box>
            {collections.length ? (
              <Box width={1} pb={20}>
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
                  <Box mt={4}>
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
              <Box pb={20}>
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
              </Box>
            )}
          </div>
        )}
        {step === 2 && (
          <div className={classes.otherContent}>
            <div className={classes.typo1}>Creating new collection</div>
            <Box className={classes.typo3} mt={"12px"} mb={"24px"}>
              Fill all the details of your new collection
            </Box>
            <CreateCollection handleNext={() => {}} handleCancel={handlePrev} />
          </div>
        )}
        {step === 3 && (
          <div className={classes.otherContent}>
            <div className={classes.typo1}>Creating new NFT</div>
            <Box className={classes.typo3} mt={"12px"} mb={"24px"}>
              Fill all the details of your new nft.
            </Box>
            <CreateNFT metaData={metaDataForModal} handleNext={() => {}} handleCancel={handlePrev} />
          </div>
        )}
        {step > 1 || (step === 1 && collections.length) ? (
          <Box className={classes.footer}>
            <div className={classes.howToCreateBtn} onClick={handlePrev}>
              back
            </div>
            <PrimaryButton
              size="medium"
              className={classes.nextBtn}
              disabled={step === 1 && !currentCollection}
              onClick={() => setStep(3)}
            >
              next
            </PrimaryButton>
          </Box>
        ) : null}
      </div>
      {openCreateNftModal && (
        <CreateRealmModal
          open={openCreateNftModal}
          onClose={() => setOpenCreateNftModal(false)}
          metaData={metaDataForModal}
        />
      )}
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
