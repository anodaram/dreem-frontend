import URL from "./getURL";
import axios from "axios"
const { mnemonicToSeed } = require('bip39')
const { fromMasterSeed } = require('hdkey')
const { ecsign, toRpcSig, keccak } = require("ethereumjs-util")


export async function signTransaction(mnemonic, transaction): Promise<[string, string]> {
     // Derive Public and Private key from mnemonic //
     const derivationPath = "m/44'/60'/0'/0/0";
     const seed = await mnemonicToSeed(mnemonic);
     const node = fromMasterSeed(seed)
     const hdKey = node.derive(derivationPath);
     // Generate transaction hash //
     let transactionString = JSON.stringify(transaction);
     let transactionHash = keccak(Buffer.from(transactionString));
     // Generate signature //
     const { v, r, s } = ecsign(transactionHash, hdKey._privateKey);
     let signature = toRpcSig(v, r, s);
     return [transactionHash.toString('hex'), signature]
}


export async function signTransaction2(address, mnemonic, transactionObject) {
     const body = {};
     const blockchainRes: any = await axios.post(`${URL()}/user/getLastTxid`, body);
     if (blockchainRes && blockchainRes.success) {
          // construct object to sign
          const transactionObjectToSign = { ...transactionObject };
          transactionObjectToSign.Signature = blockchainRes.output;
          transactionObjectToSign.Address = address;
          transactionObjectToSign.Payload = transactionObject;

          const derivationPath = "m/44'/60'/0'/0/0";
          const seed = await mnemonicToSeed(mnemonic);
          const node = fromMasterSeed(seed)
          const hdKey = node.derive(derivationPath);
          // Generate transaction hash //
          const transactionString = JSON.stringify(transactionObjectToSign);
          const transactionHash = keccak(Buffer.from(transactionString));
          // Generate signature //
          const { v, r, s } = ecsign(transactionHash, hdKey._privateKey);
          const signature = toRpcSig(v, r, s);
          return [transactionHash.toString('hex'), signature]
     }
}