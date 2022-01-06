import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { ChevronIconLeft } from "shared/ui-kit/Icons/chevronIconLeft";

export type ButtonProps = React.PropsWithChildren<{
  dark?: boolean;
  purple?: boolean;
}>;

const Button = styled.div<ButtonProps>`
  color: ${p => (p.dark ? "#181818" : p.purple ? "#431AB7" : "#99a1b3")};
  margin-top: ${p => (p.dark || p.purple ? 0 : "50px")};
  margin-bottom: ${p => (p.dark || p.purple ? 0 : "30px")};
  cursor: pointer;
  font-family: ${p => (p.purple ? "Agrandir" : "sans-serif")};
  font-size: 18px;
  font-weight: 400;
  display: flex;
  align-items: baseline;
  svg {
    width: 16px;
    height: 13px;
    margin-right: ${p => (p.purple ? "12px" : "5px")};
  }
`;

export const BackButton = ({
  dark,
  purple,
  overrideFunction,
}: {
  dark?: boolean;
  purple?: boolean;
  overrideFunction?: () => void;
}) => {
  const history = useHistory();

  const onClick = () => {
    history.goBack();
  };

  return (
    <Button onClick={overrideFunction ?? onClick} dark={dark} purple={purple} style={{width:"fit-content"}}>
      {dark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path
            d="M1 7L17 7M1 7L7 1M1 7L7 13"
            stroke="#181818"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : purple ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none">
          <path
            d="M1.5 5.00001L11.5 5.00001M1.5 5.00001L5.5 1M1.5 5.00001L5.5 9"
            stroke="#431AB7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <ChevronIconLeft />
      )}
      <span>Back</span>
    </Button>
  );
};
