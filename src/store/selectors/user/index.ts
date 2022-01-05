import {RootState} from "../../reducers/Reducer";

export const getUser = (store: RootState) => store.user;
export const getSelectedUser = (store: RootState) => store.selectedUser;
export const getUpdateBasicInfo = (store: RootState) => store.updateBasicInfo;
export const getUpdateAllProfileInfo = (store: RootState) => store.updateAllProfileInfo.value;
export const getUsersInfoList = (store: RootState) => store.usersInfoList;
export const getMessageBox = (store: RootState) => store.messageBox;
