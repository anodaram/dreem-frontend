// local storage field name
const keyFieldName = "tempKey";

export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsArrayBuffer(file);
  });
};

export const exportKey = async () => {
  //key exportable=true
  const format = "jwk";
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  try {
    const keyData = await window.crypto.subtle.exportKey(
      format, //can be "jwk" or "raw"
      key //extractable must be true
    );
    return { key, keyData };
  } catch (err) {
    throw new Error(err);
  }
};

export const saveKeyToLocalStorage = async () => {
  const { key, keyData } = await exportKey();
  localStorage.setItem(keyFieldName, JSON.stringify(keyData));
  return { key, keyData };
};

export const getIV = (len) => {
  return window.crypto.getRandomValues(new Uint8Array(len));
};

export const encryptFile = async (objFile) => {
  // plainTextBytes
  let plainTextBytes;
  try {
    plainTextBytes = await readFile(objFile);
  } catch (err) {
    console.error(err);
  }
  plainTextBytes = new Uint8Array(plainTextBytes);

  // generate & save key on local storage
  const { key, keyData } = await exportKey();
  const iv = getIV(12);

  // cipherBytes
  let cipherBytes;
  try {
    cipherBytes = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      plainTextBytes
    );
    if (!cipherBytes) {
      console.error("<p>Error encrypting file.  See console log.</p>");
      return;
    }
  } catch (err) {
    console.error("<p>Error encrypting file.  See console log.</p>", err);
    return;
  }

  // resultBytes
  const resultBytes = new Uint8Array(cipherBytes.byteLength + 12);
  const cipherData = new Uint8Array(cipherBytes);
  resultBytes.set(iv, 0);
  resultBytes.set(cipherData, 12);

  return { resultBytes, keyData };
};

export const importKey = async (keyData) => {
  try {
    const key = await window.crypto.subtle.importKey(
      "jwk", //can be "jwk" or "raw"
      {
        //this is an example jwk key, "raw" would be an ArrayBuffer
        kty: keyData.kty,
        k: keyData.k,
        alg: keyData.alg,
        ext: keyData.ext,
      },
      {
        //this is the algorithm options
        name: "AES-GCM",
      },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"*/
    );
    return { keyData, key };
  } catch (err) {
    throw new Error(err);
  }
};

export const decryptContent = async (cipherBytes, keyData) => {
  cipherBytes = new Uint8Array(cipherBytes);
  let ivBytes = cipherBytes.slice(0, 12);
  cipherBytes = cipherBytes.slice(12);

  const { key } = await importKey(keyData);
  // plainTextBytes
  let plainTextBytes = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBytes,
    },
    key, //from generateKey or importKey above
    cipherBytes
  );

  //returns an ArrayBuffer containing the decrypted data
  if (!plainTextBytes) {
    console.error("<p>Error decrypting file.  Key may be incorrect.</p>");
    return;
  }
  plainTextBytes = new Uint8Array(plainTextBytes);
  return plainTextBytes;
};

export const decryptFile = async (objFile) => {
  // cipherBytes
  let cipherBytes;
  try {
    cipherBytes = await readFile(objFile);
  } catch (err) {
    console.error(err);
  }
  const plainTextBytes = await decryptContent(cipherBytes);
  return plainTextBytes;
};

export const getBlob = (data) => {
  return new Blob([data], { type: "application/download" });
};

export const getBlobURL = (data) => {
  var blob = getBlob(data);
  var blobURL = URL.createObjectURL(blob);
  return blobURL;
};
