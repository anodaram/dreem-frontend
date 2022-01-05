import axios from "axios";
import IPFSBackendURL from '../getIPFSBackendURL';
const BackendURL = `${IPFSBackendURL()}/ipfs`;
export const uploadToLocal = (file) => {
  const formData = new FormData();
  formData.append("file", file, file.name);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  axios
    .post(`http://localhost:5001/api/v0/add?pin=false`, formData, config)
    .then((resp) => {
      console.log("uploadToLocal Response", resp);
    });
};

export const uploadMetaData = async (added, keyData, newFile, originalFile) => {
  const newFileCID = added.cid.toString();
  const metadata = {
    title: "metadata",
    object: "content",
    object_type: originalFile.type,
    privacy_type: "private",
    properties: {
      ownerID: "dev",
      name: originalFile.name,
      size: originalFile.size,
      description: "",
      key: keyData,
      CID: newFileCID,
      datefrom: null,
      dateto: null,
    },
    data: null,
  };
  try {
    const resp = await axios.post(`${BackendURL}/addMetaData`, metadata);
    return resp.data.data;
  } catch (err) {
    console.error("uploadMetaData", err);
  }
};

export const addNewPubKey2MetaData = async ({
  userName,
  pubKey,
  metaDataID,
}) => {
  try {
    await axios.post(`${BackendURL}/addPubKey`, {
      userName,
      pubKey,
      metaDataID,
    });
  } catch (err) {
    console.error("addNewPubKey2MetaData", err);
  }
};

export const downloadMetaData = async (metaDataID) => {
  return await axios.get(`${BackendURL}/getMetaData/${metaDataID}`);
};

export const uploadKeyFiles = async (files, folderCID) => {
  try {
    await axios.post(`${BackendURL}/uploadKeyFiles`, {
      files,
      hash: folderCID,
    });
    console.log("uploadKeyFiles");
  } catch (error) {
    console.error("uploadKeyFiles", error);
  }
};

export const backendPost = async (url, data) => {
  try {
    const resp = await axios.post(`${BackendURL}/${url}`, data);
    console.log("backendPost ");
    return resp.data;
  } catch (err) {
    console.error("POST-", { url }, err);
  }
};
