import * as actionTypes from "./ActionTypes";

export const setSelTabContentType = (selTabContentType: string) => ({
  type: actionTypes.SET_SELTAB_CONTENT_TYPE,
  selTabContentType: selTabContentType,
});

export const setSelTabAssetType = (selTabAssetType: string[]) => ({
  type: actionTypes.SET_SELTAB_ASSET_TYPE,
  selTabAssetType: selTabAssetType,
});
