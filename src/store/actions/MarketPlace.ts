import * as actionTypes from "./ActionTypes";

export const setTokenList = (tokenList: any[]) => ({
  type: actionTypes.SET_TOKEN_LIST,
  tokenList: tokenList,
});

export const setMarketFee = (fee: any) => ({
  type: actionTypes.SET_MARKET_FEE,
  fee,
});

export const setSelTabMarketMain = (selectedTab: string) => ({
  type: actionTypes.SET_SELTAB_MARKET_MAIN,
  selectedTabMarketMain: selectedTab,
});

export const setSelTabMarketManageNFTMain = (selectedTab: string) => ({
  type: actionTypes.SET_SELTAB_MARKET_MANAGE_NFT_MAIN,
  selectedTabMarketManageNFTMain: selectedTab,
});

export const setSelTabMarketManageNFTSub = (selectedTab: number) => ({
  type: actionTypes.SET_SELTAB_MARKET_MANAGE_NFT_SUB,
  selectedTabMarketManageNFTSub: selectedTab,
});

export const setCollectionNFTList = (collectionNFTList: any[]) => ({
  type: actionTypes.SET_COLLECTION_NFT_LIST,
  collectionNFTList: collectionNFTList,
});

export const setAllNFTList = (allNFTList: any[]) => ({
  type: actionTypes.SET_ALL_NFT_LIST,
  allNFTList: allNFTList,
});

export const setScrollPositionInCollection = (scrollPositionInCollection: number) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_COLLECTION,
  scrollPositionInCollection: scrollPositionInCollection,
});

export const setScrollPositionInAllNFT = (scrollPositionInAllNFT: number) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_ALL_NFT,
  scrollPositionInAllNFT: scrollPositionInAllNFT,
});
