import React from "react";
import { withStyles } from "@material-ui/core";
import CheckBox, { CheckboxProps } from "@material-ui/core/Checkbox";

import { Color } from "../../constants/const";

interface StyledCheckBoxProps extends CheckboxProps {
  buttonType?: "round" | "circle";
  buttonColor?: Color;
  theme?: "dark" | "light";
}

const StyledCheckbox = withStyles({
  root: {
    color: (props: CheckboxProps) => `${props.color || Color.Black} !important`,
    padding: "0 9px 0 0",
    "&:hover": {
      backgroundColor: "inherit !important",
    },
  },
})(({ buttonType, buttonColor, theme, ...props }: StyledCheckBoxProps) => (
  <CheckBox
    disableTouchRipple
    checkedIcon={
      buttonType === "circle" ? (
        <CircleCheckedIcon color={buttonColor} />
      ) : theme === "dark" ? (
        <RoundCheckedIconDark />
      ) : (
        <RoundCheckedIcon color={buttonColor} />
      )
    }
    icon={
      buttonType === "circle" ? (
        <CircleUncheckedIcon color={buttonColor} />
      ) : theme === "dark" ? (
        <RoundUncheckedIconDark />
      ) : (
        <RoundUncheckedIcon color={buttonColor} />
      )
    }
    {...props}
  />
));

export default StyledCheckbox;

interface CheckIconProps {
  size?: number;
  color?: Color | string;
}

const RoundCheckedIcon = (props: CheckIconProps) => (
  <svg width={(props.size || 27).toString()} height={(props.size || 26).toString()} viewBox="0 0 27 26">
    <rect
      x="0.923828"
      y="0.75"
      width="24.5"
      height="24.5"
      rx="4.25"
      stroke={props.color || Color.Black}
      strokeWidth="1.5"
      fill="none"
    />
    <rect x="6.17383" y="6" width="14" height="14" rx="3" fill={props.color || Color.Black} />
  </svg>
);

const RoundCheckedIconDark = (props: CheckIconProps) => (
  <svg width={(props.size || 27).toString()} height={(props.size || 26).toString()} viewBox="0 0 27 26">
    <defs>
      <linearGradient
        id="SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1="-4.8962"
        y1="18.9791"
        x2="31.9454"
        y2="10.7876"
        gradientTransform="matrix(1 0 0 -1 0 28)"
      >
        <stop offset="0" stopColor="#00BFFF" />
        <stop offset="0.5365" stopColor="#8D2EFF" />
        <stop offset="1" stopColor="#FF00C1" />
      </linearGradient>
      <linearGradient
        id="SVGID_2_"
        gradientUnits="userSpaceOnUse"
        x1="3.3636"
        y1="17.1426"
        x2="23.2014"
        y2="12.7318"
        gradientTransform="matrix(1 0 0 -1 0 28)"
      >
        <stop offset="0" stopColor="#00BFFF" />
        <stop offset="0.5365" stopColor="#8D2EFF" />
        <stop offset="1" stopColor="#FF00C1" />
      </linearGradient>
      <linearGradient
        id="SVGID_3_"
        gradientUnits="userSpaceOnUse"
        x1="3.3636"
        y1="17.1426"
        x2="23.2014"
        y2="12.7318"
        gradientTransform="matrix(1 0 0 -1 0 28)"
      >
        <stop offset="0" stopColor="#00BFFF" />
        <stop offset="0.5365" stopColor="#8D2EFF" />
        <stop offset="1" stopColor="#FF00C1" />
      </linearGradient>
    </defs>
    <path
      fill={"none"}
      stroke={`url(#SVGID_1_)`}
      strokeWidth="1.5"
      d="M5,0.8h16c2.3,0,4.3,1.9,4.3,4.3v16c0,2.3-1.9,4.3-4.3,4.3H5c-2.3,0-4.3-1.9-4.3-4.3V5C0.8,2.7,2.7,0.8,5,0.8z"
    />
    <path
      fill={`url(#SVGID_3_)`}
      stroke={`url(#SVGID_3_)`}
      d="M9,6.5h8c1.4,0,2.5,1.1,2.5,2.5v8c0,1.4-1.1,2.5-2.5,2.5H9c-1.4,0-2.5-1.1-2.5-2.5V9C6.5,7.6,7.6,6.5,9,6.5z"
    />
  </svg>
);

const RoundUncheckedIcon = (props: CheckIconProps) => (
  <svg
    width={(props.size || 27).toString()}
    height={(props.size || 26).toString()}
    viewBox="0 0 27 26"
    fill="none"
  >
    <rect
      x="0.923828"
      y="0.75"
      width="24.5"
      height="24.5"
      rx="4.25"
      stroke={props.color || Color.GrayDark}
      strokeWidth="1.5"
    />
  </svg>
);

const RoundUncheckedIconDark = (props: CheckIconProps) => (
  <svg width={(props.size || 27).toString()} height={(props.size || 26).toString()} viewBox="0 0 27 26">
    <defs>
      <linearGradient
        id="SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1="-4.8962"
        y1="18.9791"
        x2="31.9454"
        y2="10.7876"
        gradientTransform="matrix(1 0 0 -1 0 28)"
      >
        <stop offset="0" stopColor="#00BFFF" />
        <stop offset="0.5365" stopColor="#8D2EFF" />
        <stop offset="1" stopColor="#FF00C1" />
      </linearGradient>
    </defs>
    <path
      fill={"none"}
      stroke={`url(#SVGID_1_)`}
      strokeWidth="1.5"
      d="M5,0.8h16c2.3,0,4.3,1.9,4.3,4.3v16c0,2.3-1.9,4.3-4.3,4.3H5c-2.3,0-4.3-1.9-4.3-4.3V5C0.8,2.7,2.7,0.8,5,0.8z"
    />
  </svg>
);

const CircleCheckedIcon = (props: CheckIconProps) => (
  <svg
    width={(props.size || 20).toString()}
    height={(props.size || 20).toString()}
    viewBox="0 0 20 20"
    fill="none"
  >
    <rect
      x="0.75"
      y="0.75"
      width="18.5"
      height="18.5"
      rx="9.25"
      stroke={props.color || Color.Black}
      strokeWidth="1.5"
    />
    <circle cx="9.99985" cy="10" r="5.38462" fill={props.color || Color.Black} />
  </svg>
);

const CircleUncheckedIcon = (props: CheckIconProps) => (
  <svg
    width={(props.size || 20).toString()}
    height={(props.size || 20).toString()}
    viewBox="0 0 20 20"
    fill="none"
  >
    <rect
      x="0.75"
      y="0.75"
      width="18.5"
      height="18.5"
      rx="9.25"
      stroke={props.color || Color.GrayDark}
      strokeWidth="1.5"
    />
  </svg>
);
