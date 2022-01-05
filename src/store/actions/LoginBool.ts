import * as actionTypes from './ActionTypes';

// Set a SelectedProfilePage.ts into the global state
export const setLoginBool = (bool: boolean) => ({
    type: actionTypes.SET_LOGIN_BOOL,
    bool: bool
});