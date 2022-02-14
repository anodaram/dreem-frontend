import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import { erc20ToWeiUnit } from "shared/constants/constants";
import { BigNumber } from "ethers";
import { toNDecimals } from "shared/functions/web3";

const MAX_PRIO_FEE = "50";

const erc20_standard = (network, token) => {
  const contractAddress = config[network].TOKEN_ADDRESSES[token];
  const metadata = require(`shared/connectors/web3/contracts/${token}.json`);

  const approve = async (web3: Web3, account: string, address: string, amount?: BigNumber): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const approveAmount = amount || toNDecimals(1, 30);

        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods.approve(address, approveAmount).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        await web3.eth.getChainId()==137 
            ? await contract.methods.approve(address, approveAmount).send({ 
              from: account, 
              gas: gas,
              maxPriorityFeePerGas: await web3.eth.getChainId()==137 ? await web3.utils.toWei(MAX_PRIO_FEE, 'gwei') : "",
            })
            : await contract.methods.approve(address, approveAmount).send({ 
                from: account, 
                gas: gas
              });
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

  const Approval = async (
    web3: Web3,
    account: string,
    owner: string,
    interactingContractName: string,
    amount: string,
    token: string = ""
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const unit = erc20ToWeiUnit[token] ?? "ether";
        const weiAmount = await web3.utils.toWei(amount.toString(), unit);
        const interactingContractAddress = config[network].CONTRACT_ADDRESSES[interactingContractName];
        const contract = ContractInstance(web3, metadata.abi, owner);
        const gas = await contract.methods
          .approve(interactingContractAddress, weiAmount)
          .estimateGas({ from: account });
        const response = await contract.methods
          .approve(interactingContractAddress, weiAmount)
          .send({ type: "0x2", from: account, gas: gas });
        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
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

  return { approve, allowance, Approval, balanceOf, decimals };
};

export default erc20_standard;
