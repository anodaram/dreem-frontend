import React from "react";
import styled, { css } from "styled-components";
import { makeStyles } from "@material-ui/core/styles";

import { Color, FontSize, Gradient, grid } from "shared/ui-kit";

export const useStyles = makeStyles(() => ({
  receiver: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: "#D10869 !important",
  },
  progress: {
    "& svg": {
      marginLeft: 8,
      marginRight: 16,
    },
    "& span": {
      size: 14,
      color: `${Color.White} !important`,
    },
  },
  votedStatus: {
    opacity: 0.5,
  },
  dateinput: {
    height: "40px !important",
    "& .MuiInputBase-root": {
      borderRadius: 6,
    },
  },
  multiRows: {
    height: "100% !important",
  },
  rootAuto: {
    width: "auto !important",
    "& > div": {
      width: "auto !important",
    },
  },
  back: {
    cursor: "pointer",
  },
  maxWidth: {
    width: "100%",
    "& *": {
      width: "100% !important",
    },
  },
  unselectedTab: {
    cursor: "pointer",
    fontWeight: 400,
  },
  selectedTab: {
    cursor: "pointer",
    background: Gradient.BlueMagenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
}));

export const subDAOPageStyles = makeStyles(() => ({
  daoPage: {
    position: "relative",
    width: "calc(100vw)",
    height: "calc(100vh - 104px)",
    minHeight: "calc(100vh - 104px)",
    backgroundColor: "black",
  },
  contentWrapper: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    "& > nav": {
      paddingLeft: 80,
      display: "flex",
      alignItems: "center",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 16,
      lineHeight: "21px",
      letterSpacing: "0.04em",
      color: "#ffffff",
      marginBottom: 38,
      marginTop: 16.5,
      cursor: "pointer",
    },
    "& > nav img": {
      marginRight: 16,
      height: 16,
      width: 8,
    },
  },
  headerWrapper: {
    width: "100%",
    height: "auto",
  },
  mobileHeaderWrapper: {
    display: "none",
    flexDirection: "column",
  },
  "@media screen and (max-width: 375px)": {
    mobileHeaderWrapper: {
      display: "flex",
    },
  },
  content: {
    padding: "0px 80px 100px",
    position: "relative",
  },
  appbarContainer: {
    overflowX: "auto",
    scrollbarWidth: "none",
    marginBottom: 40,
    top: 0,
    width: "100%",
    "& header": {
      background: "transparent !important",
    },
    "@media screen and (max-width: 768px)": {
      "& header": {
        padding: 0,
      },
    },
  },
}));

export type CardProps = React.PropsWithChildren<{
  dark?: boolean;
  noMargin?: boolean;
}>;

export const Card = styled.div<CardProps>`
  background: ${p => (p.dark ? "#020102" : "rgba(255, 255, 255, 0.12)")};
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 0px;
  padding: 24px;
  margin-bottom: ${p => (p.noMargin ? "0px" : "24px")};
  color: white;
`;

export type TitleGrandLightProps = React.PropsWithChildren<{
  mb?: number | string;
  fontSize?: number | string;
  color?: Color | string;
  bold?: boolean;
  disableUppercase?: boolean;
}>;

export const TitleGrandLight = styled.div<TitleGrandLightProps>`
  font-family: Grifter;
  color: ${p => (p.color ? p.color : Color.White)};
  margin-bottom: ${p =>
    p.mb ? (typeof p.mb === "string" ? `${p.mb}${p.mb.includes("px") ? "" : "px"}` : `${8 * p.mb}px`) : 0};
  font-size: ${p =>
    p.fontSize
      ? `${p.fontSize}${typeof p.fontSize === "string" && p.fontSize.includes("px") ? "" : "px"}`
      : "22px"};
  font-weight: ${p => (p.bold ? 800 : 400)};
  text-transform: ${p => (p.disableUppercase ? "none" : "uppercase")};
  line-height: 20px;
`;

export const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  border-radius: 100%;
  background: #d10869;
  font-size: 10px;
  color: white;
