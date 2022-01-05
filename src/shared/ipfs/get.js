import TimeLogger from "../utils-IPFS/TimeLogger";

/*import { downloadMetaData } from "../utils-IPFS/post";
import { readFile } from "../utils-IPFS/HLFAPIs";*/

import ecies from "ecies-parity";
import { generatePriviWallet } from "./generatePriviWallet";
import axios from "axios";
import {getBlob} from "../utils-IPFS/crypto";
import {saveAs} from "file-saver";

const BackendURL = "http://localhost:3002";

export const onGetDecrypt = async (metaDataID, address, mnemonic, downloadWithDecryption) => {
  if (!metaDataID) return;
  try {
    let resp = await downloadMetadataFunction(metaDataID);

    const metaData = resp.data.metaData;
    const encryptedKey = metaData.properties.key[address];
    if (encryptedKey === undefined) {
      alert("This user doesn't have permission to the data.");
      return;
    }
    return;
    /// TODO
    // let fileCID = await readFileWithCIDFunction(metaData);

    // TimeLogger.start("ECIES Decrypt");
    // const wallet = await generatePriviWallet(mnemonic);
    // const k = await getDecryptedKey(encryptedKey, wallet);
    // TimeLogger.end("ECIES Decrypt");

    // const keyData = {
    //   alg: "A256GCM",
    //   ext: true,
    //   k,
    //   key_ops: ["encrypt", "decrypt"],
    //   kty: "oct",
    // };

    // const peerNumber = metaData.properties.peer;

    // TimeLogger.start("Get files (IPFS+Decrypt)");
    // let files = await downloadWithDecryption(fileCID, true, keyData, false, peerNumber);
    // TimeLogger.end("Get files (IPFS+Decrypt)");
    // TimeLogger.log();
    // return(files);
  } catch (err) {
    console.error("onDownload-MetaData", err);
  }
};

export const onGetNonDecrypt = async (metaDataID, fileName, downloadWithNonDecryption) => {
  if (!metaDataID) return;
  try {
    /*let resp = await downloadMetadataFunction(metaDataID);

    const metaData = resp.data.metaData;

    let fileCID = await readFileWithCIDFunction(metaData);*/

    TimeLogger.start("Get Files IPFS");
    // const files = await getFiles(fileCID);
    const files = await downloadWithNonDecryption(metaDataID, fileName, false);

    TimeLogger.end("Get Files IPFS");
    TimeLogger.log();

    return(files);
  } catch (err) {
    console.error("onDownload-MetaData", err);
  }
};

export const downloadMetadataFunction = async (metaDataID) => {
  return new Promise(async (resolve, reject) => {
    TimeLogger.start("MetaDatafromIPFS");
    const resp = await downloadMetaData(metaDataID);
    TimeLogger.end("MetaDatafromIPFS");
    resolve(resp);
  });
}

/*
export const readFileWithCIDFunction = async (metaData) => {
  return new Promise(async (resolve, reject) => {
    TimeLogger.start("MetaDatafromHLF");
    const fileCID = metaData.properties.CID;
    await readFile(fileCID);
    TimeLogger.end("MetaDatafromHLF");
    resolve(fileCID);
  });
}*/

const getDecryptedKey = async (encryptedKey, wallet) => {
  // if (useMetaMask) return await decrypt(encryptedKey);
  return await ecies.decrypt(
    wallet.privateKey,
    Buffer.from(encryptedKey, "base64")
  );
};

export const downloadMetaData = async (metaDataID) => {
  return await axios.get(`${BackendURL}/getMetaData/${metaDataID}`);
};
