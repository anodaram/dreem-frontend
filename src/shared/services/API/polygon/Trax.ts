import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import PolygonConfig from "shared/connectors/polygon/config";
import PolygonAPI from "shared/services/API/polygon";

const usdc_metadata = require("shared/connectors/polygon/contracts/USDC.json");
const usdt_metadata = require("shared/connectors/polygon/contracts/USDT.json");
const dai_metadata = require("shared/connectors/polygon/contracts/DAI.json");
const pix_metadata = require("shared/connectors/polygon/contracts/PIX.json");
const trax_metadata = require("shared/connectors/polygon/contracts/TRAX.json");
const eth_metadata = require("shared/connectors/polygon/contracts/ETH.json");
const privi_metadata = require("shared/connectors/polygon/contracts/PRIVI.json");

const tokenList = {
  USDC: usdc_metadata,
  USDT: usdt_metadata,
  DAI: dai_metadata,
  PIX: pix_metadata,
  TRAX: trax_metadata,
  ETH: eth_metadata,
  PRIVI: privi_metadata,
};

const APPROVE_AMOUNT = 1000000;

export async function approve(web3: Web3, account: string, token: string, address: string) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, tokenList[token].abi, PolygonConfig.TOKEN_ADDRESSES[token]);
      const allowance = await contract.methods.allowance(account, address).call();

      const decimals = await PolygonAPI.Trax.decimals(web3, token);
      const weiAmount = web3.utils
        .toBN(APPROVE_AMOUNT)
        .mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));

      if (web3.utils.toBN(allowance) > web3.utils.toBN(0)) {
        resolve({ success: true });
      } else {
        const gas = await contract.methods.approve(address, weiAmount).estimateGas({ from: account });
        await contract.methods.approve(address, weiAmount).send({ from: account, gas: gas });
        resolve({ success: true });
      }
    } catch (e) {
      console.log(e);
      resolve({ success: false });
    }
  });
}

export async function allowance(web3: Web3, token: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, tokenList[token].abi, PolygonConfig.TOKEN_ADDRESSES[token]);
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

export async function balanceOf(web3: Web3, token: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, tokenList[token].abi, PolygonConfig.TOKEN_ADDRESSES[token]);
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

export async function decimals(web3: Web3, token: string): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, tokenList[token].abi, PolygonConfig.TOKEN_ADDRESSES[token]);
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
