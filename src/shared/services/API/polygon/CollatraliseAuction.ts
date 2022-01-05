import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";

const auction_metadata = require("shared/connectors/polygon/contracts/ERC721Auction.json");

export async function instantiate(web3: Web3, account: string): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = new web3.eth.Contract(auction_metadata.abi);
      console.log("calcing gas price....");
      const gas = await contract
        .deploy({
          data: auction_metadata.bytecode,
          arguments: [config.CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY],
        })
        .estimateGas({ from: account });
      console.log("calced gas price: => ", gas);
      contract
        .deploy({
          data: auction_metadata.bytecode,
          arguments: [config.CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY],
        })
        .send(
          {
            from: account,
            gas: gas,
          },
          (error, transactionHash) => {}
        )
        .on("error", error => {})
        .on("transactionHash", transactionHash => {
          console.log("Transaction Hash: => ", transactionHash);
        })
        .on("receipt", receipt => {
          console.log("Contract Address: => ", receipt.contractAddress);
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log("Confirmation Number: => ", confirmationNumber);
        })
        .then(newContractInstance => {
          console.log("New Contract Instance: => ", newContractInstance);
          resolve({ success: true });
        });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  })
}

export async function createAuction(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        auction_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION
      );

      console.log("Getting gas....");
      const gas = await contract.methods
        .createAuction(
          payload.tokenId,
          payload.startPrice,
          payload.startTimestamp,
          payload.endTimestamp,
          payload.fee,
          payload.fundTokenAddress
        )
        .estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods
        .createAuction(
          payload.tokenId,
          payload.startPrice,
          payload.startTimestamp,
          payload.endTimestamp,
          payload.fee,
          payload.fundTokenAddress
        )
        .send({ from: account, gas: gas });
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
      const contract = ContractInstance(
        web3,
        auction_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION
      );
      console.log("Getting gas....");
      const gas = await contract.methods
        .placeBid(payload.tokenId, payload.bidAmount)
        .estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods
        .placeBid(payload.tokenId, payload.bidAmount)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.BidPlaced.returnValues,
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

export async function withdrawFunds(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        auction_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION
      );
      console.log("Getting gas....");
      const gas = await contract.methods
        .withdrawFunds(payload.tokenId, payload.withdrawAmount)
        .estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods
        .withdrawFunds(payload.tokenId, payload.withdrawAmount)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.FundWithdrawn.returnValues,
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

export async function returnFunds(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        auction_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION
      );

      console.log("Getting gas....");
      const gas = await contract.methods
        .returnFunds(payload.tokenId, payload.returnAmount)
        .estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods
        .returnFunds(payload.tokenId, payload.returnAmount)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.FundReturned.returnValues,
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

export async function endAuction(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        auction_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION
      );

      console.log("Getting gas....");
      const gas = await contract.methods.endAuction(payload.tokenId).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.endAuction(payload.tokenId).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: response.events.AuctionEnded.returnValues,
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

export async function getAuction(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        auction_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION
      );
      contract.methods.getAuction(payload.tokenId).call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log('transaction succeed ', result);
          resolve(result);
        }
      })
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function getBidList(web3: Web3, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        auction_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION
      );
      contract.methods.getBidList(payload.tokenId).call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log('transaction succeed ', result);
          resolve(result);
        }
      })
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function getAvailableFunds(web3: Web3, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        auction_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION
      );
      contract.methods.getAvailableFunds(payload.tokenId).call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log('transaction succeed ', result);
          resolve(result);
        }
      })
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}