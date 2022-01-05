import axios from "axios";
import URL from "shared/functions/getURL";

export const successFunc = res => res.data;
export const failFunc = (e: Error) => {
  console.log(e.message);
  throw new Error(e.message);
};

export const convertPusd = async (data): Promise<any> => {
  return await axios.post(`${URL()}/trade/convertPusd`, data).then(successFunc).catch(failFunc);
};

export const convertPrivi = async (data): Promise<any> => {
  return await axios.post(`${URL()}/trade/convertPrivi`, data).then(successFunc).catch(failFunc);
}