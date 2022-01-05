import axios from "axios";
import Web3 from "web3";
import URL from "shared/functions/getURL";
import PolygonAPI from "shared/services/API/polygon";
import PolygonConfig from "shared/connectors/polygon/config";
import { ContractInstance } from "shared/connectors/polygon/functions";

const songs_manager_metadata = require("shared/connectors/polygon/contracts/SongsManager.json");

export async function registerSong(web3: Web3, account: string, song: any) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        songs_manager_metadata.abi,
        PolygonConfig.CONTRACT_ADDRESSES.SONGS_MANAGER
      );

      const genre = song.genres;
      const artists = (song.artists && song.artists.map(item => web3.utils.keccak256(item.name))) || [];

      const approveRes: any = await PolygonAPI.Trax.approve(
        web3,
        account,
        "TRAX", //WIP: test case
        PolygonConfig.CONTRACT_ADDRESSES.SONGS_MANAGER
      );

      if (!approveRes.success) {
        resolve({ success: false });
      }

      const gas = await contract.methods.registerSong("test", genre, artists).estimateGas({
        from: account,
      });
      const response = await contract.methods.registerSong("test", genre, artists).send({
        from: account,
        gas: gas,
      });

      const { song: songAddress, songId, artistsPool, stakePool } = response.events.RegisterSong.returnValues;

      resolve({
        success: true,
        data: {
          songAddress,
          songId,
          artistsPool,
          stakePool,
        },
      });
    } catch (e) {
      console.error(e);
      resolve({ success: false });
    }
  });
}
