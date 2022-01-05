import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import TokenVaultABI from "shared/connectors/web3/contracts/TokenVault.json";
import { erc20ToWeiUnit } from "shared/constants/constants";

const tokenVault = (network: string) => {
  const updateReservePrice = async (
    web3: Web3,
    account: string,
    payload: any,
    contractAddress: string
  ): Promise<any> => {
    try {
      const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
      const listTokenWeiUnit = erc20ToWeiUnit[payload.token] ?? "ether";
      const gas = await contract.methods
        .updateUserPrice(web3.utils.toWei(payload.price.toString(), listTokenWeiUnit))
        .estimateGas({ from: account });
      const response = await contract.methods
        .updateUserPrice(web3.utils.toWei(payload.price.toString(), listTokenWeiUnit))
        .send({ from: account, gas: gas, type: "0x2" });
      if (response) return { success: true };
      else return { success: false };
    } catch (e) {
      let error;
      if (e.toString().includes("not an update")) error = "Not updating the price, same value as last price";
      return { success: false, error };
    }
  };
  const getReservePrice = async (web3: Web3, reserveToken: string, contractAddress: string): Promise<any> => {
    try {
      const listTokenWeiUnit = erc20ToWeiUnit[reserveToken] ?? "ether";
      const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
      const resp = await contract.methods.reservePrice().call();
      return { success: true, data: web3.utils.fromWei(resp, listTokenWeiUnit) };
    } catch (e) {
      console.log(e);
      return { success: false };
    }
  };

  const startAuction = async (
    web3: Web3,
    account: string,
    payload: any,
    contractAddress: string,
    listToken: string
  ): Promise<any> => {
    try {
      const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
      const listTokenWeiUnit = erc20ToWeiUnit[payload.token] ?? "ether";
      const listTokenABI = require(`shared/connectors/web3/contracts/${listToken}.json`);
      const listTokenContract = ContractInstance(
        web3,
        listTokenABI.abi,
        "0x5251AF6c7eB0a13ab6502eD2e3Fd2704F9dEFF1C"
      );
      const approveGas = await listTokenContract.methods
        .approve(contractAddress, web3.utils.toWei(payload.price.toString(), listTokenWeiUnit))
        .estimateGas({ from: account });
      const res = await listTokenContract.methods
        .approve(contractAddress, web3.utils.toWei(payload.price.toString(), listTokenWeiUnit))
        .send({ from: account, gas: approveGas, type: "0x2" });
      const gas = await contract.methods
        .start(web3.utils.toWei(payload.price.toString(), listTokenWeiUnit))
        .estimateGas({ from: account });
      const response = await contract.methods
        .start(web3.utils.toWei(payload.price.toString(), listTokenWeiUnit))
        .send({ from: account, gas, type: "0x2" });

      return {
        success: true,
        data: response?.events?.Start?.returnValues,
      };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  };

  const endAuction = async (web3: Web3, account: string, contractAddress: string): Promise<any> => {
    try {
      const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
      const gas = await contract.methods.end().estimateGas({ from: account });
      const response = await contract.methods.end().send({ from: account, gas });
      return {
        success: true,
        data: {},
      };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  };

  const placeBid = async (
    web3: Web3,
    account: string,
    payload: any,
    contractAddress: string
  ): Promise<any> => {
    try {
      const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
      const gas = await contract.methods.bid(payload.amount).estimateGas({ from: account });
      const response = await contract.methods.bid(payload.amount).send({ from: account, gas, type: "0x2" });
      return {
        success: true,
        data: {
          hash: response.transactionHash,
        },
      };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  };

  const cash = async (web3: Web3, account: string, contractAddress: string): Promise<any> => {
    try {
      const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
      const gas = await contract.methods.cash().estimateGas({ from: account });
      const response = await contract.methods.cash().send({ from: account, gas });
      console.log(response);
      return {
        success: true,
        data: {},
      };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  };

  const redeem = async (web3: Web3, account: string, contractAddress: string): Promise<any> => {
    try {
      const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
      const gas = await contract.methods.redeem().estimateGas({ from: account });
      const response = await contract.methods.redeem().send({ from: account, gas });
      return {
        success: true,
        data: {},
      };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  };

  const claimFees = async (web3: Web3, account: string, contractAddress: string): Promise<any> => {
    try {
      const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
      const gas = await contract.methods.claimFees().estimateGas({ from: account });
      const response = await contract.methods.claimFees().send({ from: account, gas });
      return {
        success: true,
        data: {},
      };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  };

  const auctionLength = async (web3: Web3, account: string, contractAddress: string): Promise<any> => {
    return new Promise(resolve => {
      try {
        const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
        contract.methods.auctionLength().call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const balanceOf = async (web3: Web3, account: string, contractAddress: string): Promise<any> => {
    return new Promise(resolve => {
      try {
        const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
        contract.methods.balanceOf(account).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const decimals = async (web3: Web3, account: string, contractAddress: string): Promise<any> => {
    return new Promise(resolve => {
      try {
        const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
        contract.methods.decimals().call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const auctionState = async (web3: Web3, account: string, contractAddress: string): Promise<any> => {
    return new Promise(resolve => {
      try {
        const contract = ContractInstance(web3, TokenVaultABI.abi, contractAddress);
        contract.methods.auctionState().call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
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
    updateReservePrice,
    getReservePrice,
    startAuction,
    placeBid,
    redeem,
    cash,
    auctionLength,
    balanceOf,
    decimals,
    auctionState,
    endAuction,
    claimFees,
  };
};

export default tokenVault;
