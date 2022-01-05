import * as actionTypes from './ActionTypes';

// Set the Auth selected page into the global state
export const setSelectedAuthPage = (id: number) => ({
    type: actionTypes.SET_SELECTED_AUTH_PAGE,
    id: id
});
