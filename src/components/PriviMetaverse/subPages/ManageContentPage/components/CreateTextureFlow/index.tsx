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

import CreateAssetForm from "../CreateAssetForm";
import { FormData, InputFileContents, InputFiles } from "../CreateAssetForm/interface";

const CreateSteps = [
  {
    step: 1,
    label: "NFT",
    completed: false,
  },
  {
    step: 2,
    label: "Royalties",
    completed: false,
  },
  {
    step: 3,
    label: "Files",
    completed: false,
  },
  {
    step: 4,
    label: "Collection",
    completed: false,
  },
];

const CreateTextureFlow = ({ handleCancel }: { handleCancel: () => void }) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [nftOption, setNftOption] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [steps, setSteps] = useState<any>(CreateSteps);
  const [amount, setAmount] = useState<string>("");
  const [royaltyAddress, setRoyaltyAddress] = useState<string>("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState<string>("");
  const [isRoyalty, setIsRoyalty] = useState<boolean>();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [currentCollection, setCurrentCollection] = useState<any>(null);
  const [openPublic, setOpenPublic] = useState<any>();
  const [openMintEditions, setOpenMintEditions] = useState<any>();

  const [metadata, setMetadata] = useState<any>({});
  const [formData, setFormData] = useState<FormData>({});
  const [fileInputs, setFileInputs] = useState<InputFiles>({});
  const [fileContents, setFileContents] = useState<InputFileContents>({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    MetaverseAPI.getAssetMetadata("TEXTURE").then(res => {
      setMetadata(res.data)
    });
  }, []);

  const handlePrev = () => {
    if (step == 1) handleCancel();
    setStep(prev => prev - 1);
  };
  const handleNext = () => {
    console.log(steps[step - 1]);
    switch (step) {
      case 1:
        steps[step - 1].completed =
          nftOption === "single" || (nftOption === "multiple" && amount) ? true : false;
        break;
      case 2:
        steps[step - 1].completed =
          (isRoyalty && royaltyPercentage && royaltyAddress) || isRoyalty === false ? true : false;
        break;
      case 3:
        steps[step - 1].completed = validate() ? true : false;
        break;
      case 4:
        steps[step - 1].completed = currentCollection ? true : false;
        break;

      default:
        break;
    }
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handleMint = () => {
    nftOption == "single" ? mintSingleNFT() : setOpenMintEditions(true);
  };

  const validate = () => {
    for (let i = 0; i < metadata.fields.length; i++) {
      const field = metadata.fields[i];
      if (field.kind === "STRING") {
        if (field.input.required && !formData[field.key]) {
          showAlertMessage(`${field.name.value} is required`, { variant: "error" });
          return false;
        }
        if (formData[field.key] && field.input.range) {
          if (field.input.range.min && field.input.range.min > formData[field.key].length) {
            showAlertMessage(
              `${field.name.value} is invalid. Must be more than ${field.input.range.min} characters`,
              { variant: "error" }
            );
            return false;
          }
          if (field.input.range.max && field.input.range.max < formData[field.key].length) {
            showAlertMessage(
              `${field.name.value} is invalid. Must be less than ${field.input.range.max} characters`,
              { variant: "error" }
            );
            return false;
          }
        }
      } else if (field.kind === "FILE_TYPE_IMAGE") {
        if (field.input.required && !fileInputs[field.key]) {
          showAlertMessage(`${field.name.value} is required`, { variant: "error" });
          return false;
        }
        if (fileContents[field.key] && fileContents[field.key].dimension && field.input.min) {
          if (
            field.input.min.width > (fileContents[field.key].dimension?.width || 0) ||
            field.input.min.height > (fileContents[field.key].dimension?.height || 0)
          ) {
            showAlertMessage(
              `${field.name.value} is invalid. Minium image size is ${field.input.min.width} x ${field.input.min.height}`,
              { variant: "error" }
            );
            return false;
          }
        }
        if (fileContents[field.key] && fileContents[field.key].dimension && field.input.max) {
          if (
            field.input.max.width < (fileContents[field.key].dimension?.width || 0) ||
            field.input.max.height < (fileContents[field.key].dimension?.height || 0)
          ) {
            showAlertMessage(
              `${field.name.value} is invalid. Maximum image size is ${field.input.max.width} x ${field.input.max.height}`,
              { variant: "error" }
            );
            return false;
          }
        }
      }
    }

    return true;
  };

  const mintSingleNFT = () => {};

  return (
    <>
      {openMintEditions ? (
        <MintEditions
          amount={amount}
          handleCancel={() => {
            setOpenMintEditions(false);
          }}
        />
      ) : (
        <>
          <div className={classes.otherContent}>
            <div className={classes.typo1}>
              <AssetIcon />
              Creating New Texture
            </div>
            <CreatingStep curStep={step} status={steps} />
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
                        checked={nftOption === "single" && true}
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
                        checked={nftOption === "multiple" && true}
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
            )}
            {step == 2 && (
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
                    Every time the NFT is traded on OpenSea or Dreem, NFT holders can receive royalties to
                    their wallet address. If you select “Yes”, be prepared to paste the recipient wallet
                    address.
                  </Box>
                  <div className={classes.inputGroup}>
                    <div className={classes.inputBox}>
                      <input
                        name="radio-group"
                        className={classes.inputRadio}
                        id="single"
                        type="radio"
                        checked={isRoyalty && true}
                        onChange={e => setIsRoyalty(e.target.value == "on" ? true : false)}
                      />
                      <label htmlFor="single">yes</label>
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
                        checked={!isRoyalty && true}
                        onChange={e => {
                          setIsRoyalty(e.target.value == "on" ? false : true);
                        }}
                      />
                      <label htmlFor="multi">no</label>
                      <div className="check">
                        <div className="inside"></div>
                      </div>
                    </div>
                  </div>
                  {isRoyalty && (
                    <>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                        <Box className={classes.itemTitle} mb={1}>
                          royalty share amount
                        </Box>
                        <InfoTooltip tooltip={"royalty share amount to receive profit"} />
                      </Box>
                      <Box position="relative">
                        <input
                          type="number"
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
                  )}
                </div>
              </Box>
            )}
            {step == 3 && (
              <>
                <Box
                  className={classes.content}
                  style={{
                    padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
                  }}
                >
                  <div className={classes.modalContent}>
                    <CreateAssetForm
                      metadata={metadata}
                      formData={formData}
                      setFormData={setFormData}
                      fileInputs={fileInputs}
                      setFileInputs={setFileInputs}
                      fileContents={fileContents}
                      setFileContents={setFileContents}
                    />
                  </div>
                </Box>
              </>
            )}
          </div>
          {step === 4 && (
            <CollectionList
              handleNext={() => {}}
              handleCancel={() => {}}
              handleSelect={item => {
                setCurrentCollection(item);
                steps[step - 1].completed = true;
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
                <PrimaryButton
                  size="medium"
                  className={classes.nextBtn}
                  onClick={() => {
                    handleMint();
                  }}
                >
                  mint nft
                </PrimaryButton>
              </Box>
            )}
          </Box>
        </>
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

export default CreateTextureFlow;
