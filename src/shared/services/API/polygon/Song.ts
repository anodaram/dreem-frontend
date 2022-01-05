import axios from "axios";
import Web3 from "web3";
import URL from "shared/functions/getURL";
import PolygonAPI from "shared/services/API/polygon";
import PolygonConfig from "shared/connectors/polygon/config";
import { ContractInstance } from "shared/connectors/polygon/functions";

const songs_metadata = require("shared/connectors/polygon/contracts/Song.json");

export async function spawnBop(web3: Web3, account: string, data: any) {
  return new Promise(async resolve => {
    try {
      const { token, amount, songAddress } = data;

      const contract = ContractInstance(web3, songs_metadata.abi, songAddress);

      const approveRes1: any = await PolygonAPI.Trax.approve(web3, account, token, songAddress);

      const approveRes2: any = await PolygonAPI.Trax.approve(web3, account, "TRAX", songAddress);

      if (!approveRes1.success || !approveRes2.success) {
        resolve({ success: false });
      }

      const decimals = await PolygonAPI.Trax.decimals(web3, token);
      const weiAmount = amount * Math.pow(10, decimals);

      const gas = await contract.methods
        .spawnBop(PolygonConfig.TOKEN_ADDRESSES[token], weiAmount, 0)
        .estimateGas({
          from: account,
        });
      await contract.methods.spawnBop(PolygonConfig.TOKEN_ADDRESSES[token], weiAmount, 0).send({
        from: account,
        gas: gas,
      });

      resolve({ success: true });
    } catch (e) {
      console.error(e);
      resolve({ success: false });
    }
  });
}
