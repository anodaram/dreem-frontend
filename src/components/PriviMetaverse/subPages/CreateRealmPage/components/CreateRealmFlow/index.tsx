import React, { useEffect, useState, useRef } from "react";

import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled, Select, MenuItem, Button, TextField, InputAdornment, Hidden, Grid } from "@material-ui/core";

import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import CreatingStep from "../CreatingStep";
import CollectionList from "../CollectionList";
import WorldList from "../WorldList";
import ContentProcessingOperationModal from "components/PriviMetaverse/modals/ContentProcessingOperationModal";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import { useModalStyles, useFilterSelectStyles } from "./index.styles";

import { InfoIcon } from "shared/ui-kit/Icons";
import { ReactComponent as DeleteIcon } from "assets/icons/remove.svg";
import { sanitizeIfIpfsUrl } from "shared/helpers";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh.svg";

interface CollectionInfo {
  address: string;
  firstIndex: string;
  lastIndex: string;
  chain: string;
}

const CreateSteps = [
  {
    step: 1,
    label: 'Realm Details',
    completed: false
  },
  {
    step: 2,
    label: 'Financials',
    completed: false
  },
  {
    step: 3,
    label: 'Governance',
    completed: false
  },
  {
    step: 4,
    label: 'Status',
    completed: false
  },
]

