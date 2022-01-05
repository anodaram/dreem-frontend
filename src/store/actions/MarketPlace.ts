import * as actionTypes from './ActionTypes';

export const setTokenList = (tokenList: any[]) => ({
    type: actionTypes.SET_TOKEN_LIST,
    tokenList: tokenList
});
