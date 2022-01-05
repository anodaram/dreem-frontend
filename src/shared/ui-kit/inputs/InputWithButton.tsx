import React from "react";
import styled from "styled-components";

import { InputAdornment, TextField } from "@material-ui/core";

import { Color, grid } from "../../constants/const";

const StyledTextField = styled(TextField)`
  && {
    font-family: Agrandir;
    background-color: ${Color.MusicDAOLightGreen};
    border-radius: 55px;
    height: 56px;
    padding: 0 17px 0 27px;

    display: flex;
    justify-content: center;
    align-items: center;

    color: ${Color.GrayDark};
    border: 1px solid #7bcbb7;
    transition: 100ms border-color ease;

    &.Mui-focused {
      border-color: ${Color.GrayInputBorderSelected};
    }

    &::placeholder {
      ${Color.GrayInputPlaceholder}
    }

    .MuiInputAdornment-root {
      color: ${Color.GrayInputBorderSelected};
    }

    .MuiInputAdornment-positionEnd {
      margin-right: -${grid(1)};
    }
  }
`;

interface InputWithButtonProps {
  position?: "start" | "end";
  additionalNode: React.ReactNode;
  value?: any;
  handleInputChange?: (e) => void;
  placeholder?: string;
  type?: string;
}

const InputWithButton = ({
  position = "end",
  additionalNode,
  handleInputChange,
  value = "",
  placeholder = "",
  type = "",
}: InputWithButtonProps) => {
  return (
    <div className="input-with-button">
      <StyledTextField
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        type={type}
        InputProps={{
          endAdornment: <InputAdornment position={position}>{additionalNode}</InputAdornment>,
        }}
      />
    </div>
  );
};

export default InputWithButton;
