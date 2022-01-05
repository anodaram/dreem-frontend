import React from "react";
import URL from "shared/functions/getURL";
const uuid = require("uuid");

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

// generate uuid
export function generateUniqueId() {
  return "Px" + uuid.v4();
}

// format an given number returning the string represtentation of it. If it is a crypto then currency is placed a right side,
// otherwise at left side.
const currencyMap = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};
const billion = 1000000000;
const billionSymbol = "B";
const million = 1000000;
const millionSymbol = "M";
export function formatNumber(number, token, numDecimals): string {
  let formattedNum = "";
  if (number >= billion)
    formattedNum = parseFloat((number / billion).toFixed(numDecimals)).toString() + billionSymbol;
  else if (number >= million)
    formattedNum = parseFloat((number / million).toFixed(numDecimals)).toString() + millionSymbol;
  else formattedNum = parseFloat(Number(number).toFixed(numDecimals)).toString();

  const isCrypto = currencyMap[token] === undefined;
  if (isCrypto) formattedNum = formattedNum + " " + token;
  else formattedNum = formattedNum + " " + (currencyMap[token] ?? "");
  return formattedNum;
}

// return a random color from the following palette
const collabCardColors = ["#ACDDDE", "#CAF1DE", "#E1F8DC", "#FEF8DD", "#FFE7C7", "#F7D8BA"];
export function getRandomCollabCardColor(): string {
  const n = collabCardColors.length;
  return collabCardColors[Math.floor(Math.random() * n)];
}

//add unique id to array elements
export function addUniqueIdToArray(arr: any[]): any[] {
  if (Array.isArray(arr)) {
    return arr.map(a => {
      a._priviUniqueId = generateUniqueId();
      return a;
    });
  }
  console.error("supplied argument in not an array");
  return [];
}

export function timePassed(date): string {
  let res: string = "";
  const now = Math.floor(Date.now() / 1000);
  const diffInSec = now - date;
  const diffInMins = Math.floor(diffInSec / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays > 365) {
    const years = diffInDays % 365;
    res = `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (diffInDays > 30) {
    const month = diffInDays % 30;
    res = `${month} month${month > 1 ? "s" : ""} ago`;
  } else if (diffInDays > 0) {
    res = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours) {
    res = `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    res = `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
  }
  return res;
}

const monthNames: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export function getMonthName(index): string {
  if (index < 12) return monthNames[index];
  else return "";
}

const dayOfWeek: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export function getDayOfWeek(index): string {
  if (index < 7) return dayOfWeek[index];
  else return "";
}

export function getMediaImage(media): string {
  let res = "none";
  if (media) {
    if (
      (media.Type === MediaType.Audio ||
        media.Type === MediaType.Video ||
        media.Type === MediaType.Blog ||
        media.Type === MediaType.BlogSnap) &&
      media.HasPhoto
    ) {
      res = `${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")}`;
    } else if (media.Type === MediaType.LiveAudio) {
      res = media.ImageUrl
        ? media.ImageUrl
        : new Date(media.Date).getTime() >= new Date().getTime()
        ? `${require("assets/backgrounds/audio_live_started.png")}`
        : `${require("assets/backgrounds/audio_live.png")}`;
    } else if (media.Type === MediaType.LiveVideo) {
      res = media.ImageUrl
        ? media.ImageUrl
        : new Date(media.StartedTime).getTime() >= new Date().getTime()
        ? `${require("assets/backgrounds/video_live_started.png")}`
        : `${require("assets/backgrounds/video_live.png")}`;
    } else if (media.Type === MediaType.Video) {
      res = media.ImageUrl
        ? media.ImageUrl
        : new Date(media.StartedTime).getTime() >= new Date().getTime()
        ? `${require("assets/backgrounds/video.png")}`
        : `${require("assets/backgrounds/video.png")}`;
    } else if (media.Type === MediaType.Blog) {
      res = media.ImageUrl
        ? media.ImageUrl
        : new Date(media.StartedTime).getTime() >= new Date().getTime()
        ? `${require("assets/backgrounds/blog.png")}`
        : `${require("assets/backgrounds/blog.png")}`;
    } else if (media.Type === MediaType.BlogSnap) {
      res = media.ImageUrl
        ? media.ImageUrl
        : new Date(media.StartedTime).getTime() >= new Date().getTime()
        ? `${require("assets/backgrounds/blog_snap.png")}`
        : `${require("assets/backgrounds/blog_snap.png")}`;
    } else if (media.Type === MediaType.DigitalArt) {
      res = `${URL()}/media/getDigitalArt/${media.MediaSymbol.replace(/\s/g, "")}`;
    }
  }
  return res;
}

