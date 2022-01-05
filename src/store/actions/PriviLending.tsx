import * as actionTypes from "./ActionTypes";

export interface PriviData {
  id: string;
  creatorId: string;
  funding_qty: number;
  funding_uom: string;
  available_qty: number;
  available_uom: string;
  endorsement_score: number;
  trust_score: number;
  interest: number;
  premium: number;
  incentive: number;
  payments: number;
  collaterals: Map<string, number>;
  duedate: string;
  daystogo: number;
  duration: number;
  status: string;
  lenders: number;
  borrowers: number;
  providers: number;
  coverage: number;
  loaned: number;
  credit_cap: number;
}

export const createDataPrivi = (
  id: string,
  creatorId: string,
  funding_qty: number,
  funding_uom: string,
  available_qty: number,
  available_uom: string,
  endorsement_score: number,
  trust_score: number,
  interest: number,
  premium: number,
  incentive: number,
  payments: number,
  collaterals: Map<string, number>,
  duedate: string,
  daystogo: number,
  duration: number,
  status: string,
  lenders: number,
  borrowers: number,
  providers: number,
  coverage: number,
  loaned: number,
  credit_cap: number
): PriviData => {
  return {
    id,
    creatorId,
    funding_qty,
    funding_uom,
    available_qty,
    available_uom,
    endorsement_score,
    trust_score,
    interest,
    premium,
    incentive,
    payments,
    collaterals,
    duedate,
    daystogo,
    duration,
    status,
    lenders,
    borrowers,
    providers,
    coverage,
    loaned,
    credit_cap,
  };
};

// Set a Lending into the global state
export const setPriviLending = (
  id: string,
  creatorId: string,
  funding_qty: number,
  funding_uom: string,
  available_qty: number,
  available_uom: string,
  endorsement_score: number,
  trust_score: number,
  interest: number,
  premium: number,
  incentive: number,
  payments: number,
  collaterals: Map<string, number>,
  duedate: string,
  daystogo: number,
  duration: number,
  status: string,
  lenders: number,
  borrowers: number,
  providers: number,
  coverage: number,
  loaned: number,
  credit_cap: number
) => ({
  type: actionTypes.SET_PRIVI_LENDING,
  id,
  creatorId,
  funding_qty,
  funding_uom,
  available_qty,
  available_uom,
  endorsement_score,
  trust_score,
  interest,
  premium,
  incentive,
  payments,
  collaterals,
  duedate,
  daystogo,
  duration,
  status,
  lenders,
  borrowers,
  providers,
  coverage,
  loaned,
  credit_cap,
});

// Set all Lending into the global state
export const setAllPriviLending = (lendings: PriviData[]) => ({
  type: actionTypes.SET_ALL_PRIVI_LENDING,
  lendings: lendings,
});

// Remove a Lending from the global state
export const removePriviLending = (id: string) => ({
  type: actionTypes.REMOVE_PRIVI_LENDING,
  id: id,
});
