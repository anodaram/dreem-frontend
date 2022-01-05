import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";

const trax_metadata = require("shared/connectors/polygon/contracts/TRAX.json");
export async function approve(web3: Web3, account: string, address: string) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, trax_metadata.abi, config.TOKEN_ADDRESSES.TRAX);
      console.log("Getting gas....");
      const gas = await contract.methods.approve(address, web3.utils.toBN(10).pow(web3.utils.toBN(30))).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.approve(address, web3.utils.toBN(10).pow(web3.utils.toBN(30))).send({ from: account, gas: gas });
      console.log("transaction succeed");
      resolve(true);
    } catch (e) {
      console.log(e);
      resolve(false);
    }
  });
}

export async function allowance(web3: Web3, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, trax_metadata.abi, config.TOKEN_ADDRESSES.TRAX);
      contract.methods.allowance(payload.owner, payload.spender).call((err, result) => {
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

export async function balanceOf(web3: Web3, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, trax_metadata.abi, config.TOKEN_ADDRESSES.TRAX);
      contract.methods.balanceOf(payload.account).call((err, result) => {
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

export async function decimals(web3: Web3): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, trax_metadata.abi, config.TOKEN_ADDRESSES.TRAX);
      contract.methods.decimals().call((err, result) => {
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