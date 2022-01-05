import axios from "axios";
import URL from "shared/functions/getURL";
import { propNameCaseCrossTo, parseCommaSeparatedValue } from "shared/functions/commonFunctions";
import { ContractInstance, decodeAbiData } from "shared/connectors/substrate/functions";
import PODCROWDFUNDING from "shared/connectors/substrate/contracts/PodCrowdFunding.json";
import { POD_CROWD_FUNDING_CONTRACT } from "shared/connectors/substrate/config/test.json";
import { IInitiatePod, IRegisterMedia, IUploadMedia } from "./PodMediaAPI";
import { ApiPromise } from "@polkadot/api";
import { encodeAddress } from "@polkadot/keyring";
import { randomAsU8a } from "@polkadot/util-crypto";

const UNIT = Math.pow(10, 9);

// repair structure for UpdateMedias, UpdatePods, UpdateTokens, UpdatePodStates fields adjusting to hlf
function restructure(obj: any) {
  const output = {};
  let prop: string = "";
  let value: any = {};
  for ([prop, value] of Object.entries(obj)) {
    if (
      prop === "UpdateMedias" ||
      prop === "UpdatePods" ||
      prop === "UpdatePodStates" ||
      prop === "UpdateTokens"
    ) {
      output[prop] = {};
      if (prop && value) {
        value.forEach(itr => {
          output[prop][itr[0]] = itr[1];
        });
      }
    } else {
      output[prop] = value;
    }
  }
  return output;
}

export async function initiatePodForSubstrate(
  payload: any, // hlf payload changed
  additionalData: any,
  api: ApiPromise,
  accountPair: any
): Promise<any> {
  return new Promise(async resolve => {
    try {
      const podAddress = encodeAddress(randomAsU8a());
      const ammAddress = encodeAddress(randomAsU8a());

      (payload.PodInfo as any).PodAddress = podAddress;
      (payload.PodInfo as any).AMMAddress = ammAddress;
      (payload.Medias as any) = payload.Medias.map(media => {
        return { ...media, Collabs: [media.Collabs], PodAddress: podAddress };
      });
      payload.PodInfo.FundingDate *= 1000;

      payload.PodInfo.FundingTokenPrice *= UNIT;
      payload.PodInfo.InvestorDividend *= UNIT;
      payload.PodInfo.Spread *= UNIT;
      payload.PodInfo.MaxPrice *= UNIT;

      payload.PodInfo.IsInvesting = false;

      const requestData = {
        function: "",
        address: "",
        signature: "",
        payload: propNameCaseCrossTo(payload, "P2S"),
      };
      const request = {
        data: requestData,
        caller: "Privi",
      };

      const contract = ContractInstance(api, JSON.stringify(PODCROWDFUNDING), POD_CROWD_FUNDING_CONTRACT);

      const value = 0;
      const gasLimit = 6000 * 100000000;

      (await contract).tx.initiatePod({ value, gasLimit }, request).signAndSend(accountPair, async result => {
        if (result.status.isFinalized) {
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
                const { args } = decodeAbiData(api, JSON.stringify(PODCROWDFUNDING), data);
                // Make response data human friendly (readable)
                let blockchainRes: any = args[0].toHuman();

                if (!blockchainRes) return;

                blockchainRes.output = parseCommaSeparatedValue(restructure(propNameCaseCrossTo(blockchainRes.output, "S2P")));

                // Hard code here
                // Initilize media collabs as blank object
                let mediaSymbol: string = "";
                let mediaObj: any = {};
                let medias = {};
                for ([mediaSymbol, mediaObj] of Object.entries(blockchainRes.output.UpdateMedias)) {
                  mediaObj.Collabs = {};
                  medias[mediaSymbol] = mediaObj;
                }
                blockchainRes.output.UpdateMedias = medias;

                const body = {
                  BlockchainRes: blockchainRes,
                  AdditionalData: additionalData,
                };

                const response = await axios.post(`${URL()}/mediaPod/initiatePod_s1`, body);
                resolve(response.data);
              }
            );
        }
      });
    } catch (e) {
      throw new Error(e.message);
    }
  });
}

export async function registerMediaForSubstrate(
  payload: any, // hlf payload changed
  additionalData: any,
  api: ApiPromise,
  accountPair: any
): Promise<any> {
  return new Promise(async resolve => {
    try {
      // Hard code for Collabs
      const _payload = { ...payload, Collabs: [] };

      const requestData = {
        function: "",
        address: "",
        signature: "",
        payload: propNameCaseCrossTo(_payload, "P2S"),
      };

      const request = {
        data: requestData,
        caller: "Privi",
      };
      const contract = ContractInstance(api, JSON.stringify(PODCROWDFUNDING), POD_CROWD_FUNDING_CONTRACT);

      const value = 0;
      const gasLimit = 6000 * 10000000;

      await (await contract).tx
        .registerMedia({ value, gasLimit }, request)
        .signAndSend(accountPair, result => {
          if (result.status.isFinalized) {
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
                  const { args } = decodeAbiData(api, JSON.stringify(PODCROWDFUNDING), data);
                  let blockchainRes: any = args[0].toHuman();

                  if (!blockchainRes) return;

                  blockchainRes.output = parseCommaSeparatedValue(restructure(propNameCaseCrossTo(blockchainRes.output, "S2P")));

                  // Hard code here
                  // Initilize media collabs as blank object
                  let mediaSymbol: string = "";
                  let mediaObj: any = {};
                  let medias = {};
                  for ([mediaSymbol, mediaObj] of Object.entries(blockchainRes.output.UpdateMedias)) {
                    mediaObj.Collabs = payload.Collabs;
                    medias[mediaSymbol] = mediaObj;
                  }
                  blockchainRes.output.UpdateMedias = medias;

                  const body = {
                    BlockchainRes: blockchainRes,
                    AdditionalData: additionalData,
                  };

                  const response = await axios.post(`${URL()}/mediaPod/registerMedia_s1`, body);
                  resolve(response.data);
                }
              );
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  });
}

export async function uploadMediaForSubstrate(
  payload: IUploadMedia,
  additionalData: Object,
  api: ApiPromise,
  accountPair: any
): Promise<any> {
  return new Promise(async resolve => {
    try {
      const requestData = {
        function: "",
        address: "",
        signature: "",
        payload: propNameCaseCrossTo(payload, "P2S"),
      };

      const contract = ContractInstance(api, JSON.stringify(PODCROWDFUNDING), POD_CROWD_FUNDING_CONTRACT);

      const value = 0;
      const gasLimit = 6000 * 10000000;

      await (await contract).tx
        .uploadMedia({ value, gasLimit }, requestData)
        .signAndSend(accountPair, result => {
          if (result.status.isFinalized) {
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
                  const { args } = decodeAbiData(api, JSON.stringify(PODCROWDFUNDING), data);
                  let blockchainRes: any = args[0].toHuman();

                  if (!blockchainRes) return;

                  blockchainRes.output = parseCommaSeparatedValue(restructure(propNameCaseCrossTo(blockchainRes.output, "S2P")));

                  const body = {
                    BlockchainRes: blockchainRes,
                    AdditionalData: additionalData,
                  };
                  const response = await axios.post(`${URL()}/mediaPod/uploadMedia_s1`, body);
                  resolve(response.data);
                }
              );
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  });
}
