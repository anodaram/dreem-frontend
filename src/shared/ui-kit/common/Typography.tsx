import styled, { css, StyledComponent } from "styled-components";
import { grid, FontSize, Color } from "../../constants/const";

interface HeaderProps {
  noMargin?: boolean;
  theme?: "dark" | "light";
  fontWeight?: number;
}

type HeaderThemeProps = {
  theme?: "dark" | "light";
};

const headerCommon = css`
  font-weight: 400;
  line-height: 104.5%;
  margin: 0;
`;

const makeHeaderBold = (component: StyledComponent<any, any, any, any>) => styled(component)`
  font-weight: 700;
`;

export const Header1 = styled.h1<HeaderProps>`
  ${headerCommon}
  color: ${props => (props.theme === "dark" ? Color.White : Color.Black)};
  font-size: ${FontSize.H1};
  margin-bottom: ${props => (props.noMargin ? "0" : grid(2))};
`;

export const Header2 = styled.h2<HeaderProps>`
  ${headerCommon}
  color: ${props => (props.theme === "dark" ? Color.White : Color.Black)};
  font-size: ${FontSize.H2};
  margin-bottom: ${props => (props.noMargin ? "0" : grid(2))};
`;

export const Header3 = styled.h3<HeaderProps>`
  ${headerCommon}
  color: ${props => (props.theme === "dark" ? Color.White : Color.Black)};
  font-size: ${FontSize.H3};
  margin-bottom: ${props => (props.noMargin ? "0" : grid(2))};
  font-weight: ${props => props.fontWeight ?? 400};
`;

export const Header4 = styled.h4<HeaderProps>`
  ${headerCommon}
  color: ${props => (props.theme === "dark" ? Color.White : Color.Black)};
  font-size: ${FontSize.H4};
`;

export const Header5 = styled.h5<HeaderProps>`
  ${headerCommon}
  color: ${props => (props.theme === "dark" ? Color.White : Color.Black)};
  font-size: ${FontSize.H5};
  margin-bottom: ${props => (props.noMargin ? "0" : grid(2))};
`;

export const Header6 = styled.h5<HeaderProps>`
  ${headerCommon}
  color: ${props => (props.theme === "dark" ? Color.White : Color.Black)};
  font-size: ${FontSize.H6};
  margin-bottom: ${props => (props.noMargin ? "0" : grid(2))};
`;

export const HeaderBold1 = makeHeaderBold(Header1);
export const HeaderBold2 = makeHeaderBold(Header2);
export const HeaderBold3 = makeHeaderBold(Header3);
export const HeaderBold4 = makeHeaderBold(Header4);
export const HeaderBold5 = makeHeaderBold(Header5);
export const HeaderBold6 = makeHeaderBold(Header6);

export const Paragraph = styled.p`
  color: ${Color.Black};
  font-size: ${FontSize.M};
  line-height: 104.5%;
`;

export type TextProps = React.PropsWithChildren<{
  bold?: boolean;
  size?: FontSize;
  color?: Color;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  opacity?: number;
  align?: "auto" | "center" | "left" | "right";
}>;

export const Text = styled.span<TextProps>`
  font-size: ${p => p.size || FontSize.M};
  color: ${p => (p.color ? p.color : p.bold ? Color.Black : Color.GrayDark)};
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
  ${p =>
    p.opacity &&
    css`
      opacity: ${p.opacity};
    `};
  ${p =>
    p.align &&
    css`
      text-align: ${p.align};
    `};
`;
