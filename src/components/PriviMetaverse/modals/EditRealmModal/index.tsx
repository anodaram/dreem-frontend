import React, { useEffect, useState, useRef } from "react";

import {
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Switch,
  SwitchProps,
  styled,
  CircularProgress,
  Select,
  MenuItem
} from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import FileUploadingModal from "components/PriviMetaverse/modals/FileUploadingModal";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";
import { useModalStyles, useFilterSelectStyles } from "./index.styles";
import { sanitizeIfIpfsUrl } from "shared/helpers";

const initialFileChangedState = {
  image: false,
  video: false,
  unity: false,
  entity: false,
};

const EditRealmModal = ({
  open,
  onClose,
  metaData,
  realmData,
  handleRefresh,
}: {
  open: boolean;
  onClose: any;
  metaData: any;
  realmData: any;
  handleRefresh?: () => void;
}) => {
  const userSelector = useTypedSelector(state => state.user);
  const classes = useModalStyles();
  const filterClasses = useFilterSelectStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [owner, setOwner] = useState<any>(userSelector? userSelector.id : null);
  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [unity, setUnity] = useState<any>(null);
  const [unityFile, setUnityFile] = useState<any>(null);
  const [entity, setEntity] = useState<any>(null);
  const [entityFile, setEntityFile] = useState<any>(null);
  const [collectionId, setCollectionId] = useState<string>(realmData && realmData.collectionId ? realmData.collectionId : "");
  const [title, setTitle] = useState<string>(realmData && realmData.worldTitle ? realmData.worldTitle : "");
  const [symbol, setSymbol] = useState<string>(
    realmData && realmData.worldSymbol ? realmData.worldSymbol : ""
  );
  const [description, setDescription] = useState<string>(
    realmData && realmData.worldDescription ? realmData.worldDescription : ""
  );

  const [isPublic, setIsPublic] = useState<boolean>(realmData.worldIsPublic);

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const [isDraft, setIsDraft] = useState<boolean>(true);

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
  const [fileChanged, setFileChanged] = useState<any>(initialFileChangedState);
  const [isLoadingFiles, setLoadingFiles] = useState(false);
  const [openCollectionSelect, setOpenCollectionSelect] = useState<boolean>(false);
  const [filterCollection, setFilterCollection] = useState<string>("");
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    setFileChanged(initialFileChangedState);
  }, [open]);

  useEffect(() => {
    if (!realmData) return;
    setOwner(userSelector?.id)
    loadCollection()
    loadFiles();
  }, [realmData]);

  const loadCollection = async () => {
    MetaverseAPI.getCollections(100, 1, "DESC", owner)
    .then(res => {
      if (res.success) {
        const items = res.data.elements;
        if (items && items.length > 0) {
          setCollections([...collections, ...items]);
        }
      } else{
        console.log('empty collection')
      }
    })
  }
  const loadFiles = async () => {
    try {
      const allTasks: any[] = [];
      setLoadingFiles(true);
      const task1 = new Promise<void>(async (resolve, reject) => {
        setImageFile(realmData.worldImage);
        const image = await fetch(realmData.worldImage)
          .then(r => r.blob())
          .then(blobFile => new File([blobFile], "source.png"));
        setImage(image);
        resolve();
      });
      allTasks.push(task1);

      if (realmData.worldVideo) {
        const task2 = new Promise<void>(async (resolve, reject) => {
          setVideoFile(realmData.worldVideo);
          const video = await fetch(realmData.worldVideo)
            .then(r => r.blob())
            .then(blobFile => new File([blobFile], "source.mp4"));
          setVideo(video);
          resolve();
        });
        allTasks.push(task2);
      }

      const task3 = new Promise<void>(async (resolve, reject) => {
        setUnityFile(realmData.worldAssetUrl);
        const unity = new File(["World file"], `source.${sizeSpec.worldLevel.supportedFormats.toString()}`);
        setUnity(unity);
        resolve();
      });
      allTasks.push(task3);

      const task4 = new Promise<void>(async (resolve, reject) => {
        setEntityFile(realmData.worldAssetUrl);
        const entity = new File(["World data"], `source.${sizeSpec.worldMeta.supportedFormats.toString()}`, {
          type: "text/plain",
        });
        setEntity(entity);
        resolve();
      });
      allTasks.push(task4);
      await Promise.all(allTasks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const onImageInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleImageFiles(files);
      setFileChanged({ ...fileChanged, image: true });
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
      setFileChanged({ ...fileChanged, video: true });
    }
    e.preventDefault();

    if (videoInputRef !== null && videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleVideoFiles = (files: any) => {
    if (files && files[0]) {
      setVideo(files[0]);

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
      setFileChanged({ ...fileChanged, unity: true });
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
      setFileChanged({ ...fileChanged, entity: true });
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

    if (!isDraft && !video) {
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
    // } else if (
    //   symbol.length < sizeSpec.worldSymbol.limit.min ||
    //   symbol.length > sizeSpec.worldSymbol.limit.max
    // ) {
    //   showAlertMessage(
    //     `Symbol field invalid. Must be alphanumeric and contain from ${sizeSpec.worldSymbol.limit.min} to ${sizeSpec.worldSymbol.limit.max} characters`,
    //     { variant: "error" }
    //   );
    //   return false;
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
      let payload: any = {};
      try {
        payload.collectionId = collectionId;
        payload.worldTitle = title;
        // payload.worldSymbol = symbol;
        payload.worldDescription = description;
        if (fileChanged.image) payload.worldImage = image;
        if (fileChanged.unity) payload.worldLevel = unity;
        if (fileChanged.video) payload.worldVideo = video;
        if (fileChanged.entity) payload.worldData = entity;
        if (isPublic !== realmData.worldIsPublic) payload.isPublic = isPublic;

        setShowUploadingModal(true);
        setProgress(0);
        await MetaverseAPI.editWorld(realmData.id, payload);

        if (handleRefresh) handleRefresh();
        setProgress(100);
        setShowUploadingModal(false);
        showAlertMessage(`Updated draft successfully`, { variant: "success" });
        onClose();
      } catch (error) {
        showAlertMessage("Failed to update draft", { variant: "error" });
      }
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
          <Box className={classes.title} mb={1.5} display="flex" justifyContent="center" width={1}>
            Edit Draft
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
            <Box className={classes.itemTitle} mb={1}>
              Collection
            </Box>
            <InfoTooltip tooltip={""} />
          </Box>
          <Select
            open={openCollectionSelect}
            onClose={() => setOpenCollectionSelect(false)}
            value={collections?.map((item, index) => (
              collectionId == item.id ? item.name : ''
            ))}
            onChange={e => setCollectionId(String(e.target.value))}
            className={classes.select}
            renderValue={(value: any) => (
              <Box display="flex" alignItems="center" onClick={() => setOpenCollectionSelect(true)}>
                <span>{value}</span>
              </Box>
            )}
            MenuProps={{
              classes: filterClasses,
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
          >
            {collections?.map((item, index) => (
              <MenuItem key={`filter-chain-${index}`} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mb={1}>
              {sizeSpec.worldTitle.header}
            </Box>
            <InfoTooltip tooltip={"Please give your realm a name."} />
          </Box>
          <input
            className={classes.input}
            placeholder="Realm Name"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {/* <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              {sizeSpec.worldSymbol.header}
            </Box>
            <InfoTooltip
              tooltip={"Please give your realm a symbol, it must be more than 3 characters in length."}
            />
          </Box>
          <input
            className={classes.input}
            placeholder="ex. SMBLN"
            value={symbol}
            onChange={e => setSymbol(e.target.value.trim().toUpperCase())}
            maxLength={5}
          /> */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              {sizeSpec.worldDescription.header}
            </Box>
            <InfoTooltip tooltip={"Please give your realm a description."} />
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
            <InfoTooltip tooltip={"Please add an image of your realm."} />
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
                <Box flex={1} display="flex" justifyContent="flex-end" mr={3}>
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
                "Please give your realm a video. This video can be considered as your teaser to your realm."
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
                <Box
                  className={classes.image}
                  style={{
                    backgroundImage: `url(${sanitizeIfIpfsUrl(videoFile)})`,
                    backgroundSize: "cover",
                  }}
                />
                <Box flex={1} display="flex" justifyContent="flex-end" mr={3}>
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
          {isLoadingFiles ? (
            <Box minWidth={250} display="flex" justifyContent="center">
              <CircularProgress size={24} style={{ color: "#EEFF21" }} />
            </Box>
          ) : (
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
          )}
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
          {isLoadingFiles ? (
            <Box minWidth={250} display="flex" justifyContent="center">
              <CircularProgress size={24} style={{ color: "#EEFF21" }} />
            </Box>
          ) : (
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
          )}
          {isDraft ? (
            <Box className={classes.switchWrapper}>
              <Box display="flex" alignItems="center">
                <p style={{ marginRight: 16 }}>Make your file public</p>
                <InfoTooltip
                  tooltip={
                    "This allows you to make your realm, which in this case is a work in progress/draft, available for people to test and give feedback (public). Or just internal for you (private), only to be set public later"
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
          ) : (
            <>
              <Box className={classes.royaltySwitchWrapper}>
                <Box className={classes.itemTitle} mb={1}>
                  Royalty share
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
              <input
                className={classes.input}
                placeholder="00.00"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <Box className={classes.itemTitle} mt={3} mb={1}>
                Royalty recipient address
              </Box>
              <input
                className={classes.input}
                placeholder="Paste wallet address here, it will receive royalty %"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </>
          )}

          <Box className={classes.buttons} mt={7}>
            <SecondaryButton size="medium" onClick={onClose}>
              CANCEL
            </SecondaryButton>
            {isDraft ? (
              <PrimaryButton
                size="medium"
                onClick={handleWorld}
                style={{
                  background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                  color: "#212121",
                }}
                disabled={isLoadingFiles}
              >
                SAVE DRAFT
              </PrimaryButton>
            ) : (
              <PrimaryButton size="medium" onClick={handleWorld}>
                CREATE NFT
              </PrimaryButton>
            )}
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
          // accept={sizeSpec.worldLevel.mimeTypes.join(",")}
          onChange={onUnityInput}
        />
        <input
          ref={entityInputRef}
          id={`selectEntity-create-nft`}
          hidden
          type="file"
          style={{ display: "none" }}
          // accept={sizeSpec.worldMeta.mimeTypes.join(",")}
          onChange={onEntityInput}
        />
      </Modal>
      {txModalOpen && (
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
      )}
      {showUploadingModal && (
        <FileUploadingModal open={showUploadingModal} progress={progress} isUpload={isUpload} />
      )}
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

export default EditRealmModal;
