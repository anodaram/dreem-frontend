import * as actionTypes from "./ActionTypes";

// Set a setSlug.ts into the global state
export const setSlug = (slug: string) => ({
  type: actionTypes.SET_UPDATE_SLUG,
  slug: slug,
});
