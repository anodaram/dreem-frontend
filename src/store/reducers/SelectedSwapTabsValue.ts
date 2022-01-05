import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedSwapTabsValue'];
interface State extends rootState { }
interface Action extends rootState {
    type: string,
    id: number
}

// Set initial state for SelectedSwapTabPool
const initialState = {
    id: 0,
};

// Set a SelectedSwapTabsValue into the global state
const setSelectedSwapTabsValue = (state: State, action: Action) => {
    return {
        ...state,
        ...{ id: action.id,
        }
    };
};

// Return the SelectedProfilePage state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_SWAP_TABS_VALUE: return setSelectedSwapTabsValue(state, action);
        default: return state;
    }
};

export default reducer;
