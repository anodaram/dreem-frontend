import axios from "axios";
import URL from "shared/functions/getURL";

export async function getAllTokenInfos(type: string = "Crypto"): Promise<any> {
  try {
    const config = {
      params: {
        type,
      },
    };
    const response = await axios.get(`${URL()}/token/getAllTokenInfos`, config);
    return response?.data;
  } catch (e) {
    throw new Error(e.message);
  }
}
