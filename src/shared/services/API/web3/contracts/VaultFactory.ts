import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import { erc20ToWeiUnit } from "shared/constants/constants";

const vaultFactory = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ERC721_VAULT_FACTORY;
  const metadata = require("shared/connectors/web3/contracts/ERC721VaultFactory.json");

  const mint = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(
          web3,
          metadata.abi,
          await web3.utils.toChecksumAddress(contractAddress)
        );
        const listTokenWeiUnit = erc20ToWeiUnit[payload.listToken] ?? 'ether';
        const gas = await contract.methods
          .mint(payload.name, payload.symbol, payload.token, payload.id, await web3.utils.toWei(payload.supply.toString(), 'ether'), 
          payload.asset, await web3.utils.toWei(payload.listPrice.toString(), listTokenWeiUnit), payload.fee*10).estimateGas({ from: account });
        const response = await contract.methods
          .mint(payload.name, payload.symbol, payload.token, payload.id, await web3.utils.toWei(payload.supply.toString(), 'ether'), 
          payload.asset, await web3.utils.toWei(payload.listPrice.toString(), listTokenWeiUnit), payload.fee*10).send({ from: account, gas: gas, type: "0x2" });
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
  };
  return { mint };
};
export default vaultFactory;
