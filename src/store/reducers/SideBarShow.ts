import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['sideBarShow'];
interface State extends rootState {}
interface Action extends rootState {
    type: string,
    bool: boolean
}

// Set initial state for SelectedProfilePage
const initialState = {
    bool: true,
};

const setSideBarShow = (state: State, action: Action) => {
    return {
        ...state,
        ...{ bool: action.bool,
        }
    };
};

// Return the SelectedProfilePage state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SIDE_BAR_SHOW: return setSideBarShow(state, action);
        default: return state;
    }
};

export default reducer;
