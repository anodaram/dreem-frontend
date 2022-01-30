import Web3 from "web3";
import axios from "axios";
import { METAVERSE_URL } from "shared/functions/getURL";

export async function signWithMetamask(address: string, web3: Web3, domain: string): Promise<any> {
  const res = await axios.post(`${METAVERSE_URL()}/auth/requestSignInUsingRandomNonce/`, {
    address,
  });
  const nonce = res.data.nonce;
  const msgParams = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
      ],
      Mail: [
        { name: "Address", type: "address" },
        { name: "Nonce", type: "string" },
      ],
    },
    primaryType: "Mail",
    domain: {
      name: domain,
      version: "1.0.0-beta",
    },
    message: {
      "Address": address,
      "Nonce": nonce,
    },
  });
  let params = [address, msgParams];
  let method = "eth_signTypedData_v3";
  const provider = web3.currentProvider;

  return new Promise<any>((resolve, reject) => {
    (provider as any).sendAsync(
      {
        method,
        params,
        from: address,
      },
      function (err, result) {
        console.log('err', err)
        if (err) reject("error occurred");
        if (result.error) reject("error occurred");
        resolve(result.result);
      }
    );
  });
}