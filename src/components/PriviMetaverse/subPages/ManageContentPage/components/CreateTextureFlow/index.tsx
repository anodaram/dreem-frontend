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
import ContentProcessingOperationModal from "components/PriviMetaverse/modals/ContentProcessingOperationModal";
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
import ItemModel from "shared/model/ItemModel";

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
  const { activate, chainId, account, library } = useWeb3React();
  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);
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
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [savingDraft, setSavingDraft] = useState<any>();
  const [networkName, setNetworkName] = useState<string>("");
  const [metadata, setMetadata] = useState<ItemModel>({});
  const [formData, setFormData] = useState<FormData>({});
  const [fileInputs, setFileInputs] = useState<InputFiles>({});
  const [fileContents, setFileContents] = useState<InputFileContents>({});
  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    MetaverseAPI.getAssetMetadata("TEXTURE").then(res => {
      setMetadata(res.data);
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
  const handleGoStep = step => {
    setStep(step);
  }

  const handleSaveDraft = async () => {
    setOpenPublic(false)
    if (validate()) {
      let payload: any = {};
      let collectionAddr = currentCollection.address;
      let tokenId;
      console.log(formData)
      console.log(fileInputs)
      console.log(fileContents)

      payload = {
        collectionId: currentCollection.id,
        item: "TEXTURE",
        name: formData.ITEM_NAME,
        description: formData.ITEM_DESCRIPTION,
        texture: fileInputs.ITEM_IMAGE_TEXTURE,
        isPublic: isPublic,
      };

      setIsUploading(true);
      setProgress(0);
      MetaverseAPI.uploadAsset(payload).then(async res => {
        if (!res.success) {
          showAlertMessage(`Failed to upload world`, { variant: "error" });
          setUploadSuccess(false);
        } else {
          setSavingDraft(res.data);
          setUploadSuccess(true);
          showAlertMessage(`Created draft successfully`, { variant: "success" });
        }
      });
    }
  };
  const getMetadata = async (hashId) => {
    try {
      const res = await MetaverseAPI.getNFTInfo(hashId)
      return res.data
    } catch (error) {
      console.log('error in getting metadata',error)
    }
  }
  const mintSingleNFT = async () => {
    if(!savingDraft){
      showAlertMessage(`Save draft first`, { variant: "error" });
      return;
    }
    let collectionData = currentCollection;
    let metadata = await getMetadata(savingDraft.instance.hashId);
    let collectionAddr = collectionData.address;
    let isDraft = collectionData?.kind == "DRAFT" ? true : false;

    const metaData = await onUploadNonEncrypt(metadata, file => uploadWithNonEncryption(file));
    console.log(metaData, collectionData);
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
          savingDraft.instance.hashId,
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
          savingDraft.instance.hashId,
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
  const mintMultipleEdition = async () => {
    if(!savingDraft){
      showAlertMessage(`Save draft first`, { variant: "error" });
      return;
    }
    let collectionData = currentCollection;
    let metadata = await getMetadata(savingDraft.instance.hashId);
    let collectionAddr = collectionData.address;
    let isDraft = collectionData?.kind == "DRAFT" ? true : false;

    const metaData = await onUploadNonEncrypt(metadata, file => uploadWithNonEncryption(file));
    console.log(metaData, collectionData);
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
          savingDraft.instance.hashId,
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
          savingDraft.instance.hashId,
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

  const handleMint = () => {
    nftOption == "single" ? mintSingleNFT() : setOpenMintEditions(true);
  };

  const validate = () => {
    if(metadata && metadata?.fields){
      for (let i = 0; i < metadata?.fields?.length; i++) {
        const field = metadata.fields[i];
        if (field.kind === "STRING") {
          if (field?.key && field?.input?.required && !formData[field?.key]) {
            showAlertMessage(`${field?.name?.value} is required`, { variant: "error" });
            return false;
          }
          if (field?.key && formData[field.key] && field?.input?.range) {
            if (field?.input?.range.min && field?.input?.range.min > formData[field.key].length) {
              showAlertMessage(
                `${field?.name?.value} is invalid. Must be more than ${field.input.range.min} characters`,
                { variant: "error" }
              );
              return false;
            }
            if (field.input.range.max && field.input.range.max < formData[field.key].length) {
              showAlertMessage(
                `${field?.name?.value} is invalid. Must be less than ${field.input.range.max} characters`,
                { variant: "error" }
              );
              return false;
            }
          }
        } else if (field.kind === "FILE_TYPE_IMAGE") {
          if (field?.key && field?.input?.required && !fileInputs[field.key]) {
            showAlertMessage(`${field?.name?.value} is required`, { variant: "error" });
            return false;
          }
          if (field.key && fileContents[field.key] && fileContents[field.key].dimension && field?.input?.min) {
            //@ts-ignore
            if ( field?.input?.min.width > (fileContents[field.key].dimension?.width || 0) || field?.input?.min?.height > (fileContents[field.key].dimension?.height || 0)
            ) {
              showAlertMessage(
                `${field?.name?.value} is invalid. Minium image size is ${field?.input?.min?.width} x ${field?.input?.min?.height}`,
                { variant: "error" }
              );
              return false;
            }
          }
          if (field.key && fileContents[field.key] && fileContents[field.key].dimension && field?.input?.max) {
            //@ts-ignore
            if ( field?.input?.max?.width < (fileContents[field.key].dimension?.width || 0) || field?.input?.max?.height < (fileContents[field.key].dimension?.height || 0)
            ) {
              showAlertMessage(
                `${field?.name?.value} is invalid. Maximum image size is ${field?.input?.max?.width} x ${field?.input?.max?.height}`,
                { variant: "error" }
              );
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  return (
    <>
      {openMintEditions ? (
        <MintEditions
          amount={amount}
          hashId = {savingDraft.instance.hashId}
          handleCancel={() => {
            setOpenMintEditions(false);
          }}
          handleMint = {() => {}}
        />
      ) : (
        <>
          <div className={classes.otherContent}>
            <div className={classes.typo1}>
              <AssetIcon />
              Creating New Texture
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
              handleSubmit={() => handleSaveDraft()}
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
      {isUploading && (
        <ContentProcessingOperationModal open={isUploading} txSuccess={uploadSuccess} onClose={()=>{setIsUploading(false)}}/>
      )}
      {txModalOpen && (
        <TransactionProgressModal
          open={txModalOpen}
          title="Minting your NFT"
          transactionSuccess={txSuccess}
          hash={txHash}
          onClose={() => {
            setTxSuccess(null);
            setTxModalOpen(false);
            handleNext();
          }}
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

export default CreateTextureFlow;
