import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";
import { StakingData } from "../actions/StakingActions";

type StakingRootState = RootState["stakings"];
interface StakingState extends StakingRootState { }
interface StakingAction extends StakingData {
    type: string;
}

// Credit State
const initialState: StakingState = new Map([]);

// Set a Staking into the global state
const setStaking = (state: StakingState, action: StakingAction) => {
    var loanObj: any = action;
    delete loanObj.type; // dont need type property
    state.set(loanObj.token, loanObj);
    return state;
};

// Replace all stakings, actions should be an array of stakings
const setAllStaking = (state: StakingState, action: any) => {
    state = new Map([]);
    const stakings: StakingData[] = action.stakings;
    stakings.forEach((staking) => {
        state.set(staking.token, staking);
    });
    return state;
};

// Delete a Staking from the state
const removeStaking = (state: StakingState, action: StakingAction) => {
    state.delete(action.token);
    return state;
};


// Return the state
const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.SET_ALL_STAKING:
            return setAllStaking(state, action);
        case actionTypes.SET_STAKING:
            return setStaking(state, action);
        case actionTypes.REMOVE_STAKING:
            return removeStaking(state, action);
        default:
            return state;
    }
};

export default reducer;