export function handleSetStatus(msg, result, setStatus) {
  setStatus({
    msg: msg,
    key: Math.random(),
    variant: result,
  });
  setTimeout(() => {
    setStatus("");
  }, 2000);
}

export function removeAllUnnecessaryZeros(num: string) {
  return Number(parseFloat(num)).toString();
}

export const getDataURLFromFile = (cb, showImgId = "") => {
  const inputElement = document.createElement("input");
  inputElement.type = "file";
  inputElement.accept = "*";

  // set onchange event to call callback when user has selected file
  const onSelected = e => {
    if (!e.target.files.length) return;
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      var dataURL = reader.result;
      if (showImgId) {
        var output: any = document.getElementById("output");
        if (output) output.src = dataURL;
      }
      cb(dataURL);
    };
    reader.readAsDataURL(file);
  };
  inputElement.addEventListener("change", onSelected);
  inputElement.dispatchEvent(new MouseEvent("click"));
};


function buildJsxFromObjectHelper(elem: any, level: number, fromObj: boolean) {
  const content: any[] = [];
  // calculate indentation according to level
  let indent = "";
  for (let i = 0; i < level; i++) indent += "\u00A0\u00A0";

  // array
  if (elem != undefined && Array.isArray(elem)) {
    content.push(<span>{indent + "["}</span>);
    content.push(<br />);
    elem.forEach(item => {
      content.push(...buildJsxFromObjectHelper(item, level + 1, false));
    });
    content.push(<span>{indent + "]"}</span>);
    content.push(<br />);
  }
  // object
  else if (elem != undefined && typeof elem === "object") {
    if (level != 0) {
      content.push(<span>{indent + "{"}</span>);
      content.push(<br />);
    }
    Object.entries(elem).map(([key, val]) => {
      content.push(
        <span key={val + key}>
          {" "}
          {indent + key}: {buildJsxFromObjectHelper(val, level + 1, true)}
        </span>
      );
      content.push(<br key={val + key}/>);
    });
    if (level != 0) {
      content.push(<span>{indent + "}"}</span>);
      content.push(<br />);
    }
  }
  // literal
  else if (elem != undefined) {
    return `${!fromObj? indent:''}${elem}`;
  } else return "";
  return content;
}

export function buildJsxFromObject(elem: Object): any {
  return buildJsxFromObjectHelper(elem, 0, true);
}

export function convertObjectToJsx(obj?: Object | Array<any>): React.ReactNode {
  let content: any;
  if (Array.isArray(obj)) {
    content = obj.map((item, index) => {
      if (item && typeof item === "string")
        return (
          <>
            {item} <br />
          </>
        );
      else if (item && typeof (item === "object" || Array.isArray(item))) {
        return <div style={{ paddingLeft: "10px" }}>{convertObjectToJsx(item)}</div>;
      }
      return <> </>;
    });
  } else if (typeof obj === "object" && obj)
    content = Object.keys(obj as Object).map(key => {
      if (obj[key] && typeof obj[key] === "string")
        return (
          <>
            {`${key}:${obj[key]}`}
            <br />
          </>
        );
      else if (obj[key] && typeof (obj[key] === "object" || Array.isArray(obj[key]))) {
        return (
          <>
            <b> {key} </b>
            <div style={{ paddingLeft: "10px" }}>{convertObjectToJsx(obj[key])}</div>
          </>
        );
      }
      return <> </>;
    });
  return <>{content}</>;
}

// expected dd-mm-yyy
export function parseDateFromStr (str:string) {
  try {
    const strArray = str.split('-');
    if (strArray.length != 3) return null;
    const d = Number(strArray[0]);
    const m = Number(strArray[1]) - 1;
    const y = Number(strArray[2]);
    const date = new Date(y, m, d);
    return date.getTime();
  }
  catch (e) {
    console.log(e);
    return null;
  }
}

