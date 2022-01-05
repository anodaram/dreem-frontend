import axios from "axios";
import { fileSize } from "./functions";
const HLFURL = "http://206.189.100.38:4000/api/ipfs"


export const getUniqueKey = (added) => {
  return added.cid.toString();
};

export const getTimeStamp = () => {
  return Math.floor(Date.now() / 1000);
};

export const addFile = async (functionName, added, newFile, originalFile, key, address, privacy) => {
  const data = {
    Data: {
      Function: functionName,
      Address: address,
      Signature: "",
      Payload: {
        Title: originalFile.name,
        Object: "content",
        Object_type: originalFile.type ?? "other",
        Privacy_type: privacy,
        Properties: {
          OwnerID: address,
          Name: originalFile.name,
          Size: fileSize(originalFile),
          Description: "Information",
          Key: key,
          CID: added.cid.toString(),
          Datefrom: getTimeStamp(),
          Dateto: getTimeStamp(),
        },
        Data: ["communityId"],
      },
    },
    Caller: "PRIVI",
  };
  try {
    const resp = await axios.post(`${HLFURL}/${functionName}`, data);
    if(!resp.data.success)
      console.log('HLF False: type string!');
    return resp.data.data;
  } catch (err) {
    console.error(`HLF ${functionName}`, err);
  }
};

export const readFile = async (fileCID) => {
  const data = {
    CID: fileCID,
    Caller: "PRIVI",
  };

  try {
    const resp = await axios.post(`${HLFURL}/readFile`, data);
    return resp.data;
  } catch (err) {
    console.error(`HLF readFile`, err);
  }
};

export const updateFile = async(fileCID, userName, newPubKey) => {
  const data = await readFile(fileCID);
  const keyList = data["output"]["Properties"]["Key"];
  keyList[userName] = newPubKey;
  try {
    const updatedData = {
      Data: {
        Function: 'updateFile',
        Address: "0xd896466bde3583d495e66951e2243de86d4f15af",
        Signatrue: "",
        Payload: data["output"],
      },
      Caller: "PRIVI",
    };
    const resp = await axios.post(`${HLFURL}/updateFile`, updatedData);
    console.log("updateFile is working", resp.data);
    return resp.data;
  } catch (error) {
    console.error(`HLF updateFile`, error);
  }
}
