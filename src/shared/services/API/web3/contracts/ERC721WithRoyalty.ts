import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
const erc721 = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ERC721WithRoyalty;
  const metadata = require("shared/connectors/web3/contracts/ERC721WithRoyalty.json");

  const instantiate = async (web3: Web3, account: string): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = new web3.eth.Contract(metadata.abi);
        console.log("calcing gas price....");
        const gas = await contract
          .deploy({
            data: metadata.bytecode,
            arguments: ["privierc721", "privi"],
          })
          .estimateGas({ from: account });
        console.log("calced gas price: => ", gas);
        contract
          .deploy({
            data: metadata.bytecode,
            arguments: ["privierc721", "privi"],
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
        resolve(null);
      }
    });
  };
  const mint = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .mint(payload.to, payload.tokenId, payload.uri)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .mint(payload.to, payload.tokenId, payload.uri)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            if (setHash) {
              setHash(hash);
            }
          });
        console.log("transaction succeed", response);
        resolve(response.transactionHash);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  const setApprovalForToken = async (
    web3: Web3,
    account: string,
    payload: any,
    tokenContractAddress: string = ""
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, tokenContractAddress || contractAddress);
        const gas = await contract.methods
          .approve(payload.to, payload.tokenId)
          .estimateGas({ from: account });
        await contract.methods.approve(payload.to, payload.tokenId).send({ 
          from: account, 
          gas: gas,
          maxFeePerGas: gas*1.5,
         });
        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };
  const setApprovalForAll = async (
    web3: Web3,
    account: string,
    payload: any,
    tokenContractAddress: string = ""
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, tokenContractAddress || contractAddress);
        const gas = await contract.methods
          .setApprovalForAll(payload.operator, payload.approve)
          .estimateGas({ from: account });
        await contract.methods
          .setApprovalForAll(payload.operator, payload.approve)
          .send({ from: account, gas: gas });
        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };
  const setApprovalForAll2 = (
    web3: Web3,
    account: string,
    interactingContractAddress: string,
    sourceContractAddress = undefined
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, sourceContractAddress ?? contractAddress);
        const gas = await contract.methods
          .setApprovalForAll(config[network].CONTRACT_ADDRESSES[interactingContractAddress], true)
          .estimateGas({ from: account });
        await contract.methods
          .setApprovalForAll(config[network].CONTRACT_ADDRESSES[interactingContractAddress], true)
          .send({ type: "0x2", from: account, gas: gas });
        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };
  const ownerOf = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        contract.methods.ownerOf(payload.tokenId).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("operation succeed ", result);
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  const balanceOf = async (web3: Web3, account: string): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        contract.methods.balanceOf(account).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("operation succeed ", result);
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const approve = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, payload.nftAddress);
        console.log("Getting gas....");
        const gas = await contract.methods.approve(payload.to, payload.tokenId).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        await contract.methods.approve(payload.to, payload.tokenId).send({ from: account, gas: gas });
        console.log("transaction succeed");
        resolve(true);
      } catch (e) {
        console.log(e);
        resolve(false);
      }
    });
  };

  return {
    instantiate,
    mint,
    setApprovalForToken,
    setApprovalForAll,
    setApprovalForAll2,
    ownerOf,
    balanceOf,
    approve
  };
};
export default erc721;
