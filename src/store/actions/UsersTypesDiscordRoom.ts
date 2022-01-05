import * as actionTypes from './ActionTypes';

// Set a setUsersDiscordRoom into the global state
export const setterUsersTypesDiscordRoom = (value: any[]) => ({
    type: actionTypes.SET_USERS_TYPES_DISCORD_ROOM,
    value: value
});
