import axios from "axios";
import URL from "shared/functions/getURL";

// PIX PROFILE ITEMS
export async function getPixProfileItems(
    userId: string,
    isVisitor: boolean,
    tab: string,
): Promise<any> {
    try {
    const config = {
        params: {
            userId,
            isVisitor,
            tab,
        },
    };
    const response = await axios.get(`${URL()}/user/getPixProfileItems`, config);
    return response?.data;
    } 
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}

// get
export async function getProfileTabsInfo(
    userId: string,
    isVisitor: boolean,
    mainTab: string,
    subTab: string,
    lastId: string,
    isLastNFT: boolean,
    pagination: number,
    lastLikedMedia: string,
    mediaTypes: any = undefined
): Promise<any> {
    try {
    const config = {
        params: {
            userId,
            isVisitor,
            mainTab: "Media",
            subTab,
            lastId,
            isLastNFT,
            pagination,
            lastLikedMedia,
            mediaTypes
        },
    };
    const response = await axios.get(`${URL()}/user/getProfileTapsInfo`, config);
    return response?.data;
    } catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}

export interface IAutocompleteUsers {
    name: string,
    urlSlug: string,
    address: string,
    imageUrl: string,
    anonAvatar: string
}

export async function getMatchingUsers(
    searchValue: string,
    properties: string[]
): Promise<any> {
    try {
        let url = `${URL()}/user/getMatchingUsers`;
        url += `?value=${searchValue}`;
        properties.forEach(prop => url += `&properties=${prop}`)
    const response = await axios.get(url);
    return response?.data;
    } catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}

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