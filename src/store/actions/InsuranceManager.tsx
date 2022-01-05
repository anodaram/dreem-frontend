import * as actionTypes from './ActionTypes';

export const setTrendingPoolsList = (list: any[]) => ({
  type: actionTypes.SET_TRENDING_POOLS_LIST,
  list: list,
});

export const setPoolsList = (list: any[]) => ({
  type: actionTypes.SET_POOLS_LIST,
  list: list,
});

export const setTrendingPoolsLoading = (bool: boolean) => ({
  type: actionTypes.SET_TRENDING_POOLS_LOADING,
  bool: bool,
});

export const setPoolsLoading = (bool: boolean) => ({
  type: actionTypes.SET_POOLS_LOADING,
  bool: bool,
});
