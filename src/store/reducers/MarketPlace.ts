import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["marketPlace"];
interface State extends rootState {
  collectionNFTList: any[];
  tokenList: any[];
  fee: number;
  selectedTabMarketMain: string;
  selectedTabMarketManageNFTMain: string;
  selectedTabMarketManageNFTSub: number;
  scrollPosition: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  collectionNFTList: [],
  tokenList: [],
  fee: 0,
  selectedTabMarketMain: "",
  selectedTabMarketManageNFTMain: "",
  selectedTabMarketManageNFTSub: 0,
  scrollPosition: 0,
};

// Set a SelectedSwapPool into the global state
const setTokenList = (state: State, action: Action) => {
  return {
    ...state,
    ...{ tokenList: action.tokenList },
  };
};

const setMarketFee = (state: State, action: any) => {
  return {
    ...state,
    fee: action.fee,
  };
};

const setSelTabMarketMain = (state: State, action: any) => {
  return {
    ...state,
    selectedTabMarketMain: action.selectedTabMarketMain,
  };
};

const setSelTabMarketManageNFTMain = (state: State, action: any) => {
  return {
    ...state,
    selectedTabMarketManageNFTMain: action.selectedTabMarketManageNFTMain,
  };
};

const setSelTabMarketManageNFTSub = (state: State, action: any) => {
  return {
    ...state,
    selectedTabMarketManageNFTSub: action.selectedTabMarketManageNFTSub,
  };
};

const setCollectionNFTList = (state: State, action: Action) => {
  return {
    ...state,
    collectionNFTList: action.collectionNFTList,
  };
};

const setScrollPosition = (state: State, action: Action) => {
  return {
    ...state,
    scrollPosition: action.scrollPosition,
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_TOKEN_LIST:
      return setTokenList(state, action);
    case actionTypes.SET_MARKET_FEE:
      return setMarketFee(state, action);
    case actionTypes.SET_SELTAB_MARKET_MAIN:
      return setSelTabMarketMain(state, action);
    case actionTypes.SET_SELTAB_MARKET_MANAGE_NFT_MAIN:
      return setSelTabMarketManageNFTMain(state, action);
    case actionTypes.SET_SELTAB_MARKET_MANAGE_NFT_SUB:
      return setSelTabMarketManageNFTSub(state, action);
    case actionTypes.SET_COLLECTION_NFT_LIST:
      return setCollectionNFTList(state, action);
    case actionTypes.SET_SCROLL_POSITION:
      return setScrollPosition(state, action);
    default:
      return state;
  }
};

export default reducer;
