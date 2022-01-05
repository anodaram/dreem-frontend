import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";

const royalty_metadata = require("shared/connectors/polygon/contracts/Royalty.json");

interface Proposal {
  splitFrom: string;
  splitWith: string;
  percentage: string;
}

interface Split {
  splitWith: string;
  percentage: string;
}

export async function instantiate(web3: Web3, account: string) {
  return new Promise(async resolve => {
    try {
      const contract = new web3.eth.Contract(royalty_metadata.abi);
      console.log("calcing gas price....");
      const gas = await contract.deploy({
          data: royalty_metadata.bytecode,
          arguments: []
      }).estimateGas({ from: account });
      console.log("calced gas price: => ", gas);
      contract
        .deploy({
          data: royalty_metadata.bytecode,
          arguments: [],
        })
        .send(
          {
            from: account,
            gas: gas,
          },
          (error, transactionHash) => {}
        )
        .on("error", error => {})
        .on("transactionHash", transactionHash => {
            console.log("Transaction Hash: => ", transactionHash);
        })
        .on("receipt", receipt => {
          console.log("Contract Address: => ", receipt.contractAddress);
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log("Confirmation Number: => ", confirmationNumber);
        })
        .then(newContractInstance => {
          console.log("New Contract Instance: => ", newContractInstance);
          resolve({ success: true });
        });
    } catch (e) {
        console.log(e);
    }
  });
}

/**
 * 
 * @param {Proposal} proposal - royalty split proposal
 * @param {string} proposal.splitFrom - address of original owner of shares
 * @param {string} proposal.splitWith - address of receiver of shares
 * @param {string} proposal.percentage - amount of shares transferred
 * @param {string} contractAddr - instantiated royalty contract address
 * @returns {Object} proposalState - {id, splitFrom, splitWith, percentage}
 */
export async function createProposal(web3: Web3, account: string, proposal: Proposal, contractAddr: string) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, royalty_metadata.abi, contractAddr);

      console.log("Getting gas....");
      const gas = await contract.methods.createProposal(proposal.splitFrom, proposal.splitWith, proposal.percentage).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.createProposal(proposal).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);

      const proposalState = response.events.ProposalCreated.returnValues;
      resolve(proposalState);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

/**
 * 
 * @param {string} proposalId - proposal id to be voted
 * @param {string} contractAddr - instantiated royalty contract address
 * @returns {Object} proposalState - {id, executed}
 */
export async function voteForProposal(web3: Web3, account: string, proposalId: string, contractAddr: string) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, royalty_metadata.abi, contractAddr);

      console.log("Getting gas....");
      const gas = await contract.methods.voteForProposal(proposalId).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.voteForProposal(proposalId).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);

      const proposalState = response.events.ProposalVoted.returnValues;
      resolve(proposalState);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

/**
 * 
 * @param {string} contractAddr - instantiated royalty contract address 
 * @returns {Object} withdrawInfo - {withdrawer, amount}
 */
export async function withdrawRoyalties(web3: Web3, account: string, contractAddr: string) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, royalty_metadata.abi, contractAddr);

      console.log("Getting gas....");
      const gas = await contract.methods.withdrawRoyalties().estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.withdrawRoyalties().send({ from: account, gas: gas });
      console.log("transaction succeed ", response);

      const withdrawInfo = response.events.RoyaltyWithdrawn.returnValues;
      resolve(withdrawInfo);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

/**
 * 
 * @param {Split} split - royalty split info
 * @param {string} split.splitWith - address of receiver of shares
 * @param {string} split.percentage - amount of shares transferred
 * @param {string} contractAddr - instantiated royalty contract address
 * @param {Object} splitInfo - {splitFrom, splitWith, percentage} 
 * @returns 
 */
export async function splitRoyalty(web3: Web3, account: string, split: Split, contractAddr: string) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, royalty_metadata.abi, contractAddr);

      console.log("Getting gas....");
      const gas = await contract.methods.splitRoyalty(split.splitWith, split.percentage).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.splitRoyalty(split.splitWith, split.percentage).send({ from: account, gas: gas });
      console.log("transaction succeed ", response);

      const splitInfo = response.events.RoyaltySplit.returnValues;
      resolve(splitInfo);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}