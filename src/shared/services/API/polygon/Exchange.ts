import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";

const erc20_exchange_metadata = require("shared/connectors/polygon/contracts/ERC20TokenExchange.json");
const erc721_exchange_metadata = require("shared/connectors/polygon/contracts/ERC721TokenExchange.json");
const erc1155_exchange_metadata = require("shared/connectors/polygon/contracts/ERC1155TokenExchange.json");

export async function CreateERC721TokenExchange(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      const gas = await contract.methods
        .CreateERC721TokenExchange(payload.input, payload.caller)
        .estimateGas({ from: account });
      const response = await contract.methods
        .CreateERC721TokenExchange(payload.input, payload.caller)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: {
          exchangeId: response.events.ERC721TokenExchangeCreated.returnValues[0],
          initialOfferId: response.events.ERC721TokenExchangeCreated.returnValues[1],
        },
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

export async function PlaceERC721TokenBuyingOffer(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      const gas = await contract.methods
        .PlaceERC721TokenBuyingOffer(payload.input, payload.caller)
        .estimateGas({ from: account });
      const response = await contract.methods
        .PlaceERC721TokenBuyingOffer(payload.input, payload.caller)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: {
          offerId: response.events.ERC721TokenBuyingOfferPlaced.returnValues[0],
        },
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

export async function PlaceERC721TokenSellingOffer(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      const gas = await contract.methods
        .PlaceERC721TokenSellingOffer(payload.input, payload.caller)
        .estimateGas({ from: account });
      const response = await contract.methods
        .PlaceERC721TokenSellingOffer(payload.input, payload.caller)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: {
          offerId: response.events.ERC721TokenSellingOfferPlaced.returnValues[0],
        },
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

export async function BuyERC721TokenFromOffer(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      const gas = await contract.methods
        .BuyERC721TokenFromOffer(payload.input, payload.caller)
        .estimateGas({ from: account });
      const response = await contract.methods
        .BuyERC721TokenFromOffer(payload.input, payload.caller)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: {
          offerId: response.events.ERC721TokenFromOfferBought.returnValues[0],
        },
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

export async function SellERC721TokenFromOffer(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      const gas = await contract.methods
        .SellERC721TokenFromOffer(payload.input, payload.caller)
        .estimateGas({ from: account });
      const response = await contract.methods
        .SellERC721TokenFromOffer(payload.input, payload.caller)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: {
          offerId: response.events.ERC721TokenFromOfferSold.returnValues[0],
        },
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

export async function CancelERC721TokenBuyingOffer(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      const gas = await contract.methods
        .CancelERC721TokenBuyingOffer(payload.input, payload.caller)
        .estimateGas({ from: account });
      const response = await contract.methods
        .CancelERC721TokenBuyingOffer(payload.input, payload.caller)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: {
          offerId: response.events.ERC721TokenBuyingOfferCanceled.returnValues[0],
        },
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

export async function CancelERC721TokenSellingOffer(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      const gas = await contract.methods
        .CancelERC721TokenSellingOffer(payload.input, payload.caller)
        .estimateGas({ from: account });
      const response = await contract.methods
        .CancelERC721TokenSellingOffer(payload.input, payload.caller)
        .send({ from: account, gas: gas });
      console.log("transaction succeed ", response);
      const result = {
        data: {
          offerId: response.events.ERC721TokenSellingOfferCanceled.returnValues[0],
        },
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

export async function getErc721OfferById(web3: Web3, account: string, offerId: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      contract.methods.getErc721OfferById(offerId).call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log("transaction succeed ", result);
          resolve(result);
        }
      });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function getErc721OfferAll(web3: Web3, account: string): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      contract.methods.getErc721OfferAll().call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log("transaction succeed ", result);
          resolve(result);
        }
      });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function getErc721OfferCount(web3: Web3, account: string): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      contract.methods.getErc721OfferCount().call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log("transaction succeed ", result);
          resolve(result);
        }
      });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function getErc721ExchangeById(web3: Web3, account: string, exchangeId: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      contract.methods.getErc721ExchangeById(exchangeId).call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log("transaction succeed ", result);
          resolve(result);
        }
      });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function getErc721ExchangeAll(web3: Web3, account: string): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc721_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE
      );
      contract.methods.getErc721ExchangeAll().call((err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log("transaction succeed ", result);
          resolve(result);
        }
      });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function CreateERC20TokenExchange(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc20_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC20_TOKEN_EXCHANGE
      );
      const gas = await contract.methods.CreateERC20TokenExchange(payload).estimateGas({ from: account });
      await contract.methods.CreateERC20TokenExchange(payload).send({ from: account, gas: gas });
    } catch (e) {
      console.log(e);
      resolve({ success: false });
    }
  });
}

export async function CreateERC1155TokenExchange(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc1155_exchange_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC1155_TOKEN_EXCHANGE
      );
      const gas = await contract.methods.CreateERC1155TokenExchange(payload).estimateGas({ from: account });
      await contract.methods.CreateERC1155TokenExchange(payload).send({ from: account, gas: gas });
    } catch (e) {
      console.log(e);
      resolve({ success: false });
    }
  });
}
