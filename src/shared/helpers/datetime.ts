import { intervalToDuration } from "date-fns";
import moment from "moment";

export const formatDateTime = (date: Date) => date.toLocaleString();

export const formatDateTimeWithNA = (date: Date | undefined) => (date ? formatDateTime(date) : "N/A");

export const formatSecondsDuration = (seconds: number) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  return [duration.hours, duration.minutes, duration.seconds]
    .map(value => (value || 0).toString().padStart(2, "0"))
    .join(":");
};

export const formatDDMMYY = dateNum => {
  const date = new Date(dateNum);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getDuration = (start, end) => {
  var s1 = moment(start, 'DD-MM-YYYY HH:mm:ss'); 
  var s2 = moment(end, 'DD-MM-YYYY HH:mm:ss');
  var s3 = s2.diff(s1,'seconds');

  var numDays = Math.floor(s3 / (24 * 60 * 60)); 
  var numHours = Math.floor((s3 % (24 * 60 * 60)) / (60 * 60)); 
  var numMinutes = Math.floor((s3 % (24 * 60 * 60)) % (60 * 60) / 60);
  var numSeconds = Math.floor((s3 % (24 * 60 * 60)) % (60 * 60) % 60);

  return `${numDays < 10 ? `0${numDays}` : numDays}d ${numHours < 10 ? `0${numHours}` : numHours}h ${numMinutes < 10 ? `0${numMinutes}` : numMinutes}m ${numSeconds < 10 ? `0${numSeconds}` : numSeconds}s`
}