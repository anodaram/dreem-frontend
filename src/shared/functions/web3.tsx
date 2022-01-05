import BigNumber from "bignumber.js";

export const formatTokenAmount = (amount, decimals) => {
  toDecimals(amount, decimals);
};

export const toDecimals = (value, decimals = 18) => {
  const TENPOW_ = new BigNumber(10).pow(decimals);
  return new BigNumber(value).div(TENPOW_).toFixed();
};

export const to18Decimals = value => {
  const TENPOW18 = new BigNumber(10).pow(18);
  return new BigNumber(value).multipliedBy(TENPOW18).toFixed(0);
};

export const toNDecimals = (value, decimals) => {
  const TENPOW = new BigNumber(10).pow(decimals);
  return new BigNumber(value).multipliedBy(TENPOW).toFixed(0);
};

export const toPrecision = (value, precision) => {
  const number = new BigNumber(value).toPrecision(precision);
  return new BigNumber(number).toFixed();
};

export const multiplyNumbers = (a, b) => {
  if (!a || !b) return 0;
  return new BigNumber(a).multipliedBy(b).toFixed();
};

export const divNumbers = (a, b) => {
  if (!a || !b) return 0;
  return new BigNumber(a).dividedBy(b).toFixed();
};

export const toDecimalPlaces = (value, decimals = 5) => {
  return new BigNumber(value).decimalPlaces(Number(decimals)).toString();
};

export const random = (decimals = 10) => {
  const TENPOW = new BigNumber(10).pow(decimals);
  return BigNumber.random(decimals).multipliedBy(TENPOW).toFixed(0);
};

export const toSeconds = (day, hour, min, sec) => {
  return day * 86400 + hour * 3600 + min * 60 + sec;
};