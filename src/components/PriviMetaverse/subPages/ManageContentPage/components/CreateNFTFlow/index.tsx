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
} from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
// import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import MintingNFTProgressModal from "components/PriviMetaverse/modals/MintingNFTProgressModal";
import ContentProcessingOperationModal from "components/PriviMetaverse/modals/ContentProcessingOperationModal";
import FileUploadingModal from "components/PriviMetaverse/modals/FileUploadingModal";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import useIPFS from "shared/utils-IPFS/useIPFS";
import CreatingStep from "../CreatingStep";
import NFTOption from "../NFTOption";
import CollectionList from "../CollectionList";
import PublicOption from "../PublicOption";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import { FilterWorldAssetOptions } from "shared/constants/constants";
import { useModalStyles, useFilterSelectStyles } from "./index.styles";

import CreateNFT from "../CreateNFT";
const CreateSteps = [
  {
    step: 1,
    label: 'Royalties',
    completed: false
  },
  {
    step: 2,
    label: 'Files',
    completed: false
  },
  {
    step: 3,
    label: 'Collection',
    completed: false
  },
]
const CreateNFTFlow = ({ metaData, handleCancel }: { metaData: any; handleCancel: () => void }) => {
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
  const [description, setDescription] = useState<string>("");
  const { chainId, account, library } = useWeb3React();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [step, setStep] = useState<number>(1);
  const [royaltyAddress, setRoyaltyAddress] = useState<string>("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState<string>("");
  const [isRoyalty, setIsRoyalty] = useState<boolean>();
  const [isDraft, setIsDraft] = useState<boolean>(true);
  const [currentCollection, setCurrentCollection] = useState<any>(null);
  const [response, setResponse] = useState<any>();
  const [openPublic, setOpenPublic] = useState<any>();
  const [steps, setSteps] = useState<any>(CreateSteps);

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const unityInputRef = useRef<HTMLInputElement>(null);
  const entityInputRef = useRef<HTMLInputElement>(null);
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);
  const [networkName, setNetworkName] = useState<string>("");
  const [nftImage, setNftImage] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<any>(null);

  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");

  // uploading modal
  const [showUploadingModal, setShowUploadingModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUpload, setIsUpload] = useState(true);
  const [sizeSpec, setSizeSpec] = useState<any>(metaData);

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

  const handlePrev = () => {
    if(step == 1) handleCancel()
    setStep(prev => prev - 1);
  };
  const handleNext = () => {
    console.log(steps[step-1])
    switch (step) {
      case 1:
        console.log(isValidAddress(royaltyAddress))
        if(!isValidAddress(royaltyAddress) && isRoyalty){
          showAlertMessage(`Invalid Address`, { variant: "error" });
          return;
        }
        steps[step-1].completed = (isRoyalty && royaltyPercentage && royaltyAddress) || (isRoyalty === false) ? true : false;
        break;
      case 2:
        steps[step-1].completed = validate() ? true : false;
        break;
      case 3:
        steps[step-1].completed = currentCollection ? true : false;
        break;
    
      default:
        break;
    }
    if(step < 3){
      setStep(prev => prev + 1);
    }
  };
  const handleGoStep = step => {
    setStep(step);
  }
  const isValidAddress = address => {
    const web3 = new Web3(library.provider);
    return web3.utils.isAddress(address);
  };
  const validate = () => {
    if (!title || !description || !image || !unity) {
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

  const handleSaveDraft = async () => {
    setOpenPublic(false)
    if (validate()) {
      let payload: any = {};
      let collectionAddr = currentCollection.address;
      let tokenId;

      payload = {
        collectionId: currentCollection.id,
        worldTitle: title,
        worldDescription: description,
        worldImage: image,
        worldLevel: unity,
        worldData: entity,
        isPublic: isPublic,
      };

      if (video) payload.worldVideo = video;

      setShowUploadingModal(true);
      setProgress(0);
      MetaverseAPI.uploadWorld(payload).then(async res => {
        if (!res.success) {
          showAlertMessage(`Failed to upload world`, { variant: "error" });
          // setShowUploadingModal(false);
          setUploadSuccess(false);
        } else {
          setResponse(res.data);
          // setShowUploadingModal(false);
          setUploadSuccess(true);
          showAlertMessage(`Created draft successfully`, { variant: "success" });
        }
      });
    }
  };
  const mintNFT = async () => {
    if(!response){
      showAlertMessage(`Save draft first`, { variant: "error" });
      return;
    }
    let collectionData = currentCollection;
    let metadata = response.metadata;
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
    if(!library) {
      showAlertMessage("Please check your network", { variant: "error" });
      return;
    }
    const uri = `https://elb.ipfsprivi.com:8080/ipfs/${metaData.newFileCID}`;
    console.log(uri);
    setNftImage(metadata.image);
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
          isRoyalty,
          royaltyAddress,
          royaltyPercentage
        },
        setTxModalOpen,
        setTxHash
      );
      if (resRoyalty.success) {
        setTxSuccess(true);
        showAlertMessage(`Successfully world minted`, { variant: "success" });

        await MetaverseAPI.convertToNFTWorld(
          response.item.id,
          resRoyalty.contractAddress,
          targetChain.name,
          [resRoyalty.tokenId],
          metaData.newFileCID,
          account,
          royaltyAddress,
          royaltyPercentage
        );
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
          isRoyalty,
          royaltyAddress,
          royaltyPercentage
        },
        setTxModalOpen,
        setTxHash
      );

      if (contractRes.success) {
        setTxSuccess(true);
        showAlertMessage(`Successfully world minted`, { variant: "success" });
        console.log(contractRes);
        await MetaverseAPI.convertToNFTWorld(
          response.item.id,
          contractRes.collectionAddress,
          targetChain.name,
          [contractRes.tokenId],
          metaData.newFileCID,
          contractRes.owner,
          royaltyAddress,
          royaltyPercentage
        );
      } else {
        setTxSuccess(false);
      }
    }
  };

  return (
    <>
      {!txModalOpen && !showUploadingModal && (
        <>
          <div className={classes.otherContent}>
            <div className={classes.typo1}>
              <AssetIcon />
              Creating New World
            </div>
            <CreatingStep curStep={step} status={steps} handleGoStep={handleGoStep} />
            {step == 1 && (
              <Box
                className={classes.content}
                style={{
                  padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
                }}
              >
                <div className={classes.modalContent}>
                  <Box display="flex" alignItems="center" justifyContent="center" mt={2.5}>
                    <Box className={classes.title} mb={1}>
                      do you want royalties from secondary sales of the nft(s)?
                    </Box>
                  </Box>
                  <Box className={classes.typo3} mb={3}>
                  Every time the NFT is traded on OpenSea or Dreem, NFT holders can receive royalties to their wallet address. If you select “Yes”, be prepared to paste the recipient wallet address.
                  </Box>
                  <div className={classes.inputGroup}>
                    <div className={classes.inputBox}>
                      <input
                        name="radio-group"
                        className={classes.inputRadio}
                        id='single'
                        type='radio'
                        checked={isRoyalty && true}
                        onChange={e => setIsRoyalty(e.target.value == 'on' ? true : false)}
                      />
                      <label htmlFor="single">yes</label>
                      <div className="check"><div className="inside"></div></div>
                    </div>
                    <div className={classes.inputBox}>
                      <input
                        name="radio-group"
                        className={classes.inputRadio}
                        id='multi'
                        type='radio'
                        checked={!isRoyalty && true}
                        onChange={e => {setIsRoyalty(e.target.value == 'on' ? false : true)}}
                      />
                      <label htmlFor="multi">no</label>
                      <div className="check"><div className="inside"></div></div>
                    </div>
                  </div>
                  {isRoyalty &&
                  <>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                      <Box className={classes.itemTitle} mb={1}>
                        royalty share amount
                      </Box>
                      <InfoTooltip tooltip={"royalty share amount to receive profit"} />
                    </Box>
                    <Box position="relative">
                      <input
                        type='number'
                        className={classes.inputText}
                        placeholder="00.00"
                        value={royaltyPercentage}
                        onChange={e => setRoyaltyPercentage(e.target.value)}
                      />
                      <div className={classes.percentLabel}>%</div>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                      <Box className={classes.itemTitle} mb={1}>
                        address to receive royalties
                      </Box>
                    </Box>
                    <input
                      className={classes.inputText}
                      placeholder=""
                      value={royaltyAddress}
                      onChange={e => setRoyaltyAddress(e.target.value)}
                    />
                  </>
                  }
                </div>
              </Box>
            )}
            {step == 2 && (
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
                        NFT Name
                      </Box>
                      <InfoTooltip tooltip={"Please give your world a name."} />
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
                      <InfoTooltip tooltip={"Please give your world a description."} />
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
                      <InfoTooltip tooltip={"Please add an image of your world."} />
                    </Box>
                    <Box
                      className={classes.uploadBox}
                      onClick={() => !image && imageInputRef.current?.click()}
                      style={{
                        cursor: image ? undefined : "pointer",
                        height: image ? 110 : 80,
                      }}
                    >
                      {image ? (
                        <>
                          <Box
                            className={classes.image}
                            style={{
                              backgroundImage: `url(${imageFile})`,
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
                        Add Video file
                      </Box>
                      <InfoTooltip
                        tooltip={
                          "Please give your world a video. This video can be considered as your teaser to your world."
                        }
                      />
                    </Box>
                    <Box
                      className={classes.uploadBox}
                      onClick={() => !video && videoInputRef.current?.click()}
                      style={{
                        cursor: video ? undefined : "pointer",
                        height: video ? 110 : 80,
                      }}
                    >
                      {video ? (
                        <>
                          <Box
                            className={classes.image}
                            style={{
                              backgroundImage: `url(${videoFile})`,
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
                        <Box pt={0.5}>Add Unity File</Box>
                      )}
                    </PrimaryButton>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box className={classes.itemTitle} mt={2.5} mb={1}>
                        World Data file
                      </Box>
                      <InfoTooltip
                        tooltip={
                          "Please input your extension source file (.dreemworld.data) that was generated by the dreem creator toolkit. The maximum size allowed is 50MB - if your file exceeds this limit, try reducing the size of resources."
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
                        <Box pt={0.5}>Add Data File</Box>
                      )}
                    </PrimaryButton>
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
                    ref={videoInputRef}
                    id={`selectPhoto-create-nft`}
                    hidden
                    type="file"
                    style={{ display: "none" }}
                    accept={sizeSpec?.worldVideo.mimeTypes.join(",")}
                    onChange={onVideoInput}
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
                  <input
                    ref={entityInputRef}
                    id={`selectEntity-create-nft`}
                    hidden
                    type="file"
                    style={{ display: "none" }}
                    // accept={sizeSpec?.worldMeta.mimeTypes.join(",")}
                    onChange={onEntityInput}
                  />
                </Box>
              </>
            )}
          </div>
          {step === 3 && (
            <CollectionList
              handleNext={() => {}}
              handleCancel={() => {}}
              handleSelect={item => {
                setCurrentCollection(item);
                steps[step-1].completed = true
              }}
            />
          )}

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
          <Box className={classes.footer}>
            <div className={classes.howToCreateBtn} onClick={handlePrev}>
              back
            </div>
            {step < 3 && (
              <PrimaryButton
                size="medium"
                className={classes.nextBtn}
                // disabled={step === 1}
                onClick={() => handleNext()}
              >
                next
              </PrimaryButton>
            )}
            {step === 3 && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <div className={classes.howToCreateBtn} onClick={() => setOpenPublic(true)}>
                  create draft
                </div>
                <PrimaryButton size="medium" className={classes.nextBtn} onClick={() => mintNFT()}>
                  mint nft
                </PrimaryButton>
              </Box>
            )}
          </Box>
        </>
      )}

      {txModalOpen && (
        // <TransactionProgressModal
        //   open={txModalOpen}
        //   title="Minting your NFT"
        //   transactionSuccess={txSuccess}
        //   hash={txHash}
        //   onClose={() => {
        //     setTxSuccess(null);
        //     setTxModalOpen(false);
        //     handleNext();
        //   }}
        // />
        <MintingNFTProgressModal
          open={txModalOpen}
          txSuccess={txSuccess}
          hash={txHash}
          network={networkName}
          nftImage={nftImage}
          onClose={() => {
            setTxSuccess(null);
            setTxModalOpen(false);
            handleNext();
          }}
        />
      )}
      {showUploadingModal && (
        // <FileUploadingModal open={showUploadingModal} progress={progress} isUpload={isUpload} />
        <ContentProcessingOperationModal
          open={showUploadingModal}
          onClose={() => setShowUploadingModal(false)}
          txSuccess={uploadSuccess}
        />
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

export default CreateNFTFlow;
