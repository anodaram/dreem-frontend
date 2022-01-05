import * as actionTypes from './ActionTypes';

// Set a Selected User into the global state
export const setSelectedUser = (id: string, address?: string) => ({
    type: actionTypes.SET_SELECTED_USER,
    id: id,
    address: address || ''
})
