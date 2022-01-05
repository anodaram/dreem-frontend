import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';
import { UserInfo } from '../actions/UsersInfo';

type UsersRootState = RootState['usersInfoList'];
interface UsersState extends UsersRootState {}

// users info State
const initialState: UsersState = [];

// Replace users info, actions will be an array of PriviData
const setUsersInfoList = (state: UsersState, action: any) => {
  //console.log('In Reducer: ', action);
  state = [];
  const users: UserInfo[] = action.users;
  users.forEach((userData) => {
    state.push(userData);
  });
  return state;
};

const updateUsersInfoList = (state: UsersState, action: any) => {
  return state.map((user) => {
    if (user.id === action.data.UserId) {
      return {
        ...user,
        connected: action.data.connected
      };
    }
    return user;
  })
}

// Return the state
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USERS_INFO_LIST:
      return setUsersInfoList(state, action);
    case actionTypes.UPDATE_USER_INFO:
      return updateUsersInfoList(state, action);
    default:
      return state;
  }
};

export default reducer;
