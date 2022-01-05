import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedLendingPage'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
    id: number
};

// Set initial state for SelectedLendingPage
const initialState = {
    id: 1,
};

// Set a SelectedLendingPage into the global state
const setSelectedLendingPage = (state: State, action: Action) => {
    return {
        ...state,
        ...{ id: action.id,
        }
    };
};

// Return the SelectedLendingPage state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_LENDING_PAGE: return setSelectedLendingPage(state, action);
        default: return state;
    }
};

export default reducer;
