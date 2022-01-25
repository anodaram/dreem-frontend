import moment from "moment";
import axios from 'axios';

const isProd = process.env.REACT_APP_ENV === "prod";

export const countDecimals = (value: number) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};

export const limitOfDecimals = (number: number) => {
  if (countDecimals(number) > 5) return number.toFixed(2);
  return number;
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const toDecimalFormat = (currency, decimalPlace = 8) =>
  Intl.NumberFormat("en-US", { style: "decimal", maximumFractionDigits: decimalPlace }).format(currency);

export const parsePrice = (price: string): string => {
  let priceList = price.split(" ");

  if (priceList.length === 1) {
    return `${parseFloat(priceList[0])}`;
  } else if (priceList.length > 1) {
    if (isNaN(parseFloat(priceList[0]))) {
      return `${priceList[0]} ${parseFloat(priceList[1])}`;
    } else {
      return `${parseFloat(priceList[0])} ${priceList[1]}`;
    }
  }

  return price;
};

export function getUnixEpochTimeStamp(value) {
  return Math.floor(value.getTime() / 1000);
}

export const promiseTimeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const detectMob = () => {
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

  return toMatch.some(toMatchItem => {
    return navigator.userAgent.match(toMatchItem);
  });
};

export const sanitizeIfIpfsUrl = url => {
  if (!url) {
    return null;
  }
  if (url.includes("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return url;
};

export const getNextDay = date => {
  var nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  nextDay.setHours(0);
  nextDay.setMinutes(0);
  nextDay.setSeconds(0);
  return nextDay.getTime();
};

export const formatDuration = period => {
  let parts: any[] = [];
  const duration = moment.duration(period);

  // return nothing when the duration is falsy or not correctly parsed (P0D)
  if (!duration || duration.toISOString() === "P0D") return;

  if (duration.years() >= 1) {
    const years = Math.floor(duration.years());
    parts.push(years + " " + (years > 1 ? "years" : "year"));
  }

  if (duration.months() >= 1) {
    const months = Math.floor(duration.months());
    parts.push(months + " " + (months > 1 ? "months" : "month"));
  }

  if (duration.days() >= 1) {
    const days = Math.floor(duration.days());
    parts.push(days + " " + (days > 1 ? "days" : "day"));
  }

  if (duration.hours() >= 1) {
    const hours = Math.floor(duration.hours());
    parts.push(hours + " " + (hours > 1 ? "hours" : "hour"));
  }

  if (duration.minutes() >= 1) {
    const minutes = Math.floor(duration.minutes());
    parts.push(minutes + " " + (minutes > 1 ? "minutes" : "minute"));
  }

  if (duration.seconds() >= 1) {
    const seconds = Math.floor(duration.seconds());
    parts.push(seconds + " " + (seconds > 1 ? "seconds" : "second"));
  }

  return parts.join(" ");
};

export const roundFloat = (value: number, precision: number) => parseFloat(value.toFixed(precision));

export const typeUnitValue = (value: any, precision: number) => {
  let num_str = value.toString();
  let int_str = num_str.split(".")[0];
  let direction = true;
  if (int_str[0] == "-") {
    direction = false;
    int_str = int_str.split("-")[1];
  }
  if (int_str.length > 6) {
    return `${direction ? "" : "-"}${int_str.substring(0, int_str.length - 6)},${int_str.substring(
      int_str.length - 6,
      int_str.length - 6 - 3
    )}M`;
  } else if (int_str.length > 5) {
    return `${direction ? "" : "-"}${int_str.substring(0, int_str.length - 3)},${int_str.substring(
      int_str.length - 3,
      int_str.length
    )}K`;
  } else if (int_str.length >= 4) {
    return `${direction ? "" : "-"}${int_str.substring(0, int_str.length - 3)},${int_str.substring(
      int_str.length - 3,
      int_str.length
    )}`;
  } else {
    return roundFloat(Number(value), precision);
  }
};

export const visitChainLink = (chain, address, isAddress = true) => {
  if (isAddress) {
    if (chain.toLowerCase() === "bsc") {
      window.open(`https://${!isProd ? "testnet." : ""}bscscan.com/address/${address}`, "_blank");
    } else if (chain.toLowerCase() === "polygon"){
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/address/${address}`, "_blank");
    }
  } else {
    if (chain.toLowerCase() === "bsc") {
      window.open(`https://${!isProd ? "testnet." : ""}bscscan.com/tx/${address}`, "_blank");
    } else if (chain.toLowerCase() === "polygon"){
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${address}`, "_blank");
    }
  }
}

export const getAbbrAddress = (address, start, end) => {
  return `${address?.substring(0, start)}...${address?.substring(address?.length - end, address.length)}`
}

export const getNFTOwnerAddress = async (chainId, address, tokenId) => {
  const COVAL_API_ENDPOINT = "https://api.covalenthq.com/v1";
  const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
  const meta = await axios.get(
          `${COVAL_API_ENDPOINT}/${chainId}/tokens/${address}/nft_metadata/${tokenId}/?key=${COVALENT_API_KEY}`
          )

  return meta?.data.data.items[0].nft_data[0].owner_address
}

export const getInputValue = (val, min: number, max?: number) => {
  if (min !== undefined && val < min) {
    return min;
  }
  if (max !== undefined && val > max) {
    return max;
  }
  return val;
}