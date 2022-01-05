// import { createFFmpeg } from "@ffmpeg/ffmpeg";
// import Hls, { HlsConfig } from "hls.js";

// import { readFile as readMyFile } from "shared/functions/ipfs/crypto";
// import { uploadKeyFiles, backendPost } from "shared/functions/ipfs/post";
import MyIPFS from "./useIPFS";
import getIPFSURL from "../getIPFSURL";

const { uploadMultipleFiles, setMultiAddr, uploadContent, upload } = MyIPFS;
const multiAddr = getIPFSURL();
setMultiAddr(multiAddr);

// let keyCreationStop = true;
// export const startFFmpeg = async file => {
//   const ffmpeg = await initFFmpeg();
//   const { name } = file;
//   // let blob = await fetch(file).then((r) => r.blob());
//   let blob = await readMyFile(file);
//   //console.log("blob downloaded");
//   // write the AVI to the FFmpeg file system
//   //console.log(name, blob);
//   ffmpeg.FS("writeFile", name, new Uint8Array(blob as ArrayBuffer));
//   return { ffmpeg, name };
// };

// export const initFFmpeg = async () => {
//   const ffmpeg = createFFmpeg({
//     log: true,
//     corePath: "https://cdn.jsdelivr.net/npm/@ffmpeg/core/dist/ffmpeg-core.js",
//   });
//   await ffmpeg.load();
//   return ffmpeg;
// }

// const getFileDuration = async file => {
//   return new Promise((resolve, reject) => {
//     var video = document.createElement("video");
//     video.preload = "metadata";

//     video.onloadedmetadata = function () {
//       window.URL.revokeObjectURL(video.src);
//       var duration = video.duration;
//       resolve(duration);
//     };

//     video.src = window.URL.createObjectURL(file);
//   });
// };

// const sleep = duration => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("done");
//     }, duration);
//   });
// };

// const keyCreation = async (duration, ffmpeg) => {
//   return new Promise(async (resolve, reject) => {
//     // const baseURL = window.location.href;
//     const segLength = 5;
//     const baseURL = "";

//     let mxCount = Math.ceil(duration / segLength) + 2;
//     for (let i = 2; i < mxCount && !keyCreationStop; ++i) {
//       let content = "";
//       const key = window.crypto.getRandomValues(new Uint8Array(16));
//       ffmpeg.FS("writeFile", `enc${i}.key`, key);
//       content += `${baseURL}enc${i}.key\r\n`;
//       content += `enc${i}.key\r\n`;
//       content += [...crypto.getRandomValues(new Uint8Array(16))]
//         .map(m => ("0" + m.toString(16)).slice(-2))
//         .join("");
//       content += "\r\n";
//       var enc = new TextEncoder(); // always utf-8
//       const unit8Content = enc.encode(content);
//       ffmpeg.FS("writeFile", "enc.keyinfo", unit8Content);
//       await sleep(segLength * 100);
//     }
//     resolve("success");
//   });
// };

// export const addStreamingVideo2IPFS = async (file) => {
//   const { ffmpeg, name } = await startFFmpeg(file);
//   const fileExists = fileName => ffmpeg.FS("readdir", "/").includes(fileName);
//   const readFile = fileName => ffmpeg.FS("readFile", fileName);

//   let duration = await getFileDuration(file);
//   //console.log("file duration", duration);
//   keyCreationStop = false;
//   keyCreation(duration, ffmpeg);

//   // audio command
//   // const rate = '128K', length = 10;
//   // const command = `-i ${name} -c aac -b:a 196K -f hls -hls_playlist_type vod -start_number 0 -hls_time 15 -hls_list_size 0 master.m3u8`;

