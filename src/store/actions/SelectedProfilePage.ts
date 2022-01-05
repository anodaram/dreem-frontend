import * as actionTypes from './ActionTypes';

// Set a SelectedProfilePage.ts into the global state
export const setSelectedProfilePage = (id: number) => ({
    type: actionTypes.SET_SELECTED_PROFILE_PAGE,
    id: id
});
