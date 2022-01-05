import * as actionTypes from './ActionTypes';

// Set a SelectedSwapTabsValue.ts into the global state
export const setSelectedSwapTabPool = (id: number) => ({
    type: actionTypes.SET_SELECTED_SWAP_TAB_POOL,
    id: id
});
