import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
const exchange = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE;
  const metadata = require("shared/connectors/web3/contracts/ERC721TokenExchange.json");

  const CreateERC721TokenExchange = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const PlaceERC721TokenBuyingOffer = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const PlaceERC721TokenSellingOffer = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const BuyERC721TokenFromOffer = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        console.log(payload);
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const SellERC721TokenFromOffer = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const CancelERC721TokenBuyingOffer = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const CancelERC721TokenSellingOffer = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const getErc721OfferById = async (web3: Web3, account: string, offerId: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const getErc721OfferAll = async (web3: Web3, account: string): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const getErc721OfferCount = async (web3: Web3, account: string): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const getErc721ExchangeById = async (web3: Web3, account: string, exchangeId: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  const getErc721ExchangeAll = async (web3: Web3, account: string): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };
  return {
    CreateERC721TokenExchange,
    PlaceERC721TokenBuyingOffer,
    PlaceERC721TokenSellingOffer,
    BuyERC721TokenFromOffer,
    SellERC721TokenFromOffer,
    CancelERC721TokenBuyingOffer,
    CancelERC721TokenSellingOffer,
    getErc721OfferById,
    getErc721OfferAll,
    getErc721OfferCount,
    getErc721ExchangeById,
    getErc721ExchangeAll,
  };
};
export default exchange;
