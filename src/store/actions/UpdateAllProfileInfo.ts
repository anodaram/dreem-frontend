import * as actionTypes from './ActionTypes';

// Set a UpdateAllProfileInfo into the global state
export const setUpdateAllProfileInfo = (value: boolean) => ({
    type: actionTypes.SET_UPDATE_ALL_PROFILE_INFO,
    value: value
});