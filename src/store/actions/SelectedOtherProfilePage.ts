import * as actionTypes from './ActionTypes';

// Set a SelectedProfilePage.ts into the global state
export const setSelectedOtherProfilePage = (id: number) => ({
    type: actionTypes.SET_SELECTED_OTHER_PROFILE_PAGE,
    id: id
});
