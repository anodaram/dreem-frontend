import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import VaultFactory from "shared/contracts/ERC721VaultFactory.json";

const RINKEBY_TEST_NET_ID = "4";

export async function mint(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        VaultFactory.abi,
        VaultFactory.networks[RINKEBY_TEST_NET_ID].address
      );
      const gas = await contract.methods
        .mint(payload.name, payload.symbol, payload.token, payload.id, payload.supply, payload.listPrice, payload.fee)
        .estimateGas({ from: account });
      const response = await contract.methods
        .mint(payload.name, payload.symbol, payload.token, payload.id, payload.supply, payload.listPrice, payload.fee)
        .send({ from: account, gas: gas });

      const erc20VaultTokenAddress = response?.events?.Mint?.returnValues?.vault;
      const vaultId = response?.events?.Mint?.returnValues?.vaultId;
      const erc721VaultTokenAddress = response?.events?.["0"]?.address;
      const retData = {
        erc20VaultTokenAddress,
        vaultId,
        erc721VaultTokenAddress
      }
      resolve({success: true, data: retData});
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}
