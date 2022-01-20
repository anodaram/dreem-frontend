import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["marketPlace"];
interface State extends rootState {
  tokenList: any[];
  fee: number;
  selectedTabMarketMain: number | string;
  selectedTabMarketManageNFTMain: number | string;
  selectedTabMarketManageNFTSub: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  tokenList: [],
  fee: 0,
  selectedTabMarketMain: 0 || "",
  selectedTabMarketManageNFTMain: 0 || "",
  selectedTabMarketManageNFTSub: 0,
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
    default:
      return state;
  }
};

export default reducer;
