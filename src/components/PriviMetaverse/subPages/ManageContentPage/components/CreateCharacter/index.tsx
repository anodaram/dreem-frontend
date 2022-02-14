import React, { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import {
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Switch,
  SwitchProps,
  styled,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import FileUploadingModal from "components/PriviMetaverse/modals/FileUploadingModal";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { FilterAssetTypeOptions } from "shared/constants/constants";
import { useModalStyles, useFilterSelectStyles } from "./index.styles";
import { ReactComponent as DocumentIcon } from "assets/icons/document.svg";
import { ReactComponent as UnityIcon } from "assets/icons/unity.svg";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh.svg";
import { sanitizeIfIpfsUrl } from "shared/helpers";

const CreateTexture = ({
  metaData,
  handleNext,
  handleCancel,
}: {
  metaData: any;
  handleNext: () => void;
  handleCancel: () => void;
}) => {
  const classes = useModalStyles();
  const filterClasses = useFilterSelectStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [unity, setUnity] = useState<any>(null);
  const [unityFile, setUnityFile] = useState<any>(null);
  const [entity, setEntity] = useState<any>(null);
  const [entityFile, setEntityFile] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { chainId, account, library } = useWeb3React();
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const unityInputRef = useRef<HTMLInputElement>(null);
  const entityInputRef = useRef<HTMLInputElement>(null);
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);

  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");

  // uploading modal
  const [showUploadingModal, setShowUploadingModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUpload, setIsUpload] = useState(true);
  const [sizeSpec, setSizeSpec] = useState<any>(metaData);

  const [openAssetSelect, setOpenAssetSelect] = useState<boolean>(false);
  const [openCollectionSelect, setOpenCollectionSelect] = useState<boolean>(false);
  const [filterAsset, setFilterAsset] = useState<string>(FilterAssetTypeOptions[0]);
  const [filterCollection, setFilterCollection] = useState<string>("");
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
    let sizeSpec = metaData;
    if (!title || !description || !image || !unity) {
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
      // } else if (
      //   symbol.length < sizeSpec?.worldSymbol.limit.min ||
      //   symbol.length > sizeSpec?.worldSymbol.limit.max
      // ) {
      //   showAlertMessage(
      //     `Symbol field invalid. Must be alphanumeric and contain from ${sizeSpec?.worldSymbol.limit.min} to ${sizeSpec?.worldSymbol.limit.max} characters`,
      //     { variant: "error" }
      //   );
      //   return false;
    } else if (
      description.length < sizeSpec?.description.limit.min ||
      description.length > sizeSpec?.description.limit.max
    ) {
      showAlertMessage(
        `Description field invalid. Must be alphanumeric and contain from ${sizeSpec?.description.limit.min} to ${sizeSpec?.description.limit.max} characters`,
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
      console.log(sizeSpec, metaData, unity.name.split(".").reverse()[0]);
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

  const handleWorld = async () => {
    if (validate()) {
      let payload: any = {};
      let tokenId;

      payload = {
        worldTitle: title,
        worldDescription: description,
        worldImage: image,
        worldLevel: unity,
        worldData: entity,
      };

      if (video) payload.worldVideo = video;
    }
  };

  return (
    <>
      <Box
        className={classes.content}
        style={{
          padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
        }}
      >
        <div className={classes.modalContent}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
            <Box className={classes.itemTitle} mb={1}>
              character name
            </Box>
          </Box>
          <input
            className={classes.input}
            placeholder="NFT Name"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              Description
            </Box>
          </Box>
          <textarea
            style={{ height: "130px" }}
            className={classes.input}
            placeholder="NFT description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              Preview Image
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
                <Box
                  flex={1}
                  display="flex"
                  alignItems="center"
                  marginLeft="24px"
                  justifyContent="space-between"
                  mr={3}
                >
                  Uploaded {image.name}
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImage(null);
                      setImageFile(null);
                      imageInputRef.current?.click();
                    }}
                  >
                    CHANGE FILE
                  </Button>
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
                  <span>Accepted files png, jpg, svg</span> minimum 600 x 600 px size for
                  <br />
                  best viewing experience
                </Box>
              </>
            )}
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              Unity file
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
            style={unity && { background: "#E9FF26!important" }}
          >
            {unity ? (
              <Box display="flex" alignItems="center" justifyContent="space-between" width={1} fontSize={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between" fontSize={12}>
                  <DocumentIcon /> {unity.name}
                </Box>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUnity(null);
                    setUnityFile(null);
                    unityInputRef.current?.click();
                  }}
                >
                  CHANGE FILE
                </Button>
              </Box>
            ) : (
              <Box pt={0.5} display="flex" alignItems="center" justifyContent="space-between">
                <UnityIcon />{" "}
                <Box display="flex" alignItems="center" marginLeft="5px">
                  Add Unity File
                </Box>
              </Box>
            )}
          </PrimaryButton>
          <Box className={classes.switchWrapper}>
            <Box display="flex" alignItems="center">
              <p style={{ marginRight: 16 }}>Make your file Public</p>
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
        </div>
        <input
          ref={imageInputRef}
          id={`selectPhoto-create-nft`}
          hidden
          type="file"
          style={{ display: "none" }}
          accept={sizeSpec?.worldImage.mimeTypes.join(",")}
          onChange={onImageInput}
        />
        <input
          ref={unityInputRef}
          id={`selectUnity-create-nft`}
          hidden
          type="file"
          style={{ display: "none" }}
          // accept={sizeSpec?.worldLevel.mimeTypes.join(",")}
          onChange={onUnityInput}
        />
      </Box>
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
export default CreateTexture;
