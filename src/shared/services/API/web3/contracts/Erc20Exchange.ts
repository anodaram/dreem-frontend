import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import { erc20ToWeiUnit } from "shared/constants/constants";

const exchange = network => {
    const contractAddress = config[network].CONTRACT_ADDRESSES.ERC20_TOKEN_EXCHANGE;
    const metadata = require("shared/connectors/web3/contracts/ERC20TokenExchange.json");

    const CreateERC20TokenExchange = async (web3: Web3, account: string, exchangeName: string, exchangeTokenAddress: string, token: string, fractionAmount: string, pricePerFraction: string): Promise<any> => {
        return new Promise(async resolve => {
            try {
                const offerTokenAddress = config[network].TOKEN_ADDRESSES[token];
                const amount = web3.utils.toWei(fractionAmount.toString(), 'ether');
                const tokenWeiUnit = erc20ToWeiUnit[token] ?? 'ether';
                const price = web3.utils.toWei(pricePerFraction.toString(), tokenWeiUnit);
                const contract = ContractInstance(web3, metadata.abi, contractAddress);
                const gas = await contract.methods
                    .CreateERC20TokenExchange({
                        exchangeName,
                        exchangeTokenAddress,
                        offerTokenAddress,
                        amount,
                        price,
                    }, account)
                    .estimateGas({ from: account });
                const response = await contract.methods
                    .CreateERC20TokenExchange({
                        exchangeName,
                        exchangeTokenAddress,
                        offerTokenAddress,
                        amount,
                        price,
                    }, account)
                    .send({ from: account, gas: gas, type: "0x2" });
                const retData = {
                    exchangeId: response.events.ERC20TokenExchangeCreated.returnValues[0],
                    initialOfferId: response.events.ERC20TokenExchangeCreated.returnValues[1],
                };
                resolve({success: true, data: retData})
            } catch (e) {
                console.log(e);
                resolve({success: false});
            }
        });
    };
    const PlaceERC20TokenBuyingOffer = async (web3: Web3, account: string, exchangeId: string, amount: string, price: string, token: string): Promise<any> => {
        return new Promise(async resolve => {
            try {
                const payload = {
                    exchangeId,
                    amount: web3.utils.toWei(amount, 'ether'),
                    price: web3.utils.toWei(price, erc20ToWeiUnit[token] ?? 'ether')
                }
                const contract = ContractInstance(web3, metadata.abi, contractAddress);
                const gas = await contract.methods
                    .PlaceERC20TokenBuyingOffer(payload, account)
                    .estimateGas({ from: account });
                const response = await contract.methods
                    .PlaceERC20TokenBuyingOffer(payload, account)
                    .send({ from: account, gas: gas, type: "0x2"});
                resolve({success: true, data: response.events.ERC20TokenBuyingOfferPlaced.returnValues[0]});
            } catch (e) {
                console.log(e);
                resolve({success: false});
            }
        });
    };
    const PlaceERC20TokenSellingOffer = async (web3: Web3, account: string, exchangeId: string, amount: string, price: string, token: string): Promise<any> => {
        return new Promise(async resolve => {
            try {
                const payload = {
                    exchangeId,
                    amount: web3.utils.toWei(amount, 'ether'),
                    price: web3.utils.toWei(price, erc20ToWeiUnit[token] ?? 'ether')
                }
                const contract = ContractInstance(web3, metadata.abi, contractAddress);
                const gas = await contract.methods
                    .PlaceERC20TokenSellingOffer(payload, account)
                    .estimateGas({ from: account });
                const response = await contract.methods
                    .PlaceERC20TokenSellingOffer(payload, account)
                    .send({ from: account, gas: gas, type: "0x2"});
                resolve({success: true, data: response.events.ERC20TokenSellingOfferPlaced.returnValues[0]});
            } catch (e) {
                console.log(e);
                resolve({success: false});
            }
        });
    };
    const BuyERC20TokenFromOffer = async (web3: Web3, account: string, exchangeId: string, offerId: string): Promise<any> => {
        return new Promise(async resolve => {
            try {
                const contract = ContractInstance(web3, metadata.abi, contractAddress);
                const gas = await contract.methods
                    .BuyERC20TokenFromOffer({exchangeId, offerId}, account)
                    .estimateGas({ from: account });
                const response = await contract.methods
                    .BuyERC20TokenFromOffer({exchangeId, offerId}, account)
                    .send({ from: account, gas: gas, type: "0x2" });
                resolve({success: true});
            } catch (e) {
                console.log(e);
                resolve({success: false});
            }
        });
    };
    const SellERC20TokenFromOffer = async (web3: Web3, account: string, exchangeId: string, offerId: string): Promise<any> => {
        return new Promise(async resolve => {
            try {
                const contract = ContractInstance(web3, metadata.abi, contractAddress);
                const gas = await contract.methods
                    .SellERC20TokenFromOffer({exchangeId, offerId}, account)
                    .estimateGas({ from: account });
                const response = await contract.methods
                    .SellERC20TokenFromOffer({exchangeId, offerId}, account)
                    .send({ from: account, gas: gas, type: "0x2" });
                resolve({success: true});
            } catch (e) {
                console.log(e);
                resolve({success: false});
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
    return {
        CreateERC20TokenExchange,
        PlaceERC20TokenBuyingOffer,
        PlaceERC20TokenSellingOffer,
        BuyERC20TokenFromOffer,
        SellERC20TokenFromOffer,

        CancelERC721TokenBuyingOffer,
        CancelERC721TokenSellingOffer,
    };
};
export default exchange;
