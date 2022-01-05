import axios from "axios";
// const BackendURL = process.env.REACT_APP_BACKEND_URL;
const BackendURL = "http://localhost:3002";

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

export const uploadMetaDataPrivate = async (added, keyData, newFile, originalFile, peerNumber) => {
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
      peer: peerNumber || 0
    },
    data: null,
  };
  try {
    const resp = await axios.post(`${BackendURL}/addMetaData`, metadata);
    return resp.data.data;
  } catch (err) {
    console.log("uploadMetaData", err);
  }
};


export const uploadMetaDataPublic = async (added, originalFile) => {
  return new Promise(async (resolve, reject) => {
    if(added && originalFile) {
      const newFileCID = added.cid.toString();
      const metadata = {
        title: "metadata",
        object: "content",
        object_type: originalFile.type,
        privacy_type: "public",
        properties: {
          ownerID: "dev",
          name: originalFile.name,
          size: originalFile.size,
          description: "",
          /*key: keyData,*/
          CID: newFileCID,
          datefrom: null,
          dateto: null,
        },
        data: null,
      };
      try {
        /*const resp = await axios.post(`${BackendURL}/addMetaData`, metadata);
        return resp.data.data;*/
        console.log(newFileCID, metadata);
        resolve({newFileCID, metadata});
      } catch (err) {
        console.log("uploadMetaData", err);
      }
    }
  });
};

export const addNewPubKey2MetaData = async ({userName, pubKey, metaDataID}) => {
  try {
    await axios.post(`${BackendURL}/addPubKey`, {userName, pubKey, metaDataID});
  } catch(err) {
    console.err("addNewPubKey2MetaData", err);
  }
}

export const downloadMetaData = async (metaDataID) => {
  return await axios.get(`${BackendURL}/getMetaData/${metaDataID}`);
};
