import * as actionTypes from './ActionTypes';

// Set a setSideBarShow.ts into the global state
export const setSideBarShow = (bool: boolean) => ({
    type: actionTypes.SET_SIDE_BAR_SHOW,
    bool: bool
});
