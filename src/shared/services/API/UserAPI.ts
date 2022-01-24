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

export async function userTrackDownload(): Promise<any> {
  try {
    const userId: string = localStorage.getItem("userId") || "";
    if (userId) {
      let url = `${URL()}/user/userTrackDownload/${userId}`;
      await axios.get(url);
    }
  } catch (e) {
    console.log(e);
  }
}

export async function userTrackMarketPlace(): Promise<any> {
  try {
    const userId: string = localStorage.getItem("userId") || "";
    if (userId) {
      let url = `${URL()}/user/userTrackMarketPlace/${userId}`;
      await axios.get(url);
    }
  } catch (e) {
    console.log(e);
  }
}