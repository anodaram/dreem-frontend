import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";
import polygon_config from "shared/connectors/polygon/config";
import ethereum_config from "shared/connectors/ethereum/config"; 

// const ethereumMetadata = require("shared/connectors/polygon/contracts/ERC721VaultFactory.json");
const metadata = require("shared/connectors/ethereum/contracts/ERC721VaultFactory.json");

const configMap = {
  1: ethereum_config,
  3: ethereum_config,
  4: ethereum_config,
  137: polygon_config,
  80001: polygon_config
}

// const metadataMap = {
//   1: ethereumMetadata,
//   3: ethereumMetadata,
//   4: ethereumMetadata,
//   137: polygonMetadata,
//   80001: polygonMetadata
// }

export async function mint(web3: Web3, account: string, chainId: number, payload: any): Promise<any> {
    if (metadata[chainId] && configMap[chainId]) {
      return new Promise(async resolve => {
        try {
          const contract = ContractInstance(
            web3,
            metadata.abi,
            polygon_config.CONTRACT_ADDRESSES.ERC721_VAULT_FACTORY
          );
          const gas = await contract.methods
            .mint(payload.name, payload.symbol, payload.token, payload.id, payload.supply, payload.listTokenAddress, payload.listPrice, payload.fee)
            .estimateGas({ from: account });
          const response = await contract.methods
            .mint(payload.name, payload.symbol, payload.token, payload.id, payload.supply, payload.listTokenAddress, payload.listPrice, payload.fee)
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
  }