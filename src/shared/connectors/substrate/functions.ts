import { ApiPromise } from "@polkadot/api";
import { ContractPromise, Abi } from "@polkadot/api-contract";

export const ContractInstance = async (
  api: ApiPromise,
  abi: string,
  address: string
): Promise<ContractPromise> => {
  const contract = new ContractPromise(api, AbiInstance(api, abi), address);
  return contract;
};

export const decodeAbiData = (api: any, abi: string, data: any) => {
  const abiIns = AbiInstance(api, abi);
  return abiIns.decodeEvent(data);
};

export const AbiInstance = (api: any, abi: string) => {
  return new Abi(JSON.parse(abi), api.registry.getChainProperties());
};
