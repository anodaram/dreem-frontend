import * as actionTypes from "./ActionTypes";

export interface StakeReserveData {
    token: string;
    reserve: number;
    annualInterestRate: number;
    dailyInterestRate: number;
}

export const createStakeReserve = (
    token: string,
    reserve: number,
    annualInterestRate: number,
    dailyInterestRate: number,
): StakeReserveData => {
    return {
        token,
        reserve,
        annualInterestRate,
        dailyInterestRate
    };
};

// Set a Reserve into the global state
export const setReserve = (stakeReserveData: StakeReserveData
) => ({
    type: actionTypes.SET_RESERVE,
    ...stakeReserveData
});

// Set all Reserve into the global state
export const setAllReserves = (reserves: StakeReserveData[]) => ({
    type: actionTypes.SET_ALL_RESERVE,
    reserves: reserves,
});

// Remove a Reserve from the global state. Id is token in Loans 1.0
export const removeReserve = (token: string) => ({
    type: actionTypes.REMOVE_RESERVE,
    token: token,
});
