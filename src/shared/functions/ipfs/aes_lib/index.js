import { createRequire } from "module";
// const require = createRequire(import.meta.url);

import Aes from './wbaes-decrypt.js';

import ecies from "ecies-parity";
import bip39 from "bip39";
import hd from "hdkey";
const options = {
  counter: "1826e4111826e4111826e4111826e411",
  encoding: "str",
};

export const wbDecrypt = async (encrypted, privateKey) => {
  try {
    const encryptedBuffer = Buffer.from(encrypted, "base64");
    const privateKeyBuffer = Buffer.from(privateKey, "base64");

    let ttt = await ecies.decrypt(privateKeyBuffer, encryptedBuffer);
    let aes_plain_re = Aes.decrypt(ttt.toString("utf8"), options);
    return {
      decrypted: aes_plain_re,
    };
  } catch (err) {
    console.error(err);
  }
};

export const s2a = Aes.s2a;
