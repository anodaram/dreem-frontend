import { create as ipfsHttpClient } from "ipfs-http-client";
import { saveAs } from "file-saver";
import { encryptFile, decryptContent, getBlob } from "./crypto";
import TimeLogger, { logFunc } from "./TimeLogger";
import promisify from 'cypress-promise'

class IPFSClass {
  static ipfs = {};
  static isConnected = false;
  static multiAddr = "";
  static setIPFS(ipfs) {
    this.ipfs = ipfs;
  }
  static setConnected(state) {
    this.isConnected = state;
  }
  static setMultiAddr(newMultiAddr) {
    this.multiAddr = newMultiAddr;
    this.ipfs = ipfsHttpClient(newMultiAddr);
    this.setConnected(true);
  }

  static async getFiles(fileCID) {
    const files = [];
    for await (let file of this.ipfs.ls(fileCID)) {
      files.push(file);
    }
    return files;
  }

  static async uploadWithFileName(file) {
    return await TimeLogger.logFunc(async () => {
      const fileDetails = {
        path: file.name,
        content: file,
      };
      const options = {
        wrapWithDirectory: true,
        progress: (prog) => console.log(`received: ${prog}`),
      };

      try {
        const added = await this.ipfs.add(fileDetails, options);
        return added;
      } catch (err) {
        console.error(err);
      }
    }, "uploadWithFileName");
  }

  static async uploadWithEncryption(file) {
    return await TimeLogger.logFunc(async () => {
      const { resultBytes: encryptedBytes, keyData } = await encryptFile(file);
      const newFile = new File([encryptedBytes], file.name + ".enc");
      const added = await this.uploadWithFileName(newFile);
      console.log("added", added);
      return { added, newFile, keyData };
    }, "uploadWithEncryption");
  }

  static async download(fileCID, isEncrypted = false, keyData) {
    await TimeLogger.logFunc(async () => {
      const files = await this.getFiles(fileCID);
      for await (const file of files) {
        const ipfsPath = `/ipfs/${file.path}`;
        const chunks = [];
        for await (const chunk of this.ipfs.cat(ipfsPath)) {
          chunks.push(Buffer.from(chunk));
        }
        let content = Buffer.concat(chunks);
        let fileName = file.name;
        if (isEncrypted) {
          content = await decryptContent(content, keyData);
          fileName = fileName.replace(".enc", "");
        }
        const blob = getBlob(content);
        saveAs(blob, fileName);
      };
    }, "download");
  }

  static async upload(file) {
    try {
      const added = await this.ipfs.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
        pin: false,
      });
      return added;
    } catch (err) {
      console.error(err);
    }
  }
}

export default IPFSClass;
