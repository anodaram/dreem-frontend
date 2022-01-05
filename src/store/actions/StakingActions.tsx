import * as actionTypes from "./ActionTypes";

export interface StakingData {
    token: string;
    deposit: number;
    reward: number;
    annualInterestRate: number;
}

export const createStaking = (
    token: string,
    deposit: number,
    reward: number,
    annualInterestRate: number,
): StakingData => {
    return {
        token,
        deposit,
        reward,
        annualInterestRate
    };
};

// Set a Staking into the global state
export const setStaking = (staking: StakingData
) => ({
    type: actionTypes.SET_STAKING,
    ...staking
});

// Set all Staking into the global state
export const setAllStakings = (stakings: StakingData[]) => ({
    type: actionTypes.SET_ALL_STAKING,
    stakings: stakings,
});

// Remove a Staking from the global state
export const removeStaking = (token: string) => ({
    type: actionTypes.REMOVE_STAKING,
    token: token,
});
