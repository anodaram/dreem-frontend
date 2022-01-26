import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress } from "@material-ui/core";

import { useAuth } from "shared/contexts/AuthContext";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
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
import CreateNFTFlow from "./components/CreateNFTFlow";
import CreateTextureFlow from "./components/CreateTextureFlow";
import CreateMaterialFlow from "./components/CreateMaterialFlow";
import Create3DAssetFlow from "./components/Create3DAssetFlow";
import CreateCharacterFlow from "./components/CreateCharacterFlow";
import SelectType from "./components/SelectType";
import { RootState } from "../../../../store/reducers/Reducer";
import CreateRealmModal from "../../modals/CreateRealmModal";
import { manageContentPageStyles } from "./index.styles";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";

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

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const classes = manageContentPageStyles();
  const { activate, chainId, account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [openCreateNftModal, setOpenCreateNftModal] = useState<boolean>(false);
  const { isSignedin, setSignedin, isOnSigning, setOnSigning } = useAuth();
  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [metaDataForModal, setMetaDataForModal] = useState<any>(null);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);

  const width = useWindowDimensions().width;
  const [step, setStep] = useState<number>(0);
  const [worldCurStep, setWorldCurStep] = useState<number>(1);
  const [textureCurStep, setTextureCurStep] = useState<number>(1);

  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");

  // uploading modal
  const [showUploadingModal, setShowUploadingModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUpload, setIsUpload] = useState(true);

  //uploading data
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [unity, setUnity] = useState<any>(null);
  const [unityFile, setUnityFile] = useState<any>(null);
  const [entity, setEntity] = useState<any>(null);
  const [entityFile, setEntityFile] = useState<any>(null);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const unityInputRef = useRef<HTMLInputElement>(null);
  const entityInputRef = useRef<HTMLInputElement>(null);

  const [hasUnderMaintenanceInfo, setHasUnderMaintenanceInfo] = useState(false);
  const [openCreateCollectionModal, setOpenCreateCollectionModal] = useState<boolean>(false);
  const loadingCount = React.useMemo(() => (width > 1000 ? 6 : width > 600 ? 3 : 6), [width]);
  const [currentCollection, setCurrentCollection] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [curPage, setCurPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(0);
  const [loadingCollection, setLoadingCollection] = React.useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<string>();

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
    loadMore();
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
    console.log("----", step);
    if (step == 2) {
      switch (selectedAsset) {
        case "world":
          if (worldCurStep < 2) {
            setWorldCurStep(prev => prev + 1);
          } else {
            setStep(prev => prev + 1);
          }
          break;
        case "texture":
          if (textureCurStep < 3) {
            setTextureCurStep(prev => prev + 1);
          } else {
            setStep(prev => prev + 1);
          }
          break;
        case "material":
          if (textureCurStep < 3) {
            setTextureCurStep(prev => prev + 1);
          } else {
            setStep(prev => prev + 1);
          }
          break;
        case "3d-asset":
          if (textureCurStep < 3) {
            setTextureCurStep(prev => prev + 1);
          } else {
            setStep(prev => prev + 1);
          }
          break;
        case "character":
          if (textureCurStep < 3) {
            setTextureCurStep(prev => prev + 1);
          } else {
            setStep(prev => prev + 1);
          }
          break;

        default:
          break;
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleAsset = asset => {
    setSelectedAsset(asset);
    if (asset != "world") {
      setStep(2);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleRefreshCollection = () => {
    setStep(3);
    setCurPage(1);
    setLoadingCollection(true);
    MetaverseAPI.getCollections(12, 1, "DESC")
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          if (items && items.length > 0) {
            setCollections(res.data.elements);
            if (res.data.page && curPage <= res.data.page.max) {
              setCurPage(curPage => curPage + 1);
              setLastPage(res.data.page.max);
            }
          }
        }
      })
      .finally(() => setLoadingCollection(false));
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

  const validate = () => {
    let sizeSpec = metaDataForModal;
    if (!currentCollection) {
      showAlertMessage(`Please select collection first`, { variant: "error" });
      return false;
    }
    if (!title || !description || !image || !unity) {
      showAlertMessage(`Please fill all the fields to proceed`, { variant: "error" });
      return false;
    }
    if (!video) {
      showAlertMessage(`Please fill all the fields to proceed`, { variant: "error" });
      return false;
    }
    if (title.length < sizeSpec?.worldTitle.limit.min || title.length > sizeSpec?.worldTitle.limit.max) {
      showAlertMessage(
        `Name field invalid. Must be alphanumeric and contain from ${sizeSpec?.worldTitle.limit.min} to ${sizeSpec?.worldTitle.limit.max} characters`,
        {
          variant: "error",
        }
      );
      return false;
    } else if (
      description.length < sizeSpec?.worldDescription.limit.min ||
      description.length > sizeSpec?.worldDescription.limit.max
    ) {
      showAlertMessage(
        `Description field invalid. Must be alphanumeric and contain from ${sizeSpec?.worldDescription.limit.min} to ${sizeSpec?.worldDescription.limit.max} characters`,
        { variant: "error" }
      );
      return false;
    } else if (image.size > sizeSpec?.worldImage.limit.maxBytes) {
      showAlertMessage(`Image field invalid. Size cannot exceed ${sizeSpec?.worldImage.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else if (video && video.size > sizeSpec?.worldVideo.limit.maxBytes) {
      showAlertMessage(`Video field invalid. Size cannot exceed ${sizeSpec?.worldVideo.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else if (
      !sizeSpec?.worldLevel.supportedFormats.toString().includes(unity.name.split(".").reverse()[0])
    ) {
      showAlertMessage(`World file is invalid.`, { variant: "error" });
      return false;
    } else if (unity.size > sizeSpec?.worldLevel.limit.maxBytes) {
      showAlertMessage(`World file invalid. Size cannot exceed ${sizeSpec?.worldLevel.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else if (!entity.name.includes(sizeSpec?.worldMeta.supportedFormats.toString())) {
      showAlertMessage(`World data is invalid.`, { variant: "error" });
      return false;
    } else if (entity.size > sizeSpec?.worldMeta.limit.maxBytes) {
      showAlertMessage(`World data invalid. Size cannot exceed ${sizeSpec?.worldMeta.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handleSaveDraft = async () => {
    if (validate()) {
      let payload: any = {};
      let collectionAddr = currentCollection.address;
      let tokenId;

      payload = {
        collectionId: currentCollection.id,
        worldTitle: title,
        worldDescription: description,
        worldImage: image,
        worldLevel: unity,
        worldData: entity,
        isPublic: isPublic,
      };

      if (video) payload.worldVideo = video;

      setShowUploadingModal(true);
      setProgress(0);
      MetaverseAPI.uploadWorld(payload).then(async res => {
        if (!res.success) {
          showAlertMessage(`Failed to upload world`, { variant: "error" });
          setShowUploadingModal(false);
        } else {
          setResponse(res.data);
          setShowUploadingModal(false);
          showAlertMessage(`Created draft successfully`, { variant: "success" });
        }
      });
    }
  };
  const mintNFT = async () => {
    let collectionData = currentCollection;
    let metadata = response.medadata;
    let collectionAddr = collectionData.address;
    let tokenId;
    let isDraft = collectionData?.kind == "DRAFT" ? true : false;

    const metaData = await onUploadNonEncrypt(metadata, file => uploadWithNonEncryption(file));

    const targetChain = BlockchainNets.find(net => net.value === chain);

    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    const uri = `https://elb.ipfsprivi.com:8080/ipfs/${metaData.newFileCID}`;
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    console.log("----metadata:", metaData, isDraft);

    if (isDraft) {
      console.log("here-----");
      const resRoyalty = await web3APIHandler.RoyaltyFactory.mint(
        web3,
        account,
        {
          name: collectionData.name,
          symbol: collectionData.symbol,
          uri,
        },
        setTxModalOpen,
        setTxHash
      );
      if (resRoyalty.success) {
        setTxSuccess(true);
        showAlertMessage(`Successfully world minted`, { variant: "success" });

        await MetaverseAPI.convertToNFTWorld(
          metaData.id,
          resRoyalty.contractAddress,
          targetChain.name,
          resRoyalty.tokenId,
          metaData.newFileCID,
          account,
          "0x0000000000000000000000000000000000000000"
        );
        handleRefreshCollection();
      } else {
        setTxSuccess(false);
      }
    } else {
      const contractRes = await web3APIHandler.NFTWithRoyalty.mint(
        web3,
        account,
        {
          collectionAddress: collectionAddr,
          to: account,
          uri,
        },
        setTxModalOpen,
        setTxHash
      );

      if (contractRes.success) {
        setTxSuccess(true);
        showAlertMessage(`Successfully world minted`, { variant: "success" });
        console.log(contractRes);
        await MetaverseAPI.convertToNFTWorld(
          response.item.id,
          contractRes.collectionAddress,
          targetChain.name,
          contractRes.tokenId,
          metadata.newFileCID,
          contractRes.owner,
          contractRes.royaltyAddress
        );
        handleRefreshCollection();
      } else {
        setTxSuccess(false);
      }
    }
  };

  return (
    <>
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
                    Create
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
          <SelectType
            handleNext={asset => {
              handleAsset(asset);
            }}
          />
        )}
        {step === 2 && selectedAsset === "world" && (
          <CreateNFTFlow
            metaData={metaDataForModal}
            step={worldCurStep}
            handleNext={() => {}}
            handleCancel={handlePrev}
            handleRefresh={() => handleRefreshCollection()}
          />
        )}
        {step === 2 && selectedAsset === "texture" && (
          <CreateTextureFlow
            metaData={metaDataForModal}
            step={textureCurStep}
            handleNext={() => {}}
            handleCancel={handlePrev}
            handleRefresh={() => handleRefreshCollection()}
          />
        )}
        {step === 2 && selectedAsset === "material" && (
          <CreateMaterialFlow
            metaData={metaDataForModal}
            step={textureCurStep}
            handleNext={() => {}}
            handleCancel={handlePrev}
            handleRefresh={() => handleRefreshCollection()}
          />
        )}
        {step === 2 && selectedAsset === "3d-asset" && (
          <Create3DAssetFlow
            metaData={metaDataForModal}
            step={textureCurStep}
            handleNext={() => {}}
            handleCancel={handlePrev}
            handleRefresh={() => handleRefreshCollection()}
          />
        )}
        {step === 2 && selectedAsset === "character" && (
          <CreateCharacterFlow
            metaData={metaDataForModal}
            step={textureCurStep}
            handleNext={() => {}}
            handleCancel={handlePrev}
            handleRefresh={() => handleRefreshCollection()}
          />
        )}
        {step === 3 && (
          <div className={classes.otherContent}>
            <div className={classes.typo1}>Creating new NFT</div>
            <Box className={classes.typo3} mb={3}>
              Select or create a collection to create NFT in
            </Box>
            {collections.length ? (
              <>
                <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
                  <Box className={classes.typo4}>All of your collections</Box>
                  <div className={classes.createCollectionBtn} onClick={() => setStep(4)}>
                    <PlusIcon />
                    create new collection
                  </div>
                </Box>
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
              </>
            ) : (
              <Box pb={20}>
                <Box className={classes.typo4}>All of your collections</Box>
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
                <Box display="flex" alignItems="center" justifyContent="center" width={1} mt="20px">
                  <div className={classes.createCollectionBtn} onClick={() => setStep(4)}>
                    <PlusIcon />
                    create new collection
                  </div>
                </Box>
              </Box>
            )}
          </div>
        )}
        {step === 4 && (
          <div className={classes.otherContent}>
            <div className={classes.typo1}>Creating New Collection</div>
            <Box className={classes.typo3} mb={3}>
              Fill all the details of your new collection
            </Box>
            <CreateCollection
              handleNext={() => {}}
              handleCancel={() => setStep(2)}
              handleRefresh={() => handleRefreshCollection()}
            />
          </div>
        )}
        {step > 2 || (step === 2 && collections.length) ? (
          <Box className={classes.footer}>
            <div className={classes.howToCreateBtn} onClick={handlePrev}>
              back
            </div>
            {step < 3 && (
              <PrimaryButton
                size="medium"
                className={classes.nextBtn}
                disabled={step === 1 && !currentCollection}
                onClick={() => handleNext()}
              >
                next
              </PrimaryButton>
            )}
            {step === 3 && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <div className={classes.howToCreateBtn} onClick={() => {}}>
                  create draft
                </div>
                <PrimaryButton size="medium" className={classes.nextBtn} onClick={() => {}}>
                  mint nft
                </PrimaryButton>
              </Box>
            )}
          </Box>
        ) : null}
      </div>
      {/* {openCreateNftModal && (
        <CreateRealmModal
          open={openCreateNftModal}
          onClose={() => setOpenCreateNftModal(false)}
          metaData={metaDataForModal}
        />
      )} */}
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
