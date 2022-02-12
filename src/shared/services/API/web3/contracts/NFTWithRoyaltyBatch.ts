import Web3 from "web3";
import { zeroAddress } from "ethereumjs-util";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const MAX_PRIO_FEE = "50";

const nftWithRoyalty = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY;

  const metadata = require("shared/connectors/web3/contracts/ERC721WithRoyalty.json");
  let txHash;
  const mint = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { collectionAddress, name, symbol, to, amount, uri, isRoyalty, royaltyAddress, royaltyPercentage  } = payload;
        const rAddress = isRoyalty ? royaltyAddress : zeroAddress()
        const bps = isRoyalty ? royaltyPercentage * 100 : 0

        const contract = ContractInstance(web3, metadata.abi, collectionAddress);

        console.log("Getting gas....", contract, collectionAddress, to, account, uri, rAddress, bps);
        const gas = await contract.methods.mintMasterBatch(name, symbol, amount, uri, rAddress, bps, '').estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .mintMasterBatch(name, symbol, amount, uri, rAddress, bps, '')
          .send({ from: account, gas: gas, maxPriorityFeePerGas: web3.utils.toWei(MAX_PRIO_FEE, 'gwei') })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
            txHash = hash;
          });
        console.log("transaction succeed", response);
        console.log(response.events)
        const returnValues = response.events.RoyaltyNFT.returnValues;
        const returnValuesBatch = response.events.BatchMinting.returnValues;
        resolve({ success: true, txHash: txHash, owner: returnValues.owner, collectionAddress, batchId: returnValuesBatch.batchId,  startTokenId: returnValuesBatch.startingId, endTokenId: returnValuesBatch.endingId });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const mintBatchFromId = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { collectionAddress, batchId  } = payload;

        const contract = ContractInstance(web3, metadata.abi, collectionAddress);

        console.log("Getting gas....", contract, collectionAddress);
        const gas = await contract.methods.mintBatchFromId(batchId).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .mintBatchFromId(batchId)
          .send({ from: account, gas: gas, maxPriorityFeePerGas: web3.utils.toWei(MAX_PRIO_FEE, 'gwei') })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
            txHash = hash;
          });
        console.log("transaction succeed", response);
        console.log(response.events)
        const returnValues = response.events.BatchMinting.returnValues;
        resolve({ success: true, txHash: txHash, collectionAddress, batchId: returnValues.batchId,  startTokenId: returnValues.startingId, endTokenId: returnValues.endingId });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    mint,
    mintBatchFromId
  };
};

export default nftWithRoyalty;
