import * as actionTypes from "./ActionTypes";

export const setRealmsList = (realmsList: any[]) => ({
  type: actionTypes.SET_REALMS_LIST,
  realmsList: realmsList,
});

export const setScrollPositionInRealms = (scrollPositionInRealms: number) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_REALMS,
  scrollPositionInRealms: scrollPositionInRealms,
});
