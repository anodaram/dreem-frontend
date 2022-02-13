import Web3 from "web3";
import { zeroAddress } from "ethereumjs-util";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const MAX_PRIO_FEE = "50";

const RealmFactory = network => {
  let txHash;
  const metadata = require("shared/connectors/web3/contracts/Realm.json");

  const applyExtension = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress, amount, nftToAttachAddress, nftToAttachId } = payload;
        // const rAddress = isRoyalty ? royaltyAddress : zeroAddress()
        console.log('params---', contractAddress, nftToAttachAddress, nftToAttachId)
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log('contract-----', contract, contractAddress, metadata.abi)

        console.log("Getting gas....", contract, contractAddress, account, nftToAttachAddress, nftToAttachId, await web3.utils.toWei(amount, 'gwei'));
        const gas = await contract.methods.addExtension(nftToAttachAddress, nftToAttachId).estimateGas({ from: account, value: await web3.utils.toWei(amount, 'gwei')});
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .addExtension(nftToAttachAddress, nftToAttachId)
          .send({ from: account, gas: gas, maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei'), value: await web3.utils.toWei(amount, 'gwei') })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
            txHash = hash;
          });
        console.log("transaction succeed", response);
        const returnValues = response.events.ProposalSubmitted.returnValues
        console.log(returnValues)
        resolve({ success: true, txHash: txHash, proposalId: returnValues.proposalId, nftAddress: returnValues.nftAddress, nftId: returnValues.nftId, owner: returnValues.owner, proposalType: returnValues.proposalType });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    applyExtension,
  };
};

export default RealmFactory;
