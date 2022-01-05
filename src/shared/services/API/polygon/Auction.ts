import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";

const auction_metadata = require("shared/connectors/polygon/contracts/IncreasingPriceERC721Auction.json");

export async function createAuction(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, auction_metadata.abi, config.CONTRACT_ADDRESSES.ERC721_AUCTION);

      console.log("Getting gas....");
      const gas = await contract.methods.createAuction(payload).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.createAuction(payload).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.AuctionCreated.returnValues,
        transaction: {
          From: response.from,
          To: response.to,
          Id: response.transactionHash,
          Date: new Date().getTime(),
        },
      };
      resolve(result);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function placeBid(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, auction_metadata.abi, config.CONTRACT_ADDRESSES.ERC721_AUCTION);
      console.log("Getting gas....");
      const gas = await contract.methods.placeBid(payload).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.placeBid(payload).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.Bid.returnValues,
        transaction: {
          From: response.from,
          To: response.to,
          Id: response.transactionHash,
          Date: new Date().getTime(),
        },
      };
      resolve(result);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function withdrawAuction(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, auction_metadata.abi, config.CONTRACT_ADDRESSES.ERC721_AUCTION);
      console.log("Getting gas....");
      const gas = await contract.methods.withdrawAuction(payload).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.withdrawAuction(payload).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.AuctionAccepted.returnValues,
        transaction: {
          From: response.from,
          To: response.to,
          Id: response.transactionHash,
          Date: new Date().getTime(),
        },
      };
      resolve(result);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function resetAuction(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, auction_metadata.abi, config.CONTRACT_ADDRESSES.ERC721_AUCTION);

      console.log("Getting gas....");
      const gas = await contract.methods.resetAuction(payload).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.resetAuction(payload).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.AuctionRestarted.returnValues,
        transaction: {
          From: response.from,
          To: response.to,
          Id: response.transactionHash,
          Date: new Date().getTime(),
        },
      };
      resolve(result);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function cancelAuction(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, auction_metadata.abi, config.CONTRACT_ADDRESSES.ERC721_AUCTION);

      console.log("Getting gas....");
      const gas = await contract.methods.cancelAuction(payload).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.cancelAuction(payload).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.AuctionCanceled.returnValues,
        transaction: {
          From: response.from,
          To: response.to,
          Id: response.transactionHash,
          Date: new Date().getTime(),
        },
      };
      resolve(result);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}
