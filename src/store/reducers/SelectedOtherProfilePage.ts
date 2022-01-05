import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedOtherProfilePage'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
    id: number
};

// Set initial state for SelectedProfilePage
const initialState = {
    id: 1,
};

// Set a SelectedOtherProfilePage.ts into the global state
const setSelectedOtherProfilePage = (state: State, action: Action) => {
    return {
        ...state,
        ...{ id: action.id,
        }
    };
};

// Return the SelectedProfilePage state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_OTHER_PROFILE_PAGE: return setSelectedOtherProfilePage(state, action);
        default: return state;
    }
};

export default reducer;
