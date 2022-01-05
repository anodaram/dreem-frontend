import React from "react";

export const IconMessagesWhite: React.FunctionComponent<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.23688 2.10602L11.4618 11.3309C12.4786 12.3477 14.1272 12.3477 15.1441 11.3309L24.3689 2.10602M2.88782 19.6815H23.718C24.437 19.6815 25.0199 19.0986 25.0199 18.3796V2.75696C25.0199 2.03795 24.437 1.45508 23.718 1.45508H2.88782C2.16881 1.45508 1.58594 2.03795 1.58594 2.75696V18.3796C1.58594 19.0986 2.16881 19.6815 2.88782 19.6815Z"
      stroke={isActive ? "url(#paint0_linear)" : "#FFFFFF"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="3.76923"
        y1="9.80001"
        x2="22.844"
        y2="12.2761"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.828418" stopColor="#23D0C6" />
        <stop offset="1" stopColor="#00CC8F" />
      </linearGradient>
    </defs>
  </svg>
);
