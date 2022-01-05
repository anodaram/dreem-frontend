import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';
import { LoanData } from '../actions/Loan';

type LoanRootState = RootState['loan'];
interface LoanState extends LoanRootState {}
interface LoanAction extends LoanData {
  type: string;
}

// Privi Credit State
const initialState: LoanState = new Map([]);

// Set a Lending into the global state
const setLoan = (state: LoanState, action: LoanAction) => {
  var loanObj: any = action;
  delete loanObj.type; // dont need type property
  state.set(loanObj.principal_token, loanObj);
  // console.log("ReduxState:", state);
  return state;
};

// Replace all loans, actions should be an array of LoanData
const setAllLoan = (state: LoanState, action: any) => {
  //console.log('In Reducer: ', action);
  state = new Map([]);
  const lendings: LoanData[] = action.lendings;
  lendings.forEach((loanData) => {
    state.set(loanData.principal_token, loanData);
  });
  return state;
};

// Delete a Loan from the state
const removeLoan = (state: LoanState, action: LoanAction) => {
  state.delete(action.principal_token);
  return state;
};

// Return the SelectedLendingPage state
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_ALL_LOAN:
      return setAllLoan(state, action);
    case actionTypes.SET_LOAN:
      return setLoan(state, action);
    case actionTypes.REMOVE_LOAN:
      return removeLoan(state, action);
    default:
      return state;
  }
};

export default reducer;
