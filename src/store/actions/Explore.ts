import * as actionTypes from "./ActionTypes";

export const setSelTabContentType = (selTabContentType: string) => ({
  type: actionTypes.SET_SELTAB_CONTENT_TYPE,
  selTabContentType: selTabContentType,
});

export const setSelTabAssetType = (selTabAssetType: string[]) => ({
  type: actionTypes.SET_SELTAB_ASSET_TYPE,
  selTabAssetType: selTabAssetType,
});

export const setDreemList = (dreemList: any[]) => ({
  type: actionTypes.SET_DREEM_LIST,
  dreemList: dreemList,
});

export const setScrollPositionInExplore = (scrollPositionInExplore: number) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_EXPLORE,
  scrollPositionInExplore: scrollPositionInExplore,
});
