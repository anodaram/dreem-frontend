import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { useMediaQuery, useTheme, capitalize } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import ContentProcessingOperationModal from "components/PriviMetaverse/modals/ContentProcessingOperationModal";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import useIPFS from "shared/utils-IPFS/useIPFS";
import ItemModel from "shared/model/ItemModel";
import CreatingStep from "../CreatingStep";
import MintEditions from "../MintEditions";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import CollectionList from "../CollectionList";
import PublicOption from "../PublicOption";
import CreateAssetForm from "../CreateAssetForm";
import { FormData, InputFileContents, InputFiles } from "../CreateAssetForm/interface";

import { useModalStyles } from "./index.styles";

const CreateSteps = [
  {
    label: 'NFT',
    completed: false
  },
  {
    label: 'Royalties',
    completed: false
  },
  {
    label: 'Files',
    completed: false
  },
  {
    label: 'Collection',
    completed: false
  },
]
const CreateAssetFlow = ({
  assetItem,
  handleCancel,
}: {
  assetItem: string;
  handleCancel: () => void;
}) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { chainId, account, library } = useWeb3React();
  const { uploadWithNonEncryption } = useIPFS();
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);
  const [nftOption, setNftOption] = useState<string>("single");
  const [step, setStep] = useState<number>(1);
  const [steps, setSteps] = useState<any>([]);
  const [amount, setAmount] = useState<number>();
  const [royaltyAddress, setRoyaltyAddress] = useState<string>("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState<number>();
  const [isRoyalty, setIsRoyalty] = useState<boolean>(false);
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
  const [uri, setUri] = useState<string>();
  const [formData, setFormData] = useState<FormData>({});
  const [fileInputs, setFileInputs] = useState<InputFiles>({});
  const [fileContents, setFileContents] = useState<InputFileContents>({});
  const [savingType, setSavingType] = useState<string>("nft");
  const [batchId, setBatchId] = useState<string>();
  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");

  const stepItem = React.useMemo(() => steps.find(s => s.step === step),  [step, steps]);

  const param = {
    TEXTURE: {
      texture: "ITEM_IMAGE_TEXTURE"
    },
    MATERIAL: {
      surface: "ITEM_MATERIAL_SURFACE_TYPE",
      blend: "ITEM_MATERIAL_BLENDING_MODE",
      cull: "ITEM_MATERIAL_CULL_MODE",
      alphaClip: "ITEM_MATERIAL_ALPHA_CLIPPING",
      cutoff: "ITEM_MATERIAL_ALPHA_CLIPPING_THRESHOLD",
      baseColor: "ITEM_MATERIAL_BASE_COLOR",
      baseMap: "ITEM_MATERIAL_BASE_MAP",
    },
    WORLD: {
      worldImage: "ITEM_WORLD_IMAGE",
      worldVideo: "ITEM_WORLD_VIDEO",
      worldLevel: "ITEM_WORLD_FILE",
      worldData: "ITEM_WORLD_FILE_DATA",
    },
  }
  useEffect(() => {
    if (assetItem === "WORLD") {
      setSteps(CreateSteps.slice(1).map((s, index) => ({ ...s, step: index + 1 })));
    } else {
      setSteps(CreateSteps.map((s, index) => ({ ...s, step: index + 1 })));
    }

    MetaverseAPI.getAssetMetadata(assetItem).then(res => {
      setMetadata(res.data);
    });
  }, [assetItem]);

  const handlePrev = () => {
    if (step == 1) handleCancel()
    setStep(prev => prev - 1);
  };
  const handleNext = () => {
    switch (stepItem.label) {
      case 'NFT':
        steps[step - 1].completed = (nftOption === 'single') || (nftOption === 'multiple' && amount) ? true : false;
        break;
      case 'Royalties':
        steps[step - 1].completed = (isRoyalty && royaltyPercentage && royaltyAddress) || (isRoyalty === false) ? true : false;
        break;
      case 'Files':
        steps[step - 1].completed = validate(true) ? true : false;
        break;
      case 'Collection':
        steps[step - 1].completed = currentCollection ? true : false;
        break;

      default:
        break;
    }
    if (step < steps.length) {
      if(steps[step - 1].completed){
        setStep(prev => prev + 1);
      } else{
        if(stepItem.label != 'Files'){
          showAlertMessage('Please complete current step.', { variant: "error" });
        }
      }
    }
  };
  const checkCurrentStep = (stepItem) => {
    switch (stepItem.label) {
      case 'NFT':
        return (nftOption === 'single') || (nftOption === 'multiple' && amount) ? true : false;
        break;
      case 'Royalties':
        return (isRoyalty && royaltyPercentage && royaltyAddress) || (isRoyalty === false) ? true : false;
        break;
      case 'Files':
        return validate(false) ? true : false;
        break;
      case 'Collection':
        return currentCollection ? true : false;
        break;

      default:
        break;
    }
  };

  const handleGoStep = step => {
    setStep(step);
  }


  const handleSaveDraft = async () => {
    setOpenPublic(false)
    if (validate(false)) {
      if (!currentCollection) {
        showAlertMessage('Please choose collection.', { variant: "error" });
        return false;
      }
      if(nftOption === 'multiple' && Number(amount || 0) < 2){
        showAlertMessage(`please set the amount for Multiple edition`, { variant: "error" });
        return false;
      }
      let payload: any = {};

      payload = {
        collectionHashId: currentCollection.versionHashId,
        item: assetItem,
        isPublic: isPublic,
        name: formData.ITEM_NAME,
        description: formData.ITEM_DESCRIPTION,
      };
      const params = param[assetItem]
      Object.keys(params).map(function (key, index) {
        payload[key] = formData[params[key]] ? formData[params[key]] : fileInputs[params[key]]
      });

      setIsUploading(true);
      setProgress(0);
      MetaverseAPI.uploadAsset(payload).then(async res => {
        if (!res.success) {
          showAlertMessage(`Failed to upload world`, { variant: "error" });
          setUploadSuccess(false);
        } else {
          setSavingDraft(res.data);
          if(savingType == 'draft'){
            setUploadSuccess(true);
            showAlertMessage(`Created draft successfully`, { variant: "success" });
          } else if(savingType == 'nft'){
            setUploadSuccess(true);
            setIsUploading(false);
            handleMint(res.data)
          } else{
            showAlertMessage(`Something is wrong`, { variant: "error" });
          }
        }
      });
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
  const mintSingleNFT = async (data) => {
    if (!data) {
      showAlertMessage(`Save draft first`, { variant: "error" });
      return;
    }
    const savingDraft = data;
    let collectionData = await MetaverseAPI.getAsset(currentCollection.versionHashId);
    collectionData = collectionData.data
    let metadata = await getMetadata(savingDraft.instance.hashId);
    let collectionAddr = collectionData.collectionAddress;
    let isDraft = !collectionData?.minted;

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
    if (!library) {
      showAlertMessage("Please check your network", { variant: "error" });
      return;
    }
    const uri = `https://elb.ipfsprivi.com:8080/ipfs/${metaData.newFileCID}`;
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    if (isDraft) {
      const resRoyalty = await web3APIHandler.RoyaltyFactoryBatch.mint(
        web3,
        account,
        {
          name: collectionData.name,
          symbol: collectionData.collectionSymbol,
          amount: 1,
          uri: uri,
          isRoyalty,
          royaltyAddress,
          royaltyPercentage
        },
        setTxModalOpen,
        setTxHash
      );
      if (resRoyalty.success) {
        const resp = await MetaverseAPI.convertToNFTAssetBatch(
          savingDraft.instance.hashId,
          resRoyalty.contractAddress,
          targetChain.name,
          [1],
          uri,
          account,
          royaltyAddress,
          royaltyPercentage,
          resRoyalty.txHash,
          1,
          resRoyalty.batchId
        );
        if(resp.success){
          setBatchId(resRoyalty.batchId)
          setTxSuccess(true);
          showAlertMessage(`Successfully asset minted`, { variant: "success" });
          return true;
        } else{
          setTxSuccess(false);
          showAlertMessage(`Something went wrong`, { variant: "error" });
          return false;
        }
      } else {
        setTxSuccess(false);
        return false;
      }
    } else {
      const contractRes = await web3APIHandler.NFTWithRoyaltyBatch.mint(
        web3,
        account,
        {
          collectionAddress: collectionAddr,
          name: collectionData.name,
          symbol: collectionData.collectionSymbol,
          to: account,
          amount: 1,
          uri: uri,
          isRoyalty,
          royaltyAddress,
          royaltyPercentage
        },
        setTxModalOpen,
        setTxHash
      );
      console.log(contractRes)

      if (contractRes.success) {
        const resp = await MetaverseAPI.convertToNFTAssetBatch(
          savingDraft.instance.hashId,
          contractRes.collectionAddress,
          targetChain.name,
          [contractRes.startTokenId],
          uri,
          contractRes.owner,
          royaltyAddress,
          royaltyPercentage,
          contractRes.txHash,
          1,
          contractRes.batchId
        );
        if(resp.success){
          setBatchId(contractRes.batchId)
          setTxSuccess(true);
          showAlertMessage(`Successfully asset minted`, { variant: "success" });
          return true;
        } else{
          setTxSuccess(false);
          showAlertMessage(`Something went wrong`, { variant: "error" });
          return false;
        }
      } else {
        setTxSuccess(false);
        return false
      }
    }
  };
  const mintMultipleEdition = async () => {
    if (!savingDraft) {
      showAlertMessage(`Save draft first`, { variant: "error" });
      return;
    }
    let collectionData = await MetaverseAPI.getAsset(currentCollection.versionHashId);
    collectionData = collectionData.data
    let metaData;
    if (!uri) {
      let metadata = await getMetadata(savingDraft.instance.hashId);
      metaData = await onUploadNonEncrypt(metadata, file => uploadWithNonEncryption(file));
      const metadatauri = `https://elb.ipfsprivi.com:8080/ipfs/${metaData.newFileCID}`;
      setUri(metadatauri)
    }
    let isDraft = !collectionData?.minted;
    let collectionAddr = collectionData.collectionAddress;
    let URI = uri ? uri : metaData.newFileCID
    const targetChain = BlockchainNets.find(net => net.value === chain);
    setNetworkName(targetChain.name);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }
    if (!library) {
      showAlertMessage("Please check your network", { variant: "error" });
      return false;
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    if (isDraft) {
      const resRoyalty = await web3APIHandler.RoyaltyFactoryBatch.mint(
        web3,
        account,
        {
          name: collectionData.name,
          symbol: collectionData.collectionSymbol,
          amount: amount,
          uri: URI,
          isRoyalty,
          royaltyAddress,
          royaltyPercentage
        },
        setTxModalOpen,
        setTxHash
      );
      console.log(resRoyalty)
      if (resRoyalty.success) {
        let tokenIds: any = [];
        for (let i = 0; i < Number(resRoyalty.amount) && i < 20; i++) {
          tokenIds.push(Number(resRoyalty.initialId) + i)
        }

        const resp = await MetaverseAPI.convertToNFTAssetBatch(
          savingDraft.instance.hashId,
          resRoyalty.contractAddress,
          targetChain.name,
          tokenIds,
          URI,
          account,
          royaltyAddress,
          royaltyPercentage,
          resRoyalty.txHash,
          amount,
          resRoyalty.batchId
        );
        if(resp.success){
          setBatchId(resRoyalty.batchId)
          setTxSuccess(true);
          showAlertMessage(`Successfully asset minted`, { variant: "success" });
          return true;
        } else{
          setTxSuccess(false);
          showAlertMessage(`Something went wrong`, { variant: "error" });
          return false;
        }
      } else {
        setTxSuccess(false);
        return false;
      }
    } else {
      if(batchId){
        const contractRes = await web3APIHandler.NFTWithRoyaltyBatch.mintBatchFromId(
          web3,
          account,
          {
            collectionAddress: collectionAddr,
            batchId: batchId
          },
          setTxModalOpen,
          setTxHash
        );
        console.log(contractRes)

        if (contractRes.success) {
          let tokenIds: any = [];
          for (let i = Number(contractRes.startTokenId); i < Number(contractRes.endTokenId); i++) {
            tokenIds.push(Number(i))
          }
          const resp = await MetaverseAPI.convertToNFTAssetBatch(
            savingDraft.instance.hashId,
            contractRes.collectionAddress,
            targetChain.name,
            tokenIds,
            URI,
            contractRes.owner,
            royaltyAddress,
            royaltyPercentage,
            contractRes.txHash,
            amount,
            contractRes.batchId
          );
          if(resp.success){
            setBatchId(contractRes.batchId)
            setTxSuccess(true);
            showAlertMessage(`Successfully asset minted`, { variant: "success" });
            return true;
          } else{
            setTxSuccess(false);
            showAlertMessage(`Something went wrong`, { variant: "error" });
            return false;
          }
        } else {
          setTxSuccess(false);
          return false
        }
      } else{
        const contractRes = await web3APIHandler.NFTWithRoyaltyBatch.mint(
          web3,
          account,
          {
            collectionAddress: collectionAddr,
            name: collectionData.name,
            symbol: collectionData.collectionSymbol,
            to: account,
            amount: amount,
            uri: URI,
            isRoyalty,
            royaltyAddress,
            royaltyPercentage
          },
          setTxModalOpen,
          setTxHash
        );
        console.log(contractRes)

        if (contractRes.success) {
          let tokenIds: any = [];
          for (let i = Number(contractRes.startTokenId); i < Number(contractRes.endTokenId); i++) {
            tokenIds.push(Number(i))
          }
          const resp = await MetaverseAPI.convertToNFTAssetBatch(
            savingDraft.instance.hashId,
            contractRes.collectionAddress,
            targetChain.name,
            tokenIds,
            URI,
            contractRes.owner,
            royaltyAddress,
            royaltyPercentage,
            contractRes.txHash,
            amount,
            contractRes.batchId
          );
          if(resp.success){
            setBatchId(contractRes.batchId)
            setTxSuccess(true);
            showAlertMessage(`Successfully asset minted`, { variant: "success" });
            return true;
          } else{
            setTxSuccess(false);
            showAlertMessage(`Something went wrong`, { variant: "error" });
            return false;
          }
        } else {
          setTxSuccess(false);
          return false
        }
      }
    }
  };

  const handlePublic = (option) => {
    setSavingType(option)
    option == 'draft' ? setOpenPublic(true) : handleSaveDraft()
  };

  const handleMint = (data) => {
    nftOption == "single" ? mintSingleNFT(data) : setOpenMintEditions(true);
  };

  const validate = (withMessage) => {
    if (metadata && metadata?.fields) {
      for (let i = 0; i < metadata?.fields?.length; i++) {
        const field = metadata.fields[i];
        if (field.kind === "STRING") {
          if (field?.key && field?.input?.required && !formData[field?.key]) {
            withMessage && showAlertMessage(`${field?.name?.value} is required`, { variant: "error" });
            return false;
          }
          if (field?.key && formData[field.key] && field?.input?.range) {
            if (field?.input?.range.min && field?.input?.range.min > formData[field.key].length) {
              withMessage && showAlertMessage(
                `${field?.name?.value} is invalid. Must be more than ${field.input.range.min} characters`,
                { variant: "error" }
              );
              return false;
            }
            if (field.input.range.max && field.input.range.max < formData[field.key].length) {
              withMessage && showAlertMessage(
                `${field?.name?.value} is invalid. Must be less than ${field.input.range.max} characters`,
                { variant: "error" }
              );
              return false;
            }
          }
        } else if (field.kind === "FILE") {
          if (field?.key && field?.input?.required && !fileInputs[field.key]) {
            withMessage && showAlertMessage(`${field?.name?.value} is required`, { variant: "error" });
            return false;
          }
          if (field.key && fileContents[field.key] && fileContents[field.key].dimension && field?.input?.min) {
            //@ts-ignore
            if (field?.input?.min.width > (fileContents[field.key].dimension?.width || 0) || field?.input?.min?.height > (fileContents[field.key].dimension?.height || 0)
            ) {
              withMessage && showAlertMessage(
                `${field?.name?.value} is invalid. Minium image size is ${field?.input?.min?.width} x ${field?.input?.min?.height}`,
                { variant: "error" }
              );
              return false;
            }
          }
          if (field.key && fileContents[field.key] && fileContents[field.key].dimension && field?.input?.max) {
            //@ts-ignore
            if (field?.input?.max?.width < (fileContents[field.key].dimension?.width || 0) || field?.input?.max?.height < (fileContents[field.key].dimension?.height || 0)
            ) {
              withMessage && showAlertMessage(
                `${field?.name?.value} is invalid. Maximum image size is ${field?.input?.max?.width} x ${field?.input?.max?.height}`,
                { variant: "error" }
              );
              return false;
            }
          }
          if (field.key && fileContents[field.key] && field?.input?.formats){
            //@ts-ignore
            var el =  field?.input?.formats.some(i => i.name.includes(fileInputs[field.key]?.name.split(".").reverse()[0]));
            if(!el) {
              withMessage && showAlertMessage(`${field.key} File is invalid.`, { variant: "error" });
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  const handleFinish = () => {
    setOpenMintEditions(false)
    handleCancel()
  }

  return (

    <>
      {openMintEditions ?
        <MintEditions
          amount={amount || 0}
          hashId={savingDraft.instance.hashId}
          handleCancel={() => { handleFinish() }}
          handleMint={() => mintMultipleEdition()}
        />
        :
        <>
          <div className={classes.otherContent}>
            <div className={classes.typo1}>
              <AssetIcon />
              Creating New {capitalize(assetItem)}
            </div>
            <CreatingStep curStep={step} status={steps} handleGoStep={handleGoStep} />
            {stepItem?.label == "NFT" &&
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
                        placeholder="0"
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                      />
                    </>
                  )}
                </div>
              </Box>
            }
            {stepItem?.label == "Royalties" &&

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
                        onChange={e => { setIsRoyalty(e.target.value == 'on' ? false : true) }}
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
                          onChange={e => setRoyaltyPercentage(Number(e.target.value))}
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
            {stepItem?.label == "Files" &&
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
            }
          </div>
          {stepItem?.label == "Collection" && (
            <CollectionList
              handleNext={() => { }}
              handleCancel={() => { }}
              handleSelect={item => {
                setCurrentCollection(item);
                steps[step - 1].completed = true
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
            {step < steps.length && (
              <PrimaryButton
                size="medium"
                className={classes.nextBtn}
                disabled={!checkCurrentStep(steps[step-1])}
                onClick={() => handleNext()}
              >
                next
              </PrimaryButton>
            )}
            {step === steps.length && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <PrimaryButton size="medium" className={classes.createDraftBtn} disabled={currentCollection ? false : true} onClick={() => handlePublic("draft")}>
                  create draft
                </PrimaryButton>
                <PrimaryButton size="medium" className={classes.nextBtn} disabled={currentCollection ? false : true} onClick={() => { handlePublic("nft") }}>
                  mint nft
                </PrimaryButton>
              </Box>
            )}
          </Box>
        </>
      }
      {isUploading && (
        <ContentProcessingOperationModal open={isUploading} txSuccess={uploadSuccess} onClose={() => { setIsUploading(false) }} />
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

export default CreateAssetFlow;
