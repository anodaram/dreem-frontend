import React, { useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled } from "@material-ui/core";

import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { switchNetwork } from "shared/functions/metamask";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { UnitEdition } from "shared/constants/constants";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { mintNFTPageStyles } from "./index.styles";
import useIPFS from "shared/utils-IPFS/useIPFS";
import ContentProcessingOperationModal from "components/PriviMetaverse/modals/ContentProcessingOperationModal";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

export default function MintNFTPage() {

  const history = useHistory();
  const classes = mintNFTPageStyles();
  const user: any = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();
  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const { id: hash } = useParams<{ id: string }>();
  const { activate, chainId, account, library } = useWeb3React();
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [bunches, setBunches] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [batch, setBatch] = useState<any>();
  const [amount, setAmount] = useState<any>();
  const [uri, setUri] = useState<any>();
  const [finishedAmount, setFinishedAmount] = useState<any>();
  const [networkName, setNetworkName] = useState<string>("");
  const [batchId, setBatchId] = useState<string>("");
  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [txHash, setTxHash] = useState<string>("");
  React.useEffect(() => {
    MetaverseAPI.getUnfinishedNFT(hash)
    .then(res => {
      console.log(res)
      if (res.success) {
        const item = res.data;
        setBatch(item)
        setAmount(item.erc721TotalSupply)
        setFinishedAmount(item.erc721MintedCount)
        setUri(item.item.erc721Metadata)
      }
    })
  }, []);
  React.useEffect(() => {
    const steps: Array<{}> = [{key: 0, amount: 0, status: null}];
    for(var i = 1;i <= Math.ceil((Number(amount) / UnitEdition)); i++){
      if(Number(amount) >= i * UnitEdition){
        const status = i*UnitEdition <= finishedAmount ? true : null
        const batch = {key: i, amount: i*UnitEdition, status: status}
        steps.push(batch)
      } else{
        const status =  Number(amount) <= finishedAmount ? true : null
        const batch = {key: i, amount: Number(amount), status: status}
        steps.push(batch)
      }
    }
    setBunches(steps)
  }, [amount, finishedAmount]);

  const handleMintBatch = async (i) => {
    const res = mintMultipleEdition()
    bunches.map((item, index)=>{
      if(item.key == i) {
        //@ts-ignore
        if(res){
          item.status = true;
        } else {
          item.status = false;
        }
      }
    });
  }

  const mintMultipleEdition = async () => {
    let collectionData = await MetaverseAPI.getAsset(batch.item.collectionHashId);
    collectionData = collectionData.data
    let metaData;
    let batchId;
    if(!uri){
      let metadata = await getMetadata(batch.item.updateHash);
      batchId = metadata.masterBatchId
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
    if(!library) {
      showAlertMessage("Please check your network", { variant: "error" });
      return false;
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    if (isDraft) {
      let isRoyalty = batch.item.erc721RoyaltyPercentage > 0 ? true : false
      const resRoyalty = await web3APIHandler.RoyaltyFactoryBatch.mint(
        web3,
        account,
        {
          name: collectionData.name,
          symbol: collectionData.collectionSymbol,
          amount: amount,
          uri : URI,
          isRoyalty,
          royaltyAddress: batch.item.erc721RoyaltyAddress,
          royaltyPercentage: batch.item.erc721RoyaltyPercentage
        },
        setTxModalOpen,
        setTxHash
      );
      if (resRoyalty.success) {
        let tokenIds: any = [];
        for (let i = 0; i < Number(resRoyalty.amount) && i < 20; i++) {
          tokenIds.push(Number(resRoyalty.initialId) + i)
        }

        const resp = await MetaverseAPI.convertToNFTAssetBatch(
          batch.item.updateHash,
          resRoyalty.contractAddress,
          targetChain.name,
          tokenIds,
          URI,
          account,
          batch.item.erc721RoyaltyAddress,
          batch.item.erc721RoyaltyPercentage,
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
  
        if (contractRes.success) {
          console.log(contractRes);
          let tokenIds: any = [];
          for (let i = Number(contractRes.startTokenId); i < Number(contractRes.endTokenId); i++) {
            tokenIds.push(Number(i))
          }
          const resp = await MetaverseAPI.convertToNFTAssetBatch(
            batch.item.updateHash,
            contractRes.collectionAddress,
            targetChain.name,
            tokenIds,
            URI,
            contractRes.owner,
            batch.item.erc721RoyaltyAddress,
            batch.item.erc721RoyaltyPercentage,
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
      } else {
        let isRoyalty = batch.item.erc721RoyaltyPercentage > 0 ? true : false
        const contractRes = await web3APIHandler.NFTWithRoyaltyBatch.mint(
          web3,
          account,
          {
            collectionAddress: collectionAddr,
            name: collectionData.name,
            symbol: collectionData.collectionSymbol,
            to: account,
            amount: amount,
            uri : URI,
            isRoyalty,
            royaltyAddress: batch.item.erc721RoyaltyAddress,
            royaltyPercentage: batch.item.erc721RoyaltyPercentage
          },
          setTxModalOpen,
          setTxHash
        );

        if (contractRes.success) {
          console.log(contractRes);
          let tokenIds: any = [];
          for (let i = Number(contractRes.startTokenId); i < Number(contractRes.endTokenId); i++) {
            tokenIds.push(Number(i))
          }
          const resp = await MetaverseAPI.convertToNFTAssetBatch(
            batch.item.updateHash,
            contractRes.collectionAddress,
            targetChain.name,
            tokenIds,
            URI,
            contractRes.owner,
            batch.item.erc721RoyaltyAddress,
            batch.item.erc721RoyaltyPercentage,
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

  const getMetadata = async (hashId) => {
    try {
      const res = await MetaverseAPI.getNFTInfo(hashId)
      return res.data
    } catch (error) {
      console.log('error in getting metadata',error)
    }
  }
  const handleCancel = () => {
    history.push(`/profile/${user?.address}`);
  }

  return (
    isUploading ? (
      <ContentProcessingOperationModal open={isUploading} txSuccess={uploadSuccess} onClose={()=>{setIsUploading(false)}}/>
    ) :
    <div className={classes.otherContent}>
      <Box
        className={classes.content}
        style={{
          padding: isMobile ? "47px 22px 63px" : "100px 58px 50px",
        }}
      >
        <div className={classes.modalContent}>
          <div className={classes.title}>
            Sign all batches  of multiple editions to mint.
          </div>
          <div className={classes.description}>
            Let’s mint your NFTs! You will need to do this step by step, so please ensure that you have enough MATIC to cover the fees.
          </div>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.subTitle} mb={5}>
              Mint the following batches in order 
            </Box>
          </Box>
          {bunches.map((item, index)=>
            index > 0 &&
            <Box className={classes.mintBox}>
              <Box className={classes.itemTitle}>
                Batch {bunches[index - 1].amount + 1}-{item.amount}
              </Box>
              {item.status ? 
              <Box>Minted</Box>
              :
              <PrimaryButton className={classes.mintBtn} size="medium" onClick={()=>handleMintBatch(item.key)}>
                 {item.status == false ? "Try again" : "Mint"}
              </PrimaryButton>
              }
            </Box>
          )}
          <Box display="flex" alignItems="center" justifyContent="center" mt={5}>
            <PrimaryButton className={classes.finishBtn} size="medium" onClick={()=>handleCancel()}>
              Finish Minting
            </PrimaryButton>
          </Box>
        </div>
      </Box>
      {txModalOpen && (
        <TransactionProgressModal
          open={txModalOpen}
          title="Minting your NFT"
          transactionSuccess={txSuccess}
          hash={txHash}
          onClose={() => {
            setTxSuccess(null);
            setTxModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

