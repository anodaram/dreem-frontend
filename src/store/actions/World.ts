import * as actionTypes from "./ActionTypes";

export const setSelTabWorldDetail = (selectedTab: string) => ({
  type: actionTypes.SET_SELTAB_WORLD_DETAIL,
  selectedTabWorldDetail: selectedTab,
});
