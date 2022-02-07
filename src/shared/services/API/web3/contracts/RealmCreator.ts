import Web3 from "web3";
import { zeroAddress } from "ethereumjs-util";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const MAX_PRIO_FEE = "50";

const RealmCreator = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.REALMCREATOR;
  let txHash;
  const metadata = require("shared/connectors/web3/contracts/RealmCreator.json");

  const mint = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { uri, taxRate, creatorShare, votingConsensus, nftToAttachAddress, nftToAttachId } = payload;
        // const rAddress = isRoyalty ? royaltyAddress : zeroAddress()
        console.log('params---', uri, taxRate, creatorShare, votingConsensus, nftToAttachAddress, nftToAttachId)
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....", contract, contractAddress, account, uri, taxRate, creatorShare, votingConsensus, nftToAttachAddress, nftToAttachId);
        const gas = await contract.methods.createRealm(uri, taxRate, creatorShare, votingConsensus, nftToAttachAddress, nftToAttachId).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .createRealm(uri, taxRate, creatorShare, votingConsensus, nftToAttachAddress, nftToAttachId)
          .send({ from: account, gas: gas, maxPriorityFeePerGas: web3.utils.toWei(MAX_PRIO_FEE, 'gwei') })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
            txHash = hash;
          });
        console.log("transaction succeed", response);
        const returnValues = response.events.RealmCreated.returnValues
        resolve({ success: true, txHash: txHash });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    mint,
  };
};

export default RealmCreator;
