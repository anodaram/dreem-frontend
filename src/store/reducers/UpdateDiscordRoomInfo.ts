import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['updateDiscordRoomInfo'];
interface State extends rootState { }
interface Action extends rootState {
  type: string,
  value: boolean
}

// Set initial state for updateBasicInfo
const initialState = {
  value: false,
};

// Set a UpdateBasicInfo into the global state
const setUpdateDiscordRoomInfo = (state: State, action: Action) => {
  return {
    ...state,
    ...{ value: action.value,
    }
  };
};

// Return the SelectedUser state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_UPDATE_DISCORD_ROOM_INFO: return setUpdateDiscordRoomInfo(state, action);
    default: return state;
  }
};

export default reducer;
