import React from "react";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

interface ILoadingWrapperProps {
  loading: boolean;
  theme?: "dark" | "light" | "green" | "purple" | "light dark" | "blue";
  iconWidth?: string;
  iconHeight?: string;
  height?: string;
}

export const LoadingWrapper: React.FC<ILoadingWrapperProps> = ({
  children,
  loading,
  theme,
  iconWidth = "40px",
  iconHeight = "40px",
  height = "auto",
}) => {
  return loading ? (
    <LoaderDiv height={height}>
      <CircularProgress
        style={{
          color:
            theme && theme === "dark"
              ? "#D810D6"
              : theme && theme === "light dark"
              ? "#FF5954"
              : theme && theme === "green"
              ? "#B1FF00"
              : theme === "purple"
              ? "#431AB7"
              : theme === "blue"
              ? "#431AB7"
              : "#27e8d9",
          width: iconWidth,
          height: iconHeight,
        }}
      />
    </LoaderDiv>
  ) : (
    <>{children}</>
  );
};

const LoaderDiv = styled("div").attrs((props: { height: string }) => ({
  height: props.height || "auto",
}))`
  width: 100%;
  height: ${props => props.height || "auto"};
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
`;
