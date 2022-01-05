import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";

const erc20_metadata = require("shared/connectors/polygon/contracts/ERC20TestToken.json");

export async function instantiate(web3: Web3, account: string) {
  return new Promise(async resolve => {
    try {
      const contract = new web3.eth.Contract(erc20_metadata.abi);
      console.log("calcing gas price....");
      const gas = await contract
        .deploy({
          data: erc20_metadata.bytecode,
          arguments: [],
        })
        .estimateGas({ from: account });
      console.log("calced gas price: => ", gas);
      contract
        .deploy({
          data: erc20_metadata.bytecode,
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

export async function approve(web3: Web3, account: string, address: string) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        erc20_metadata.abi,
        config.CONTRACT_ADDRESSES.ERC20_TEST_TOKEN
      );
      console.log("Getting gas....");
      const gas = await contract.methods.approve(address, 10000).estimateGas({ from: account });
      console.log("calced gas price is.... ", gas);
      const response = await contract.methods.approve(address, 10000).send({ from: account, gas: gas });
      console.log("transaction succeed");
      resolve({ success: true })
    } catch (e) {
      console.log(e);
      resolve({ success: false });
    }
  });
}
