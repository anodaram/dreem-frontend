import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';
import { TransactionData } from '../actions/Transactions';

type TransactionRootState = RootState['transactions'];
interface TransactionState extends TransactionRootState {}

// Transactions State
const initialState: TransactionState = [];

// Replace transactions, actions will be an array of PriviData
const setTransactionsList = (state: TransactionState, action: any) => {
  //console.log('In Reducer: ', action);
  state = [];
  const transactions: TransactionData[] = action.transactions;
  transactions.forEach((transactionData) => {
    state.push(transactionData);
  });
  return state;
};

// Return the state
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_TRANSACTIONS_LIST:
      return setTransactionsList(state, action);
    default:
      return state;
  }
};

export default reducer;
