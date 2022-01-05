import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

const initialStateList = {
  list: [],
};
const initialStateLoading = {
  bool: false,
};
const initialStatePool = {
  pool: {},
};

//TRENDING POOLS LIST
type rootStateTrendingPoolsList = RootState['trendingPoolsList'];
interface StateTrendingPoolsList extends rootStateTrendingPoolsList {}
interface ActionTrendingPoolsList extends rootStateTrendingPoolsList {
  type: string;
  list: any[];
}
const setTrendingPoolsList = (
  state: StateTrendingPoolsList,
  action: ActionTrendingPoolsList
) => {
  return {
    ...state,
    ...{ list: action.list },
  };
};
const reducerTrendingPoolsList = (
  state = initialStateList,
  action: ActionTrendingPoolsList
) => {
  switch (action.type) {
    case actionTypes.SET_TRENDING_POOLS_LIST:
      return setTrendingPoolsList(state, action);
    default:
      return state;
  }
};

//POOLS LIST
type rootStatePoolsList = RootState['poolsList'];
interface StatePoolsList extends rootStatePoolsList {}
interface ActionPoolsList extends rootStatePoolsList {
  type: string;
  list: any[];
}
const setPoolsList = (state: StatePoolsList, action: ActionPoolsList) => {
  return {
    ...state,
    ...{ list: action.list },
  };
};
const reducerPoolsList = (
  state = initialStateList,
  action: ActionPoolsList
) => {
  switch (action.type) {
    case actionTypes.SET_POOLS_LIST:
      return setPoolsList(state, action);
    default:
      return state;
  }
};

//TRENDING POOLS LOADING
type rootStateTrendingPoolsLoading = RootState['trendingPoolsLoading'];
interface StateTrendingPoolsLoading extends rootStateTrendingPoolsLoading {}
interface ActionTrendingPoolsLoading extends rootStateTrendingPoolsLoading {
  type: string;
  bool: boolean;
}
const setTrendingPoolsLoading = (
  state: StateTrendingPoolsLoading,
  action: ActionTrendingPoolsLoading
) => {
  return {
    ...state,
    ...{ bool: action.bool },
  };
};
const reducerTrendingPoolsLoading = (
  state = initialStateLoading,
  action: ActionTrendingPoolsLoading
) => {
  switch (action.type) {
    case actionTypes.SET_POOLS_LOADING:
      return setTrendingPoolsLoading(state, action);
    default:
      return state;
  }
};

//POOLS LOADING
type rootStatePoolsLoading = RootState['poolsLoading'];
interface StatePoolsLoading extends rootStatePoolsLoading {}
interface ActionPoolsLoading extends rootStatePoolsLoading {
  type: string;
  bool: boolean;
}
const setPoolsLoading = (
  state: StatePoolsLoading,
  action: ActionPoolsLoading
) => {
  return {
    ...state,
    ...{ loading: action.bool },
  };
};
const reducerPoolsLoading = (
  state = initialStateLoading,
  action: ActionPoolsLoading
) => {
  switch (action.type) {
    case actionTypes.SET_POOLS_LOADING:
      return setPoolsLoading(state, action);
    default:
      return state;
  }
};

const insuranceReducers = {
  reducerTrendingPoolsList: reducerTrendingPoolsList,
  reducerTrendingPoolsLoading: reducerTrendingPoolsLoading,
  reducerPoolsList: reducerPoolsList,
  reducerPoolsLoading: reducerPoolsLoading,
};

export default insuranceReducers;
