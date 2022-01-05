import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";

const socialErc20 = network => {
  const metadata = require("shared/connectors/web3/contracts/SocialERC20.json");

  const allocateTokens = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void,
    handleCloseModal: () => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { addresses, amounts, periods, immediate, contractAddress } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .allocateTokens(addresses, amounts, immediate, periods)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);

        const response = await contract.methods
          .allocateTokens(addresses, amounts, immediate, periods)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            handleCloseModal();
            setTxHash(hash);
            setTxModalOpen(true);
          });
        console.log("transaction succeed", response);

        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const airdropTokens = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void,
    handleCloseModal: () => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { addresses, amounts, contractAddress } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.airdropTokens(addresses, amounts).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .airdropTokens(addresses, amounts)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            handleCloseModal();
            setTxHash(hash);
            setTxModalOpen(true);
          });
        console.log("transaction succeed", response);

        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getTokenStats = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const availableReserves = await contract.methods.availableReserves().call();
        const totalSupply = await contract.methods.totalSupply().call();

        resolve({ success: true, data: { availableReserves, totalSupply } });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    allocateTokens,
    airdropTokens,
    getTokenStats,
  };
};

export default socialErc20;
