import { propNameCaseCrossTo, parseCommaSeparatedValue } from "shared/functions/commonFunctions";
import { ContractInstance, decodeAbiData } from "shared/connectors/substrate/functions";
import MEDIA_METADATA from "shared/connectors/substrate/contracts/media.metadata.json";
import { MEDIA_CONTRACT, POD_MEDIA_REGULAR } from "shared/connectors/substrate/config/test.json";
import substrateTokens from "shared/connectors/substrate/tokens";
import { ApiPromise } from "@polkadot/api";

const defaultTokenAddress = "5D6YG7agRiJLVAG9S9W7NkV8Ca22UoCkj3kgHV5bF3UGjRJY";
const defaultTokenName = "Privi";

const MEDIA_TYPE_MAP = {
  DIGITAL_ART_TYPE: "DigitalArt",
  VIDEO_TYPE: "Video",
  LIVE_VIDEO_TYPE: "LiveVideo",
  AUDIO_TYPE: "Audio",
  LIVE_AUDIO_TYPE: "LiveAudio",
  BLOG_TYPE: "Blog",
  BLOG_SNAP_TYPE: "BlogSnap",
};

function tokenAddress(tokenName) {
  const token = substrateTokens.find(token => token.name === tokenName);
  return token ? token.address : defaultTokenAddress;
}

function tokenName(tokenAddress) {
  const token = substrateTokens.find(token => token.address === tokenAddress);
  return token ? token.name : defaultTokenName;
}

