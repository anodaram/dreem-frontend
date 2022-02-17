import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["explore"];
interface State extends rootState {
  selTabContentType: string;
  selTabAssetType: string[];
  dreemList: any[];
  scrollPositionInExplore: number;
}
interface Action extends rootState {
  type: string;
}

const initialState: State = {
  selTabContentType: "",
  selTabAssetType: [],
  dreemList: [],
  scrollPositionInExplore: 0,
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

const setDreemList = (state: State, action: Action) => {
  return {
    ...state,
    dreemList: action.dreemList,
  };
};

const setScrollPositionInExplore = (state: State, action: Action) => {
  return {
    ...state,
    scrollPositionInExplore: action.scrollPositionInExplore,
  };
};

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_SELTAB_CONTENT_TYPE:
      return setSelTabContentType(state, action);
    case actionTypes.SET_SELTAB_ASSET_TYPE:
      return setSelTabAssetType(state, action);
    case actionTypes.SET_DREEM_LIST:
      return setDreemList(state, action);
    case actionTypes.SET_SCROLL_POSITION_IN_EXPLORE:
      return setScrollPositionInExplore(state, action);
    default:
      return state;
  }
};

export default reducer;
