import React from "react";

export const IconNavigate: React.FunctionComponent<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24.8203 2.0415L14.487 12.3748L9.32031 7.20817L1.57031 14.9582M24.8203 2.0415H17.0703M24.8203 2.0415V9.7915"
      stroke={isActive ? "url(#paint0_linear)" : "#727F9A"}
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="4.71787"
        y1="10.8"
        x2="27.8422"
        y2="14.4688"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.828418" stopColor="#23D0C6" />
        <stop offset="1" stopColor="#00CC8F" />
      </linearGradient>
    </defs>
  </svg>
);
