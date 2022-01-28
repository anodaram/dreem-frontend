import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";

const vault = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/reserve/Vault.json");

  const isTokenInVault = async (web3: Web3, contractAddress, payloads: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods
          .isTokenInVault(payloads.collectionId, payloads.tokenId)
          .call();

        if (response) {
          resolve({ success: true, isInVault: response });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const originalOwner = async (web3: Web3, contractAddress, payloads: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.originalOwner(payloads.collectionId, payloads.tokenId).call();
        if (response) {
          resolve({ success: true, originalOwner: response });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const withdraw = async (web3: Web3, contractAddress, account: string, payloads: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods
          .withdraw(payloads.collectionId, payloads.tokenId)
          .send({ from: account });

        if (response) {
          resolve({ success: true, withdrawn: response });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    isTokenInVault,
    originalOwner,
    withdraw,
  };
};

export default vault;
