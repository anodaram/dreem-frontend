import TimeLogger from "../utils-IPFS/TimeLogger";

import { uploadMetaDataPrivate, uploadMetaDataPublic } from "../utils-IPFS/post";

import ecies from "ecies-parity";
import { generatePriviWallet } from "./generatePriviWallet";

export const onUploadEncrypt = async (file, address, mnemonic, uploadWithEncryption, peerNumber) => {

  console.log("----------Upload Start----------");

  TimeLogger.start("Upload(Encryption + IPFS)");
  const { added, newFile, keyData } = await uploadWithEncryption(file);
  TimeLogger.end("Upload(Encryption + IPFS)");

  const k = keyData.k;
  TimeLogger.start("ECIES_Encryption");
  const wallet = await generatePriviWallet(mnemonic);
  keyData.k = await getEncryptedKey(wallet.publicKey, k);
  TimeLogger.end("ECIES_Encryption");

  TimeLogger.start("Upload MetaData");
  const keyPair = {};
  keyPair[address] = keyData.k;
  const newMetaDataID = await uploadMetaDataPrivate(added, keyPair, newFile, file, peerNumber);
  TimeLogger.end("Upload MetaData");

  /*TimeLogger.start("add file to HLF");
  const metaHLF = await addFile("createFile", added, newFile, file, keyPair, address, "private");
  TimeLogger.end("add file to HLF");*/

  console.log("----------Upload End----------");
  TimeLogger.log();

  return newMetaDataID;
};

export const onUploadNonEncrypt = async (file, uploadWithNonEncryption) => {
  return new Promise(async (resolve, reject) => {
    console.log("----------Upload Start----------");

    TimeLogger.start("Upload IPFS");
    const { added } = await uploadWithNonEncryption(file);
    TimeLogger.end("Upload IPFS");

    console.log("added 1", added);

    TimeLogger.start("Upload MetaData");
    const newMetaDataID = await uploadMetaDataPublic(added, file);
    TimeLogger.end("Upload MetaData");

    /*TimeLogger.start("add file to HLF");
    const metaHLF = await addFile("createFile", added, {}, file, {}, address, "public");
    TimeLogger.end("add file to HLF");*/

    console.log("----------Upload End----------");
    TimeLogger.log();

    resolve(newMetaDataID);
  });

};

const getEncryptedKey = async (
  pubKey,
  encryptKey,
  isAddNewPubKey = false
) => {
  /*if (useMetaMask) {
    if (isAddNewPubKey) return await encrypt(encryptKey, pubKey);
    return await encrypt(encryptKey);
  }*/
  return (
    await eciesEncrypt(Buffer.from(pubKey, "base64"), encryptKey)
  ).toString("base64");
};

const eciesEncrypt = async (publicKeyA, text) => {
  const encrypted = await ecies.encrypt(publicKeyA, Buffer.from(text));
  return encrypted;
}
