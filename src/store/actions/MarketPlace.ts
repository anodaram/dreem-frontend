import * as actionTypes from "./ActionTypes";

export const setTokenList = (tokenList: any[]) => ({
  type: actionTypes.SET_TOKEN_LIST,
  tokenList: tokenList,
});

export const setMarketFee = (fee: any) => ({
  type: actionTypes.SET_MARKET_FEE,
  fee,
});

export const setSelTabMarket = (selectedTab: number) => ({
  type: actionTypes.SET_SELTAB_MARKET,
  selectedTab,
});
