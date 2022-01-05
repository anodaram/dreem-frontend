import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedUser'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
    id: string,
    address: string
};

// Set initial state for SelectedProfilePage
const initialState = {
    id: '0',
    address: ''
};

// Set a SelectedProfilePage into the global state
const setSelectedUser = (state: State, action: Action) => {
    return {
        ...state,
        ...{ id: action.id, address: action.address }
    };
};

// Return the SelectedUser state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_USER: return setSelectedUser(state, action);
        default: return state;
    }
};

export default reducer;
