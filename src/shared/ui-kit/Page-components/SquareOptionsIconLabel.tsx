import React from "react";
import "./SquareOptionsIconLabel.css";

const SquareOptionsIconLabel = (props: any) => {
  return (
    <div
      className={`${
        props.selected === props.index
          ? "squareOptionsIconLabel selectedOptionsIconLabel"
          : "squareOptionsIconLabel"
      } ${props.theme === "green" ? "greenOption" : ""}
      `}
      onClick={() => {
        if (props.setterFormat) {
          props.setterFormat(props.index);
        }
      }}
      style={
        props.theme && props.theme === "green"
          ? {
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
            }
          : {}
      }
    >
      <div
        className="imageIconOptionsIconLabel"
        style={
          props.theme && props.theme === "green"
            ? {
                height: "auto",
                marginLeft: "20px",
                marginBottom: 0,
              }
            : {}
        }
      >
        {!(props.label === "Multiple") ? (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 23.3333L5 28.3333L7.5 18.3333L0 10L10.8333 9.16667L15 0L19.1667 9.16667L30 10L22.5 18.3333L25 28.3333L15 23.3333Z"
              fill={`url(${props.theme && props.theme === "green" ? "#paint2_linear" : "#paint0_linear"})`}
            />
            <defs>
              <radialGradient
                id="paint0_angular"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(16 15.7111) rotate(20.2204) scale(9.83703 25.8226)"
              >
                <stop offset="0.307292" stopColor="#00FF15" />
                <stop offset="0.671875" stopColor="#B1FF00" />
              </radialGradient>
            </defs>
          </svg>
        ) : (
          [1, 2, 3].map(value => (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 23.3333L5 28.3333L7.5 18.3333L0 10L10.8333 9.16667L15 0L19.1667 9.16667L30 10L22.5 18.3333L25 28.3333L15 23.3333Z"
                fill={`url(${props.theme && props.theme === "green" ? "#paint2_linear" : "#paint0_linear"})`}
              />
              <defs>
                <radialGradient
                  id="paint0_angular"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(16 15.7111) rotate(20.2204) scale(9.83703 25.8226)"
                >
                  <stop offset="0.307292" stopColor="#00FF15" />
                  <stop offset="0.671875" stopColor="#B1FF00" />
                </radialGradient>
              </defs>
            </svg>
          ))
        )}
      </div>
      <div
        className="labelOptionsIconLabel"
        style={props.theme && props.theme === "green" ? { color: "#707582" } : {}}
      >
        {props.label}
      </div>
    </div>
  );
};

export default SquareOptionsIconLabel;
