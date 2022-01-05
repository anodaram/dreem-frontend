import * as actionTypes from './ActionTypes';

export interface BalanceModel {
    "Token": string,
    "Type": string,
    "InitialBalance": number,
    "Balance": number,
    "AmountPerSecond": number,
    "Debt": number,
    "NextUpdate": number,
    "LastUpdate": number
}


export const setBalances = (tokenBalances: { [key: string]: BalanceModel }
) => ({
    type: actionTypes.SET_USER_BALANCES,
    value: tokenBalances
});

export const setBalance = (obj: BalanceModel) => ({
    type: actionTypes.SET_USER_BALANCE,
    value: obj,
});
