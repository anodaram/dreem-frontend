import * as actionTypes from './ActionTypes';

// Set a SelectedProfilePage.ts into the global state
export const setSelectedMenuPriviSwap = (id: number) => ({
    type: actionTypes.SET_SELECTED_MENU_PRIVI_SWAP,
    id: id
});
