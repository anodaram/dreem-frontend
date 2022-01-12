import * as actionTypes from './ActionTypes';

export const setTokenList = (tokenList: any[]) => ({
    type: actionTypes.SET_TOKEN_LIST,
    tokenList: tokenList
});

export const setMarketFee = (fee: any) => ({
    type: actionTypes.SET_MARKET_FEE,
    fee
});