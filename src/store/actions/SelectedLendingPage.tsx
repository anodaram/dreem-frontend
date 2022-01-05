import * as actionTypes from './ActionTypes';

// Set a SelectedProfilePage.ts into the global state
export const setSelectedLendingPage = (id: number) => ({
    type: actionTypes.SET_SELECTED_LENDING_PAGE,
    id: id
});
