import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import polygonConfig from "shared/connectors/polygon/config";
import ethereumConfig from "shared/connectors/ethereum/config";

const polygonMetadata = require("shared/connectors/polygon/contracts/ERC721WithRoyalty.json");

const configMap = {
  1: ethereumConfig,
  3: ethereumConfig,
  4: ethereumConfig,
  137: polygonConfig,
  80001: polygonConfig
}

const metadataMap = {
  1: polygonMetadata,
  3: polygonMetadata,
  4: polygonMetadata,
  137: polygonMetadata,
  80001: polygonMetadata
}

export async function mint(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        polygonMetadata.abi,
        polygonConfig.CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY
      );
      console.log("Getting gas....");
      const gas = await contract.methods.mint(account, [], []).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.mint(account, [], []).send({ from: account, gas: gas });
      console.log("transaction succeed");
      const tokenId = response.events.Transfer.returnValues[2];
      resolve(tokenId);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function setApprovalForAll(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        polygonMetadata.abi,
        polygonConfig.CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY
      );
      const gas = await contract.methods
        .setApprovalForAll(payload.operator, payload.approve)
        .estimateGas({ from: account });
      await contract.methods
        .setApprovalForAll(payload.operator, payload.approve)
        .send({ from: account, gas: gas });
      resolve({ success: true });
    } catch (e) {
      console.log(e);
      resolve({ success: false });
    }
  });
}

export async function setApprovalForAll2(web3: Web3, account: string, chainId: number, contractName: string): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        polygonMetadata.abi,
        configMap[chainId].CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY
      );
      const gas = await contract.methods
        .setApprovalForAll(configMap[chainId].CONTRACT_ADDRESSES[contractName], true)
        .estimateGas({ from: account });
      await contract.methods
        .setApprovalForAll(configMap[chainId].CONTRACT_ADDRESSES[contractName], true)
        .send({ from: account, gas: gas });
      resolve({ success: true });
    } catch (e) {
      console.log(e);
      resolve({ success: false });
    }
  });
}


export async function ownerOf(web3: Web3, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        polygonMetadata.abi,
        polygonConfig.CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY
      );
      contract.methods.ownerOf(payload.tokenId).call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log('operation succeed ', result);
          resolve(result);
        }
      })
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function balanceOf(web3: Web3, account: string): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        polygonMetadata.abi,
        polygonConfig.CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY
      );
      contract.methods.balanceOf(account).call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log('operation succeed ', result);
          resolve(result);
        }
      })
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}