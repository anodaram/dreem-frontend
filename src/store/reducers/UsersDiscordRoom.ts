import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['usersDiscordRoom'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
    value: any
};

// Set initial state for SelectedProfilePage
const initialState = {
    value: {},
};

// Set a UsersDiscordRoom into the global state
const setUsersDiscordRoom = (state: State, action: Action) => {
    return {
        ...state,
        ...{ value: action.value,
        }
    };
};

// Return the UsersDiscordRoom state
const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_USERS_DISCORD_ROOM: return setUsersDiscordRoom(state, action);
        default: return state;
    }
};

export default reducer;
