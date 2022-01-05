import axios from "axios";
import Web3 from "web3";
import URL from "shared/functions/getURL";
import PolygonAPI from "shared/services/API/polygon";
import PolygonConfig from "shared/connectors/polygon/config";
import { ContractInstance } from "shared/connectors/polygon/functions";

const yield_metadata = require("shared/connectors/polygon/contracts/Yield.json");

export async function mintShares(web3: Web3, account: string, payload: any) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(web3, yield_metadata.abi, PolygonConfig.CONTRACT_ADDRESSES.YIELD);

      const { to, bucket, amountOutShares } = payload;

      const bucketId = parseInt(bucket.match(/\d+/)[0]);

      const approveRes: any = await PolygonAPI.Trax.approve(
        web3,
        account,
        "TRAX", //WIP: test case
        PolygonConfig.CONTRACT_ADDRESSES.YIELD
      );

      if (!approveRes.success) {
        resolve({ success: false });
      }

      const gas = await contract.methods.mintShares(to, bucketId, amountOutShares).estimateGas({
        from: account,
      });
      const response = await contract.methods.mintShares(to, bucketId, amountOutShares).send({
        from: account,
        gas: gas,
      });

      const { amountShares, amountToken } = response.events.Mint.returnValues;

      await axios.post(`${URL()}/musicDao/highYield/buyShares`, {
        payload: {
          to,
          bucket,
          amount: parseInt(web3.utils.fromWei(amountToken)),
        },
      });

      resolve({ success: true });
    } catch (e) {
      console.error(e);
      resolve({ success: false });
    }
  });
}
