import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedAuthPage'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
    id: number
};

// Set initial state (SignIn) for SelectedAuthPage
const initialState = {
    id: 1,
};

// Set a SelectedAuthPage into the global state
const setSelectedAuthPage = (state: State, action: Action) => {
    return {
        ...state,
        ...{ id: action.id,
        }
    };
};

// Return the SelectedAuthPage state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_AUTH_PAGE: return setSelectedAuthPage(state, action);
        default: return state;
    }
};

export default reducer;
