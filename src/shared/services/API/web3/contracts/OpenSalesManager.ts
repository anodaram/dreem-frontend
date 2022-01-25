import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const MAX_PRIO_FEE = "32";

const openSalesManager = network => {
  const metadata = require("shared/connectors/web3/contracts/OpenSalesManager.json");
  const contractAddress = config[network].CONTRACT_ADDRESSES.OPEN_SALES_MANAGER;

  const approvePurchase = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .approvePurchase(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.sellerToMatch
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .approvePurchase(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.sellerToMatch
          )
          .send({ from: account, gas: gas, maxPriorityFeePerGas: web3.utils.toWei(MAX_PRIO_FEE, 'gwei') })
          .on("transactionHash", hash => {
            setHash(hash);
          });

        console.log("transaction succeed", response?.events);
        if ( payload.mode === 1 && response?.events?.PurchaseCompleted ||
            payload.mode === 0 && response?.events?.PurchaseProposed )
          {
            resolve({ success: true, hash: response.transactionHash });
          } else {
            resolve({ success: false })
          }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const approveSale = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .approveSale(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.buyerToMatch
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .approveSale(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.buyerToMatch
          )
          .send({ from: account, gas: gas, maxPriorityFeePerGas: web3.utils.toWei(MAX_PRIO_FEE, 'gwei') })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response?.events);
        if (payload.mode === 0 && response?.events?.SaleProposed ||
            payload.mode === 1 && response?.events?.SaleCompleted )
          {
            resolve({ success: true, hash: response.transactionHash });
          } else {
            resolve({ success: false })
          }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const cancelSaleProposal = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .cancelSaleProposal(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.price,
            payload.owner
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .cancelSaleProposal(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.price,
            payload.owner
          )
          .send({ from: account, gas: gas, maxPriorityFeePerGas: web3.utils.toWei(MAX_PRIO_FEE, 'gwei') })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response?.events);

        if (response?.events?.SaleCanceled) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const cancelPurchaseProposal = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .cancelPurchaseProposal(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.price,
            payload.beneficiary
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .cancelPurchaseProposal(
            payload.collection_id,
            payload.token_id,
            payload.paymentToken,
            payload.price,
            payload.beneficiary
          )
          .send({ from: account, gas: gas, maxPriorityFeePerGas: web3.utils.toWei(MAX_PRIO_FEE, 'gwei') })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response?.events);

        if (response?.events?.PurchaseCanceled) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  return { approvePurchase, approveSale, cancelSaleProposal, cancelPurchaseProposal };
};

export default openSalesManager;