//   // video final command
//   const videoCommand = `-i ${name} -strftime 1 -strftime_mkdir 1 -c:v libx264 -crf 21 -preset ultrafast -c:a aac -b:a 128K -ac 2 -hls_time 1 -hls_list_size 0 -f hls -hls_key_info_file enc.keyinfo -hls_flags second_level_segment_index+periodic_rekey -hls_segment_filename files/file-%Y%m%d-%%4d.ts master.m3u8`;
//   // audio finale command
//   const audioCommand = `-i ${name} -strftime 1 -strftime_mkdir 1 -preset ultrafast -c:a aac -b:a 128K -vn -hls_time 15 -hls_list_size 0 -f hls -hls_key_info_file enc.keyinfo -hls_flags second_level_segment_index+periodic_rekey -hls_segment_filename files/file-%Y%md%d-%%4d.ts master.m3u8`;
//   try {
//     await ffmpeg.run(...audioCommand.split(" "));
//     //console.log("-FFMPEG RUN-");
//     console.log("ffmpeg result dir-", ffmpeg.FS("readdir", "files/"));
//   } catch (err) {
//     console.error('FFmpeg Error Occured - Invalid File Type');
//     keyCreationStop = true;
//     return false;
//   } finally {
//     console.log("ffmpeg result dir-", ffmpeg.FS("readdir", "/"));
//     keyCreationStop = true;
//     const playListURL = await uploadSeparate(ffmpeg);
//     console.log('playListURL', playListURL);
//     return playListURL;
//   }
//   // No need to erase, play using hls.js
//   // const video = document.getElementById("ipfs-test-video") as HTMLMediaElement;
//   // const hls = new Hls({
//   //   pLoader: pLoader,
//   //   fLoader: fLoader,
//   // } as HlsConfig);
//   // hls.loadSource(playListURL);
//   // //console.log({ playListURL });
//   // if (video) {
//   //   hls.attachMedia(video);
//   //   hls.on(Hls.Events.MANIFEST_PARSED, () => {
//   //     var playPromise = video.play();

//   //     if (playPromise !== undefined) {
//   //       playPromise.then(_ => {
//   //         // Automatic playback started!
//   //         // Show playing UI.
//   //         //console.log('Playing')
//   //       })
//   //         .catch(error => {
//   //           // Auto-play was prevented
//   //           // Show paused UI.
//   //           //console.log('Paused');
//   //         });
//   //     }
//   //   });
//   // }
// };

// const uploadAll = async ffmpeg => {
//   const fileExists = fileName => ffmpeg.FS("readdir", "/").includes(fileName);
//   const readFile = fileName => ffmpeg.FS("readFile", fileName);

//   async function* streamAllFiles() {
//     let index = 0,
//       buffer;

//     // video chunks
//     const filesList = ffmpeg.FS("readdir", "files/");
//     index = 2;
//     const len = filesList.length;
//     while (index < len) {
//       const fileName = filesList[index];
//       buffer = readFile(`/${fileName}`);
//       //console.log("ffmpeg readFile buffer", buffer);
//       yield {
//         path: `/${fileName}`,
//         content: [buffer],
//       };
//       index++;
//     }

//     // key files
//     // if (fileExists(`enc.keyinfo`)) {
//     //   buffer = readFile(`/enc.keyinfo`);
//     //   yield {
//     //     path: `/enc.keyinfo`,
//     //     content: [buffer],
//     //   };
//     // }
//     // index = 2;
//     // while (fileExists(`enc${index}.key`)) {
//     //   buffer = readFile(`enc${index}.key`);
//     //   //console.log("ffmpeg readFile buffer", buffer);
//     //   yield {
//     //     path: `/enc${index}.key`,
//     //     content: [buffer],
//     //   };
//     //   index++;
//     // }
//   }

//   const uploadPlayList = async folderCID => {
//     if (fileExists(`master.m3u8`)) {
//       let utf8decoder = new TextDecoder();
//       const buffer = readFile(`/master.m3u8`);

//       let masterContent = utf8decoder.decode(buffer);
//       //console.log("master.m3u8-", masterContent);
//       const patt = /:\d{4}/i;
//       let apiAddr = multiAddr.replace(patt, ":8080");
//       // const prefixURL = `${apiAddr}/ipfs/${folderCID}/`;
//       // masterContent = (masterContent as any).replaceAll(`URI="`, `URI="${prefixURL}`);
//       // masterContent = (masterContent as any).replaceAll(`files/`, `${prefixURL}files/`);
//       //console.log("masterContent", masterContent);

//       var enc = new TextEncoder(); // always utf-8
//       const unit8Content = enc.encode(masterContent);
//       //console.log("unit8Content", unit8Content);

//       //console.log("could cause an error here UploadContent");
//       const playListCID = await uploadContent(
//         {
//           path: `/master.m3u8`,
//           content: [unit8Content],
//         },
//         unit8Content.length
//       );
//       return playListCID.cid.toString();
//     }
//   };

//   let res;
//   try {
//     res = await uploadMultipleFiles(streamAllFiles);
//   } catch (error) {
//     //console.log("error", error);
//   }

//   const folderCID = res.folderCID.toString();
//   //console.log("folderCID", folderCID);
//   const playListCID = await uploadPlayList(folderCID);
//   const patt = /:\d{4}/i;
//   let apiAddr = multiAddr.replace(patt, ":8080");
//   const resultURL = `${apiAddr}/ipfs/${playListCID}/master.m3u8`;
//   return resultURL;
// };

