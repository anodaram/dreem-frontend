import styled, { css } from "styled-components";
import { Color, grid } from "../../constants/const";

export const Divider = styled.hr`
  border-bottom: 1px solid ${Color.Black};
  opacity: 0.2;
  margin: ${grid(2)} 0;
`;

type DividerType = "solid" | "dashed";

export type DividerProps = React.PropsWithChildren<{
  type: DividerType;
  color?: Color | string;
  margin?: number;
  mt?: number;
  mb?: number;
}>;

export const StyledDivider = styled.hr<DividerProps>`
  opacity: 0.3;
  border-bottom: ${p => `1px ${p.type} ${p.color || Color.Black}`};
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
    p.margin &&
    css`
      margin-bottom: ${grid(p.margin)};
      margin-top: ${grid(p.margin)};
    `}
`;
