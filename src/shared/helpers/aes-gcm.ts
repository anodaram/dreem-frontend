export async function generateEncryptionKey() {
  return new Promise(async (resolve, reject) => {
    var aesKey = await makeAESKey();
    callOnStore(function (store) {
      store.put({ id: 1, aesKey });
      resolve({ aesKey });
    });
  });
}

export function loadDecryptionKey(): Promise<{ aesKey: any }> {
  return new Promise((resolve, reject) => {
    callOnStore(function (store) {
      var request = store.get(1);
      request.onsuccess = async function () {
        if (request.result && request.result.aesKey) resolve({ aesKey: request.result.aesKey });
        else reject({ message: "aesKey not found" });
      };

      request.onerror = async function () {
        var aesKey = await makeAESKey();
        store.put({ id: 1, aesKey });
        resolve({ aesKey });
      };
    });
  });
}

export function callOnStore(fn_) {
  var indexedDB = window.indexedDB;
  // Open (or create) the database
  var open = indexedDB.open("MyDatabase", 1);
  // Create the schema
  open.onupgradeneeded = function () {
    var db = open.result;
    var store = db.createObjectStore("PriviStore", { keyPath: "id" });
  };
  open.onsuccess = function () {
    // Start a new transaction
    var db = open.result;
    var tx = db.transaction("PriviStore", "readwrite");
    var store = tx.objectStore("PriviStore");
    fn_(store);
    // Close the db when the transaction is done
    tx.oncomplete = function () {
      db.close();
    };
  };
}

export async function savePriviKey(privateKey: Uint8Array) {
  let aesKey;
  try {
    const res = await loadDecryptionKey();
    aesKey = res.aesKey;
  } catch (e) {
    const res = (await generateEncryptionKey()) as any;
    aesKey = res.aesKey;
  }
  const iv = await makeIV();
  const cipherText = await encrypt(iv, aesKey, privateKey);
  let cipherBuffered = Array.from(new Uint8Array(cipherText));
  let ivArrayTyped = Array.from(iv);
  localStorage.setItem("PRIVI_WALLET_KEY", JSON.stringify({ buffer: cipherBuffered, iv: ivArrayTyped }));
}

export async function loadPriviKey(): Promise<Uint8Array> {
  const { aesKey } = await loadDecryptionKey();
  const { buffer, iv: ivArrayTyped } = JSON.parse(localStorage.getItem("PRIVI_WALLET_KEY") || "");
  const encrypted = Uint8Array.from(buffer);
  const iv = Uint8Array.from(ivArrayTyped);
  const recoveredPrivateKey = await decrypt(iv, aesKey, encrypted);
  return recoveredPrivateKey;
}

export function makeIV() {
  return window.crypto.getRandomValues(new Uint8Array(12));
}

export function makeAESKey() {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt
 * @param {*} iv
 * @param {*} key
 * @param {*} data
 * @returns
 */
export function encrypt(iv, key, data: Uint8Array) {
  return window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data
  );
}

/**
 * Decrypt
 * @param {*} iv
 * @param {*} key
 * @param {*} data Uint8Array
 * @returns
 */
export async function decrypt(iv, key, data) {
  const cipherText = data.buffer;
  return new Uint8Array(
    await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      cipherText
    )
  );
}
/**
 * Convert plain text to encoded binary array
 * @param {*} message
 * @returns Uint8Array
 */
export function getMessageEncoding(message) {
  let enc = new TextEncoder();
  return enc.encode(message);
}

/**
 * Convert encoded array to plain text
 * @param {*} decrypted
 * @returns plainText
 */
export function getMessageDecoding(decrypted) {
  let dec = new TextDecoder();
  const msg = dec.decode(decrypted);
  return msg;
}
