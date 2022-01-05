import * as actionTypes from './ActionTypes';

// Set a SelectedSwapTabsValue.ts into the global state
export const setSelectedProtectionOptionsSwap = (id: number) => ({
    type: actionTypes.SET_SELECTED_PROTECTION_OPTIONS_SWAP,
    id: id
});