`;

type TextProps = React.PropsWithChildren<{
  bold?: boolean;
  size?: FontSize;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
}>;

export const Text = styled.div<TextProps>`
  font-size: ${p => p.size || FontSize.XL};
  color: white;
  font-weight: ${p => (p.bold ? 800 : 400)};
  ${p =>
    p.mt &&
    css`
      margin-top: ${grid(p.mt)};
    `};
  ${p =>
    p.mb &&
    css`
      margin-bottom: ${grid(p.mb)};
    `};
  ${p =>
    p.ml &&
    css`
      margin-left: ${grid(p.ml)};
    `};
  ${p =>
    p.mr &&
    css`
      margin-right: ${grid(p.mr)};
    `};
`;

export type ProgressBarProps = React.PropsWithChildren<{
  value: number;
}>;

export const ProgressBar = styled.div<ProgressBarProps>`
  width: ${p => `${p.value}%`};
  height: 14px;
  background: ${Gradient.BlueMagenta};
  flex: 1;
`;

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

export const PlusIcon = ({ color, ...props }: IconProps) => (
  <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
    <path
      d="M8.82422 1.5V17.5M0.824219 9.5L16.8242 9.5"
      stroke={color || Color.White}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ProgressAcceptIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
    <defs>
      <linearGradient
        id="progress_accept"
        gradientUnits="userSpaceOnUse"
        x1="5.4917"
        y1="21.4074"
        x2="15.2396"
        y2="3.1259"
        gradientTransform="matrix(1 0 0 -1 0 22)"
      >
        <stop offset="0" stopColor="#4CAA30" />
        <stop offset="1" stopColor="#59C4EB" />
      </linearGradient>
    </defs>
    <path
      fill={"url(#progress_accept)"}
      d="M16.2,7.5c0.3-0.3,0.3-0.8,0-1.1c-0.3-0.3-0.8-0.3-1.1,0L16.2,7.5z M8.4,14l-0.5,0.5c0.3,0.3,0.8,0.3,1,0
	L8.4,14z M5.9,10.5c-0.3-0.3-0.8-0.3-1.1,0c-0.3,0.3-0.3,0.8,0,1.1L5.9,10.5z M15.2,6.5l-7.2,7l1,1.1l7.2-7L15.2,6.5z M4.8,11.5
	l3.1,3l1-1.1l-3.1-3L4.8,11.5z M19.1,10c0,4.5-3.8,8.3-8.6,8.3v1.5c5.5,0,10.1-4.3,10.1-9.8H19.1z M10.5,18.3
	c-4.8,0-8.6-3.7-8.6-8.3H0.4c0,5.4,4.5,9.8,10.1,9.8V18.3z M1.9,10c0-4.5,3.8-8.3,8.6-8.3V0.3C5,0.3,0.4,4.6,0.4,10H1.9z M10.5,1.8
	c4.8,0,8.6,3.7,8.6,8.3h1.5c0-5.4-4.5-9.8-10.1-9.8V1.8z"
    />
  </svg>
);

export const ProgressDeclineIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21">
    <defs>
      <linearGradient
        id="progress_decline"
        gradientUnits="userSpaceOnUse"
        x1="5.4917"
        y1="21.4074"
        x2="15.2396"
        y2="3.1259"
        gradientTransform="matrix(1 0 0 -1 0 22)"
      >
        <stop offset="0" stopColor="#C932C3" />
        <stop offset="1" stopColor="#EF8732" />
      </linearGradient>
    </defs>
    <path
      fill={"url(#progress_decline)"}
      d="M14.1,7.5c0.3-0.3,0.3-0.8,0-1.1c-0.3-0.3-0.8-0.3-1.1,0L14.1,7.5z M6.9,12.5c-0.3,0.3-0.3,0.8,0,1.1
	c0.3,0.3,0.8,0.3,1.1,0L6.9,12.5z M7.9,6.5c-0.3-0.3-0.8-0.3-1.1,0c-0.3,0.3-0.3,0.8,0,1.1L7.9,6.5z M13.1,13.5
	c0.3,0.3,0.8,0.3,1.1,0c0.3-0.3,0.3-0.8,0-1.1L13.1,13.5z M13.1,6.5l-6.2,6l1,1.1l6.2-6L13.1,6.5z M6.9,7.5l6.2,6l1-1.1l-6.2-6
	L6.9,7.5z M19.1,10c0,4.5-3.8,8.3-8.6,8.3v1.5c5.5,0,10.1-4.3,10.1-9.8H19.1z M10.5,18.3c-4.8,0-8.6-3.7-8.6-8.3H0.4
	c0,5.4,4.5,9.8,10.1,9.8V18.3z M1.9,10c0-4.5,3.8-8.3,8.6-8.3V0.3C5,0.3,0.4,4.6,0.4,10H1.9z M10.5,1.8c4.8,0,8.6,3.7,8.6,8.3h1.5
	c0-5.4-4.5-9.8-10.1-9.8V1.8z"
    />
  </svg>
);

export const ProgressPendingIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
    <defs>
      <linearGradient
        id="progress_pending"
        gradientUnits="userSpaceOnUse"
        x1="5.4917"
        y1="21.4074"
        x2="15.2396"
        y2="3.1259"
        gradientTransform="matrix(1 0 0 -1 0 22)"
      >
        <stop offset="0" stopColor="#CC414A" />
        <stop offset="1" stopColor="#F6C85B" />
      </linearGradient>
    </defs>
    <path
      stroke={"url(#progress_pending)"}
      d="M10.5,5v5l3.1,3 M19.8,10c0,5-4.2,9-9.3,9c-5.1,0-9.3-4-9.3-9c0-5,4.2-9,9.3-9C15.7,1,19.8,5,19.8,10z"
    />
  </svg>
);

export const SmileIcon = ({ color, ...props }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M6.21484 12.0879C6.21484 12.0879 7.71484 14.0879 10.2148 14.0879C12.7148 14.0879 14.2148 12.0879 14.2148 12.0879M7.21484 7.08789H7.22484M13.2148 7.08789H13.2248M19.2148 10.0879C19.2148 15.0585 15.1854 19.0879 10.2148 19.0879C5.24428 19.0879 1.21484 15.0585 1.21484 10.0879C1.21484 5.11733 5.24428 1.08789 10.2148 1.08789C15.1854 1.08789 19.2148 5.11733 19.2148 10.0879Z"
      stroke={color || Color.White}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BackIcon = ({ color, ...props }: IconProps) => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
    <path
      d="M6 1L1 6L6 11"
      stroke={color || Color.White}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckIcon = ({ color, ...props }: IconProps) => (
  <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
    <path
      d="M17.0001 1L6.0001 12L1 7"
      stroke={color || Color.White}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LinkIcon = ({ color, ...props }: IconProps) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.8242 0.79884L6.82418 10.7988M16.8242 0.79884L16.8243 6.79884M16.8242 0.79884L10.8242 0.798828M6.82422 0.79884H0.824219V16.7988H16.8242V10.7988"
      stroke={color || Color.White}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FlagIcon = ({ color, ...props }: IconProps): JSX.Element => (
  <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
    <path
      d="M1.21484 1.20508L1.53201 0.525441C1.29973 0.417042 1.02817 0.434781 0.811962 0.572475C0.595755 0.71017 0.464844 0.948748 0.464844 1.20508L1.21484 1.20508ZM0.464844 19.2051C0.464844 19.6193 0.80063 19.9551 1.21484 19.9551C1.62906 19.9551 1.96484 19.6193 1.96484 19.2051H0.464844ZM1.21484 15.2051H0.464844C0.464844 15.4614 0.595755 15.7 0.811962 15.8377C1.02817 15.9754 1.29973 15.9931 1.53201 15.8847L1.21484 15.2051ZM16.2148 8.20508L16.532 8.88472C16.7961 8.76149 16.9648 8.49647 16.9648 8.20508C16.9648 7.91368 16.7961 7.64867 16.532 7.52544L16.2148 8.20508ZM0.464844 1.20508V19.2051H1.96484V1.20508H0.464844ZM1.53201 15.8847L16.532 8.88472L15.8977 7.52544L0.89768 14.5254L1.53201 15.8847ZM16.532 7.52544L1.53201 0.525441L0.89768 1.88472L15.8977 8.88472L16.532 7.52544ZM1.96484 15.2051V1.20508H0.464844V15.2051H1.96484Z"
      fill={color || Color.White}
    />
  </svg>
);

export const MessageIcon = ({ color, ...props }: IconProps): JSX.Element => (
  <svg width="22" height="23" viewBox="0 0 22 23" fill="none">
    <path
      d="M21.2335 1.01587H1.04663V16.0635H4.83168V22.3333L11.1401 16.0635H21.2335V1.01587Z"
      stroke={color || Color.White}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
