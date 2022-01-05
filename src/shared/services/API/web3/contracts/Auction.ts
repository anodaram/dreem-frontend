import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
const auction = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ERC721_AUCTION;
  const metadata = require("shared/connectors/web3/contracts/IncreasingPriceERC721Auction.json");

  const createAuction = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

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
  };
  const placeBid = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const withdrawAuction = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const resetAuction = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

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
  };
  const cancelAuction = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

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
  };
  return { createAuction, placeBid, withdrawAuction, resetAuction, cancelAuction };
};
export default auction;
