import React, { useState } from "react";
// import { useHistory } from "react-router-dom";

import { CircularProgress } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { useAuth } from "shared/contexts/AuthContext";
import CreateRealmModal from "../../modals/CreateRealmModal";
import { gettingStartedPageStyles } from "./index.styles";

export default function GettingStartedPage() {
  const classes = gettingStartedPageStyles();
  // const history = useHistory();
  const { showAlertMessage } = useAlertMessage();
  const { isSignedin } = useAuth();

  const [metaDataForModal, setMetaDataForModal] = React.useState<any>(null);
  const [openCreateNftModal, setOpenCreateNftModal] = useState<boolean>(false);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);

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
        <img
          src={require("assets/metaverseImages/getting_start_page_image.png")}
          alt="piece"
          className={classes.picImage}
        />
        <div className={classes.header}>
          <div className={classes.typo3}>Getting Started</div>
          {isSignedin &&
            (isLoadingMetaData ? (
              <Box minWidth={250} display="flex" justifyContent="center">
                <CircularProgress size={24} style={{ color: "#EEFF21" }} />
              </Box>
            ) : (
              <div className={classes.createBtn} onClick={handleOpenRealmModal}>
                Create Realm
              </div>
            ))}
        </div>
        {/* <div className={classes.backBtn} onClick={() => history.goBack()}>
          <img src={require("assets/metaverseImages/back_arrow.png")} />
          <span>BACK</span>
        </div> */}
        <div className={classes.content}>
          <Box className={classes.headerTitle}>
            <div className={classes.title}>How to create</div>
            <div className={classes.title}>content for Dreem?</div>
          </Box>
          <div className={classes.description}>
            <Box display="flex">
              <Box className={classes.orderBox}>1</Box>
              <Box display="flex" flexDirection="column" ml={2} pt={1} flex={1}>
                <div className={classes.typo1}>Connect wallet</div>
                <div className={classes.typo2}>
                  Choose the NFT and financial instrument desired to trade: Pertetual Futures, Everlasting
                  Options
                  <br />
                  or Power Perpetuals.
                </div>
              </Box>
            </Box>
            <Box display="flex" mt={1}>
              <Box className={classes.orderBox}>2</Box>
              <Box display="flex" flexDirection="column" ml={2} pt={1} flex={1}>
                <div className={classes.typo1}>Supported platforms</div>
                <div className={classes.typo2}>
                  Choose the NFT and financial instrument desired to trade: Pertetual Futures, Everlasting
                  <br />
                  Options or Power Perpetuals.
                </div>
              </Box>
            </Box>
            <Box display="flex" mt={1}>
              <Box className={classes.orderBox}>3</Box>
              <Box display="flex" flexDirection="column" ml={2} pt={1} flex={1}>
                <div className={classes.typo1}>Download file</div>
                <div className={classes.typo2}>
                  Choose the NFT and financial instrument desired to trade: Pertetual Futures, Everlasting
                  Options
                  <br />
                  or Power Perpetuals.
                </div>
                <div className={classes.downloadUnityBtn}>
                  <img src={require("assets/metaverseImages/unity-small.png")} alt="unity" />
                  <span>Download Unity File</span>
                </div>
              </Box>
            </Box>
            <Box display="flex" mt={1}>
              <Box className={classes.orderBox}>4</Box>
              <Box display="flex" flexDirection="column" ml={2} pt={1} flex={1}>
                <div className={classes.typo1}>Prepare your design</div>
                <div className={classes.typo2}>
                  Choose the NFT and financial instrument desired to trade: Pertetual Futures, Everlasting
                  Options
                  <br />
                  or Power Perpetuals.
                </div>
              </Box>
            </Box>
            <Box display="flex" mt={1}>
              <Box className={classes.orderBox}>5</Box>
              <Box display="flex" flexDirection="column" ml={2} pt={1} flex={1}>
                <div className={classes.typo1}>Upload file via Create Button</div>
                <div className={classes.typo2}>
                  Choose the NFT and financial instrument desired to trade: Pertetual Futures, Everlasting
                  Options
                  <br />
                  or Power Perpetuals.
                </div>
              </Box>
            </Box>
          </div>
        </div>
      </div>
      {openCreateNftModal && (
        <CreateRealmModal
          open={openCreateNftModal}
          onClose={() => setOpenCreateNftModal(false)}
          metaData={metaDataForModal}
        />
      )}
    </>
  );
}
