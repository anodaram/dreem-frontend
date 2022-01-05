import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedDiscordRoom'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
    value: any
};

// Set initial state for SelectedProfilePage
const initialState = {
    value: {},
};

// Set a SelectedProfilePage into the global state
const setSelectedDiscordRoom = (state: State, action: Action) => {
    return {
        ...state,
        ...{ value: action.value,
        }
    };
};

// Return the SelectedDiscordRoom state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_DISCORD_ROOM: return setSelectedDiscordRoom(state, action);
        default: return state;
    }
};

export default reducer;
