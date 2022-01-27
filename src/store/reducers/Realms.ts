import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["realms"];
interface State extends rootState {
  realmsList: any[];
  scrollPositionInRealms: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  realmsList: [],
  scrollPositionInRealms: 0,
};

// Set a SelectedSwapPool into the global state
const setRealmsList = (state: State, action: Action) => {
  return {
    ...state,
    realmsList: action.realmsList,
  };
};

const setScrollPositionInRealms = (state: State, action: Action) => {
  return {
    ...state,
    scrollPositionInRealms: action.scrollPositionInRealms,
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_REALMS_LIST:
      return setRealmsList(state, action);
    case actionTypes.SET_SCROLL_POSITION_IN_REALMS:
      return setScrollPositionInRealms(state, action);
    default:
      return state;
  }
};

export default reducer;
