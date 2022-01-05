import axios from "axios";
import URL from "shared/functions/getURL";

export async function getClaims(address: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/dreemClaim/getClaims`, {
      params: {
        address
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function claimToken(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/dreemClaim/claimToken`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}