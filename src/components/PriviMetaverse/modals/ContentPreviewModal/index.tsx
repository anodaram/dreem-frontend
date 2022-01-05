import React from "react";
import { useHistory } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import customProtocolCheck from "custom-protocol-check";

import { useMediaQuery, useTheme, CircularProgress } from "@material-ui/core";

import { METAVERSE_URL } from "shared/functions/getURL";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { CircularLoadingIndicator, Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import AddressView from "shared/ui-kit/AddressView";
import { CloseIcon, ShareIcon } from "shared/ui-kit/Icons";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { useAuth } from "shared/contexts/AuthContext";
import { detectMob } from "shared/helpers";
import NotAppModal from "components/PriviMetaverse/modals/NotAppModal";
import OpenDesktopModal from "components/PriviMetaverse/modals/OpenDesktopModal";
import EditRealmModal from "../EditRealmModal";
import EditExtensionModal from "../EditExtensionModal";
import { contentPreviewModalStyles } from "./index.styles";

const ContentPreviewModal = ({
  nftId,
  open,
  onClose,
  isOwner,
  handleRefresh,
}: {
  nftId: any;
  open: boolean;
  onClose: (e) => void;
  isOwner?: boolean;
  handleRefresh?: () => void;
}) => {
  const theme = useTheme();
  const history = useHistory();
  const { isSignedin } = useAuth();
  const { showAlertMessage } = useAlertMessage();
  const classes = contentPreviewModalStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const { shareMedia } = useShareMedia();
  const [nft, setNFT] = React.useState<any>();
  const [metaDataForModal, setMetaDataForModal] = React.useState<any>(null);
  const [openEditRealmModal, setOpenEditRealmModal] = React.useState<boolean>(false);
  const [isLoadingMetaDataForEdit, setIsLoadingMetaDataForEdit] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [showPlayModal, setShowPlayModal] = React.useState<boolean>(false);
  const [openNotAppModal, setOpenNotAppModal] = React.useState<boolean>(false);
  const [onProgressVideoItem, setOnProgressVideoItem] = React.useState<any>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [onDurationVideoItem, setOnDurationVideoItem] = React.useState<number>(1);

  const playerVideoItem: any = React.useRef();

  React.useEffect(() => {
    if (open && nftId) {
      MetaverseAPI.getWorld(nftId).then(res => {
        setNFT(res.data);
      });
    }
  }, [open, nftId]);

  const handleOpenEditModal = async () => {
    setIsLoadingMetaDataForEdit(true);
    const res = await MetaverseAPI.getUploadMetadata();
    if (res && res.success) {
      if (res.data.uploading?.enabled) {
        setMetaDataForModal(res.data);
        setIsLoadingMetaDataForEdit(false);
        setOpenEditRealmModal(true);
      } else {
        setIsLoadingMetaDataForEdit(false);
        showAlertMessage(`${res.data.uploading?.message}`, { variant: "error" });
      }
    } else {
      setIsLoadingMetaDataForEdit(false);
      showAlertMessage(`Server is down. Please wait...`, { variant: "error" });
    }
  };

  const handleShareDraft = () => {
    shareMedia("Draft", `realms/${nft.id}`);
  };

  const handleEnterGame = () => {
    if (detectMob()) {
      setShowPlayModal(true);
    } else {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(
          `${METAVERSE_URL()}/getSessionHash/`,
          {
            worldId: nftId,
            worldTitle: nft.worldTitle,
            worldAssetUrl: nft.worldAssetUrl,
            worldTag: nft.worldTag,
          },
          config
        )
        .then(res => {
          let data: any = res.data?.data?.stamp;
          if (data) {
            customProtocolCheck(
              "dreem://" + data,
              () => {
                setOpenNotAppModal(true);
              },
              () => {
                console.log("successfully opened!");
              },
              3000
            );
          }
        });
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.root}>
      <Box className={classes.close} onClick={onClose}>
        <CloseIcon />
      </Box>
      {nft ? (
        <Box display="flex" height={1}>
          <div className={classes.nftInfoSection}>
            <Box display="flex" flexDirection="column">
              {nft.itemKind === "DRAFT_WORLD" && !!isOwner && (
                <div className={classes.viewLabel}>draft of realm - visible for owner only</div>
              )}
              <Box className={classes.nftContent}>
                <Box>ID #{nft.id}</Box>
                {nft.worldCreator && (
                  <Box className={classes.creatorinfoSection} justifyContent="space-between">
                    <Box
                      display="flex"
                      alignItems="center"
                      onClick={() => history.push(`/profile/${nft.worldCreator.user.urlSlug}`)}
                    >
                      <Avatar size={42} rounded image={nft.worldCreator.user.avatarUrl} />
                      <Box display="flex" flexDirection="column" ml={1}>
                        <Box className={classes.typo1}>{`${nft.worldCreator.user.firstName ?? ""} ${
                          nft.worldCreator.user.lastName ?? ""
                        }`}</Box>
                        <AddressView
                          className={classes.typo4}
                          address={"@" + nft.worldCreator.user.urlSlug}
                        />
                      </Box>
                    </Box>
                    <Box
                      className={classes.shareButton}
                      display="flex"
                      alignItems="center"
                      style={{ cursor: "pointer" }}
                      onClick={handleShareDraft}
                      ml={4}
                    >
                      <ShareIcon />
                    </Box>
                  </Box>
                )}
                {isMobile && (
                  <Box className={classes.nftPreviewSection}>
                    {nft.worldVideo ? (
                      <ReactPlayer
                        url={nft.worldVideo}
                        ref={playerVideoItem}
                        controls
                        progressInterval={200}
                        loop={true}
                        playing={isPlaying}
                        onProgress={progress => {
                          setOnProgressVideoItem(progress);
                        }}
                        onDuration={duration => {
                          setOnDurationVideoItem(duration);
                        }}
                        onEnded={() => {
                          //player.current.seekTo(0);
                          setIsPlaying(false);
                        }}
                      />
                    ) : nft.worldImages ? (
                      <img src={nft.worldImages[0]} width="100%" height="80%" />
                    ) : null}
                  </Box>
                )}
                <Box className={classes.typo2} mt={5.625}>
                  {nft.worldTitle || ""}
                </Box>
                <Box className={classes.typo5} mt={5.625}>
                  Description
                </Box>
                <Box className={classes.typo3} mt={1.25} mb={4}>
                  {nft.worldDescription || ""}
                </Box>
              </Box>
              <img
                src={require("assets/metaverseImages/rectangle_yellow.png")}
                alt="Metaverse Shape"
                className={classes.freejectShape}
              />
            </Box>
            {nft.id ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                {isSignedin && nft.worldIsExtension && (
                  <PrimaryButton
                    size="medium"
                    className={classes.button}
                    style={{
                      minWidth: 250,
                      paddingTop: 6,
                      marginLeft: 8,
                      marginBottom: 16,
                    }}
                    onClick={handleEnterGame}
                  >
                    Enter the game
                  </PrimaryButton>
                )}
                {isOwner &&
                  isSignedin &&
                  (isLoadingMetaDataForEdit ? (
                    <Box minWidth={250} display="flex" justifyContent="center">
                      <CircularProgress size={24} style={{ color: "#EEFF21" }} />
                    </Box>
                  ) : (
                    <PrimaryButton
                      size="medium"
                      className={`${classes.button} ${classes.editButton}`}
                      style={{
                        minWidth: 250,
                        paddingTop: 6,
                      }}
                      onClick={handleOpenEditModal}
                    >
                      {nft.worldIsExtension ? "Edit Extension" : "Edit Draft"}
                    </PrimaryButton>
                  ))}
              </Box>
            ) : null}
          </div>
          {!isMobile && (
            <div className={classes.nftPreviewSection}>
              {nft.worldVideo ? (
                <ReactPlayer
                  url={nft.worldVideo}
                  ref={playerVideoItem}
                  controls
                  progressInterval={200}
                  loop={true}
                  playing={isPlaying}
                  onProgress={progress => {
                    setOnProgressVideoItem(progress);
                  }}
                  onDuration={duration => {
                    setOnDurationVideoItem(duration);
                  }}
                  onEnded={() => {
                    //player.current.seekTo(0);
                    setIsPlaying(false);
                  }}
                />
              ) : nft.worldImages ? (
                <img src={nft.worldImages[0]} width="100%" height="80%" />
              ) : null}
            </div>
          )}
          {openEditRealmModal &&
            (nft.worldIsExtension ? (
              <EditExtensionModal
                open={openEditRealmModal}
                onClose={() => setOpenEditRealmModal(false)}
                metaData={metaDataForModal}
                realmData={nft}
                handleRefresh={() => {
                  MetaverseAPI.getWorld(nftId).then(res => {
                    setNFT(res.data);
                  });
                  handleRefresh && handleRefresh();
                }}
              />
            ) : (
              <EditRealmModal
                open={openEditRealmModal}
                onClose={() => setOpenEditRealmModal(false)}
                metaData={metaDataForModal}
                realmData={nft}
                handleRefresh={() => {
                  MetaverseAPI.getWorld(nftId).then(res => {
                    setNFT(res.data);
                  });
                  handleRefresh && handleRefresh();
                }}
              />
            ))}
          {openNotAppModal && (
            <NotAppModal
              open={openNotAppModal}
              onClose={() => {
                setOpenNotAppModal(false);
              }}
            />
          )}
          {showPlayModal && (
            <OpenDesktopModal isPlay open={showPlayModal} onClose={() => setShowPlayModal(false)} />
          )}
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularLoadingIndicator theme="blue" />
        </Box>
      )}
    </Modal>
  );
};

export default ContentPreviewModal;
