export const getStyledTime = (time_past, time_future, condensed) => {
  // get total seconds between the times
  let delta = Math.abs(time_future - time_past) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  if (condensed) {
    if (days > 0) {
      return `${days}d ${hours > 0 ? `${hours}h` : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    } else return `${minutes}m`;
  } else {
    if (days > 0) {
      return `${days}${days > 1 ? 'days' : 'day'} ${
        hours > 0 ? `${hours}h` : ''
      }`;
    } else if (hours > 0) {
      return `${hours}${hours > 1 ? 'hours' : 'hour'} ${
        minutes > 0 ? `${minutes}m` : ''
      }`;
    } else return `${minutes}${minutes > 1 ? 'minutes' : 'minute'}`;
  }
};
