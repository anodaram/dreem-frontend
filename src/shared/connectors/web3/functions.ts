import Web3 from "web3";

export const ContractInstance = (web3: Web3, abi: any, address: string): any => {
  const contract = new web3.eth.Contract(abi, address);
  return contract;
};
