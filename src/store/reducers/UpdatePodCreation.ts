import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['updatePodCreation'];
interface State extends rootState { }
interface Action extends rootState {
    type: string,
    value: boolean
}

// Set initial state for updateBasicInfo
const initialState = {
    value: false,
};

// Set a setUpdatePodCreation into the global state
const setUpdatePodCreation = (state: State, action: Action) => {
    return {
        ...state,
        ...{ value: action.value,
        }
    };
};

// Return the UpdatePodCreation state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_UPDATE_POD_CREATION: return setUpdatePodCreation(state, action);
        default: return state;
    }
};

export default reducer;