// returns array of labels with each month appearing only once, other positions are filled with ""
// each label is placed in equivalent distance
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function generateMonthLabelsFromDate (dates:number[]) {
  const labels:string[] = [];
  const map = {};
  dates.forEach((d) => {
    const date = new Date(d);
    const month = date.getMonth();
    const year = date.getFullYear();
    map[`${month}/${year}`] = false;
  });
  dates.forEach(d => {
    const date = new Date(d);
    const month = date.getMonth();
    const year = date.getFullYear();
    if (!map[`${month}/${year}`]) {
      map[`${month}/${year}`] = true;
      labels.push(monthLabels[new Date(date).getMonth()])
    }
  })
  return labels;
}

export function generateDayLabelsFromDate (dates:number[], numOfDates:number) {
  const pointsPerDay = Math.floor(dates.length/numOfDates);
  const labels:string[] = [];
  let counter = 1;
  dates.forEach(date => {
    if (counter == pointsPerDay) {
      const dateObj = new Date(date);
      labels.push(`${dateObj.getDate()}/${dateObj.getMonth()+1}`);
      counter = 1;
    }
    else {
      labels.push("");
      counter++;
    }
  });
  return labels;
}

// expected date parameter in seconds
export function calculateTimeFromNow (date:number) {
  const secsFromNow = Date.now()/1000-date;
  const hoursFromNow = Math.floor(secsFromNow/3600);
  const daysFromNow = Math.floor(hoursFromNow/24);
  const weeksFromNow = Math.floor(daysFromNow/7);
  return weeksFromNow > 0? `${weeksFromNow} week${weeksFromNow > 1? "s":""} ago`:
    daysFromNow > 0? `${daysFromNow} day${daysFromNow > 1? "s":""} ago` :
    `${hoursFromNow} hour${hoursFromNow > 1? "s":""} ago`;
}

export function pascalToSnakeCase (str: string) {
  if (str === 'AMM') {
    return 'amm';
  }
  return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ?.map(x => x.toLowerCase())
            .join('_');
}

export function snakeToPascalCase (str: string) {
  return str.replace(/(^\w|_\w)/g, m => m.replace(/_/, "").toUpperCase())
}

export function propNameCaseCrossTo(obj: any, opt: string) {
  var newObj, origKey, newKey, value
  if (obj instanceof Array) {
    return obj.map(function(value) {
        if (typeof value === "object") {
          value = propNameCaseCrossTo(value, opt)
        }
        return value
    })
  } else {
    newObj = {}
    for (origKey in obj) {
      if (obj.hasOwnProperty(origKey)) {
        if (opt === 'P2S') {
          newKey = pascalToSnakeCase(origKey);
        } else if (opt === 'S2P') {
          newKey = snakeToPascalCase(origKey);
        } else {
          newKey = origKey;
        }
        value = obj[origKey]
        if (value instanceof Array || (value !== null && value !== undefined && value.constructor === Object)) {
          value = propNameCaseCrossTo(value, opt)
        }
        newObj[newKey] = value
      }
    }
  }
  return newObj
}

export function parseCommaSeparatedValue(obj: any) {
  var newObj, key, value
  if (obj instanceof Array) {
    return obj.map(function(value) {
      if (typeof value === "object") {
        value = parseCommaSeparatedValue(value);
      } else if (typeof value === "string") {
        if (isCommaSeparatedString(value)) {
          value = commaSeparatedStringToInteger(value);
        }
      }
      return value
    })
  } else {
    newObj = {}
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        value = obj[key]
        if (value instanceof Array || (value !== null && value !== undefined && value.constructor === Object)) {
          value = parseCommaSeparatedValue(value)
        } else if (typeof value === "string") {
          if (isCommaSeparatedString(value)) {
            value = commaSeparatedStringToInteger(value);
          }
        }
        newObj[key] = value
      }
    }
  }
  return newObj;
}

export function commaSeparatedStringToInteger(str: string) {
  return parseInt(str.replace(/,/g, ''));
}

export function isCommaSeparatedString(str: string) {
  return (/[0-9]+(,[0-9]+)+/g).test(str)
}

export function _arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
