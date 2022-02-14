import Web3 from "web3";
import { zeroAddress } from "ethereumjs-util";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const MAX_PRIO_FEE = "50";

const nftWithRoyalty = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY;
  let txHash;
  const metadata = require("shared/connectors/web3/contracts/ERC721WithRoyalty.json");

  const mint = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { collectionAddress, to, uri, isRoyalty, royaltyAddress, royaltyPercentage  } = payload;
        const rAddress = isRoyalty ? royaltyAddress : zeroAddress()
        const bps = isRoyalty ? royaltyPercentage * 100 : 0

        const contract = ContractInstance(web3, metadata.abi, collectionAddress);

        console.log("Getting gas....", contract, collectionAddress, to, account, uri, rAddress, bps);
        const gas = await contract.methods.mintWithRoyalty(to, uri, rAddress, bps, '').estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .mintWithRoyalty(to, uri, rAddress, bps, '')
          .send({ from: account, gas: gas, maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')})
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
            txHash = hash;
          });
        console.log("transaction succeed", response);
        const returnValues = response.events.RoyaltyNFT.returnValues;
        resolve({ success: true, txHash: txHash, collectionAddress, tokenId: returnValues.initialId, owner: returnValues.owner, royaltyAddress: returnValues.royaltyAddress });
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

export default nftWithRoyalty;
