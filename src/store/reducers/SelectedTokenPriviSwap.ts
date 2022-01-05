import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedTokenPriviSwap'];
interface State extends rootState { }
interface Action extends rootState {
    type: string,
    value: string
}

// Set initial state for SelectedSwapTabsValue
const initialState = {
    value: '',
};

// Set a SelectedTokenPriviSwap into the global state
const setSelectedTokenPriviSwap = (state: State, action: Action) => {
    return {
        ...state,
        ...{ value: action.value,
        }
    };
};

// Return the SelectedTokenPriviSwap state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_TOKEN_PRIVI_SWAP: return setSelectedTokenPriviSwap(state, action);
        default: return state;
    }
};

export default reducer;
