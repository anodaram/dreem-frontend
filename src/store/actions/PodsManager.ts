import * as actionTypes from './ActionTypes';

export const setMyPodsList = (list: any[]) => ({
    type: actionTypes.SET_MY_PODS_LIST,
    list: list
});

export const setTrendingPodsList = (list: any[]) => ({
    type: actionTypes.SET_TRENDING_PODS_LIST,
    list: list
});

export const setOtherPodsList = (list: any[]) => ({
    type: actionTypes.SET_OTHER_PODS_LIST,
    list: list
});

export const setMyPodsLoading = (bool: boolean) => ({
    type: actionTypes.SET_MY_PODS_LOADING,
    bool: bool
});
export const setTrendingPodsLoading = (bool: boolean) => ({
    type: actionTypes.SET_TRENDING_PODS_LOADING,
    bool: bool
});
export const setOtherPodsLoading = (bool: boolean) => ({
    type: actionTypes.SET_OTHER_PODS_LOADING,
    bool: bool
});
export const setPodMenuSelection = (value: number) => ({
    type: actionTypes.SET_OTHER_PODS_LOADING,
    value: value
});
