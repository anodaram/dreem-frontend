import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import api from "../api";
import { toDecimals, toNDecimals } from "shared/functions/web3";

export const POD_STATUS = {
  FUNDING_STATE: "FUNDING_STATE",
  FUNDED: "FUDED",
  DISPOSED: "DISPOSED",
};

const podManager = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.POD_MANAGER;
  const copyrightTokenAddress = config[network].CONTRACT_ADDRESSES.COPYRIGHT_TOKEN;

  const metadata = require("shared/connectors/web3/contracts/PodManager.json");

  const registerPodProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const stableDecimals = await api(network).Erc20[payload.FundingToken].decimals(web3);
        const copyrightDecimals = await api(network).Erc20["COPYRIGHT"].decimals(web3, copyrightTokenAddress);

        const pod = {
          owners: payload.Collabs.map(collab => collab.address) || [],
          podAddress: contractAddress,
          fundingDate: payload.FundingDate,
          spread: 10,
          fundingToken: config[network].TOKEN_ADDRESSES[payload.FundingToken],
          fundingTokenPrice: toNDecimals(payload.FundingPrice, stableDecimals),
          fundingTarget: toNDecimals(payload.FundingTarget, stableDecimals),
        };

        const mediaIds = payload.Medias?.map(media => web3.utils.keccak256(media.Title)) || [];
        const royaltyPercentage = payload.Royalty;
        const podDescription = {
          podTokenName: payload.TokenName,
          podTokenSymbol: payload.TokenSymbol,
        };
        const copyrightTokenSupply = toNDecimals(payload.CopyRightSupply, copyrightDecimals);
        const copyrightAllocation = [
          ...payload.CreatorsData.map(data => data.sharingPercent),
          payload.CopyrightInvestorShare || 0,
        ];
        const investorShare = toNDecimals(payload.InvestorShare, 16);

        console.log("Getting gas....");
        const gas = await contract.methods
          .registerPodProposal(
            pod,
            mediaIds,
            royaltyPercentage,
            podDescription,
            copyrightTokenSupply,
            investorShare,
            copyrightAllocation
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .registerPodProposal(
            pod,
            mediaIds,
            royaltyPercentage,
            podDescription,
            copyrightTokenSupply,
            investorShare,
            copyrightAllocation
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        resolve({
          data: {
            id: response.events.PodProposalCreated.returnValues.id,
          },
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const voteForPodProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { id } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.voteForPodProposal(id).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .voteForPodProposal(id)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        resolve({
          success: true,
          data: {
            id: response.events.ProposalVoted.returnValues.id,
            voter: response.events.ProposalVoted.returnValues.voter,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const executePodProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash,
    count = 0
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { id } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.executePodProposal(id).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .executePodProposal(id)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        resolve({
          data: {
            podAddress: response.events.CreatePod.returnValues.podAddress,
          },
        });
      } catch (e) {
        if (count === 2) {
          console.log(e);
          resolve(null);
        } else {
          executePodProposal(web3, account, payload, setHash, count + 1);
        }
      }
    });
  };

  const investPod = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { podAddress, amount } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.investPod(podAddress, amount).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .investPod(podAddress, amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        resolve({
          hash: response.transactionHash,
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const claimPodTokens = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { podAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.claimPodTokens(podAddress).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .claimPodTokens(podAddress)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        if (response) {
          resolve({
            success: true,
            data: {
              hash: response.transactionHash,
            },
          });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const disposePod = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { podAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.disposePod(podAddress).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods.disposePod(podAddress).send({ from: account, gas: gas });
        console.log("transaction succeed");

        if (response) {
          resolve({
            success: true,
            data: {
              hash: response.transactionHash,
            },
          });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
          error: e,
        });
      }
    });
  };

  const getPodInfo = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { podAddress, fundingToken } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const stableDecimals = await api(network).Erc20[fundingToken].decimals(web3);
        const copyrightDecimals = await api(network).Erc20["COPYRIGHT"].decimals(web3, copyrightTokenAddress);
        const response = await contract.methods.getPodInfo(podAddress).call();

        resolve({
          copyrightSupplyInvestors: +toDecimals(response.copyrightSupplyInvestors, copyrightDecimals),
          copyrightToken: response.copyrightToken,
          distributionManagerAddress: response.distributionManagerAddress,
          mediaIds: response.mediaIds,
          nftContract: response.nftContract,
          fundingDate: response.pod.fundingDate,
          fundingTarget: +toDecimals(response.pod.fundingTarget, stableDecimals),
          fundingToken: response.pod.fundingToken,
          fundingTokenPrice: +toDecimals(response.pod.fundingTokenPrice, stableDecimals),
          podAddress: response.pod.podAddress,
          raisedFunds: +toDecimals(response.raisedFunds, stableDecimals),
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const uploadMedia = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { podAddress, mediaId, uri } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .uploadMedia(podAddress, web3.utils.keccak256(mediaId), uri)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .uploadMedia(podAddress, web3.utils.keccak256(mediaId), uri)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");

        console.log(response);
        if (response) {
          resolve({
            success: true,
            data: {
              nftId: response.events.UploadMedia.returnValues.nftId,
              hash: response.transactionHash,
            },
          });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  return {
    registerPodProposal,
    voteForPodProposal,
    executePodProposal,
    investPod,
    claimPodTokens,
    getPodInfo,
    disposePod,
    uploadMedia,
  };
};

export default podManager;
