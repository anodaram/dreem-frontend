import React, { useState, useEffect } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import Box from "shared/ui-kit/Box";
import EditNFTDraftTab from "./components/EditNFTDraft";
import EditRoyaltiesDraftTab from "./components/EditRoyaltiesDraft";
import EditFilesNFTTab from "./components/EditFilesNFT";
import EditCollectionDraftTab from "./components/EditCollectionDraft";
import PublicOption from "./components/PublicOption";
import { useModalStyles } from "./index.styles";

const EditDraftContentModal = ({ open, onClose, draftContent, metaData }) => {
  const classes = useModalStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { showAlertMessage } = useAlertMessage();

  const [tabs, setTabs] = useState<string[]>(["NFT", "Royalties", "Files", "Collection"]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [isWorldNFT, setIsWorldNFT] = useState<boolean>(false);
  const [openSelectCollectionPage, setOpenSelectCollectionPage] = useState<boolean>(false);
  const [showUploadingModal, setShowUploadingModal] = useState<boolean>(false);
  const [openPublic, setOpenPublic] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);

  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [unity, setUnity] = useState<any>(null);
  const [unityFile, setUnityFile] = useState<any>(null);
  const [entity, setEntity] = useState<any>(null);
  const [entityFile, setEntityFile] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isRoyalty, setIsRoyalty] = useState<boolean>();
  const [royaltyAddress, setRoyaltyAddress] = useState<string>("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState<string>("");
  const [currentCollection, setCurrentCollection] = useState<any>(draftContent.collectionId);

  useEffect(() => {
    if (!draftContent) return;

    if (draftContent.itemKind === "WORLD") {
      setIsWorldNFT(true);
      setTabs(["Royalties", "Files", "Collection"]);
    } else {
      setIsWorldNFT(false);
      setTabs(["NFT", "Royalties", "Files", "Collection"]);
    }
  }, [draftContent]);

  const handlePage = (index: number) => {
    const newComplete = [...completed];
    setSelectedTab(prev => {
      if (index > prev) {
        if (index > 0) {
          newComplete[0] = true;
          setCompleted(newComplete);
        }
        if (index > 1) {
          newComplete[1] = true;
          setCompleted(newComplete);
        }
        if (index > 2) {
          newComplete[2] = true;
          setCompleted(newComplete);
        }
      }
      return index;
    });
  };

  const handleChangeCollection = value => {
    setOpenSelectCollectionPage(value);
  };


  const handleSaveDraft = async () => {
    // if (validate()) {
      let payload: any = {};
      try {
        if(currentCollection) payload.collectionId = currentCollection;
        payload.worldTitle = title;
        payload.worldDescription = description;
        if(image) payload.worldImage = image;
        if(unity) payload.worldLevel = unity;
        if(video) payload.worldVideo = video;
        if(entity) payload.worldData = entity;
        if (isPublic !== draftContent.isPublic) payload.isPublic = isPublic;
        if(isRoyalty){
          payload.royaltyPercentage = royaltyPercentage
          payload.royaltyAddress = royaltyAddress
        }

        setShowUploadingModal(true);
        setProgress(0);
        await MetaverseAPI.editWorld(draftContent.id, payload);
        setProgress(100);
        setShowUploadingModal(false);
        showAlertMessage(`Updated draft successfully`, { variant: "success" });
        onClose();
      } catch (error) {
        showAlertMessage("Failed to update draft", { variant: "error" });
      }
    // }
  };

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={onClose}
      showCloseIcon
      className={classes.root}
      style={{ maxWidth: openSelectCollectionPage ? "1374px" : "788px" }}
    >
      <Box className={classes.modalContent}>
        <Box className={classes.header1} mt={3}>
          Edit NFT Draft
        </Box>
        <Box className={classes.tabSection}>
          <div className={classes.stepsBorder} />
          <div className={classes.steps}>
            {tabs.map((tab, index) => (
              <div
                className={index <= selectedTab ? classes.selected : undefined}
                key={`tab-${index}`}
                style={{ position: "relative" }}
              >
                {index <= selectedTab &&
                  (completed[index] ? (
                    <div className={classes.tick}>
                      <SuccessIcon />
                    </div>
                  ) : (
                    <div className={classes.tick}>
                      <FailedIcon />
                    </div>
                  ))}

                <button
                  onClick={() => {
                    handlePage(index);
                  }}
                >
                  <div>{index + 1}</div>
                </button>
                <span>{tab}</span>
              </div>
            ))}
          </div>
        </Box>
        <div className={classes.divider} />
        <Box className={classes.mainSection}>
          {selectedTab === 0 && !isWorldNFT && <EditNFTDraftTab />}
          {((selectedTab === 1 && !isWorldNFT) || (selectedTab === 0 && isWorldNFT)) && (
            <EditRoyaltiesDraftTab 
              draftContent={draftContent}
              handleIsRoyalty={(value)=>setIsRoyalty(value)}
              handleRoyaltyPercentage={(value)=>setRoyaltyPercentage(value)}
              handleRoyaltyAddress={(value)=>setRoyaltyAddress(value)}
            />
          )}
          {((selectedTab === 2 && !isWorldNFT) || (selectedTab === 1 && isWorldNFT)) && (
            draftContent.itemKind === "WORLD" &&
            <EditFilesNFTTab
              draftContent={draftContent}
              metaData={metaData}
              handleTitle={(value)=>setTitle(value)}
              handleDescription={(value)=>setDescription(value)}
              handleImage={(value)=>setImage(value)}
              handleVideo={(value)=>setVideo(value)}
              handleUnity={(value)=>setUnity(value)}
              handleEntity={(value)=>setEntity(value)}
            />
          )}
          {((selectedTab === 3 && !isWorldNFT) || (selectedTab === 2 && isWorldNFT)) && (
            <EditCollectionDraftTab 
              currentCollection={currentCollection} 
              onChangeCollection={handleChangeCollection} 
              handleCollection={(value)=>setCurrentCollection(value)}
            />
          )}
          <Box className={classes.footerSection}>
            <SecondaryButton
              size="medium"
              style={{
                height: 48,
                background: "transparent",
                border: "2px solid #fff",
                borderRadius: "100px",
                color: "#fff",
                fontSize: 18,
                paddingTop: 4,
              }}
              onClick={() => setSelectedTab(prev => (prev > 0 ? prev - 1 : prev))}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              style={{
                height: 48,
                width: 270,
                background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                borderRadius: "100px",
                fontSize: 18,
                paddingTop: 4,
                color: "#212121",
              }}
              onClick={() => {
                  setSelectedTab(prev => (prev < 4 ? prev + 1 : prev))
                  selectedTab == 3 && setOpenPublic(true);
                }
              }
            >
              Save Changes
            </PrimaryButton>
          </Box>
        </Box>
      </Box>

      {openPublic && (
        <PublicOption
          open={openPublic}
          onClose={() => {
            setOpenPublic(false);
          }}
          handleSubmit={() => handleSaveDraft()}
          handleSelect={isPublic => setIsPublic(isPublic)}
        />
      )}
    </Modal>
  );
};

export default EditDraftContentModal;

const SuccessIcon = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.0001 1L4.00004 8.00002L1 5"
      stroke="#E9FF26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FailedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 1L1 15M1.00001 1L15 15"
      stroke="#FF6868"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
