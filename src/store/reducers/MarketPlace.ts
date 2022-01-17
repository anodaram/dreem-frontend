import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["marketPlace"];
interface State extends rootState {
  tokenList: any[];
  fee: number;
  selectedTab: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  tokenList: [],
  fee: 0,
  selectedTab: 0,
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

const setSelTabMarket = (state: State, action: any) => {
  return {
    ...state,
    selectedTab: action.selectedTab,
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_TOKEN_LIST:
      return setTokenList(state, action);
    case actionTypes.SET_MARKET_FEE:
      return setMarketFee(state, action);
    case actionTypes.SET_SELTAB_MARKET:
      return setSelTabMarket(state, action);
    default:
      return state;
  }
};

export default reducer;
