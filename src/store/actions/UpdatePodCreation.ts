import * as actionTypes from './ActionTypes';

// Set a UpdateBasicInfo into the global state
export const setUpdatePodCreation = (value: boolean) => ({
    type: actionTypes.SET_UPDATE_POD_CREATION,
    value: value
});
