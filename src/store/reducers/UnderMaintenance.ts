import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

type rootState = RootState["underMaintenanceInfo"];
interface State extends rootState {}
interface Action extends rootState {
  type: string;
  info: any;
  publicy: boolean;
}

// Set initial state for SelectedLendingPage
const initialState = {
  info: {},
  publicy: false,
};

// Set a UnderMaintenanceInfo into the global state
const setUnderMaintenanceInfo = (state: State, action: Action) => {
  return {
    ...state,
    info: action.info,
  };
};

// Set a UnderMaintenanceInfo into the global state
const setPublicy = (state: State, action: Action) => {
  return {
    ...state,
    publicy: action.publicy,
  };
};

// Return the setUnderMaintenanceInfo state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_UNDER_MAINTENANCE_INFO:
      return setUnderMaintenanceInfo(state, action);
    case actionTypes.SET_PUBLICY:
      return setPublicy(state, action);
    default:
      return state;
  }
};

export default reducer;
