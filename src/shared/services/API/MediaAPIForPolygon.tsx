import axios from "axios";
import Web3 from "web3";
import URL from "shared/functions/getURL";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";

const media_manager_metadata = require("shared/connectors/polygon/contracts/MediaManager.json");

export async function createMediaForPolygon(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        media_manager_metadata.abi,
        config.CONTRACT_ADDRESSES.MEDIA_MANAGER
      );

      const data = {
        creatorAddress: payload.main.CreatorAddress,
        royalty: payload.main.Royalty,
        mediaName: payload.main.MediaName,
        mediaType: payload.main.Type,
        collabsSize: 0,
        ownersSize: 0,
      };

      contract.events.CreateMedia(async (error, event) => {
        if (!error) {
          console.log(event);
          const response = await axios.post(`${URL()}/media/createMedia/p1`, payload);
          resolve(response);
        }
      });
      const gas = await contract.methods
        .createMedia(data, "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB", [])
        .estimateGas({ from: account });
      await contract.methods
        .createMedia(data, "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB", [])
        .send({ from: account, gas: gas });
      console.log("transaction succeed");
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  });
}
