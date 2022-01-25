import React, { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled, Select, MenuItem } from "@material-ui/core";

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
import CreatingStep from "../CreatingStep";
import NFTOption from "../NFTOption";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import { FilterWorldAssetOptions } from "shared/constants/constants";
import { useModalStyles, useFilterSelectStyles } from "./index.styles";


import CreateNFT from "../CreateNFT";

const CreateNFTFlow = ({
  metaData,
  step,
  handleNext,
  handleCancel,
  handleRefresh,
}: {
  metaData: any;
  step
  handleNext: () => void;
  handleCancel: () => void;
  handleRefresh: () => void;
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
  const [isDraft, setIsDraft] = useState<boolean>(true);

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
  const [filterAsset, setFilterAsset] = useState<string>(FilterWorldAssetOptions[0]);
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

    if (!isDraft && !video) {
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
    } else if (
      description.length < sizeSpec?.worldDescription.limit.min ||
      description.length > sizeSpec?.worldDescription.limit.max
    ) {
      showAlertMessage(
        `Description field invalid. Must be alphanumeric and contain from ${sizeSpec?.worldDescription.limit.min} to ${sizeSpec?.worldDescription.limit.max} characters`,
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
      console.log(sizeSpec, metaData, unity.name.split(".").reverse()[0])
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

  // const handleWorld = async () => {
  //   if (validate()) {
  //     let payload: any = {};
  //     let collectionAddr = collectionData.address;
  //     let tokenId;

  //     payload = {
  //       collectionId: collectionData.id,
  //       worldTitle: title,
  //       worldDescription: description,
  //       worldImage: image,
  //       worldLevel: unity,
  //       worldData: entity,
  //     };

  //     if (video) payload.worldVideo = video;
  //     if (isDraft) payload.isPublic = isPublic;

  //     setShowUploadingModal(true);
  //     setProgress(0);
  //     MetaverseAPI.uploadWorld(payload)
  //       .then(async res => {
  //         if (!res.success) {
  //           showAlertMessage(`Failed to upload world`, { variant: "error" });
  //           setShowUploadingModal(false);
  //         } else{

  //           // if (isDraft) {
  //           //   setProgress(100);
  //           //   setShowUploadingModal(false);
  //           //   showAlertMessage(`Created draft successfully`, { variant: "success" });
  //           //   handleCancel();
  //           //   handleRefresh()
  //           // } else {

  //             setShowUploadingModal(false);
  //             showAlertMessage(`Created draft successfully`, { variant: "success" });
  //             console.log('----metadata', res.data.metadata, chainId, BlockchainNets.find(net => net.value === chain))
  //             const metadata = await onUploadNonEncrypt(res.data.metadata, file =>
  //               uploadWithNonEncryption(file)
  //             );
  //             setProgress(100);
  //             setShowUploadingModal(false);

  //             const targetChain = BlockchainNets.find(net => net.value === chain);

  //             if (chainId && chainId !== targetChain?.chainId) {
  //               const isHere = await switchNetwork(targetChain?.chainId || 0);
  //               if (!isHere) {
  //                 showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
  //                 return;
  //               }
  //             }

  //             const uri = `https://elb.ipfsprivi.com:8080/ipfs/${metadata.newFileCID}`;
  //             const web3APIHandler = targetChain.apiHandler;
  //             const web3 = new Web3(library.provider);
  //             console.log('----metadata:', metadata, isDraft)

  //           if (isDraft) {
  //             console.log('here-----')
  //             const resRoyalty = await web3APIHandler.RoyaltyFactory.mint(
  //               web3,
  //               account,
  //               {
  //                 name: collectionData.name,
  //                 symbol: collectionData.symbol,
  //                 uri,
  //               },
  //               setTxModalOpen,
  //               setTxHash
  //             );
  //             if (resRoyalty.success) {
  //               setTxSuccess(true);
  //               showAlertMessage(`Successfully world minted`, { variant: "success" });

  //               await MetaverseAPI.convertToNFTWorld(
  //                 res.data.item.id,
  //                 resRoyalty.contractAddress,
  //                 targetChain.name,
  //                 resRoyalty.tokenId,
  //                 metadata.newFileCID,
  //                 account,
  //                 '0x0000000000000000000000000000000000000000'
  //               );
  //               handleRefresh()
  //             } else {
  //               setTxSuccess(false);
  //             }
  //           } else {
  //             const contractRes = await web3APIHandler.NFTWithRoyalty.mint(
  //               web3,
  //               account,
  //               {
  //                 collectionAddress: collectionAddr,
  //                 to: account,
  //                 uri,
  //               },
  //               setTxModalOpen,
  //               setTxHash
  //             );

  //             if (contractRes.success) {
  //               setTxSuccess(true);
  //               showAlertMessage(`Successfully world minted`, { variant: "success" });
  //               console.log(contractRes)
  //               await MetaverseAPI.convertToNFTWorld(
  //                 res.data.item.id,
  //                 contractRes.collectionAddress,
  //                 targetChain.name,
  //                 contractRes.tokenId,
  //                 metadata.newFileCID,
  //                 contractRes.owner,
  //                 contractRes.royaltyAddress
  //               );
  //               handleRefresh()
  //             } else {
  //               setTxSuccess(false);
  //             }
  //           }
  //         }
  //       })
  //       .catch(err => {
  //         setShowUploadingModal(false);
  //         showAlertMessage(`Failed to upload world`, { variant: "error" });
  //         console.log(err)
  //       });
  //   }
  // };

  return (
    <>
      { step == 1 &&
        <div className={classes.otherContent}>
          <div className={classes.typo1}><AssetIcon />Creating New Asset</div>
          <CreatingStep curStep="2" status={[]} />
          <NFTOption handleNext={() => {}}/>
        </div>
      }
      { step == 2 &&
      <>
        <div className={classes.otherContent}>
          <div className={classes.typo1}>Creating New Draft</div>
          <Box className={classes.typo3} mb={3}>
            Fill all the details of your new nft
          </Box>
          <CreateNFT metaData={metaData} handleNext={() => {}} handleCancel={()=>{}} handleRefresh={() => {}} collection={{}} isCollectionPage={false}/>
        </div>
      </>
      }
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

export default CreateNFTFlow;
