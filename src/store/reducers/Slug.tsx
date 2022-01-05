import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["slug"];
interface State extends rootState {}
interface Action extends rootState {
  type: string;
  slug: string;
}

// Set initial state for SelectedProfilePage
const initialState = {
  slug: "",
};

const setSlug = (state: State, action: Action) => {
  //console.log(action.slug);
  return {
    ...state,
    ...{ slug: action.slug },
  };
};

// Return the SelectedProfilePage state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_UPDATE_SLUG:
      return setSlug(state, action);
    default:
      return state;
  }
};

export default reducer;
