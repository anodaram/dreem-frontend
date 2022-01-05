import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";
import { PriviData } from "../actions/PriviLending";

type PriviRootState = RootState["priviLending"];
interface PriviState extends PriviRootState { }
interface PriviAction extends PriviData {
  type: string;
}

// Privi Credit State
const initialState: PriviState = new Map([]);

// Set a Lending into the global state
const setPriviLending = (state: PriviState, action: PriviAction) => {
  var priviObj: any = action;
  delete priviObj.type; // dont need type property
  state.set(priviObj.id, priviObj);
  return state;
};

// Replace Privi Lendings, actions will be an array of PriviData
const setAllPriviLending = (state: PriviState, action: any) => {
  state = new Map([]);
  const lendings: PriviData[] = action.lendings;
  lendings.forEach((priviData) => {
    state.set(priviData.id, priviData);
  });
  return state;
};

// Delete a Privi Lending from the state
const removePriviLending = (state: PriviState, action: PriviAction) => {
  state.delete(action.id);
  return state;
};

// Return the SelectedLendingPage state
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_PRIVI_LENDING:
      return setPriviLending(state, action);
    case actionTypes.SET_ALL_PRIVI_LENDING:
      return setAllPriviLending(state, action);
    case actionTypes.REMOVE_PRIVI_LENDING:
      return removePriviLending(state, action);
    default:
      return state;
  }
};

export default reducer;
