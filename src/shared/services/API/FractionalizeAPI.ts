import axios from "axios";
import URL from "shared/functions/getURL";

/////////////////////////// GET //////////////////////////

export async function getNftDataByTokenIds(tokenIds: string[]): Promise<any> {
  try {
    const config = {
      params: {
        tokenIds,
      },
    };
    const response = await axios.get(`${URL()}/fractionalize/getNftDataByTokenIds`, config);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getFractionalizeVaults(lastId): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/fractionalize/getFractionalizeVaults`, { params: { lastId } });
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getFractionalizeVault(mediaSymbol: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/fractionalize/getFractionalizeVault/${mediaSymbol}`);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getExchangeOffers(vaultId: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/fractionalize/getExchangeOffers/${vaultId}`);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getBidHistory(mediaSymbol: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/fractionalize/getBidHistory/${mediaSymbol}`);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

/////////////////////////// POST /////////////////////////

export async function saveExternallyFetchedNfts(nfts: any[]): Promise<any> {
  try {
    const body = { nfts };
    const response = await axios.post(`${URL()}/fractionalize/saveExternallyFetchedNfts`, body);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function mint(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/mint`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function updateReservePrice(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/updateReservePrice`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function createExchange(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/createExchange`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function placeSellingOffer(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/placeSellingOffer`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function placeBuyingOffer(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/placeBuyingOffer`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function buyFromOffer(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/buyFromOffer`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function sellFromOffer(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/sellFromOffer`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function cancelBuyingOffer(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/cancelBuyingOffer`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function cancelSellingOffer(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/cancelSellingOffer`, data);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function startAuction(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/startAuction`, data);
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function placeBid(data: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/fractionalize/placeBid`, data);
    return response.data;
  } catch (e) {
    throw e;
  }
}
