import * as actionTypes from './ActionTypes';

// Set a SelectedLiquidityPoolPriviSwap.ts into the global state
export const setSelectedLiquidityPoolPriviSwap = (value: string) => ({
    type: actionTypes.SET_SELECTED_LIQUIDITY_POOL_PRIVI_SWAP,
    value: value
});
