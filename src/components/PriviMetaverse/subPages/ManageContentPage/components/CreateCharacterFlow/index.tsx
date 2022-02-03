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
import RoyaltyOption from "../RoyaltyOption";
import MintEditions from "../MintEditions";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import { FilterWorldAssetOptions } from "shared/constants/constants";
import { useModalStyles, useFilterSelectStyles } from "./index.styles";

import CollectionList from "../CollectionList";
import PublicOption from "../PublicOption";
import { ReactComponent as DocumentIcon } from "assets/icons/document.svg";
import { ReactComponent as UnityIcon } from "assets/icons/unity.svg";

const CreateSteps = [
  {
    step: 1,
    label: 'NFT',
    completed: false
  },
  {
    step: 2,
    label: 'Royalties',
    completed: false
  },
  {
    step: 3,
    label: 'Files',
    completed: false
  },
  {
    step: 4,
    label: 'Collection',
    completed: false
  },
]
const CreateCharacterFlow = ({
  metaData,
  handleCancel,
}: {
  metaData: any;
  handleCancel: () => void;
}) => {
  const classes = useModalStyles();
  const filterClasses = useFilterSelectStyles();
  const { showAlertMessage } = useAlertMessage();

  const [nftOption, setNftOption] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [steps, setSteps] = useState<any>(CreateSteps);
  const [amount, setAmount] = useState<string>("");
  const [royaltyAddress, setRoyaltyAddress] = useState<string>("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState<string>("");
  const [isRoyalty, setIsRoyalty] = useState<boolean>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [currentCollection, setCurrentCollection] = useState<any>(null);
  const [openPublic, setOpenPublic] = useState<any>();
  const [openMintEditions, setOpenMintEditions] = useState<any>();
  const [sizeSpec, setSizeSpec] = useState<any>(metaData);

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

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const unityInputRef = useRef<HTMLInputElement>(null);
  const entityInputRef = useRef<HTMLInputElement>(null);

  const handlePrev = () => {
    if(step == 1) handleCancel()
    setStep(prev => prev - 1);
  };
  const handleNext = () => {
    console.log(steps[step-1])
    switch (step) {
      case 1:
        steps[step-1].completed = (nftOption === 'single') || (nftOption === 'multiple' && amount) ? true : false;
        break;
      case 2:
        steps[step-1].completed = (isRoyalty && royaltyPercentage && royaltyAddress) || (isRoyalty === false) ? true : false;
        break;
      case 3:
        steps[step-1].completed = validate() ? true : false;
        break;
      case 4:
        steps[step-1].completed = currentCollection ? true : false;
        break;
    
      default:
        break;
    }
    if(step < 4){
      setStep(prev => prev + 1);
    }
  };
  const handleGoStep = step => {
    setStep(step);
  }

  const validate = () => {
    if (!title || !description || !image || !unity) {
      // showAlertMessage(`Please fill all the fields to proceed`, { variant: "error" });
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

  const handleMint = () => {
    nftOption == 'single' ? mintSingleNFT() : setOpenMintEditions(true)
  }

  const mintSingleNFT = () => {

  }
  
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

  return (
    <>
      {openMintEditions ?
        <MintEditions
          amount={amount}
          handleCancel={() => {setOpenMintEditions(false)}}
        /> 
      :
      <>
        <div className={classes.otherContent}>
          <div className={classes.typo1}>
            <AssetIcon />
            Creating New Character
          </div>
          <CreatingStep curStep={step} status={steps} handleGoStep={handleGoStep} />
          { step == 1 &&
            <Box
              className={classes.content}
              style={{
                padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
              }}
            >
              <div className={classes.modalContent}>
                <Box display="flex" alignItems="center" justifyContent="center" mt={2.5}>
                  <Box className={classes.title} mb={1}>
                    select nft option
                  </Box>
                </Box>
                <div className={classes.inputGroup}>
                  <div className={classes.inputBox}>
                    <input
                      name="radio-group"
                      className={classes.inputRadio}
                      id="single"
                      type="radio"
                      checked={nftOption === 'single' && true}
                      onChange={e => setNftOption(e.target.value == "on" ? "single" : "")}
                    />
                    <label htmlFor="single">single NFT(1/1)</label>
                    <div className="check">
                      <div className="inside"></div>
                    </div>
                  </div>
                  <div className={classes.inputBox}>
                    <input
                      name="radio-group"
                      className={classes.inputRadio}
                      id="multi"
                      type="radio"
                      checked={nftOption === 'multiple' && true}
                      onChange={e => {
                        setNftOption(e.target.value == "on" ? "multiple" : "");
                      }}
                    />
                    <label htmlFor="multi">multiple edition nft</label>
                    <div className="check">
                      <div className="inside"></div>
                    </div>
                  </div>
                </div>
                {nftOption == "multiple" && (
                  <>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                      <Box className={classes.itemTitle} mb={1}>
                        How many nfts do you want minted from this asset?
                      </Box>
                    </Box>
                    <input
                      type="number"
                      className={classes.inputText}
                      placeholder=""
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </>
                )}
              </div>
            </Box>
          }
          { step == 2 &&
          
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
          }
          { step == 3 &&
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
                  <InfoTooltip tooltip={"Please give your character a name."} />
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
                  <InfoTooltip tooltip={"Please give your character a description."} />
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
                  <InfoTooltip tooltip={"Please add an image of your character."} />
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
                      <Box flex={1} display="flex" alignItems="center" marginLeft="24px" justifyContent="space-between" mr={3}>
                        Uploaded {image.name}
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
                  style={unity && {background: "#E9FF26!important"}}
                >
                  {unity ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width={1}
                      fontSize={12}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        fontSize={12}
                      >
                        <DocumentIcon /> {unity.name}
                      </Box>
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
                    <Box pt={0.5}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <UnityIcon /> <Box display="flex" alignItems="center" marginLeft="5px">Add Unity File</Box>
                    </Box>
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
          }
        </div>
        {step === 4 && (
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
            handleSubmit={() => {}}
            handleSelect={isPublic => setIsPublic(isPublic)}
          />
        )}
        <Box className={classes.footer}>
          <div className={classes.howToCreateBtn} onClick={handlePrev}>
            back
          </div>
          {step < 4 && (
            <PrimaryButton
              size="medium"
              className={classes.nextBtn}
              // disabled={step === 1}
              onClick={() => handleNext()}
            >
              next
            </PrimaryButton>
          )}
          {step === 4 && (
            <Box display="flex" alignItems="center" justifyContent="center">
              <div className={classes.howToCreateBtn} onClick={() => setOpenPublic(true)}>
                create draft
              </div>
              <PrimaryButton size="medium" className={classes.nextBtn} onClick={() => {handleMint()}}>
                mint nft
              </PrimaryButton>
            </Box>
          )}
        </Box>
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

export default CreateCharacterFlow;