export async function createMediaForSubstrate(
  payload: any,
  additionalData: any,
  api: ApiPromise,
  accountPair: any
): Promise<any> {
  return new Promise(async resolve => {
    try {
      payload.PodAddress = POD_MEDIA_REGULAR;
      payload.CreatorAddress = accountPair.address;
      payload.ViewConditions.ViewingToken = tokenAddress(payload.ViewConditions.ViewingToken);
      payload.ViewConditions.SharingPercent = payload.SharingPct;
      payload.Collabs = [[accountPair.address, 1000000000]];

      if (!payload.NftConditions) {
        payload.NftConditions = {};
      } else {
        payload.NftConditions.FundingToken = tokenAddress(payload.NftConditions.NftToken);
      }
      payload = propNameCaseCrossTo(payload, "P2S");
      payload["r#type"] = MEDIA_TYPE_MAP[payload.type];
      console.log(payload);
      const contract = ContractInstance(api, JSON.stringify(MEDIA_METADATA), MEDIA_CONTRACT);

      const value = 0;
      const gasLimit = 6000 * 100000000;

      (await contract).tx.createMedia({ value, gasLimit }, payload).signAndSend(accountPair, async result => {
        result.events
          .filter(({ event }) => api?.events.system.ExtrinsicFailed.is(event))
          .forEach(
            ({
              event: {
                data: [error, info],
              },
            }) => {
              if (error.isModule) {
                const decoded = api.registry.findMetaError(error.asModule);
                resolve({ success: false });
              }
            }
          );
        result.events
          .filter(({ event }) => api?.events.contracts.ContractEmitted.is(event))
          .forEach(
            async ({
              event: {
                data: [, data],
              },
            }) => {
              const { args } = decodeAbiData(api, JSON.stringify(MEDIA_METADATA), data);
              // Make response data human friendly (readable)
              let blockchainRes: any = args[0].toHuman();
              if (blockchainRes.media_id > 1) resolve(blockchainRes);
            }
          );
      });
    } catch (e) {
      throw new Error(e.message);
    }
  });
}
export async function getMediaForSubstrate(payload: any, api: ApiPromise, accountPair: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(api, JSON.stringify(MEDIA_METADATA), MEDIA_CONTRACT);

      const value = 0;
      const gasLimit = 6000 * 100000000;

      const id = payload.media_id;
      const { output } = await (await contract).query.getMedia(accountPair.address, { value, gasLimit }, id);
      let media: any = parseCommaSeparatedValue(propNameCaseCrossTo(output?.toHuman(), "S2P"));
      // Collabs
      let collabs = {};
      media.Collabs.forEach(collab => {
        collabs[collab[0]] = collab[1];
      });
      media.Collabs = collabs;
      // CreatorAddress
      media.CreatorAddress = media.Creator;
      delete media.Creator;
      // Media Type
      media.Type = Object.keys(MEDIA_TYPE_MAP).find(key => MEDIA_TYPE_MAP[key] === media["R#type"]);
      // PodAddress
      delete media.PodAddress;

      media.BlockchainId = media.Id;
      delete media.Id;

      let blockchainRes = { output: { UpdateMedias: {}, UpdateTokens: {} } };
      blockchainRes.output.UpdateMedias[media.MediaName] = media;
      blockchainRes.output.UpdateTokens[media.MediaName] = {
        Name: media.MediaName,
        TokenType: media.Type,
        Symbol: media.MediaName,
        CreatorAddress: media.CreatorAddress,
        FeePct: "0",
        docType: "",
      };
      resolve(blockchainRes);
    } catch (e) {
      throw new Error(e.message);
    }
  });
}
export async function openMediaForSubstrate(payload: any, api: ApiPromise, accountPair: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(api, JSON.stringify(MEDIA_METADATA), MEDIA_CONTRACT);

      const value = 0;
      const gasLimit = 6000 * 100000000;

      (await contract).tx.openMedia({ value, gasLimit }, payload).signAndSend(accountPair, async result => {
        result.events
          .filter(({ event }) => api?.events.system.ExtrinsicFailed.is(event))
          .forEach(
            ({
              event: {
                data: [error, info],
              },
            }) => {
              if (error.isModule) {
                const decoded = api.registry.findMetaError(error.asModule);
                resolve({ success: false });
              }
            }
          );
        result.events
          .filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event))
          .forEach(({ event }) => {
            resolve({ success: true });
          });
      });
    } catch (e) {
      throw new Error(e.message);
    }
  });
}
export async function closeMediaForSubstrate(payload: any, api: ApiPromise, accountPair: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(api, JSON.stringify(MEDIA_METADATA), MEDIA_CONTRACT);

      const value = 0;
      const gasLimit = 6000 * 100000000;

      (await contract).tx.closeMedia({ value, gasLimit }, payload).signAndSend(accountPair, async result => {
        result.events
          .filter(({ event }) => api?.events.system.ExtrinsicFailed.is(event))
          .forEach(
            ({
              event: {
                data: [error, info],
              },
            }) => {
              if (error.isModule) {
                const decoded = api.registry.findMetaError(error.asModule);
                resolve({ success: false });
              }
            }
          );
        result.events
          .filter(({ event }) => api?.events.contracts.ContractEmitted.is(event))
          .forEach(
            async ({
              event: {
                data: [, data],
              },
            }) => {
              const { args } = decodeAbiData(api, JSON.stringify(MEDIA_METADATA), data);
              // Make response data human friendly (readable)
              let blockchainRes: any = args[0].toHuman();
              resolve(blockchainRes);
            }
          );
      });
    } catch (e) {
      throw new Error(e.message);
    }
  });
}
export async function shareMediaForSubstrate(payload: any, api: ApiPromise, accountPair: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(api, JSON.stringify(MEDIA_METADATA), MEDIA_CONTRACT);

      const value = 0;
      const gasLimit = 6000 * 100000000;

      (await contract).tx.shareMedia({ value, gasLimit }, payload).signAndSend(accountPair, async result => {
        result.events
          .filter(({ event }) => api?.events.system.ExtrinsicFailed.is(event))
          .forEach(
            ({
              event: {
                data: [error, info],
              },
            }) => {
              if (error.isModule) {
                const decoded = api.registry.findMetaError(error.asModule);
                resolve({ success: false });
              }
            }
          );
        result.events
          .filter(({ event }) => api?.events.contracts.ContractEmitted.is(event))
          .forEach(
            async ({
              event: {
                data: [, data],
              },
            }) => {
              const { args } = decodeAbiData(api, JSON.stringify(MEDIA_METADATA), data);
              // Make response data human friendly (readable)
              let blockchainRes: any = args[0].toHuman();
              resolve(blockchainRes);
            }
          );
      });
    } catch (e) {
      throw new Error(e.message);
    }
  });
}
