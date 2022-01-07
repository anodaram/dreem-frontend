import axios from "axios";
import URL from "shared/functions/getURL";

export async function visitProfile(address: string, history: any): Promise<any> {
    try {
      let url = `${URL()}/user/getUserByAddress/${address.toLowerCase()}`;
      const response = await axios.get(url);
      const urlSlug = response?.data?.data?.urlSlug;
      if (url) {
        history.push(`/profile/${urlSlug}`);
      }
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }