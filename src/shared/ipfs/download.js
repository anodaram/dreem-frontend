import TimeLogger from "../utils-IPFS/TimeLogger";

/*import { downloadMetaData } from "../utils-IPFS/post";
import { readFile } from "../utils-IPFS/HLFAPIs";*/

import ecies from "ecies-parity";
import { generatePriviWallet } from "./generatePriviWallet";

export const onDownloadDecrypt = async (
  fileCID,
  address,
  mnemonic,
  downloadWithDecryption
) => {
  // if (!metaDataID) return;
  try {
    console.log("----------Download Start----------");
    /*TimeLogger.start("MetaDatafromIPFS");
    const resp = await downloadMetaData(metaDataID);
    TimeLogger.end("MetaDatafromIPFS");

    const metaData = resp.data.metaData;
    const encryptedKey = metaData.properties.key[address];
    if (encryptedKey === undefined) {
      alert("This user doesn't have permission to the data.");
      return;
    }

    TimeLogger.start("MetaDatafromHLF");
    const fileCID = metaData.properties.CID;
    await readFile(fileCID);
    TimeLogger.end("MetaDatafromHLF");*/

    // await readFile(fileCID);

    //   TimeLogger.start("ECIES Decrypt");
    //   const wallet = await generatePriviWallet(mnemonic);
    //   const k = await getDecryptedKey(encryptedKey, wallet);
    //   TimeLogger.end("ECIES Decrypt");

    //   const keyData = {
    //     alg: "A256GCM",
    //     ext: true,
    //     k,
    //     key_ops: ["encrypt", "decrypt"],
    //     kty: "oct",
    //   };

    //   const peerNumber = metaData.properties.peer;

    //   TimeLogger.start("Download(IPFS+Decrypt)");
    //   await downloadWithDecryption(fileCID, true, keyData, true, peerNumber);
    //   TimeLogger.end("Download(IPFS+Decrypt)");

    //   console.log("----------Download End----------");
    //   TimeLogger.log();
  } catch (err) {
    console.error("onDownload-MetaData", err);
  }
};

export const onDownloadNonDecrypt = async (
  fileCID,
  fileName,
  downloadWithNonDecryption
) => {
  if (!fileCID) return;
  try {
    /*console.log("----------Download Start----------");
    TimeLogger.start("MetaDatafromIPFS");
    const resp = await downloadMetaData(metaDataID);
    TimeLogger.end("MetaDatafromIPFS");

    const metaData = resp.data.metaData;

    TimeLogger.start("MetaDatafromHLF");
    const fileCID = metaData.properties.CID;
    await readFile(fileCID);
    TimeLogger.end("MetaDatafromHLF");*/

    // await readFile(fileCID);

    TimeLogger.start("Download IPFS");
    let file = await downloadWithNonDecryption(fileCID, fileName, false);
    TimeLogger.end("Download IPFS");

    console.log("----------Download End----------");
    TimeLogger.log();

    return file;
  } catch (err) {
    console.error("onDownload-MetaData", err);
  }
};

const getDecryptedKey = async (encryptedKey, wallet) => {
  // if (useMetaMask) return await decrypt(encryptedKey);
  return await ecies.decrypt(
    wallet.privateKey,
    Buffer.from(encryptedKey, "base64")
  );
};
