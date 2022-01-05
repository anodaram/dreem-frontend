import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['loginBool'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
    bool: boolean
};

// Set initial state for SelectedLendingPage
const initialState = {
    bool: false,
};

// Set a SelectedLendingPage into the global state
const setLoginBool = (state: State, action: Action) => {
    return {
        ...state,
        ...{ bool: action.bool,
        }
    };
};

// Return the setLoginBool state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_LOGIN_BOOL: return setLoginBool(state, action);
        default: return state;
    }
};

export default reducer;
