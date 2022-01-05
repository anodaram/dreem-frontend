import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import api from "../api";
import { toNDecimals } from "shared/functions/web3";

const distributionManager = network => {
  const metadata = require("shared/connectors/web3/contracts/DistributionManager.json");

  const stakeCopyrightFractions = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { amount, contractAddress, token } = payload;

        const copyrightDecimals = await api(network).Erc20["COPYRIGHT"].decimals(web3, token);

        const approve = await api(network).Erc20["COPYRIGHT"].approve(
          web3,
          account,
          token,
          contractAddress,
          toNDecimals(amount, copyrightDecimals)
        );

        if (!approve) {
          resolve({ success: false });
        }

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .stakeCopyrightFractions(toNDecimals(amount, copyrightDecimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .stakeCopyrightFractions(toNDecimals(amount, copyrightDecimals))
          .send({ from: account, gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        console.log(response);
        resolve({
          success: true,
          data: {
            amount,
            tokenId: response.events.CopyrightStaked.returnValues.tokenId,
            staker: response.events.CopyrightStaked.returnValues.staker,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const unstakeCopyrightFractions = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { amount, contractAddress, token, id } = payload;

        const copyrightDecimals = await api(network).Erc20["COPYRIGHT"].decimals(web3, token);

        const approve = await api(network).Erc20["COPYRIGHT"].approve(
          web3,
          account,
          token,
          contractAddress,
          toNDecimals(amount, copyrightDecimals)
        );

        if (!approve) {
          resolve({ success: false });
        }

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .unstakeCopyrightFractions(id, toNDecimals(amount, copyrightDecimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .unstakeCopyrightFractions(id, toNDecimals(amount, copyrightDecimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        console.log(response);
        resolve({
          success: true,
          data: {
            amount,
            tokenId: response.events.CopyrightUnstaked.returnValues.tokenId,
            destination: response.events.CopyrightUnstaked.returnValues.destination,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const stakePodTokens = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { amount, contractAddress, token } = payload;

        const podDecimals = await api(network).Erc20["POD"].decimals(web3, token);

        const approve = await api(network).Erc20["POD"].approve(
          web3,
          account,
          token,
          contractAddress,
          toNDecimals(amount, podDecimals)
        );

        if (!approve) {
          resolve({ success: false });
        }

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .stakePodTokens(toNDecimals(amount, podDecimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .stakePodTokens(toNDecimals(amount, podDecimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        console.log(response);
        resolve({
          success: true,
          data: {
            amount,
            tokenId: response.events.PodStaked.returnValues.tokenId,
            staker: response.events.PodStaked.returnValues.staker,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const unstakePodTokens = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { amount, contractAddress, token, id } = payload;

        const podDecimals = await api(network).Erc20["POD"].decimals(web3, token);

        const approve = await api(network).Erc20["POD"].approve(
          web3,
          account,
          token,
          contractAddress,
          toNDecimals(amount, podDecimals)
        );

        if (!approve) {
          resolve({ success: false });
        }

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .unstakePodTokens(id, toNDecimals(amount, podDecimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .unstakePodTokens(id, toNDecimals(amount, podDecimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        console.log(response);
        resolve({
          success: true,
          data: {
            amount,
            tokenId: response.events.PodUnstaked.returnValues.tokenId,
            destination: response.events.PodUnstaked.returnValues.destination,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const claimCopyrightFractionRewards = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { id, contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.claimCopyrightFractionRewards(id).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .claimCopyrightFractionRewards(id)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        console.log(response);
        resolve({
          success: true,
          data: {
            claimTo: response.events.RewardsClaimed.returnValues.claimTo,
            reward: response.events.RewardsClaimed.returnValues.reward,
            tokenId: response.events.RewardsClaimed.returnValues.tokenId,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const claimPodTokenRewards = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { id, contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.claimPodTokenRewards(id).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .claimPodTokenRewards(id)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        resolve({
          success: true,
          data: {
            claimTo: response.events.RewardsClaimed.returnValues.claimTo,
            reward: response.events.RewardsClaimed.returnValues.reward,
            tokenId: response.events.RewardsClaimed.returnValues.tokenId,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getCopyrightRewards = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { id, contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.getCopyrightRewards(id).call();

        if (response) {
          resolve(response);
        } else {
          response(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getPodRewards = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { id, contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.getPodRewards(id).call();

        if (response) {
          resolve(response);
        } else {
          response(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getCopyrightStakingPositions = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.getCopyrightStakingPositions(account).call();

        if (response) {
          resolve(response);
        } else {
          response(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getPodStakingPositions = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.getPodStakingPositions(account).call();

        if (response) {
          resolve(response);
        } else {
          response(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return {
    stakeCopyrightFractions,
    unstakeCopyrightFractions,
    stakePodTokens,
    unstakePodTokens,
    claimCopyrightFractionRewards,
    claimPodTokenRewards,
    getCopyrightRewards,
    getPodRewards,
    getPodStakingPositions,
    getCopyrightStakingPositions,
  };
};

export default distributionManager;
