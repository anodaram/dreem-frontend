import { css } from "styled-components";
import { Color } from "./const";

export const shadowDepth0 = css`
  background-color: ${Color.White};
  border: 1px solid #e9e9e9;
`;

export const shadowDepth1 = css`
  background-color: ${Color.White};
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
`;

export const shadowDepth2 = css`
  background-color: ${Color.White};
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
`;

export const shadowDepth3 = css`
  background-color: ${Color.White};
  box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.08);
`;
