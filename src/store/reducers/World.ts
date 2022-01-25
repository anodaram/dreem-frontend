import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["world"];
interface State extends rootState {
  selectedTabWorldDetail: string;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  selectedTabWorldDetail: "",
};

const setSelTabWorldDetail = (state: State, action: any) => {
  return {
    ...state,
    selectedTabWorldDetail: action.selectedTabWorldDetail,
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_SELTAB_WORLD_DETAIL:
      return setSelTabWorldDetail(state, action);
    default:
      return state;
  }
};

export default reducer;
