import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["marketPlace"];
interface State extends rootState {}
interface Action extends rootState {
  type: string;
  tokenList: any[];
  fee: number;
}

// Set initial state for SelectedSwapTabsValue
const initialState = {
  tokenList: [],
  fee: 0,
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

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_TOKEN_LIST:
      return setTokenList(state, action);
    case actionTypes.SET_MARKET_FEE:
      return setMarketFee(state, action);
    default:
      return state;
  }
};

export default reducer;
