import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";
import { StakeReserveData } from "../actions/StakingReserveActions";

type ReserveRootState = RootState["reserves"];
interface ReservesState extends ReserveRootState { }
interface ReservesAction extends StakeReserveData {
    type: string;
}

// Privi Credit State
const initialState: ReservesState = new Map([]);

// Set a Staking Reserve into the global state
const setReserve = (state: ReservesState, action: ReservesAction) => {
    var loanObj: any = action;
    delete loanObj.type; // dont need type property
    state.set(loanObj.token, loanObj);
    // console.log("ReduxState:", state);
    return state;
};

// Replace all reserves, actions should be an array of StakeReserveData
const setAllReserve = (state: ReservesState, action: any) => {
    console.log("In Reducer: ", action);
    state = new Map([]);
    const reserves: StakeReserveData[] = action.reserves;
    reserves.forEach((reserveData) => {
        state.set(reserveData.token, reserveData);
    });
    return state;
};

// Delete a Staking Reserve from the state
const removeReserve = (state: ReservesState, action: ReservesAction) => {
    state.delete(action.token);
    return state;
};


// Return the SelectedLendingPage state
const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.SET_ALL_RESERVE:
            return setAllReserve(state, action);
        case actionTypes.SET_RESERVE:
            return setReserve(state, action);
        case actionTypes.REMOVE_RESERVE:
            return removeReserve(state, action);
        default:
            return state;
    }
};

export default reducer;
