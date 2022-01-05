import * as actionTypes from './ActionTypes';

// Set a setUsersDiscordRoom into the global state
export const setterUsersDiscordRoom = (value: any) => ({
    type: actionTypes.SET_USERS_DISCORD_ROOM,
    value: value
});
