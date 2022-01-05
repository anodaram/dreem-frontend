import { create as ipfsHttpClient } from "ipfs-http-client";
// import OrbitDB from 'orbit-db';
import { saveAs } from "file-saver";
import { encryptFile, decryptContent, getBlob } from "./crypto";
import TimeLogger from "./TimeLogger";

export const sizeToString = (size) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const bytes = size;
  let s;
  let i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) {
    s = bytes + " " + sizes[i];
  } else {
    s = (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  }
  return s;
};

class MyIPFS {
  static ipfs;
  static isConnected;
  static multiAddr;
  // static orbitdb;
  // static db;

  static async setMultiAddr(addr) {
    if (!addr) return;
    MyIPFS.multiAddr = addr;
    MyIPFS.ipfs = ipfsHttpClient(addr as any);
    // MyIPFS.orbitdb = await OrbitDB.createInstance(MyIPFS.ipfs);
    // MyIPFS.db = await MyIPFS.orbitdb.log('hello');
    // await MyIPFS.db.load();
    MyIPFS.isConnected = true;
  }

  static async getFiles(fileCID) {
    const files: any[] = [];
    for await (let file of (MyIPFS.ipfs as any).ls(fileCID)) {
      files.push(file);
    }
    return files;
  };

  static async uploadMultipleFiles(streamFiles) {
    let folderCID;
    const files: any[] = [];
    for await (const file of MyIPFS.ipfs.addAll(streamFiles(), {
      wrapWithDirectory: true,
      // this is just to show the interleaving of uploads and progress events
      // otherwise we'd have to upload 50 files before we see any response from
      // the server. do not specify this so low in production as you'll have
      // greatly degraded import performance
      fileImportConcurrency: 1,
      progress: (bytes, file) => {
        console.log(`File progress ${file} ${sizeToString(bytes)}`);
      }
    })) {
      console.log(`Added file: ${file.path} ${file.cid}`);
      files.push({ path: file.path, CID: file.cid });
      folderCID = file.cid;
    }
    console.log('Finished!');
    return { folderCID, files };
  }

  static async uploadContent(fileDetails, fileSize) {
    console.log('File size to Upload', sizeToString(fileSize));
    const options = {
      wrapWithDirectory: true,
      progress: (prog) => console.log(`IPFS Upload: ${(100.0 * prog / fileSize).toFixed(2)}%`),
    };

    try {
      const added = await MyIPFS.ipfs.add(fileDetails, options);
      console.log('The File is Uploaded Successfully to IPFS');
      return added;
    } catch (err) {
      console.error(err);
    }
  }

  static async uploadWithFileName(file) {
    console.log('uploadWithFileName', MyIPFS.ipfs);
    const fileDetails = {
      path: file.name,
      content: file,
    };
    const added = await MyIPFS.uploadContent(fileDetails, file.size);
    return added;
  };

  static async uploadWithEncryption(file) {
    TimeLogger.start("Encryption");
    const result = await encryptFile(file);
    if (!result) return;
    const { resultBytes: encryptedBytes, keyData } = result;
    TimeLogger.end("Encryption");
    const newFile = new File([encryptedBytes], file.name + ".enc");
    TimeLogger.start("Upload2IPFS");
    const added = await MyIPFS.uploadWithFileName(newFile);
    TimeLogger.end("Upload2IPFS");
    console.log("added", added);
    return { added, newFile, keyData };
  };

  static async download(fileCID, isEncrypted = false, keyData) {
    const files = await MyIPFS.getFiles(fileCID);
    for await (const file of files) {
      TimeLogger.start("DownloadFromIPFS");
      const ipfsPath = `/ipfs/${file.path}`;
      const chunks: any[] = [];
      for await (const chunk of MyIPFS.ipfs.cat(ipfsPath)) {
        console.log('chunk', chunk);
        chunks.push(Buffer.from(chunk));
      }
      let content: Buffer | ArrayBuffer = Buffer.concat(chunks);
      let fileName = file.name;
      TimeLogger.end("DownloadFromIPFS");

      if (isEncrypted) {
        TimeLogger.start("Decryption");
        const decryptedContent = await decryptContent(content, keyData);
        if (decryptedContent) content = decryptedContent;
        TimeLogger.end("Decryption");
        fileName = fileName.replace(".enc", "");
      }
      const blob = getBlob(content);
      saveAs(blob, fileName);
    };
  };

  static async upload(file) {
    try {
      const added = await MyIPFS.ipfs.add(file, {
        progress: (prog) => console.log(`IPFS Upload: ${(100.0 * prog / file.size).toFixed(2)}%`),
        pin: false,
      });
      console.log('IPFS Upload: 100%');
      return added;
    } catch (err) {
      console.error(err);
    }
  };
};

export default MyIPFS;
