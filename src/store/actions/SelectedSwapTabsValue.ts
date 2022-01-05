import * as actionTypes from './ActionTypes';

// Set a SelectedSwapTabsValue.ts into the global state
export const setSelectedSwapTabsValue = (id: number) => ({
    type: actionTypes.SET_SELECTED_SWAP_TABS_VALUE,
    id: id
});
