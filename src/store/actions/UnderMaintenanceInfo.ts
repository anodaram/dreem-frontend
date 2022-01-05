import * as actionTypes from "./ActionTypes";

// Set a setUnderMaintenanceInfo.ts into the global state
export const setUnderMaintenanceInfo = (info: any) => ({
  type: actionTypes.SET_UNDER_MAINTENANCE_INFO,
  info: info,
});

export const setPublicy = (publicy: boolean) => ({
  type: actionTypes.SET_PUBLICY,
  publicy: publicy,
});
