import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["explore"];
interface State extends rootState {
  selTabContentType: string;
  selTabAssetType: string[];
}
interface Action extends rootState {
  type: string;
}

const initialState: State = {
  selTabContentType: "",
  selTabAssetType: [],
};

const setSelTabContentType = (state: State, action: Action) => {
  return {
    ...state,
    selTabContentType: action.selTabContentType,
  };
};

const setSelTabAssetType = (state: State, action: Action) => {
  return {
    ...state,
    selTabAssetType: action.selTabAssetType,
  };
};

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_SELTAB_CONTENT_TYPE:
      return setSelTabContentType(state, action);
    case actionTypes.SET_SELTAB_ASSET_TYPE:
      return setSelTabAssetType(state, action);
    default:
      return state;
  }
};

export default reducer;
