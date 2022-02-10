import axios, { CancelToken } from "axios";

import URL from "shared/functions/getURL";

export async function getAllGameNFTs(payload: any, cancelToken?: CancelToken): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getAllGameNFTs`, {
      params: payload,
      cancelToken: cancelToken,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPopularGames(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getPopularGames`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getTrendingGameNfts(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getTrendingGameNfts`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getGameNFTOwners(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getGameNFTOwners`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function checkNFTHolder(payload: {
  collectionId: string;
  account: string;
  mode: string;
}): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/checkNFTHolder`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getMarketplaceFee(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getFee`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPenaltyFee(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getPenaltyFee`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getNFTOwnerAddress(payload): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getNFTOwnerAddress`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function storePenaltyFee(fee): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/setPenaltyFee`, {
      fee,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getGameNFT(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getGameNFT`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getLockedNFTsByOwner(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getLockedNFTsByOwner`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function acceptBuyingOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/acceptBuyingOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function createSellOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/setSellingOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function cancelSellingOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/cancelSellingOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function createBuyOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/createBuyOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function removeBuyOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/deleteBuyOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getOwnedNFTs(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getOwnedGameNfts`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function createBlockingOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/createBlockingOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function removeBlockingOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/deleteBlockingOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function acceptBlockingOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/acceptBlockingOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function setBlockingOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/setBlockingOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function cancelBlockingOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/cancelBlockingOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function closeBlockingHistory(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/closeBlockingHistory`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function successFinishBlocking(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/successFinishBlocking`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function updateBlockingHistory(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/updateBlockingHistory`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function createRentOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/createRentOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function cancelRentOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/cancelRentOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function createListOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/createListOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function acceptRentOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/acceptRentOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function cancelListOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/cancelListOffer`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function rentNFT(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/rentNFT`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function claimBackRent(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/claimBackRent`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function resetStatus(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/resetStatus`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function updateSyntheticAddress(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/updateSyntheticAddress`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function syncUpNFT(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/metaverseReserve/syncUpNFT`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getNFTFromMoralis(): Promise<any> {
  try {
    axios.post(`${URL()}/metaverseReserve/getNFTFromMoralis`);
    // const response = await getOwnedNFTs(payload)
    // return response;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
