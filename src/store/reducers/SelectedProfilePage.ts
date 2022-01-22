import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["selectedProfilePage"];
interface State extends rootState {
  id: number;
  selectedTabProfile: string;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedProfilePage
const initialState = {
  id: 1,
  selectedTabProfile: "",
};

// Set a SelectedProfilePage into the global state
const setSelectedProfilePage = (state: State, action: Action) => {
  return {
    ...state,
    ...{ id: action.id },
  };
};

const setSelTabProfile = (state: State, action: any) => {
  return {
    ...state,
    selectedTabProfile: action.selectedTabProfile,
  };
};

// Return the SelectedProfilePage state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_SELECTED_PROFILE_PAGE:
      return setSelectedProfilePage(state, action);
    case actionTypes.SET_SELTAB_PROFILE:
      return setSelTabProfile(state, action);
    default:
      return state;
  }
};

export default reducer;
