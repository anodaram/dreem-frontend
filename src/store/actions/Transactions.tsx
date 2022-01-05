import * as actionTypes from './ActionTypes';

export interface TransactionData {
  id: string;
  token: string;
  date: Date;
  action: string;
  type: string;
  value: number;
  fee: number;
  return_v: string;
}

export const createDataTransaction = (
  id: string,
  token: string,
  date: Date,
  action: string,
  type: string,
  value: number,
  fee: number,
  return_v: string
): TransactionData => {
  return {
    id,
    token,
    date,
    action,
    type,
    value,
    fee,
    return_v,
  };
};

// Set all Transactions into the global state
export const setTransactionsList = (transactions: TransactionData[]) => ({
  type: actionTypes.SET_TRANSACTIONS_LIST,
  transactions: transactions,
});
