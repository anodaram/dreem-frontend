import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const reservesManager = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/reserve/ReservesManager.json");
  const protocolParam = require("shared/connectors/web3/contracts/reserve/ReserveProtocolParameters.json");
  const contractAddress = config[network].CONTRACT_ADDRESSES.RESERVES_MANAGER;
  const protocolAddress = config[network].CONTRACT_ADDRESSES.RESERVES_PROTOCOL_PARAMETERS;

  const sellerCancelFeePercent = async (
    web3: Web3,
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, protocolParam.abi, protocolAddress);

        const response = await contract.methods
          .sellerCancelFeePercent().call()

        console.log("transaction succeed... ", response);
        resolve({ success: true, response: response });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };
  const cancelReserve = async (
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
          .cancelReserve(
            payload.activeReserveId
          )
          .estimateGas({ from: account });

        const response = await contract.methods
          .cancelReserve(
            payload.activeReserveId
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });

        console.log("transaction succeed... ", response?.events);
        if (response?.events?.ReserveCanceled) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const liquidateReserve = async (
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
          .liquidateReserve(
            payload.activeReserveId,
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .liquidateReserve(
            payload.activeReserveId,
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response?.events);
        if (
          payload.mode === 0 && response?.events?.PurchaseExecuted ||
          payload.mode === 1 && response?.events?.PurchaseCanceled
        ) {
          resolve({ success: true, hash: response.transactionHash });
        } else {
          resolve({
            success: false,
          });
        }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const liquidateUndercollateralization = async (
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
          .liquidateUndercollateralization(
            payload.activeReserveId,
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .liquidateUndercollateralization(
            payload.activeReserveId,
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response?.events);
        if (response?.events?.CollateralClaimed) {
          resolve({ success: true, hash: response.transactionHash });
        } else {
          resolve({
            success: false,
          });
        }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };
  
  const decreaseReserveCollateral = async (
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
          .decreaseReserveCollateral(
            payload.activeReserveId,
            payload.amount,
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .decreaseReserveCollateral(
            payload.activeReserveId,
            payload.amount,
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response?.events);
        if (response?.events?.CollateralDecreased) {
          resolve({ success: true, hash: response.transactionHash });
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

  const increaseReserveCollateral = async (
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
          .increaseReserveCollateral(
            payload.activeReserveId,
            payload.amount,
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .increaseReserveCollateral(
            payload.activeReserveId,
            payload.amount,
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response?.events);
        if (response?.events?.CollateralIncreased) {
          resolve({ success: true, hash: response.transactionHash });
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

  const payThePrice = async (
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
          .payThePrice(
            payload.activeReserveId,
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .payThePrice(
            payload.activeReserveId,
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed", response?.events);
        if (response?.events?.ReservePricePaid) {
          resolve({ success: true, hash: response.transactionHash });
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

  return {
    sellerCancelFeePercent,
    cancelReserve,
    increaseReserveCollateral,
    liquidateReserve,
    payThePrice,
    decreaseReserveCollateral,
    liquidateUndercollateralization
  };
};

export default reservesManager;