// const uploadSeparate = async ffmpeg => {
//   const fileExists = fileName => ffmpeg.FS("readdir", "/").includes(fileName);
//   const readFile = fileName => ffmpeg.FS("readFile", fileName);

//   const streamKeyFiles = () => {
//     const result = {};
//     let buffer, index;
//     if (fileExists(`enc.keyinfo`)) {
//       buffer = readFile(`/enc.keyinfo`);
//       result["enc_keyinfo"] = Array.from(buffer);
//     }
//     index = 2;
//     while (fileExists(`enc${index}.key`)) {
//       buffer = readFile(`enc${index}.key`);
//       //console.log("ffmpeg readFile buffer", buffer);
//       result[`enc${index}_key`] = Array.from(buffer);
//       index++;
//     }
//     return result;
//   };

//   async function* streamFiles() {
//     let index = 0,
//       buffer;

//     const filesList = ffmpeg.FS("readdir", "files/");
//     index = 2;
//     const len = filesList.length;
//     while (index < len) {
//       const fileName = filesList[index];
//       buffer = readFile(`files/${fileName}`);
//       //console.log("ffmpeg readFile buffer", buffer);
//       yield {
//         path: `/files/${fileName}`,
//         content: [buffer],
//       };
//       index++;
//     }
//   }

//   const uploadPlayList = async folderCID => {
//     if (fileExists(`master.m3u8`)) {
//       let utf8decoder = new TextDecoder();
//       const buffer = readFile(`/master.m3u8`);

//       let masterContent = utf8decoder.decode(buffer);
//       //console.log("master.m3u8-", masterContent);
//       const patt = /:\d{4}/i;
//       let apiAddr = multiAddr.replace(patt, ":8080");
//       const prefixURL = `${apiAddr}/ipfs/${folderCID}/`;
//       masterContent = (masterContent as any).replaceAll(`URI="`, `URI="/${folderCID}/`);
//       masterContent = (masterContent as any).replaceAll(`files/`, `${prefixURL}files/`);
//       //console.log("masterContent", masterContent);

//       var enc = new TextEncoder(); // always utf-8
//       const unit8Content = enc.encode(masterContent);
//       //console.log("unit8Content", unit8Content);

//       const playListCID = await uploadContent(
//         {
//           path: `/master.m3u8`,
//           content: [unit8Content],
//         },
//         unit8Content.length
//       );
//       return playListCID.cid.toString();
//     }
//   };

//   let res, folderCID;
//   try {
//     const data = streamKeyFiles();
//     //console.log({ keyFiles: data });
//     res = await uploadMultipleFiles(streamFiles);
//     folderCID = res.folderCID.toString();
//     console.log('folderCID', folderCID);
//     await uploadKeyFiles(data, folderCID);
//   } catch (error) {
//     //console.log("error", error);
//   }
//   //console.log("folderCID", folderCID);
//   const playListCID = await uploadPlayList(folderCID);
//   const patt = /:\d{4}/i;
//   let apiAddr = multiAddr.replace(patt, ":8080");
//   const resultURL = `${apiAddr}/ipfs/${playListCID}/master.m3u8`;
//   //console.log({ resultURL });
//   return resultURL;
// };

// export const uploadNFTMetaData = async (obj) => {
//   const { name, description, external_url, image } = obj;
//   const doc = JSON.stringify({ name, description, external_url, image });
//   const result = await upload(doc);
//   const cid = result.cid.toString();
//   const host = multiAddr.replace("5001", "8080");
//   return `${host}/ipfs/${cid}`;
// }

// export const getMetaData = async (file) => {
//   try {
//     const metadataFile = "in.txt";
//     const { ffmpeg, name } = await startFFmpeg(file);
//     await ffmpeg.run(...`-i ${name} -f ffmetadata ${metadataFile}`.split(" "));
//     const str = Buffer.from(ffmpeg.FS("readFile", `/${metadataFile}`)).toString();
//     const arr = str.split("\n").filter(s => s != "").slice(1);
//     const ffMetaData = {};
//     arr.forEach(ele => {
//       const params = ele.split("=");
//       ffMetaData[params[0]] = params[1];
//     });
//     console.log({ ffMetaData });
//     return ffMetaData;
//   }
//   catch (err) {
//     console.error('ffmpeg getting metadata error', err);
//     return {};
//   }
// }

export const uploadNFTMetaData = async obj => {
  const doc = JSON.stringify(obj);
  const result = await upload(doc);
  const cid = result.cid.toString();
  return {uri: getURLfromCID(cid), cid};
};

export const getURLfromCID = (cid) => {
  const host = multiAddr.replace("5001", "8080");
  return `${host}/ipfs/${cid}`;
}