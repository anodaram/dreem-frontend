import React from "react";
import styled, { css } from "styled-components";
import { BorderRadius, Color, FontSize, grid } from "shared/ui-kit";
import { shadowDepth2 } from "shared/constants/mixins";

export const MasnoryCard = styled.div`
  ${shadowDepth2};
  border-radius: ${BorderRadius.XL};
  overflow: hidden;
`;

type BadgeProps = React.PropsWithChildren<{
  bgcolor?: Color;
  color?: Color;
}>;

export const Badge = styled.div<BadgeProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 100%;
  font-size: ${FontSize.M};
  background: ${props => props.bgcolor || Color.Red};
  color: ${props => props.color || Color.White};
`;

type TextProps = React.PropsWithChildren<{
  bold?: boolean;
  size?: FontSize;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
}>;

export const Text = styled.span<TextProps>`
  font-size: ${p => p.size || FontSize.XL};
  color: ${p => (p.bold ? Color.Black : Color.GrayDark)};
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
