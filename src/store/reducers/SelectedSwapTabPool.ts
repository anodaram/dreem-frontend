import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedSwapTabPool'];
interface State extends rootState { }
interface Action extends rootState {
    type: string,
    id: number
}

// Set initial state for SelectedSwapTabsValue
const initialState = {
    id: 0,
};

// Set a SelectedSwapPool into the global state
const setSelectedSwapTabPool = (state: State, action: Action) => {
    return {
        ...state,
        ...{ id: action.id,
        }
    };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_SWAP_TAB_POOL: return setSelectedSwapTabPool(state, action);
        default: return state;
    }
};

export default reducer;