import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedMenuPriviSwap'];
interface State extends rootState { }
interface Action extends rootState {
    type: string,
    id: number
}

// Set initial state for SelectedMenuPriviSwap
const initialState = {
    id: 1,
};

// Set a SelectedMenuPriviSwap into the global state
const setSelectedMenuPriviSwap = (state: State, action: Action) => {
    return {
        ...state,
        ...{ id: action.id,
        }
    };
};

// Return the SelectedProfilePage state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_MENU_PRIVI_SWAP: return setSelectedMenuPriviSwap(state, action);
        default: return state;
    }
};

export default reducer;
