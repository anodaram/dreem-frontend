import React from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useHistory } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import customProtocolCheck from "custom-protocol-check";

import { useMediaQuery, useTheme, CircularProgress } from "@material-ui/core";

import { METAVERSE_URL } from "shared/functions/getURL";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getDefaultAvatar, getDefaultBGImage } from "shared/services/user/getUserAvatar";
import { CircularLoadingIndicator, Modal, PrimaryButton } from "shared/ui-kit";
import MintingNFTProgressModal from "components/PriviMetaverse/modals/MintingNFTProgressModal";
import EditDraftContentModal from "components/PriviMetaverse/modals/EditDraftContentModal";
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
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";

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
  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const { chainId, account, library } = useWeb3React();
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

  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = React.useState<boolean>(false);
  const [txSuccess, setTxSuccess] = React.useState<boolean | null>(null);
  const [txHash, setTxHash] = React.useState<string>("");

  const [networkName, setNetworkName] = React.useState<string>("");
  const [currentCollection, setCurrentCollection] = React.useState<any>(null);
  const [metadata, setMetadata] = React.useState<any>(null);
  const [chain, setChain] = React.useState<string>(BlockchainNets[0].value);

  const playerVideoItem: any = React.useRef();

  React.useEffect(() => {
    if (open && nftId) {
      MetaverseAPI.getWorld(nftId).then(res1 => {
        setNFT(res1.data);
        MetaverseAPI.getCollection(res1.data.collectionId).then(res2 => {
          setCurrentCollection(res2.data);
          console.log(res2.data, res1.data.collectionId)
        });
        MetaverseAPI.getNFTInfo(res1.data.id).then(res3 => {
          setMetadata(res3.data);
          console.log(res3.data, res1.data.id)
        });
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

  const mintNFT = async () => {
    let collectionData = currentCollection;
    let collectionAddr = collectionData.address;
    let isDraft = collectionData?.kind == "DRAFT" ? true : false;

    const metaData = await onUploadNonEncrypt(metadata, file => uploadWithNonEncryption(file));

    const targetChain = BlockchainNets.find(net => net.value === chain);
    setNetworkName(targetChain.name);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    const uri = `https://elb.ipfsprivi.com:8080/ipfs/${metaData.newFileCID}`;
    console.log(uri);
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
        await MetaverseAPI.convertToNFTWorld(
          nft.id,
          resRoyalty.contractAddress,
          targetChain.name,
          [resRoyalty.tokenId],
          metaData.newFileCID,
          account,
          "0x0000000000000000000000000000000000000000",
          0
        );
        setTxSuccess(true);
        showAlertMessage(`Successfully world minted`, { variant: "success" });
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
        console.log(contractRes);
        await MetaverseAPI.convertToNFTWorld(
          nft.id,
          contractRes.collectionAddress,
          targetChain.name,
          [contractRes.tokenId],
          metaData.newFileCID,
          contractRes.owner,
          contractRes.royaltyAddress,
          0
        );
        setTxSuccess(true);
        showAlertMessage(`Successfully world minted`, { variant: "success" });
      } else {
        setTxSuccess(false);
      }
    }
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
    <>
      <Modal size="medium" isOpen={open} onClose={onClose} className={classes.root}>
        <Box className={classes.close} onClick={onClose}>
          <CloseIcon />
        </Box>
        {nft ? (
          <Box display="flex" height={1}>
            <div className={classes.nftInfoSection}>
              <Box display="flex" flexDirection="column">
                {nft.itemKind === "WORLD" && nft.minted === false && !!isOwner && (
                  <div className={classes.viewLabel}>draft of realm - visible for owner only</div>
                )}
                <Box className={classes.nftContent}>
                  <Box>ID #{nft.id}</Box>
                  {nft.submitter && (
                    <Box className={classes.creatorinfoSection} justifyContent="space-between">
                      <Box
                        display="flex"
                        alignItems="center"
                        onClick={() => history.push(`/profile/${nft.submitter.user.address}`)}
                      >
                        <Avatar size={42} rounded image={nft.submitter.user.avatarUrl ? nft.submitter.user.avatarUrl : getDefaultAvatar()} />
                        <Box display="flex" flexDirection="column" ml={1}>
                          <Box className={classes.typo1}>{`${nft.submitter.user.firstName ?? ""} ${
                            nft.submitter.user.lastName ?? ""
                          }`}</Box>
                          <AddressView
                            className={classes.typo4}
                            address={"@" + nft.submitter.user.priviId}
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
                      {nft.worldBinary ? (
                        <ReactPlayer
                          url={nft.worldBinary}
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
                      ) : nft.worldImage ? (
                        <img src={nft.worldImage} width="100%" height="80%" />
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
                  {isSignedin && nft.minted && (
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
                        Edit Draft
                      </PrimaryButton>
                    ))
                  }
                  {isOwner && !nft.minted && 
                  <PrimaryButton
                      size="medium"
                      className={`${classes.button} ${classes.mintButton}`}
                      style={{
                        minWidth: 250,
                        paddingTop: 6,
                      }}
                      onClick={mintNFT}
                    >
                      Mint NFT
                  </PrimaryButton>
                  }
                </Box>
              ) : null}
            </div>
            {!isMobile && (
              <div className={classes.nftPreviewSection}>
                {nft.worldBinary ? (
                  <ReactPlayer
                    url={nft.worldBinary}
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
                ) : nft.worldImage ? (
                  <img src={nft.worldImage} width="100%" height="80%" />
                ) : null}
              </div>
            )}
            {openEditRealmModal &&
              <EditDraftContentModal 
                  open={openEditRealmModal}
                  onClose={() => setOpenEditRealmModal(false)}
                  draftContent={nft}
                  metaData = {metaDataForModal}
              />
              // (nft.worldIsExtension ? (
              //   <EditExtensionModal
              //     open={openEditRealmModal}
              //     onClose={() => setOpenEditRealmModal(false)}
              //     metaData={metaDataForModal}
              //     realmData={nft}
              //     handleRefresh={() => {
              //       MetaverseAPI.getWorld(nftId).then(res => {
              //         setNFT(res.data);
              //       });
              //       handleRefresh && handleRefresh();
              //     }}
              //   />
              // ) : (
              //   <EditRealmModal
              //     open={openEditRealmModal}
              //     onClose={() => setOpenEditRealmModal(false)}
              //     metaData={metaDataForModal}
              //     realmData={nft}
              //     handleRefresh={() => {
              //       MetaverseAPI.getWorld(nftId).then(res => {
              //         setNFT(res.data);
              //       });
              //       handleRefresh && handleRefresh();
              //     }}
              //   />
              // ))
            }
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
      {txModalOpen && (
        <MintingNFTProgressModal
          open={txModalOpen}
          txSuccess={txSuccess}
          hash={txHash}
          network={networkName}
          nftImage={metadata.image}
          onClose={() => {
            setTxSuccess(null);
            setTxModalOpen(false);
            onClose(null);
          }}
        />
        )}
    </>
  );
};

export default ContentPreviewModal;
