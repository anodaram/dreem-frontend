import React, { useEffect, useState, useRef } from "react";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled } from "@material-ui/core";
import ReactPlayer from "react-player";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import FileUploadingModal from "components/PriviMetaverse/modals/FileUploadingModal";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";
import { useModalStyles } from "./index.styles";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { sanitizeIfIpfsUrl } from "shared/helpers";

const CreateExtensionDraftModal = ({ realmId, onClose, open, loadRealm, metaData }) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [videoThumbnailURL, setVideoThumbnailURL] = useState<any>('');
  const [unity, setUnity] = useState<any>(null);
  const [unityFile, setUnityFile] = useState<any>(null);
  const [entity, setEntity] = useState<any>(null);
  const [entityFile, setEntityFile] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  
  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const unityInputRef = useRef<HTMLInputElement>(null);
  const entityInputRef = useRef<HTMLInputElement>(null);

  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");

  // uploading modal
  const [showUploadingModal, setShowUploadingModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUpload, setIsUpload] = useState(true);
  const [sizeSpec, setSizeSpec] = useState<any>(metaData);

  const [isPublic, setIsPublic] = useState<boolean>(true);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const onImageInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleImageFiles(files);
    }
    e.preventDefault();

    if (imageInputRef !== null && imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageFiles = (files: any) => {
    if (files && files[0] && files[0].type) {
      setImage(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageFile(reader.result);
        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onVideoInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleVideoFiles(files);
    }
    e.preventDefault();

    if (videoInputRef !== null && videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleVideoFiles = (files: any) => {
    if (files && files[0]) {
      setVideo(files[0]);
      setVideoThumbnailURL(URL.createObjectURL(files[0]));

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setVideoFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onUnityInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleUnityFiles(files);
    }
    e.preventDefault();

    if (unityInputRef !== null && unityInputRef.current) {
      unityInputRef.current.value = "";
    }
  };

  const handleUnityFiles = (files: any) => {
    if (files && files[0]) {
      setUnity(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUnityFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onEntityInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleEntityFiles(files);
    }
    e.preventDefault();

    if (entityInputRef !== null && entityInputRef.current) {
      entityInputRef.current.value = "";
    }
  };

  const handleEntityFiles = (files: any) => {
    if (files && files[0]) {
      setEntity(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setEntityFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };
  const validate = () => {
    if (!title || !description || !image || !unity || !entity) {
      showAlertMessage(`Please fill all the fields to proceed`, { variant: "error" });
      return false;
    }

    if (title.length < sizeSpec.worldTitle.limit.min || title.length > sizeSpec.worldTitle.limit.max) {
      showAlertMessage(
        `Name field invalid. Must be alphanumeric and contain from ${sizeSpec.worldTitle.limit.min} to ${sizeSpec.worldTitle.limit.max} characters`,
        {
          variant: "error",
        }
      );
      return false;
    } else if (
      description.length < sizeSpec.worldDescription.limit.min ||
      description.length > sizeSpec.worldDescription.limit.max
    ) {
      showAlertMessage(
        `Description field invalid. Must be alphanumeric and contain from ${sizeSpec.worldDescription.limit.min} to ${sizeSpec.worldDescription.limit.max} characters`,
        { variant: "error" }
      );
      return false;
    } else if (image.size > sizeSpec.worldImage.limit.maxBytes) {
      showAlertMessage(`Image field invalid. Size cannot exceed ${sizeSpec.worldImage.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else if (video && video.size > sizeSpec.worldVideo.limit.maxBytes) {
      showAlertMessage(`Video field invalid. Size cannot exceed ${sizeSpec.worldVideo.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else if (
      !sizeSpec.worldLevel.supportedFormats.toString().includes(unity.name.split(".").reverse()[0])
    ) {
      showAlertMessage(`World file is invalid.`, { variant: "error" });
      return false;
    } else if (unity.size > sizeSpec.worldLevel.limit.maxBytes) {
      showAlertMessage(`World file invalid. Size cannot exceed ${sizeSpec.worldLevel.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else if (!entity.name.includes(sizeSpec.worldMeta.supportedFormats.toString())) {
      showAlertMessage(`World data is invalid.`, { variant: "error" });
      return false;
    } else if (entity.size > sizeSpec.worldMeta.limit.maxBytes) {
      showAlertMessage(`World data invalid. Size cannot exceed ${sizeSpec.worldMeta.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handleWorld = async () => {
    if (validate()) {
      let payload: any = {
        worldTitle: title,
        worldDescription: description,
        worldImage: image,
        worldLevel: unity,
        worldMeta: entity,
        parentId: realmId,
        isPublic: isPublic,
      };

      if (video) payload.worldVideo = video;

      setShowUploadingModal(true);
      setProgress(0);
      MetaverseAPI.uploadWorld(payload)
        .then(async res => {
          if (!res.success) return;

          setProgress(100);
          setShowUploadingModal(false);
          showAlertMessage(`Created extension successfully`, { variant: "success" });
          onClose();
          loadRealm(realmId);
        })
        .catch(err => {
          showAlertMessage(`Failed to upload world`, { variant: "error" });
        });
    }
  };

  return (
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={onClose}
        showCloseIcon
        className={classes.content}
        style={{
          padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
        }}
      >
        <div className={classes.modalContent}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box className={classes.title} mb={1.5}>
              Create Extension Draft
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mb={1}>
              Extension Name
            </Box>
            <InfoTooltip tooltip={"Please give your extension a name."} />
          </Box>
          <input
            className={classes.input}
            placeholder="Extension Name"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              {sizeSpec.worldDescription.header}
            </Box>
            <InfoTooltip tooltip={"Please give your extension a description."} />
          </Box>
          <textarea
            style={{ height: "130px" }}
            className={classes.input}
            placeholder="File description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              {sizeSpec.worldImage.header}
            </Box>
            <InfoTooltip tooltip={"Please add an image of your extension."} />
          </Box>
          <Box
            className={classes.uploadBox}
            onClick={() => !image && imageInputRef.current?.click()}
            style={{
              cursor: image ? undefined : "pointer",
            }}
          >
            {image ? (
              <>
                <Box
                  className={classes.image}
                  style={{
                    backgroundImage: `url(${sanitizeIfIpfsUrl(imageFile)})`,
                    backgroundSize: "cover",
                  }}
                />
                <Box flex={1} display="flex" justifyContent="flex-end" ml={3}>
                  <SecondaryButton
                    size="medium"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImage(null);
                      setImageFile(null);
                      imageInputRef.current?.click();
                    }}
                  >
                    <img src={require("assets/metaverseImages/refresh.png")} />
                    <span style={{ marginTop: 1, marginLeft: 8 }}>CHANGE FILE</span>
                  </SecondaryButton>
                </Box>
              </>
            ) : (
              <>
                <Box className={classes.image}>
                  <img width={26} src={require("assets/icons/image-icon.png")} alt="image" />
                </Box>
                <Box className={classes.controlBox} ml={5}>
                  Drag image here or <span>browse media on your device</span>
                  <br />
                  We suggest 600 x 600 px size for best viewing experience
                </Box>
              </>
            )}
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              {sizeSpec.worldVideo.header}
            </Box>
            <InfoTooltip
              tooltip={
                "Please give your extension a video. This video can be considered as your teaser to your extension."
              }
            />
          </Box>
          <Box
            className={classes.uploadBox}
            onClick={() => !video && videoInputRef.current?.click()}
            style={{
              cursor: video ? undefined : "pointer",
            }}
          >
            {video ? (
              <>
                <div style={{marginLeft: 20}}>
                  <ReactPlayer playing={false} controls={false} url={videoThumbnailURL} width="85" height={85} />
                </div>
                <Box flex={1} display="flex" justifyContent="flex-end" ml={3}>
                  <SecondaryButton
                    size="medium"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setVideo(null);
                      setVideoFile(null);
                      videoInputRef.current?.click();
                    }}
                  >
                    <img src={require("assets/metaverseImages/refresh.png")} />
                    <span style={{ marginTop: 1, marginLeft: 8 }}>CHANGE FILE</span>
                  </SecondaryButton>
                </Box>
              </>
            ) : (
              <>
                <Box className={classes.image}>
                  <img src={require("assets/icons/video_outline_white_icon.png")} alt="video" />
                </Box>
                <Box className={classes.controlBox} ml={5}>
                  Drag video here or <span>browse media on your device</span>
                  <br />
                  Maximum video size is 30mb
                </Box>
              </>
            )}
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              {sizeSpec.worldLevel.header}
            </Box>
            <InfoTooltip
              tooltip={
                "Please input your extension source file (.dreemworld) that was generated by the dreem creator toolkit. The maximum size allowed is 50MB - if your file exceeds this limit, try reducing the size of resources."
              }
            />
          </Box>
          <PrimaryButton
            size="medium"
            className={classes.uploadBtn}
            onClick={() => {
              !unity && unityInputRef.current?.click();
            }}
          >
            {unity ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={1}
                fontSize={12}
                style={{ background: "#E9FF26 !important", borderRadius: "8px !important" }}
              >
                {unity.name}
                <SecondaryButton
                  size="medium"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUnity(null);
                    setUnityFile(null);
                    unityInputRef.current?.click();
                  }}
                >
                  <img src={require("assets/metaverseImages/refresh.png")} />
                  <span style={{ marginTop: 1, marginLeft: 8 }}>CHANGE FILE</span>
                </SecondaryButton>
              </Box>
            ) : (
              <Box pt={0.5}>UPLOAD</Box>
            )}
          </PrimaryButton>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              {sizeSpec.worldMeta.header}
            </Box>
            <InfoTooltip
              tooltip={
                "Please input your extension data file (.dreemworld.meta) that was generated by the dreem creator toolkit, it contains all the components that you added to your world. The maximum allowed file size is 10MB"
              }
            />
          </Box>
          <PrimaryButton
            size="medium"
            className={classes.uploadBtn}
            onClick={() => {
              !entity && entityInputRef.current?.click();
            }}
          >
            {entity ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={1}
                fontSize={12}
                style={{ background: "#E9FF26 !important", borderRadius: "8px !important" }}
              >
                {entity.name}
                <SecondaryButton
                  size="medium"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEntity(null);
                    setEntityFile(null);
                    entityInputRef.current?.click();
                  }}
                >
                  <img src={require("assets/metaverseImages/refresh.png")} />
                  <span style={{ marginTop: 1, marginLeft: 8 }}>CHANGE FILE</span>
                </SecondaryButton>
              </Box>
            ) : (
              <Box pt={0.5}>UPLOAD</Box>
            )}
          </PrimaryButton>
          <Box className={classes.switchWrapper}>
            <Box display="flex" alignItems="center">
              <p style={{ marginRight: 16 }}>Make your file Public</p>
              <InfoTooltip
                tooltip={
                  "This allows you to make your extension, which in this case is a work in progress/draft, available for people to test and give feedback (public). Or just internal for you (private), only to be set public later."
                }
              />
            </Box>
            <FormControlLabel
              control={
                <IOSSwitch
                  defaultChecked
                  checked={isPublic}
                  onChange={() => {
                    setIsPublic(prev => !prev);
                  }}
                />
              }
              label={isPublic ? "Yes" : "No"}
              labelPlacement="start"
            />
          </Box>
          <Box className={classes.buttons} mt={7}>
            <SecondaryButton size="medium" onClick={onClose}>
              CANCEL
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              onClick={handleWorld}
              style={{
                background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                color: "#212121",
              }}
            >
              SAVE DRAFT
            </PrimaryButton>
          </Box>
        </div>
        <input
          ref={imageInputRef}
          id={`selectPhoto-create-nft`}
          hidden
          type="file"
          style={{ display: "none" }}
          accept={sizeSpec.worldImage.mimeTypes.join(",")}
          onChange={onImageInput}
        />
        <input
          ref={videoInputRef}
          id={`selectPhoto-create-nft`}
          hidden
          type="file"
          style={{ display: "none" }}
          accept={sizeSpec.worldVideo.mimeTypes.join(",")}
          onChange={onVideoInput}
        />
        <input
          ref={unityInputRef}
          id={`selectUnity-create-nft`}
          hidden
          type="file"
          style={{ display: "none" }}
          // accept={sizeSpec.mwf.mimeTypes.join(",")}
          onChange={onUnityInput}
        />
        <input
          ref={entityInputRef}
          id={`selectEntity-create-nft`}
          hidden
          type="file"
          style={{ display: "none" }}
          // accept={sizeSpec.mwf.mimeTypes.join(",")}
          onChange={onEntityInput}
        />
      </Modal>
      <TransactionProgressModal
        open={txModalOpen}
        title="Minting your NFT"
        transactionSuccess={txSuccess}
        hash={txHash}
        onClose={() => {
          setTxSuccess(null);
          setTxModalOpen(false);
          onClose();
        }}
      />
      <FileUploadingModal open={showUploadingModal} progress={progress} isUpload={isUpload} />
    </>
  );
};

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  marginLeft: 12,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2ECA45",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default CreateExtensionDraftModal;
