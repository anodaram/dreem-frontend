import * as actionTypes from './ActionTypes';

// Set a UpdateBasicInfo into the global state
export const setUpdateBasicInfo = (value: boolean) => ({
    type: actionTypes.SET_UPDATE_BASIC_INFO,
    value: value
});
