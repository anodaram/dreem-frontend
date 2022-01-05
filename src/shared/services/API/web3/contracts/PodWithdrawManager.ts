import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import api from "../api";
import { toNDecimals } from "shared/functions/web3";

const podWithdrawManager = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.POD_WITHDRAW_MANAGER;
  const metadata = require("shared/connectors/web3/contracts/PodWithdrawManager.json");

  const returnPodTokens = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { podAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.returnPodTokens(podAddress).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .returnPodTokens(podAddress)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");

        resolve({
          success: true,
          data: {
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
          error: e,
        });
      }
    });
  };

  const createWithdrawProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { podAddress, recipient, amount, fundingToken } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const stableDecimals = await api(network).Erc20[fundingToken].decimals(web3);

        console.log("Getting gas....");
        const gas = await contract.methods
          .createWithdrawProposal(recipient, podAddress, toNDecimals(amount, stableDecimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .createWithdrawProposal(recipient, podAddress, toNDecimals(amount, stableDecimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");

        resolve({
          success: true,
          data: {
            proposalId: response.events.CreateWithdrawProposal.returnValues.proposalId,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
          error: e,
        });
      }
    });
  };

  const voteWithdrawProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { proposalId, vote } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .voteWithdrawProposal(proposalId, vote)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .voteWithdrawProposal(proposalId, vote)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");

        console.log(response);
        resolve({
          success: true,
          data: {
            accepted: response.events.ApproveWithdrawProposal ? true : false,
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
          error: e,
        });
      }
    });
  };

  return { returnPodTokens, createWithdrawProposal, voteWithdrawProposal };
};

export default podWithdrawManager;
