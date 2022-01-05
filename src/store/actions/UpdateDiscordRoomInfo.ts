import * as actionTypes from './ActionTypes';

// Set a UpdateBasicInfo into the global state
export const setUpdateDiscordRoomInfo = (value: boolean) => ({
  type: actionTypes.SET_UPDATE_DISCORD_ROOM_INFO,
  value: value
});