const CreateRealmFlow = ({
  metaData,
  handleCancel,
}: {
  metaData: any;
  handleCancel: () => void;
}) => {
  console.log('-----', metaData)
  const classes = useModalStyles();
  const filterClasses = useFilterSelectStyles();
  const { showAlertMessage } = useAlertMessage();

  const { activate, chainId, account, library } = useWeb3React();
  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);
  const [step, setStep] = useState<number>(1);
  const [steps, setSteps] = useState<any>(CreateSteps);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [taxation, setTaxation] = useState<string>("");
  const [votingConsensus, setVotingConsensus] = useState<string>("");
  const [votingPower, setVotingPower] = useState<string>("");
  const [privacy, setPrivacy] = useState<string>('public');
  const [worldHash, setWorldHash] = useState<any>(null);
  const [nftAddress, setNFTAddress] = useState<any>(null);
  const [nftId, setNFTId] = useState<any>(null);
  const [networks, setNetworks] = useState<any>([]);
  const [networkName, setNetworkName] = useState<string>("");
  const [collectionInfos, setCollectionInfos] = useState<Array<CollectionInfo>>([{
    address: '',
    firstIndex: '',
    lastIndex: '',
    chain
  }]);
  const [sizeSpec, setSizeSpec] = useState<any>(metaData);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [uploadSuccess, setUploadSuccess] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");

  useEffect(() => {
    getSettings()
    // MetaverseAPI.getAssetMetadata('REALM').then(res => {
    //   setSizeSpec(res.data);
    // });
  }, []);
  const getSettings = () => {
    MetaverseAPI.getNetworks()
      .then(res => {
        setNetworks(res.data?.Chains)
      })
  };

  const handlePrev = () => {
    if (step == 1) {
      handleCancel();
      return;
    }
    setStep(prev => prev - 1);
  };

  const checkCurrentStep = (stepItem) => {
    switch (step) {
      case 1:
        return validate(false) ? true : false;
        break;
      case 2:
        return taxation ? true : false;
        break;
      case 3:
        return votingConsensus && votingPower ? true : false;
        break;
      case 4:
        return privacy === 'public' || collectionInfos.every(c => c.address && c.firstIndex && c.lastIndex) ? true : false;
        break;
      case 5:
        return worldHash && nftId && nftAddress ? true : false;
        break;

      default:
        break;
    }
  };
  const handleNext = () => {
    switch (step) {
      case 1:
        steps[step - 1].completed = validate(true) ? true : false;
        break;
      case 2:
        steps[step - 1].completed = taxation ? true : false;
        break;
      case 3:
        steps[step - 1].completed = votingConsensus && votingPower ? true : false;
        break;
      case 4:
        steps[step - 1].completed = privacy === 'public' || collectionInfos.every(c => c.address && c.firstIndex && c.lastIndex) ? true : false;
        break;

      default:
        break;
    }
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      handleSave()
    }
  };
  const handleGoStep = step => {
    setStep(step);
  }

  const validate = (withMessage) => {
    if (!title || !description || !image) {
      withMessage && showAlertMessage(`Please fill all the fields to proceed`, { variant: "error" });
      return false;
    }

    if (title.length < sizeSpec?.worldTitle.limit.min || title.length > sizeSpec?.worldTitle.limit.max) {
      withMessage && showAlertMessage(
        `Name field invalid. Must be alphanumeric and contain from ${sizeSpec?.worldTitle.limit.min} to ${sizeSpec?.worldTitle.limit.max} characters`,
        {
          variant: "error",
        }
      );
      return false;
    } else if (
      symbol.length < sizeSpec?.worldSymbol.limit.min ||
      symbol.length > sizeSpec?.worldSymbol.limit.max
    ) {
      withMessage && showAlertMessage(
        `Symbol field invalid. Must be alphanumeric and contain from ${sizeSpec?.worldSymbol.limit.min} to ${sizeSpec?.worldSymbol.limit.max} characters`,
        { variant: "error" }
      );
      return false;
    } else if (
      description.length < sizeSpec?.worldDescription.limit.min ||
      description.length > sizeSpec?.worldDescription.limit.max
    ) {
      withMessage && showAlertMessage(
        `Description field invalid. Must be alphanumeric and contain from ${sizeSpec?.worldDescription.limit.min} to ${sizeSpec?.worldDescription.limit.max} characters`,
        { variant: "error" }
      );
      return false;
    } else if (image.size > sizeSpec?.worldImage.limit.maxBytes) {
      withMessage && showAlertMessage(`Image field invalid. Size cannot exceed ${sizeSpec?.worldImage.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else if (video && video.size > sizeSpec?.worldVideo.limit.maxBytes) {
      withMessage && showAlertMessage(`Video field invalid. Size cannot exceed ${sizeSpec?.worldVideo.limit.readable}`, {
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handleSave = async () => {
    if (validate(false)) {
      let payload: any = {};
      let savingDraft: any = {};
      payload = {
        item: "REALM",
        name: title,
        description: description,
        realmSymbol: symbol,
        masterRealmHash: worldHash,
        realmTaxation: taxation,
        realmVotingConsensus: votingConsensus,
        realmCreatorVotingPower: votingPower,
        realmImage: image,
        realmVideo: video,
        realmRestrictions: collectionInfos
      };

      setIsUploading(true);
      try {
        MetaverseAPI.uploadAsset(payload).then(async res => {
          if (!res.success) {
            showAlertMessage(`Failed to upload world`, { variant: "error" });
            setUploadSuccess(false);
            return
          } else {
            setUploadSuccess(true);
            showAlertMessage(`Created draft successfully. minting NFT...`, { variant: "success" });
            // setSavingDraft(res.data)
            handleMintRealm(res.data)
          }
        });
      } catch (error) {
        showAlertMessage(`Failed to upload world`, { variant: "error" });
        setUploadSuccess(false);
      }
    }
  };
  const getMetadata = async (hashId) => {
    try {
      const res = await MetaverseAPI.getNFTInfo(hashId)
      return res.data
    } catch (error) {
      console.log('error in getting metadata', error)
    }
  }
  const handleMintRealm = async (savingDraft) => {
    setIsUploading(false);
    let metadata = await getMetadata(savingDraft.instance.hashId);
    const metaData = await onUploadNonEncrypt(metadata, file => uploadWithNonEncryption(file));
    console.log(metaData);
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
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    console.log('---', web3APIHandler.RealmCreator)
    const contractRes = await web3APIHandler.RealmCreator.mint(
      web3,
      account,
      {
        uri,
        taxRate: taxation,
        creatorShare: votingPower,
        votingConsensus: votingConsensus,
        nftToAttachAddress: nftAddress,
        nftToAttachId: nftId,
      },
      setTxModalOpen,
      setTxHash
    );

    if (contractRes.success) {
      console.log(contractRes);
      const resp = await MetaverseAPI.realmMint(
        savingDraft.instance.hashId,
        contractRes.txHash,
        targetChain.name,
        contractRes.realmAddress,
        contractRes.distributionManager,
        contractRes.realmUpgraderAddress,
      );
      if(resp.success){
        setTxSuccess(true);
        showAlertMessage(`Successfully world minted`, { variant: "success" });
      } else{
        setTxSuccess(false);
      }
    } else {
      setTxSuccess(false);
    }
  }
  const handleAddCollection = () => {
    setCollectionInfos([
      ...collectionInfos,
      {
        address: '',
        firstIndex: '',
        lastIndex: '',
        chain: ''
      }
    ])
  }
  const handleDeleteCollection = (i) => {
    let infos = [...collectionInfos];
    setCollectionInfos(infos.slice(0, i).concat(infos.slice(i + 1, infos.length)));
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

  return (
    <>
      <div className={classes.otherContent}>
        <Box className={classes.headTitle}>\
          <div className={classes.typo1}>
            Create New Realm
          </div>
        </Box>
        <CreatingStep curStep={step} status={steps} handleGoStep={handleGoStep} />
        {step == 1 && (
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
                    realm name
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
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                  <Box className={classes.itemTitle} mb={1}>
                    realm symbol
                  </Box>
                  <InfoTooltip tooltip={"Please give a realm symbol."} />
                </Box>
                <input
                  className={classes.input}
                  placeholder="ex. SMBLN"
                  value={symbol}
                  onChange={e => setSymbol(e.target.value.trim().toUpperCase())}
                  maxLength={5}
                />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box className={classes.itemTitle} mt={2.5} mb={1}>
                    Add Video File
                  </Box>
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
                      <Box flex={1} display="flex" alignItems="center" marginLeft="24px" justifyContent="space-between" mr={3}>
                        Uploaded {video.name}
                        <Button
                          startIcon={<RefreshIcon />}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setVideo(null);
                            setVideoFile(null);
                            videoInputRef.current?.click();
                          }}
                        >
                          CHANGE FILE
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box className={classes.image}>
                        <img width={32} src={require("assets/icons/video_outline_white_icon.png")} alt="image" />
                      </Box>
                      <Box className={classes.controlBox} ml={5}>
                        Drag video here or <span>browse media on your device</span>
                        <br />
                        Maximum video size is 30mb and mp4, mov, avi and mkv formats
                      </Box>
                    </>
                  )}
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box className={classes.itemTitle} mt={2.5} mb={1}>
                    Preview Image
                  </Box>
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
                      <Box flex={1} display="flex" alignItems="center" marginLeft="24px" justifyContent="space-between" mr={3}>
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
                        We suggest 600 x 600 px size for best viewing experience
                      </Box>
                    </>
                  )}
                </Box>
              </div>
              <input
                ref={imageInputRef}
                id={`selectPhoto-create-nft`}
                hidden
                type="file"
                style={{ display: "none" }}
                accept={"image/png, image/jpeg"}
                onChange={onImageInput}
              />
              <input
                ref={videoInputRef}
                id={`selectUnity-create-nft`}
                hidden
                type="file"
                style={{ display: "none" }}
                accept={"video/mp4, video/mov, video/avi, video/mkv"}
                onChange={onVideoInput}
              />
            </Box>
          </>
        )}
        {step == 2 &&
          <Box
            className={classes.content}
            style={{
              padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
            }}
          >
            <div className={classes.modalContent}>
              <Box display="flex" alignItems="center" justifyContent="left" mt={2.5}>
                <Box className={classes.title} mb={1}>
                  Financial Settings
                </Box>
              </Box>
              <Box className={classes.typo3} mb={3}>
                If a transaction happens within this realm, there is a tax to be paid by the user. This amount is defined by you, the realm creator, and later voted on by the Realm DAO as the Realm expands. For every tax, a part goes to the Realm and a part goes to Dreem.
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                <Box className={classes.itemTitle} mb={1}>
                  taxation
                </Box>
                <InfoTooltip tooltip={"Please give a taxation."} />
              </Box>
              <Box className={classes.inputBigBox}>
                <TextField
                  placeholder="00.00"
                  value={taxation}
                  onChange={e => setTaxation(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Box>
            </div>
          </Box>
        }
        {step == 3 &&
          <>
            <Box
              className={classes.content}
              style={{
                padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
              }}
            >
              <div className={classes.modalContent}>
                <Box display="flex" alignItems="center" justifyContent="left" mt={2.5}>
                  <Box className={classes.title} mb={1}>
                    governance settings
                  </Box>
                </Box>
                <Box className={classes.typo3} mb={3}>
                  Members of the realm and creators of different assets in the realm, be it extensions of materials and so on, can help define the financials and other important decisions of the Realm through voting and consensus.
                </Box>
                <Grid container spacing={4}>
                  <Grid item sm={6} xs={12}>
                    <Box width="100%">
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box className={classes.itemTitle} mb={1}>
                          Voting consensus
                        </Box>
                        <InfoTooltip tooltip={"Please give a Voting consensus."} />
                      </Box>
                      <Box className={classes.inputBigBox}>
                        <TextField
                          placeholder="00"
                          value={votingConsensus}
                          onChange={e => setVotingConsensus(e.target.value)}
                          InputProps={{
                            disableUnderline: true,
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            style: {
                              width: 70,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Box width="100%">
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box className={classes.itemTitle} mb={1}>
                          creator voting power
                        </Box>
                        <InfoTooltip tooltip={"Please give a Voting consensus."} />
                      </Box>
                      <Box className={classes.inputBigBox}>
                        <TextField
                          placeholder="00"
                          value={votingPower}
                          onChange={e => setVotingPower(e.target.value)}
                          InputProps={{
                            disableUnderline: true,
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            style: {
                              width: 70,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                {/* <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                  <Box width="100%">
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                      <Box className={classes.itemTitle} mb={1}>
                        Voting consensus
                      </Box>
                      <InfoTooltip tooltip={"Please give a Voting consensus."} />
                    </Box>
                    <Box className={classes.inputBigBox}>
                      <TextField
                        placeholder="00"
                        value={votingConsensus}
                        onChange={e => setVotingConsensus(e.target.value)}
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          style: {
                            width: 70,
                          }
                        }}
                      />
                    </Box>
                  </Box>
                  <Box width="100%" ml={2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                      <Box className={classes.itemTitle} mb={1}>
                        creator voting power
                      </Box>
                      <InfoTooltip tooltip={"Please give a Voting consensus."} />
                    </Box>
                    <Box className={classes.inputBigBox}>
                      <TextField
                        placeholder="00"
                        value={votingPower}
                        onChange={e => setVotingPower(e.target.value)}
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          style: {
                            width: 70,
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box> */}
              </div>
            </Box>
          </>
        }
        {step === 4 && (
          <Box
            className={classes.content}
            style={{
              padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
            }}
          >
            <div className={classes.modalContent}>
              <Box display="flex" alignItems="center" justifyContent="left" mt={2.5}>
                <Box className={classes.title} mb={1}>
                  Privacy Settings
                </Box>
              </Box>
              <Box className={classes.typo3} mb={3}>
                Public is open to all Dreem users. While selecting restricted means that users only with valid NFTs - the details of which you enter here - can enter the realm.
              </Box>
              <div className={classes.inputGroup}>
                <div className={classes.inputBox}>
                  <input
                    name="radio-group"
                    className={classes.inputRadio}
                    id="public"
                    type="radio"
                    checked={privacy === 'public' && true}
                    onChange={e => setPrivacy(e.target.value == "on" ? "public" : "restricted")}
                  />
                  <label htmlFor="public">Public</label>
                  <div className="check">
                    <div className="inside"></div>
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <input
                    name="radio-group"
                    className={classes.inputRadio}
                    id="restricted"
                    type="radio"
                    checked={privacy === 'restricted' && true}
                    onChange={e => {
                      setPrivacy(e.target.value == "on" ? "restricted" : "public");
                    }}
                  />
                  <label htmlFor="restricted">restricted</label>
                  <div className="check">
                    <div className="inside"></div>
                  </div>
                </div>
              </div>
              <Box display="flex" justifyContent="left" mt={2.5}>
                <InfoIcon />
                <Box className={classes.infoText} mb={1}>
                  {privacy === 'public' && ' Your Realm will be visible to all Dreem users '}
                  {privacy === 'restricted' && ' You  can limit access o your realm to owners of specific NFT by providing Collection address and range of IDs. '}
                </Box>
              </Box>
              {privacy === 'restricted' && (
                <>
                  {collectionInfos.map((c, i) => (
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" mt={3}>
                      <Box width="100%">
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
                          <Box className={classes.itemTitle} mb={1}>
                            collection address
                          </Box>
                          <InfoTooltip tooltip={"Please give a collection address."} />
                        </Box>
                        <Box position="relative">
                          <input
                            className={classes.inputText}
                            placeholder="Address here"
                            value={c.address}
                            onChange={e => {
                              let infos = [...collectionInfos];
                              infos[i].address = e.target.value;
                              setCollectionInfos(infos);
                            }}
                          />
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
                          <Box className={classes.itemTitle} mb={1}>
                            chain
                          </Box>
                          <InfoTooltip tooltip={"Please give a collection address."} />
                        </Box>
                        <Select
                          value={c.chain}
                          onChange={e => {
                            let infos = [...collectionInfos];
                            //@ts-ignore
                            infos[i].chain = e.target.value ? e.target.value : '';
                            setCollectionInfos(infos);
                          }}
                          disableUnderline
                          className={classes.select}
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
                          {networks?.map((option, index) => (
                            <MenuItem key={`OPTION-${index}`} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        <Box display="flex" alignItems="center" justifyContent="space-between" >
                          <Box width="100%">
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                              <Box className={classes.itemTitle} mb={1}>
                                id from
                              </Box>
                            </Box>
                            <Box position="relative">
                              <input
                                className={classes.inputText}
                                placeholder="00.00"
                                value={c.firstIndex}
                                onChange={e => {
                                  let infos = [...collectionInfos];
                                  infos[i].firstIndex = e.target.value;
                                  setCollectionInfos(infos);
                                }}
                              />
                            </Box>
                          </Box>
                          <Box width="100%" ml={1.5}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                              <Box className={classes.itemTitle} mb={1}>
                                to
                              </Box>
                              <InfoTooltip tooltip={"Please give a collection from and to."} />
                            </Box>
                            <Box position="relative">
                              <input
                                className={classes.inputText}
                                placeholder="00.00"
                                value={c.lastIndex}
                                onChange={e => {
                                  let infos = [...collectionInfos];
                                  infos[i].lastIndex = e.target.value;
                                  setCollectionInfos(infos);
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Button
                        size="medium"
                        variant="contained"
                        className={classes.deleteBtn}
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteCollection(i)}
                      />
                    </Box>
                  ))}

                  <Box mt={3}>
                    <PrimaryButton
                      size="small"
                      className={classes.addCollectionBtn}
                      onClick={() => handleAddCollection()}
                    >
                      + Add Collection
                    </PrimaryButton>
                  </Box>
                </>
              )}
            </div>
          </Box>
        )}
        {step === 5 && (
          <WorldList
            handleNext={() => {}}
            handleCancel={() => {}}
            handleSelect={(hash, address, id) => {
              setWorldHash(hash);
              setNFTAddress(address);
              setNFTId(id);
            }}
          />
        )}
      </div>

      <Box className={classes.footer}>
        <div className={classes.howToCreateBtn} onClick={handlePrev}>
          back
        </div>
        <PrimaryButton
          size="medium"
          className={classes.nextBtn}
          disabled={!checkCurrentStep(steps[step-1])}
          onClick={() => handleNext()}
        >
          next
        </PrimaryButton>
      </Box>

      {isUploading && (
        <ContentProcessingOperationModal open={isUploading} txSuccess={uploadSuccess} onClose={()=>{setIsUploading(false)}}/>
      )}
      {txModalOpen && (
        <TransactionProgressModal
          open={txModalOpen}
          title="Creating your Realm"
          transactionSuccess={txSuccess}
          hash={txHash}
          onClose={() => {
            setTxSuccess(null);
            setTxModalOpen(false);
          }}
        />
      )}
    </>
  );
};

const ArrowIcon = ({ color = "white" }) => (
  <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.59766 7.77148H25.0781M1.59766 7.77148L7.59766 1.77148M1.59766 7.77148L7.59765 13.7715" stroke="white" stroke-width="2" stroke-linecap="square" />
  </svg>
);

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

export default CreateRealmFlow;
