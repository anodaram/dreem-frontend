import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';
import { BalanceModel } from "../actions/UserBalancesActions";

type rootState = RootState['userBalances'];
interface State extends rootState { };

interface BalanceAction {
    type: string;
    value: BalanceModel
};

interface BalancesAction {
    type: string;
    value: {
        [key: string]: BalanceModel
    }
};

const setUserBalances = (action: BalancesAction) => {
    return action.value;
};
const setUserBalance = (state: State, action: BalanceAction) => {
    const currState = { ...state };
    currState[action.value.Token] = action.value
    return currState;
};

const reducer = (state = {}, action: any) => {
    switch (action.type) {
        case actionTypes.SET_USER_BALANCES:
            return setUserBalances(action);
        case actionTypes.SET_USER_BALANCE:
            return setUserBalance(state, action);
        default:
            return state;
    }
};

export default reducer;
