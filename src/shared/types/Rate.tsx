// Types and Interfaces for RATE

export interface CoinRate {
    coinName: string,
    listOHLC: OHLC[],
    listRates: Rate[];
};

export interface OHLC {
    open: number,
    close: number,
    high: number,
    low: number,
    volumeto: number,
    date: Date,
};

export interface Rate {
    rateUSD: number,
    rateEUR: number,
    rateGBP: number,
    date: Date,
}