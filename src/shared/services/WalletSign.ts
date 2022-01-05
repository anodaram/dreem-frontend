import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import * as Crypto from "shared/helpers/aes-gcm";
import { getLastTxid } from "shared/services/API/WalletAPI";
import { getPriviWallet } from "shared/helpers/wallet";
import axios from "axios";
import { IAPIRequestProps } from "shared/services/API/interfaces";
import { METAVERSE_URL } from "shared/functions/getURL";
const ethUtils = require("ethereumjs-util");
const sigUtils = require("eth-sig-util");
const { ecsign, toRpcSig, keccak } = require("ethereumjs-util");

export async function signWithMetamask(address: string, web3: Web3, domain: string): Promise<any> {
  const res = await axios.post(`${METAVERSE_URL()}/requestSignInUsingRandomNonce/`, {
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

export async function signWithPrivi(address: string, privateKey?: any): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    let tx = {
      Address: address,
      mesage: "hello",
    };
    let _prvKey;
    if (privateKey) _prvKey = privateKey;
    else {
      _prvKey = await Crypto.loadPriviKey();
    }

    let hash = keccak(Buffer.from(JSON.stringify(tx)));
    const { v, r, s } = ecsign(hash, _prvKey);
    let signature = toRpcSig(v, r, s);
    resolve({ address, hash, signature });
  });
}

/**
 *
 * @param requestData
 * @returns signature
 */
export async function signPayloadWithMetamask(request: IAPIRequestProps, web3?: Web3): Promise<any> {
  try {
    const provider = await detectEthereumProvider();
    const txId = await getLastTxid(request.Address);
    const signRequestData = { ...request, Signature: txId, Payload: JSON.stringify(request.Payload) };
    const msgParams = JSON.stringify({
      domain: {
        chainId: 3,
        name: "Privi",
        version: "1",
      },
      message: signRequestData,
      primaryType: "Request",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
        ],
        Request: [
          { name: "Function", type: "string" },
          { name: "Address", type: "string" },
          { name: "Signature", type: "string" },
          { name: "Payload", type: "string" },
        ],
      },
    });

    const from = request.Address;
    const params = [from, msgParams];
    const method = "eth_signTypedData_v4";

    return new Promise<any>((resolve, reject) => {
      (provider as any).sendAsync(
        {
          method,
          params,
          from,
        },
        function (err, result) {
          if (err) return console.dir(err);
          if (result.error) {
            alert(result.error.message);
          }
          if (result.error) return reject(result.error);

          const recovered = sigUtils.recoverTypedSignature_v4({
            data: JSON.parse(msgParams),
            sig: result.result,
          });

          if (ethUtils.toChecksumAddress(recovered) === ethUtils.toChecksumAddress(from)) {
            alert("Successfully recovered signer as " + from);
            resolve(result.result);
          } else {
            reject("Failed to verify signer when comparing " + result + " to " + from);
          }
        }
      );
    });
  } catch (e) {
    console.log(e.message);
    throw new Error(e.message);
  }
}

interface ISignPayloadProps {
  Function: string;
  Address: string;
  Payload: Object;
  prvKey?: string;
}

/**
 *
 * @param func
 * @param address
 * @param payload
 * @returns signature and hash
 */
export async function signPayload(
  func: string,
  address: string,
  payload: Object,
  prvKey?: any
): Promise<{ signature: string; hash: string }> {
  try {
    const { privateKey: localPrvKey } = await getPriviWallet();
    const privateKey = prvKey ?? localPrvKey;
    const txid = await getLastTxid(address || "");
    const tx = {
      Function: func,
      Address: address,
      Signature: txid,
      Payload: JSON.stringify(payload),
    };
    let rawtx = JSON.stringify(tx);
    let hash = keccak(Buffer.from(rawtx));
    const { v, r, s } = ecsign(hash, privateKey);
    const signature = toRpcSig(v, r, s);
    return {
      hash: hash.toString("hex"),
      signature,
    };
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// TESTING PURPOSE
// DO NOT USE THIS FUNCTION
export async function _signPayload(
  { Function, Address, Payload }: ISignPayloadProps,
  privateKey?: string
): Promise<{ signature: string; hash: string }> {
  try {
    // const lastTxData = await getLastTxid(address || "");
    const lastTxData = (await axios.get("http://159.65.123.98:4000/api/Coinb/getTxid", {
      params: {
        Address,
      },
    })) as any;

    if (!lastTxData.data.success || !lastTxData.data.output) throw new Error("Can't get last transaction id");
    const txid = lastTxData.data.output;
    console.log("txid =>", txid);
    const tx = {
      Function,
      Address,
      Signature: txid,
      Payload: JSON.stringify(Payload),
    };
    let rawtx = JSON.stringify(tx);
    let hash = keccak(Buffer.from(rawtx));
    const { v, r, s } = ecsign(hash, privateKey);
    const signature = toRpcSig(v, r, s);
    return {
      hash: hash.toString("hex"),
      signature,
    };
  } catch (e) {
    console.log(e.message);
    throw new Error(e.message);
  }
}
