import * as actionTypes from "./ActionTypes";

export interface LoanData {
  principal_token: string;
  principal: number;
  collaterals: object;
  CCR: number;
  state: string;
  daily_interest: number;
}

// Set a Loan into the global state
export const setLoan = (
  principal_token: string,
  principal: number,
  collaterals: object,
  CCR: number,
  state: string,
  daily_interest: number
) => ({
  type: actionTypes.SET_LOAN,
  principal_token,
  principal,
  collaterals,
  CCR,
  daily_interest,
  state,
});

// Set all Loan into the global state
export const setAllLoan = (lendings: LoanData[]) => ({
  type: actionTypes.SET_ALL_LOAN,
  lendings: lendings,
});

// Remove a Loan from the global state. Id is token in Loans 1.0
export const removeLoan = (token: string) => ({
  type: actionTypes.REMOVE_LOAN,
  token: token,
});
