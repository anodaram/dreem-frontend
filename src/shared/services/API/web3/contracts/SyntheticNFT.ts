import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";


const syntheticNFTManager = () => {
  const metadata = require("shared/connectors/web3/contracts/reserve/SyntheticNFT.json");

  const ownerOf = async (web3: Web3, { contractAddress, tokenId }: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const response = await contract.methods.ownerOf(tokenId).call();

        resolve({ success: true, rentalInfos: response });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    ownerOf
  };
};

export default syntheticNFTManager;
