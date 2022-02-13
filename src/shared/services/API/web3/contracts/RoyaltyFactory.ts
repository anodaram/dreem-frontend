import Web3 from "web3";
import { zeroAddress } from "ethereumjs-util";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const MAX_PRIO_FEE = "50";

const royaltyFactory = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ROYALTYFACTORY;
  let txHash;
  const metadata = require("shared/connectors/web3/contracts/RoyaltyFactory.json");

  const mint = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { name, symbol, uri, isRoyalty, royaltyAddress, royaltyPercentage } = payload;
        const rAddress = isRoyalty ? royaltyAddress : zeroAddress()
        const bps = isRoyalty ? royaltyPercentage * 100 : 0

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....", contract, contractAddress, account, rAddress, bps);
        const gas = await contract.methods.createRoyaltyERC721(name, symbol, uri, rAddress, bps, '').estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .createRoyaltyERC721(name, symbol, uri, rAddress, bps, '')
          .send({ from: account, gas: gas, maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei') })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
            txHash = hash;
          });
        console.log("transaction succeed", response);

        resolve({ success: true, txHash: txHash, contractAddress: response.events.LoyaltyERC721Created.returnValues.nft, tokenId: response.events.LoyaltyERC721Created.returnValues.initialId });
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

export default royaltyFactory;
