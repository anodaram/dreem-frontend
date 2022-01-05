import axios from "axios";
import URL from "shared/functions/getURL";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";
import { IInvestPod, IRegisterMedia, IBuySellPodTokens } from "shared/services/API";
import { IUploadMedia } from "./PodMediaAPI";

// posts
export async function musicDAOInitiatePod(payload: Object): Promise<any> {
  try {
    // const { address, privateKey } = await getPriviWallet();
    // const { signature } = await signPayload("initiatePod", address, payload, privateKey);
    // const requestData: IAPIRequestProps = {
    //   Function: "initiatePod",
    //   Address: userAddress,
    //   Signature: "",
    //   Payload: payload,
    // };
    // const body = {
    //   Data: requestData,
    //   AdditionalData: additionalData,
    // };
    const response = await axios.post(`${URL()}/musicDao/new/pod/initiatePod`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoRegisterPodProposal(payload: any) {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/registerPodProposal`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoVoteForPodProposal(payload: any) {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/voteForPodProposal`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoExecutePod(payload: any) {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/executePod`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoInvestPod(payload: any) {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/invest`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoClaimPodTokens(payload: any) {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/claimPodTokens`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoStakeTokens(payload: any) {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/stakeTokens`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoUnstakeTokens(payload: any) {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/unstakeTokens`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoClaimReward(payload: any) {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/claimReward`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetStaking(id: any) {
  try {
    const response = await axios.get(`${URL()}/musicDao/new/pod/staking`, {
      params: {
        podId: id,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function musicDaoCreateWithdrawProposal(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/createWithdrawProposal`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetWithdrawProposals(podId: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/new/pod/getWithdrawProposals?podId=${podId}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoVoteForWithdrawProposal(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/new/pod/voteForWithdrawProposals`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoFollowPod(userId: string, podId: string): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/followPod`, { userId, podId });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function musicDaoUnfollowPod(userId: string, podId: string): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/unfollowPod`, { userId, podId });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// export async function musicDaoInvestPod(payload: IInvestPod, additionalData: Object): Promise<any> {
//   try {
//     const { address, privateKey } = await getPriviWallet();
//     const { signature } = await signPayload("investPod", address, payload, privateKey);
//     const requestData: IAPIRequestProps = {
//       Function: "investPod",
//       Address: address,
//       Signature: signature,
//       Payload: payload,
//     };
//     const body = {
//       Data: requestData,
//       AdditionalData: additionalData,
//     };
//     const response = await axios.post(`${URL()}/musicDao/pod/investPod`, body);
//     return response.data;
//   } catch (e) {
//     console.log(e);
//     throw new Error(e.message);
//   }
// }

export async function musicDaoUploadMedia(payload: IUploadMedia, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("uploadMedia", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "uploadMedia",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/pod/uploadMedia`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoBuyPodTokens(payload: IBuySellPodTokens, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("buyPodTokens", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "buyPodTokens",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/pod/buyPodTokens`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDAORegisterMedia(payload: IRegisterMedia, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("registerMedia", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "registerMedia",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/pod/registerMedia`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoSellPodTokens(
  payload: IBuySellPodTokens,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("sellPodTokens", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "sellPodTokens",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/pod/sellPodTokens`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// gets
export async function musicDaoGetTrendingPods(isNew: boolean, isHot: boolean, searchValue): Promise<any> {
  try {
    const config = {
      params: {
        isNew,
        isHot,
        searchValue,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getTrendingPods`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodsProposal(userAddress, searchStr, lastId): Promise<any> {
  try {
    const config = {
      params: {
        userAddress,
        searchStr,
        lastId,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getMediaPodProposals`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetRaisedTrendingPods(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/pod/getRaisedTrendingPods`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPods(lastId: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/pod/getPods/${lastId}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodsOfArtist(artistId: string, lastId: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/pod/getPodsOfArtist/${artistId}?lastId=${lastId}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaogGetPodPriceHistory(podAddress: string, numPoints: number): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        numPoints,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getPriceHistory`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodInvestmentTransactions(podAddress: string): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getInvestmentTransactions`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetBuySellTransactions(podAddress: string): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getBuySellTransactions`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodDistributionInfo(podAddress: string): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getDistributionInfo`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPod(podAddress: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/pod/getPod?podAddress=${podAddress}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetBuyingPodFundingTokenAmount(
  podAddress: string,
  amount: number
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        Amount: amount,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getBuyingPodFundingTokenAmount`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSellingPodFundingTokenAmount(
  podAddress: string,
  amount: number
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        Amount: amount,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getSellingPodFundingTokenAmount`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoFruitPod(userId: string, podId: string, fruitId: number): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/fruit`, { userId, podId, fruitId });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

/////////////////////////////// Media Staking-Liquidity //////////////////////
export interface IStakeMediaFunds {
  TokenSymbol: string;
  RewardToken: string;
  Address: string;
  Amount: string;
}

export async function stakeMediaFunds(payload: IStakeMediaFunds, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("stakeMediaFunds", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "stakeMediaFunds",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/staking/stakeMediaFunds`, body);
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error(response.data.error);
      throw new Error(response.data.error);
    }
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IUnstakeOrPayFunds {
  Id: string;
  Address: string;
  Amount: string;
}

export async function unstakeMediaFunds(payload: IUnstakeOrPayFunds, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("unstakeMediaFunds", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "unstakeMediaFunds",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/staking/unstakeMediaFunds`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function payMediaStakingFunds(
  payload: IUnstakeOrPayFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("payMediaStakingFunds", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "payMediaStakingFunds",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/staking/payMediaStakingFunds`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IStakeLiquidityMediaFunds {
  TokenSymbol: string;
  RewardToken: string;
  RangeFrom: number;
  RangeTo: number;
  Address: string;
  Amount: string;
}

export async function stakeLiquidityMediaFunds(
  payload: IStakeLiquidityMediaFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("stakeLiquidityMediaFunds", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "stakeLiquidityMediaFunds",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/staking/stakeLiquidityMediaFunds`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function unstakeLiquidityMediaFunds(
  payload: IUnstakeOrPayFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("unstakeLiquidityMediaFunds", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "unstakeLiquidityMediaFunds",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/staking/unstakeLiquidityMediaFunds`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function payLiquidityMediaFunds(
  payload: IUnstakeOrPayFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("payLiquidityMediaFunds", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "payLiquidityMediaFunds",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/staking/payLiquidityMediaFunds`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IBorrowMediaStakingTokens {
  LiquidityId: string;
  Address: string;
  Days: number;
  Amount: number;
}

export async function borrowMediaStakingTokens(
  payload: IBorrowMediaStakingTokens,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("borrowMediaStakingTokens", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "borrowMediaStakingTokens",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/staking/borrowMediaStakingTokens`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IClaimRewardTokens {
  LiquidityId: string;
  Address: string;
  Days: number;
  Amount: number;
}

export async function claimRewardTokens(payload: IClaimRewardTokens, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("claimRewardTokens", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "claimRewardTokens",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/staking/claimRewardTokens`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export const getMediaStakingsOfAddress = async (address: string) => {
  try {
    const response = await axios.get(`${URL()}/musicDao/staking/getMediaStakingsOfAddress`, {
      params: {
        Address: address,
      },
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error);
  } catch (e) {
    throw new Error(e.message || "getMediaStakingsOfAddress error");
  }
};
