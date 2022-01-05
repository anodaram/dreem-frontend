import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['usersTypesDiscordRoom'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
    value: any[]
};

// Set initial state for SelectedProfilePage
const initialState = {
    value: [],
};

// Set a UsersTypesDiscordRoom into the global state
const setUsersTypesDiscordRoom = (state: State, action: Action) => {
    return {
        ...state,
        ...{ value: action.value,
        }
    };
};

// Return the UsersTypesDiscordRoom state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_USERS_TYPES_DISCORD_ROOM: return setUsersTypesDiscordRoom(state, action);
        default: return state;
    }
};

export default reducer;
