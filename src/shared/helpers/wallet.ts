import { mnemonicToSeed } from "bip39";
import { fromMasterSeed } from "hdkey";
import { privateToAddress } from "ethereumjs-util";
import * as Crypto from "shared/helpers/aes-gcm";

/**
 * Generate Privi Wallet privateKey + address from mnemonic phrases
 * @param phrases
 * @returns
 */
export const generatePriviWallet = async (phrases: string[]) => {
  const derivationPath = "m/44'/60'/0'/0/0";
  const seed = await mnemonicToSeed(phrases.join(" "));
  const node = fromMasterSeed(seed);
  const hdKey = node.derive(derivationPath);
  const address = "0x" + privateToAddress(hdKey._privateKey).toString("hex");
  return { address, privateKey: hdKey._privateKey };
};

/**
 * get Privi Wallet privateKey + address from local storage
 * @param phrases
 * @returns
 */
export const getPriviWallet = async () => {
  try {
    const privateKey = await Crypto.loadPriviKey();
    const address = "0x" + privateToAddress(Buffer.from(privateKey)).toString("hex");
    return { address, privateKey, error: undefined };
  } catch (e) {
    return { address: "", privateKey: "", error: e.message || "Privi wallet key error" };
  }
};

/**
 * get wallet info (address, privateKey) from mnemonics
 * @param mnemonics string | array<string>
 * @returns
 */
export async function getWalletInfo(mnemonics: string | Array<string>) {
  const mnemonicList = Array.isArray(mnemonics)
    ? mnemonics
    : mnemonics.split(/(\s+)/).filter(e => e.trim().length > 0);
  const { address, privateKey } = await generatePriviWallet(mnemonicList);

  if (!address || !privateKey) {
    throw new Error("Invalid Wallet Address");
  }
  return { address, privateKey };
}

/**
 * save encrypted privi wallet info to local storage
 * @param phrases
 */
export async function savePriviWallet(phrases: string[]) {
  const { privateKey } = await generatePriviWallet(phrases);
  await Crypto.savePriviKey(privateKey);
}

/**
 * Get wallet address from privateKey
 * @param privateKey Uint8Array
 * @return address string
 */
export function convertPrivateKeyToAddress(privateKey: Uint8Array) {
  const address = "0x" + privateToAddress(Buffer.from(privateKey)).toString("hex");
  return address;
}

/**
 * Remove Privi wallet key from local storage
 */
export function lockPriviWallet() {
  localStorage.setItem("PRIVI_WALLET_KEY", "");
}
