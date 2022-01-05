// Types and Interfaces for USER

export type Language = "EN" | "CA" | "ES";

export interface User {
  id: string;
  pwd: string;
  isSignedIn: boolean;
  //token: string,            // To be used with JWT
  //isTokenValid: boolean,    // To be used with JWT
}

export interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  age: number;
  email: string;
  country: string;
  location: string;
  currency: string;
  lastUpdate: number;
  endoresementScore: string;
  trustScore: string;
}

export interface userFund {
  amount: number;
  collateral_amount: number;
  collaterals: Map<string, number>;
  credit_amount: number;
  privi_borrowing: number;
  privi_lending: number;
  staking_amount: number;
  borrowing_amount: number;
  lastUpdate: number;
}
