import React, { useState } from "react";
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
import { RootState } from "../../../../store/reducers/Reducer";
import CreateRealmModal from "../../modals/CreateRealmModal";
import { manageContentPageStyles } from "./index.styles";

export default function ManageContentPage() {
  const dispatch = useDispatch();
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);

  const classes = manageContentPageStyles();
  const { activate, account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [openCreateNftModal, setOpenCreateNftModal] = useState<boolean>(false);
  const { isSignedin, setSignedin, isOnSigning, setOnSigning } = useAuth();
  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [metaDataForModal, setMetaDataForModal] = useState<any>(null);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);

  const signInWithMetamask = () => {
    if (!account) return;

    const web3 = new Web3(library.provider);
    setOnSigning(true);
    API.signInWithMetamaskWallet(account, web3, "Dreem")
      .then(res => {
        if (res.isSignedIn) {
          setSignedin(true);
          const data = res.privian.user;
          dispatch(setUser(data));
          localStorage.setItem("token", res.accessToken);
          localStorage.setItem("address", account);
          localStorage.setItem("userId", data.id);
          localStorage.setItem("userSlug", data.urlSlug ?? data.id);

          axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
          dispatch(setLoginBool(true));
          setOnSigning(false);
        } else {
          if (res.message) {
            showAlertMessage(res.message, { variant: "error" });
            setOnSigning(false);
          } else {
            showAlertMessage("Connect the metamask", { variant: "error" });
            setOnSigning(false);
          }
        }
      })
      .catch(e => setOnSigning(false));
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

  return (
    <>
      <div className={classes.root}>
        <div className={classes.mainContent}>
          <div className={classes.typo2} style={{ textTransform: "uppercase" }}>
            Create your own Dreem
          </div>
          <div className={classes.typo3}>
            Be part of the Dreem, mint your realm as an NFT and monetize on it
          </div>
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
