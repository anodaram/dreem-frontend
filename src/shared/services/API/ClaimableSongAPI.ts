import axios from "axios";
import URL from "shared/functions/getURL";
import { getWalletInfo } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";
import { PRIVI_ADDRESS } from "shared/constants/constants";

export interface ICreateClaimableSongPod {
  CreatorAddress: string;
  Artists: { [key: string]: boolean };
  MediaName: string;
  MediaSymbol: string;
  Duration: number;
}

export async function createClaimableMedia(
  payload: ICreateClaimableSongPod,
  additionalData: Object,
  mnemonic: string = ""
): Promise<any> {
  try {
    const func = "createClaimableMedia";
    const { privateKey } = await getWalletInfo(mnemonic);
    const { signature } = await signPayload(func, PRIVI_ADDRESS, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: func,
      Address: PRIVI_ADDRESS,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/claimableSongs/createClaimableMedia`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    //throw new Error(e.message);
  }
}
