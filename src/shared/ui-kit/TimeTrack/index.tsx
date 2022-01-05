import React from "react";
import cls from "classnames";

import { HistoryIcon, useStyles } from "./index.style";
import { Color, HeaderBold4 } from "shared/ui-kit";
import Box, { BoxProps } from "shared/ui-kit/Box";

interface TimeTrackProps extends BoxProps {
  endTime?: Date;
  theme?: "dark" | "light" | "green";
}

const TimeTrack = ({ endTime, theme, ...props }: TimeTrackProps) => {
  const classes = useStyles();
  const [countDown, setCountDown] = React.useState<any>({});

  React.useEffect(() => {
    /** FIXME: This is for test */
    let addADayDate: Date = new Date();
    addADayDate.setDate(addADayDate.getDate() + 1);

    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor(
        endTime ? endTime.getTime() - now.getTime() / 1000 : (addADayDate.getTime() - now.getTime()) / 1000
      ); // diff in secs

      if (delta < 0) {
        setCountDown({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        clearInterval(timerId);
      } else {
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = delta % 60;
        setCountDown({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [endTime]);

  return (
    <Box
      className={cls(
        { [classes.timeCardDark]: theme === "dark" },
        { [classes.timeCardGreen]: theme === "green" },
        classes.timeCard
      )}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <HistoryIcon color={theme === "green" ? Color.GrayDark : Color.White} />
        <span>Time left</span>
      </Box>
      <HeaderBold4 noMargin>
        {`${countDown.days > 0 && countDown.days < 365 ? `${countDown.days}d` : ""} ${countDown.hours}h ${
          countDown.minutes
        }m ${countDown.seconds}s`}
      </HeaderBold4>
    </Box>
  );
};

export default TimeTrack;
