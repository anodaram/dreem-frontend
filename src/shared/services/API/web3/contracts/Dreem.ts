import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const dreem = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.DREEM;
  const metadata = require("shared/connectors/web3/contracts/Dreem.json");

  const createAuction = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.createAuction(payload).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods.createAuction(payload).send({ from: account, gas: gas });
        console.log("transaction succeed ", response);
        const result = {
          data: response.events.AuctionCreated.returnValues,
          transaction: {
            From: response.from,
            To: response.to,
            Id: response.transactionHash,
            Date: new Date().getTime(),
          },
        };
        resolve(result);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return { createAuction };
};

export default dreem;
