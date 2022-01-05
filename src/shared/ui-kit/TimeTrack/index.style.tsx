import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Color, Gradient } from "shared/ui-kit";

export const useStyles = makeStyles(() => ({
  timeCard: {
    borderRadius: 10,
    height: 48,
    background: Gradient.Mint,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 24,
    "& span, h4": {
      color: Color.White,
    },
    "& svg": {
      marginRight: 8,
    },
  },
  timeCardDark: {
    background: Gradient.BlueMagenta,
  },
  timeCardGreen: {
    background: Gradient.Green,
    "& *": {
      color: Color.GrayDark,
    },
  },
}));

type IconProps = React.PropsWithChildren<{
  color?: Color;
}>;

export const HistoryIcon = ({ color, ...props }: IconProps) => (
  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
    <path
      d="M9.82422 5.5V10.5L12.8242 13.5M18.8242 10.5C18.8242 15.4706 14.7948 19.5 9.82422 19.5C4.85366 19.5 0.824219 15.4706 0.824219 10.5C0.824219 5.52944 4.85366 1.5 9.82422 1.5C14.7948 1.5 18.8242 5.52944 18.8242 10.5Z"
      stroke={color || Color.White}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
