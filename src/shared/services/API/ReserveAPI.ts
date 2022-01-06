import axios from "axios";
import URL from "shared/functions/getURL";

export async function getAllNFTs(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/reserve/getAllNFTs`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getNFT(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/reserve/getNFT`, {
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
    const response = await axios.get(`${URL()}/reserve/getLockedNFTsByOwner`, {
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
    const response = await axios.post(`${URL()}/reserve/acceptBuyingOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/setSellingOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/cancelSellingOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/createBuyOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/deleteBuyOffer`, {
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
    const response = await axios.get(`${URL()}/reserve/getOwnedNFTs`, {
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
    const response = await axios.post(`${URL()}/reserve/createBlockingOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/deleteBlockingOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/acceptBlockingOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/setBlockingOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/cancelBlockingOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/closeBlockingHistory`, {
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
    const response = await axios.post(`${URL()}/reserve/successFinishBlocking`, {
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
    const response = await axios.post(`${URL()}/reserve/updateBlockingHistory`, {
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
    const response = await axios.post(`${URL()}/reserve/createRentOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/cancelRentOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/createListOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/acceptRentOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/cancelListOffer`, {
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
    const response = await axios.post(`${URL()}/reserve/rentNFT`, {
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
    const response = await axios.post(`${URL()}/reserve/resetStatus`, {
      ...payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}