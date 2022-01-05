import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedLiquidityPoolPriviSwap'];
interface State extends rootState { }
interface Action extends rootState {
    type: string,
    value: string
}

// Set initial state for SelectedSwapTabsValue
const initialState = {
    value: '',
};

// Set a SelectedSwapPool into the global state
const setSelectedLiquidityPoolPriviSwap = (state: State, action: Action) => {
    return {
        ...state,
        ...{ value: action.value,
        }
    };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_LIQUIDITY_POOL_PRIVI_SWAP: return setSelectedLiquidityPoolPriviSwap(state, action);
        default: return state;
    }
};

export default reducer;
