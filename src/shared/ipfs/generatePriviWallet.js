import {mnemonicToSeed} from "bip39";
import {fromMasterSeed} from "hdkey";
import ecies from "ecies-parity";
import {privateToAddress} from "ethereumjs-util";

export const generatePriviWallet = async (phrases) => {
  return new Promise(async (resolve, reject) => {
    const derivationPath = "m/44'/60'/0'/0/0";
    const seed = await mnemonicToSeed(phrases);
    const node = fromMasterSeed(seed);
    const hdKey = node.derive(derivationPath);
    const privateKey = hdKey._privateKey;
    const publicKey = ecies.getPublic(privateKey);
    const address = "0x" + privateToAddress(hdKey._privateKey).toString("hex");
    resolve({
      address,
      privateKey,
      publicKey
    });
  })
};
