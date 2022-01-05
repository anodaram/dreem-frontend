import React from "react";

export const IconContacts: React.FunctionComponent<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M28.4876 23.375V20.9583C28.4876 18.289 26.3237 16.125 23.6543 16.125H23.0501M18.821 11.2917C21.4903 11.2917 23.6543 9.12771 23.6543 6.45833C23.6543 3.78896 21.4903 1.625 18.821 1.625M21.2376 23.375V20.9583C21.2376 18.289 19.0737 16.125 16.4043 16.125H6.73763C4.06825 16.125 1.9043 18.289 1.9043 20.9583V23.375M16.4043 6.45833C16.4043 9.12771 14.2403 11.2917 11.571 11.2917C8.90159 11.2917 6.73763 9.12771 6.73763 6.45833C6.73763 3.78896 8.90159 1.625 11.571 1.625C14.2403 1.625 16.4043 3.78896 16.4043 6.45833Z"
      stroke={isActive ? "url(#paint0_linear)" : "#727F9A"}
      strokeWidth="2.2"
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
