import * as actionTypes from './ActionTypes';

// Set a Selected User into the global state
export const setSelectDiscordRoom = (value: any) => ({
    type: actionTypes.SET_SELECTED_DISCORD_ROOM,
    value: value
});
