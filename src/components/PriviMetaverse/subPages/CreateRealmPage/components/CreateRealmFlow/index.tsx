import React, { useEffect, useState, useRef } from "react";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled, Select, MenuItem, Button, TextField, InputAdornment } from "@material-ui/core";

import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import CreatingStep from "../CreatingStep";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import { useModalStyles } from "./index.styles";

import { InfoIcon } from "shared/ui-kit/Icons";
import { ReactComponent as DeleteIcon } from "assets/icons/remove.svg";

interface CollectionInfo {
  address: string;
  from: string;
  to: string;
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
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [step, setStep] = useState<number>(1);
  const [steps, setSteps] = useState<any>(CreateSteps);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [taxation, setTaxation] = useState<string>("");
  const [votingConsensus, setVotingConsensus] = useState<string>("");
  const [votingPower, setVotingPower] = useState<string>("");
  const [privacy, setPrivacy] = useState<string>('public');
  const [collectionInfos, setCollectionInfos] = useState<Array<CollectionInfo>>([{
    address: '',
    from: '',
    to: ''
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

  const handlePrev = () => {
    if (step == 1) {
      handleCancel();
      return;
    } 
    setStep(prev => prev - 1);
  };
  const handleNext = () => {
    switch (step) {
      case 1:
        steps[step - 1].completed = title && description && symbol && image && video && video.size <= 30 * 1024 * 1024 ? true : false;
        break;
      case 2:
        steps[step - 1].completed = taxation ? true : false;
        break;
      case 3:
        steps[step - 1].completed = votingConsensus && votingPower ? true : false;
        break;
      case 4:
        steps[step - 1].completed = privacy === 'public' || collectionInfos.every(c => c.address && c.from && c.to) ? true : false;
        break;
      
      default:
        break;
    }
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };
  const handleGoStep = step => {
    setStep(step);
  }
  const handleAddCollection = () => {
    setCollectionInfos([
      ...collectionInfos,
      {
        address: '',
        from: '',
        to: '',
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
        <div className={classes.typo1}>
          <AssetIcon />
          Creating New Realm
        </div>
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
                  placeholder="NFT symbol"
                  value={symbol}
                  onChange={e => setSymbol(e.target.value)}
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
                      <Box flex={1} display="flex" alignItems="center" marginLeft="24px" justifyContent="space-between" mr={3}>
                        Uploaded {video.name}
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
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
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
                </Box>
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
                                value={c.from}
                                onChange={e => {
                                  let infos = [...collectionInfos];
                                  infos[i].from = e.target.value;
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
                                value={c.to}
                                onChange={e => {
                                  let infos = [...collectionInfos];
                                  infos[i].to = e.target.value;
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
      </div>

      <Box className={classes.footer}>
        <div className={classes.howToCreateBtn} onClick={handlePrev}>
          cancel
        </div>
        <PrimaryButton
          size="medium"
          className={classes.nextBtn}
          onClick={() => handleNext()}
        >
          next
        </PrimaryButton>
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

export default CreateRealmFlow;