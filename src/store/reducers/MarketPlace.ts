import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['marketPlace'];
interface State extends rootState { }
interface Action extends rootState {
    type: string,
    tokenList: any[]
}

// Set initial state for SelectedSwapTabsValue
const initialState = {
    tokenList: [],
};

// Set a SelectedSwapPool into the global state
const setTokenList = (state: State, action: Action) => {
    return {
        ...state,
        ...{ tokenList: action.tokenList,
        }
    };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_TOKEN_LIST: return setTokenList(state, action);
        default: return state;
    }
};

export default reducer;
