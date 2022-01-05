import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';


const initialStateList = {
    list: []
};
const initialStateLoading = {
    bool: true
};
const initialStateValue = {
    value: 0
};

//MY PODS LIST
type rootStateMyPodsList = RootState['myPodsList'];
interface StateMyPodsList extends rootStateMyPodsList {};
interface ActionMyPodsList extends rootStateMyPodsList {
    type: string,
    list: any[]
}
const setMyPodsList = (state: StateMyPodsList, action: ActionMyPodsList) => {
    return {
        ...state,
        ...{ list: action.list,
        }
    };
};
const reducerMyPodsList = (state = initialStateList, action: ActionMyPodsList) => {
    switch (action.type) {
        case actionTypes.SET_MY_PODS_LIST: return setMyPodsList(state, action);
        default: return state;
    }
};

//TRENDING PODS LIST
type rootStateTrendingPodsList = RootState['trendingPodsList'];
interface StateTrendingPodsList extends rootStateTrendingPodsList {};
interface ActionTrendingPodsList extends rootStateTrendingPodsList {
    type: string,
    list: any[]
}
const setTrendingPodsList = (state: StateTrendingPodsList, action: ActionTrendingPodsList) => {
    return {
        ...state,
        ...{ list: action.list,
        }
    };
};
const reducerTrendingPodsList = (state = initialStateList, action: ActionTrendingPodsList) => {
    switch (action.type) {
        case actionTypes.SET_TRENDING_PODS_LIST: return setTrendingPodsList(state, action);
        default: return state;
    }
};

//OTHER PODS LIST
type rootStateOtherPodsList = RootState['otherPodsList'];
interface StateOtherPodsList extends rootStateOtherPodsList {};
interface ActionOtherPodsList extends rootStateOtherPodsList {
    type: string,
    list: any[]
}
const setOtherPodsList = (state: StateOtherPodsList, action: ActionOtherPodsList) => {
    return {
        ...state,
        ...{ list: action.list,
        }
    };
};
const reducerOtherPodsList = (state = initialStateList, action: ActionOtherPodsList) => {
    switch (action.type) {
        case actionTypes.SET_OTHER_PODS_LIST: return setOtherPodsList(state, action);
        default: return state;
    }
};

//MY PODS LOADING
type rootStateMyPodsLoading = RootState['myPodsLoading'];
interface StateMyPodsLoading extends rootStateMyPodsLoading {};
interface ActionMyPodsLoading extends rootStateMyPodsLoading {
    type: string,
    bool: boolean
}
const setMyPodsLoading = (state: StateMyPodsLoading, action: ActionMyPodsLoading) => {
    return {
        ...state,
        ...{ bool: action.bool,
        }
    };
};
const reducerMyPodsLoading = (state = initialStateLoading, action: ActionMyPodsLoading) => {
    switch (action.type) {
        case actionTypes.SET_MY_PODS_LOADING: return setMyPodsLoading(state, action);
        default: return state;
    }
};

//TRENDING PODS LOADING
type rootStateTrendingPodsLoading= RootState['trendingPodsLoading'];
interface StateTrendingPodsLoading extends rootStateTrendingPodsLoading {};
interface ActionTrendingPodsLoading extends rootStateTrendingPodsLoading {
    type: string,
    bool: boolean
}
const setTrendingPodsLoading = (state: StateTrendingPodsLoading, action: ActionTrendingPodsLoading) => {
    return {
        ...state,
        ...{ bool: action.bool
        }
    };
};
const reducerTrendingPodsLoading = (state = initialStateLoading, action: ActionTrendingPodsLoading) => {
    switch (action.type) {
        case actionTypes.SET_TRENDING_PODS_LOADING: return setTrendingPodsLoading(state, action);
        default: return state;
    }
};

//OTHER PODS LOADING
type rootStateOtherPodsLoading = RootState['otherPodsLoading'];
interface StateOtherPodsLoading extends rootStateOtherPodsLoading {};
interface ActionOtherPodsLoading extends rootStateOtherPodsLoading {
    type: string,
    bool: boolean
}
const setOtherPodsLoading = (state: StateOtherPodsLoading, action: ActionOtherPodsLoading) => {
    return {
        ...state,
        ...{ loading: action.bool,
        }
    };
};
const reducerOtherPodsLoading = (state = initialStateLoading, action: ActionOtherPodsLoading) => {
    switch (action.type) {
        case actionTypes.SET_OTHER_PODS_LOADING: return setOtherPodsLoading(state, action);
        default: return state;
    }
};

// POD MENU SELECTION
type rootStatePodMenuSelection = RootState['podMenuSelection'];
interface StatePodMenuSelection extends rootStatePodMenuSelection {};
interface ActionPodMenuSelection extends rootStatePodMenuSelection {
    type: string,
    value: number
}
const setPodMenuSelection = (state: StatePodMenuSelection, action: ActionPodMenuSelection) => {
    return {
        ...state,
        ...{ value: action.value,
        }
    };
};
const reducerPodMenuSelection = (state = initialStateValue, action: ActionPodMenuSelection) => {
    switch (action.type) {
            case actionTypes.SET_POD_MENU_SELECTION: return setPodMenuSelection(state, action);
        default: return state;
    }
};

const reducers = {
    reducerMyPodsList: reducerMyPodsList,
    reducerMyPodsLoading: reducerMyPodsLoading,
    reducerTrendingPodsList: reducerTrendingPodsList,
    reducerTrendingPodsLoading: reducerTrendingPodsLoading,
    reducerOtherPodsList: reducerOtherPodsList,
    reducerOtherPodsLoading: reducerOtherPodsLoading,
    reducerPodMenuSelection: reducerPodMenuSelection
};

export default reducers;