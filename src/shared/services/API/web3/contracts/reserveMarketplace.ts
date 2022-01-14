import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const reserveMarketplace = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/reserve/ReserveMarketplace.json");
  const contractAddress = config[network].CONTRACT_ADDRESSES.RESERVE_MARKETPLACE;

  const cancelPurchaseReserveProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log(payload);
        const gas = await contract.methods
          .cancelPurchaseReserveProposal(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.collateralToken,
            payload.price,
            payload.collateralPercent,
            payload.reservePeriod,
            payload.buyer,
          )
          .estimateGas({ from: account });

        const response = await contract.methods
          .cancelPurchaseReserveProposal(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.collateralToken,
            payload.price,
            payload.collateralPercent,
            payload.reservePeriod,
            payload.buyer,
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });

        console.log("transaction succeed... ", response);
        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const cancelSaleReserveProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log(payload);
        const gas = await contract.methods
          .cancelSaleReserveProposal(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.collateralToken,
            payload.price,
            payload.collateralPercent,
            payload.reservePeriod,
            payload.owner,
          )
          .estimateGas({ from: account });

        const response = await contract.methods
          .cancelSaleReserveProposal(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.collateralToken,
            payload.price,
            payload.collateralPercent,
            payload.reservePeriod,
            payload.owner,
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });

        console.log("transaction succeed... ", response);
        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const approveReserveToBuy = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        console.log(payload)
        const gas = await contract.methods
          .approveReserveToBuy(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.collateralToken,
            payload.price,
            payload.beneficiary,
            payload.collateralPercent,
            payload.collateralInitialAmount,
            payload.reservePeriod,
            payload.validityPeriod,
            payload.sellerToMatch
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .approveReserveToBuy(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.collateralToken,
            payload.price,
            payload.beneficiary,
            payload.collateralPercent,
            payload.collateralInitialAmount,
            payload.reservePeriod,
            payload.validityPeriod,
            payload.sellerToMatch
          )
          .send({ from: account, gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response);
        console.log(response?.events?.PurchaseReserved)
        resolve({ success: true, hash: response.transactionHash });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const approveReserveToSell = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        console.log("payload", payload);
        const gas = await contract.methods
          .approveReserveToSell(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.collateralToken,
            payload.price,
            payload.beneficiary,
            payload.collateralPercent,
            payload.reservePeriod,
            payload.validityPeriod,
            payload.buyerToMatch
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .approveReserveToSell(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.collateralToken,
            payload.price,
            payload.beneficiary,
            payload.collateralPercent,
            payload.reservePeriod,
            payload.validityPeriod,
            payload.buyerToMatch
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response.events);
        const offer = response.events.SaleReserveProposed?.returnValues
                    || response.events.SaleReserved?.returnValues;
        if (offer) {
          resolve({ success: true, offer, hash: response.transactionHash });
        } else {
          resolve({ success: false, offer, hash: response.transactionHash });
        }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  return { cancelSaleReserveProposal, cancelPurchaseReserveProposal, approveReserveToBuy, approveReserveToSell };
};

export default reserveMarketplace;
