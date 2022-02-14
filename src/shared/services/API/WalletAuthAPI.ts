import axios from "axios";
import Web3 from "web3";
import { signWithMetamask } from "../WalletSign";
import URL, { METAVERSE_URL } from "shared/functions/getURL";

export async function signInWithMetamaskWallet(
  address: string,
  web3: Web3,
  domain: string,
  handleException?: () => void
): Promise<any> {
  const signature = await signWithMetamask(address, web3, domain);
  if (handleException) {
    handleException();
  }
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${METAVERSE_URL()}/auth/signInWithMetamaskWallet/`, { address, signature, domain })
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        if (err.response?.status === 400 && err.response.data) {
          resolve({ ...err.response.data, signature });
        } else {
          console.log("Error in signWithMetamask : ", err.message);
          reject("Error");
        }
      });
  });
}

export async function signUpWithAddressAndName(
  address: string,
  userName: string,
  signature: string,
  domain: string
): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${URL()}/user/signUpWithMetamaskWallet`, { address, userName, signature, domain })
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        // console.log("Error in SignIn.tsx -> fetchUser() : ", err);
        reject("Error");
      });
  });
}
