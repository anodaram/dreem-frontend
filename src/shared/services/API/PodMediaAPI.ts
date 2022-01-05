import axios from "axios";
import URL from "shared/functions/getURL";
import { IAPIRequestProps } from "shared/types/Media";

export interface IInitiatePodPodInfo {
  Creator: string;
  TokenName?: string;
  TokenSymbol?: string;
  IsInvesting?: boolean;
  AMM?: string;
  Spread?: number;
  FundingTokenPrice?: number;
  FundingToken?: string;
  FundingDate?: number;
  FundingTarget?: number;
  InvestorDividend?: number;
  MaxSupply?: number;
  MaxPrice?: number;
  DateExpiration?: number;
  Collabs: string[];
}

export interface IInitiatePodMedias {
  MediaName: string;
  MediaSymbol: string;
  Type: string;
  ReleaseDate: number;
  Genre?: string;
}

export interface IInitiatePod {
  PodInfo: IInitiatePodPodInfo;
  Medias?: IInitiatePodMedias[];
}

export async function initiatePod(
  userAddress: string,
  payload: IInitiatePod,
  additionalData: Object
): Promise<any> {
  try {
    const requestData: IAPIRequestProps = {
      Function: "initiatePod",
      Address: userAddress,
      Signature: "",
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/mediaPod/initiatePod_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IRegisterMedia {
  Requester: string;
  PodAddress: string;
  MediaSymbol: string;
  Type: string;
  PaymentType: string;
  Copies: number;
  Royalty: number;
  FundingToken: string;
  ReleaseDate: number;
  PricePerSecond: number;
  Price: number;
  IsRecord: true;
  RecordToken: string;
  RecordPaymentType: string;
  RecordPrice: number;
  RecordPricePerSecond: number;
  RecordCopies: number;
  RecordRoyalty: number;
}

export async function registerMedia(
  address: string,
  payload: IRegisterMedia,
  additionalData: Object
): Promise<any> {
  try {
    const requestData: IAPIRequestProps = {
      Function: "registerMedia",
      Address: address,
      Signature: "",
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/mediaPod/registerMedia_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IUploadMedia {
  PodAddress: string;
  MediaSymbol: string;
}

export async function uploadMedia(
  address: string,
  payload: IUploadMedia,
  additionalData: Object
): Promise<any> {
  try {
    const requestData: IAPIRequestProps = {
      Function: "uploadMedia",
      Address: address,
      Signature: "",
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/mediaPod/uploadMedia_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IInvestPod {
  Investor: string;
  PodAddress: string;
  Amount: number;
}

export async function investPod(address: string, payload: IInvestPod, additionalData: Object): Promise<any> {
  try {
    const requestData: IAPIRequestProps = {
      Function: "investPod",
      Address: address,
      Signature: "",
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/mediaPod/investPod_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IBuySellPodTokens {
  Trader: string;
  PodAddress: string;
  Amount: number;
}

export async function buyPodTokens(
  address: string,
  payload: IBuySellPodTokens,
  additionalData: Object
): Promise<any> {
  try {
    const requestData: IAPIRequestProps = {
      Function: "buyPodTokens",
      Address: address,
      Signature: "",
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/mediaPod/buyPodTokens_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function sellPodTokens(
  address: string,
  payload: IBuySellPodTokens,
  additionalData: Object
): Promise<any> {
  try {
    const requestData: IAPIRequestProps = {
      Function: "sellPodTokens",
      Address: address,
      Signature: "",
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/mediaPod/sellPodTokens_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

/////////////////////// GET //////////////////////

export async function getMediaPod(podAddress: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/mediaPod/getMediaPod/${podAddress}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getBuyingPodFundingTokenAmount(podAddress: string, amount: number): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        Amount: amount,
      },
    };
    const response = await axios.get(`${URL()}/mediaPod/getBuyingPodFundingTokenAmount`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getSellingPodFundingTokenAmount(podAddress: string, amount: number): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        Amount: amount,
      },
    };
    const response = await axios.get(`${URL()}/mediaPod/getSellingPodFundingTokenAmount`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPodInvestmentTransactions(podAddress: string): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
      },
    };
    const response = await axios.get(`${URL()}/mediaPod/getInvestmentTransactions`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPodBuySellTransactions(podAddress: string): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
      },
    };
    const response = await axios.get(`${URL()}/mediaPod/getBuySellTransactions`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPodDistributionInfo(podAddress: string): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
      },
    };
    const response = await axios.get(`${URL()}/mediaPod/getDistributionInfo`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPodPriceHistory(podAddress: string, numPoints: number): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        numPoints,
      },
    };
    const response = await axios.get(`${URL()}/mediaPod/getPriceHistory`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
