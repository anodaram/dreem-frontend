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
import useWindowDimensions from "shared/hooks/useWindowDimensions";
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
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);

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
  const [selectedAsset, setSelectedAsset] = useState<string>();

  useEffect(() => {
    handleOpenRealmModal()
  }, []);

  useEffect(() => {
    if (underMaintenanceSelector && Object.keys(underMaintenanceSelector).length > 0) {
      setHasUnderMaintenanceInfo(true);
    }
  }, [underMaintenanceSelector]);

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
            handleCancel={handlePrev}
          />
        )}
        {step === 2 && selectedAsset === "texture" && (
          <CreateTextureFlow
            metaData={metaDataForModal}
            handleCancel={handlePrev}
          />
        )}
        {step === 2 && selectedAsset === "material" && (
          <CreateMaterialFlow
            metaData={metaDataForModal}
            handleCancel={handlePrev}
          />
        )}
        {step === 2 && selectedAsset === "3d-asset" && (
          <Create3DAssetFlow
            metaData={metaDataForModal}
            handleCancel={handlePrev}
          />
        )}
        {step === 2 && selectedAsset === "character" && (
          <CreateCharacterFlow
            metaData={metaDataForModal}
            handleCancel={handlePrev}
          />
        )}
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

