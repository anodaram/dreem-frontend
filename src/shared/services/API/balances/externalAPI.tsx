import axios from "axios";

// fetch token and balance from covalent
export const getTokenBalanceFromCovalent = async (address: string, chainId: number, isNFT: boolean = false) => {
    try {
      const config = {
        headers: {
          Authorization: "Basic Y2tleV8zYzJkMzZlZGRhYTI0Y2FmYTY0ZDRiYWEyOWI6",
        },
        params: {
          nft: isNFT,
          }
      }
      const response = await axios.get(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`, config)
      return response.data;
    } catch (err) {
      console.log("fetching balance error: " + err.message);
    }
    return [];
};

const chainNameMap = {
    1: 'eth',
    3: 'ropsten',
    4: 'rinkeby',
    137: 'polygon',
    80001: 'mumbai',
}
// fetch nft token and balance from moralis
export const getNFTBalanceFromMoralis = async (address: string, chainId: number) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'TWEH1PU0NfqKyNP57Nr5wuZuTrquVMpUF31SQG43erSrMapsXiA18tbfwsAtyhyM'
        },
      }
      const response = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chainNameMap[chainId]}&order=name.DESC`, config);
      return response.data;
    } catch (err) {
      console.log("fetching balance error: " + err.message);
    }
    return [];
};

// fetch erc20 token balance from moralis
export const getErc20BalanceFromMoralis = async (address: string, chainId: number) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'TWEH1PU0NfqKyNP57Nr5wuZuTrquVMpUF31SQG43erSrMapsXiA18tbfwsAtyhyM'
      },
    }
    const response = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chainNameMap[chainId]}`, config);
    return response.data;
  } catch (err) {
    console.log("fetching balance error: " + err.message);
  }
  return [];
};