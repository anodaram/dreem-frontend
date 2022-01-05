import URL from "../../functions/getURL";

export const getUserPhoto = (userId: string, url?: string) => {
  if(url) {
    return url;
  } else {
    return `${URL()}/user/getPhoto/${userId}`;
  }
};
