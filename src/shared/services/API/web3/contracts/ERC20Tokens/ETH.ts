import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";
import { BigNumber } from "ethers";
import { toNDecimals } from "shared/functions/web3";

const eth = network => {
  const contractAddress = config[network].TOKEN_ADDRESSES.ETH;
  const metadata = require("shared/connectors/polygon/contracts/ETH.json");

  const approve = async (web3: Web3, account: string, address: string, amount?: BigNumber): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const approveAmount = amount || toNDecimals(1, 30);

        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods.approve(address, approveAmount).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        await contract.methods.approve(address, approveAmount).send({ from: account, gas: gas });
        console.log("transaction succeed");
        resolve(true);
      } catch (e) {
        console.log(e);
        resolve(false);
      }
    });
  };

  const allowance = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };

  const balanceOf = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };

  const decimals = async (web3: Web3): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
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
  };

  return { approve, allowance, balanceOf, decimals };
};

export default eth;
