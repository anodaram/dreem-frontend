import axios from "axios";
import URL from "shared/functions/getURL";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";

// post

// ---- social token api ----
export interface ICreateSocialToken {
  AMM: string;
  TradingSpread: number;
  FundingToken: string;
  TokenSymbol: string;
  TokenName: string;
  InitialSupply: number;
  TargetSupply: number;
  TargetPrice: number;
  TokenChain: string;
}

export async function createSocialToken(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/social/createSocialToken/v2`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function allocateSocialToken(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/social/allocateSocialToken/v2`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function airdropSocialToken(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/social/airdropSocialToken/v2`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IBuySellSocialToken {
  Investor: string;
  PoolAddress: string;
  Amount: number;
}

export async function sellSocialToken(payload: IBuySellSocialToken, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("sellSocialToken", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "sellSocialToken",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/social/sellSocialToken/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function buySocialToken(payload: IBuySellSocialToken, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("buySocialToken", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "buySocialToken",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/social/buySocialToken/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function airdropToken(payload: IBuySellSocialToken, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("airdropToken", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "airdropToken",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/social/airdropToken/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IWithdrawSocialToken {
  PoolAddress: string;
  Amount: number;
}

export async function withdrawSocialToken(
  payload: IWithdrawSocialToken,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("withdrawSocialToken", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "withdrawSocialToken",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/social/withdrawSocialToken/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function withdrawFundingToken(
  payload: IWithdrawSocialToken,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("withdrawFundingToken", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "withdrawFundingToken",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/social/withdrawFundingToken/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// get
export async function getOwnSocialToken(userId: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/social/getOwnSocialToken/${userId}`);
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getSocialTokenTransactionHistory(poolAddress: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/social/getTransactionHistory/${poolAddress}`);
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getSocialTokenPriceHistory(poolAddress: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/social/getPriceHistory/${poolAddress}`);
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getBuyTokenAmount(poolAddress: string, amount: string): Promise<any> {
  try {
    const config = {
      params: {
        poolAddress,
        amount,
      },
    };
    const response = await axios.get(`${URL()}/social/getBuyTokenAmount`, config);
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getSellTokenAmount(poolAddress: string, amount: string): Promise<any> {
  try {
    const config = {
      params: {
        poolAddress,
        amount,
      },
    };
    const response = await axios.get(`${URL()}/social/getSellTokenAmount`, config);
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
