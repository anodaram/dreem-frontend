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
import CreateAssetFlow from "./components/CreateAssetFlow";
import SelectType from "./components/SelectType";
import { RootState } from "../../../../store/reducers/Reducer";
import CreateRealmModal from "../../modals/CreateRealmModal";
import { manageContentPageStyles } from "./index.styles";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import CreateAssetModel from "shared/model/CreateAssetModel";

export default function ManageContentPage() {
  const dispatch = useDispatch();
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);
  const publicy = useSelector((state: RootState) => state.underMaintenanceInfo?.publicy);

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const classes = manageContentPageStyles();
  const { activate, chainId, account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const { isSignedin, setSignedin, isOnSigning, setOnSigning } = useAuth();
  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [metaDataForModal, setMetaDataForModal] = useState<any>(null);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0);

  const [hasUnderMaintenanceInfo, setHasUnderMaintenanceInfo] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CreateAssetModel>();

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
          dispatch(
            setUser({
              ...data,
              id: data.priviId,
              infoImage: {
                ...data.infoImage,
                avatarUrl: res.data.user.avatarUrl,
              },
              urlSlug: data.name,
              name: `${data.firstName} ${data.lastName}`,
            })
          );
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

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleAsset = asset => {
    setSelectedAsset(asset);
    if (asset != "WORLD") {
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
        {step == 2 && selectedAsset?.key && (
          <CreateAssetFlow assetItem={selectedAsset.key} handleCancel={handlePrev} />
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
