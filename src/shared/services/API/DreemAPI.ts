import axios from "axios";
import URL from "shared/functions/getURL";

export async function getGameInfo(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/dreemRealm/getGameInfo`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getCharactersByGame(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getCharactersByGame`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getNftGameFeed(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/metaverseReserve/getNftGameFeed`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}