import * as actionTypes from './ActionTypes';

// Set a SelectedLiquidityPoolPriviSwap.ts into the global state
export const setSelectedTokenPriviSwap = (value: string) => ({
    type: actionTypes.SET_SELECTED_TOKEN_PRIVI_SWAP,
    value: value
});
