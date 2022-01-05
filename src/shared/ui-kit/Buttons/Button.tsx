import styled, { css } from "styled-components";
import { BorderRadius, grid, Color, FontSize } from "../../constants/const";

type ButtonSize = "large" | "medium" | "small";

export type ButtonProps = React.PropsWithChildren<{
  size: ButtonSize;
  block?: boolean;
  mb?: number;
  ml?: number;
  mt?: number;
  mr?: number;
  radius?: number;
  isRounded?: boolean;
}>;

const BaseButton = styled.button<ButtonProps>`
  font-family: inherit;
  width: ${p => (p.block ? "100%" : "auto")};
  min-width: ${p => BUTTON_MIN_WIDTH[p.size]};
  height: ${p => BUTTON_HEIGHT[p.size]};
  line-height: ${p => BUTTON_HEIGHT[p.size]};
  border-radius: ${p => p.isRounded ? "24px" : p.radius ? `${p.radius}px` : BUTTON_BORDER_RADIUS[p.size]};
  border-width: 0;
  font-size: ${p => FONT_SIZE[p.size]};
  font-weight: 700;
  padding: 0 ${grid(2)};

  ${p =>
    !p.block
      ? css`
          & + & {
            margin-left: ${grid(p.ml || 1)};
          }
        `
      : css`
          &:not(:last-child) {
            margin-bottom: ${grid(p.mb || 2)};
          }
        `}

  ${p =>
    p.ml &&
    css`
      margin-left: ${grid(p.ml)};
    `}
  ${p =>
    p.mr &&
    css`
      margin-right: ${grid(p.mr)};
    `}
  ${p =>
    p.mt &&
    css`
      margin-top: ${grid(p.mt)};
    `}
  ${p =>
    p.mb &&
    css`
      margin-bottom: ${grid(p.mb)};
    `}

  ${p =>
    p.disabled
      ? css`
          background: ${Color.Black} !important;
          color: ${Color.White} !important;
          border-color: ${Color.Black} !important;
          opacity: 0.3;
        `
      : css`
          transition: opacity 0.1s ease;
          &:hover {
            opacity: 0.8;
          }
          &:active {
            opacity: 0.5;
          }
        `}
`;

export const PrimaryButton = styled(BaseButton)`
  color: ${Color.White};
  background-color: ${Color.Black};
`;

export const SecondaryButton = styled(BaseButton)`
  color: ${Color.Black};
  background-color: ${Color.White};
  border: 2px solid ${Color.GrayDark};
`;

export const DangerButton = styled(BaseButton)`
  color: ${Color.Red};
  background-color: ${Color.White};
  border: 2px solid ${Color.Red};
`;

export const PriviSocialButton = styled(BaseButton)`
  color: ${Color.White};
  background-color: ${Color.GrayDark};
  border-radius: 6px;
`;

export const PriviSocialSecondaryButton = styled(BaseButton)`
  color: ${Color.GrayDark};
  background-color: transparent;
  border: 1.5px solid ${Color.GrayDark};
  border-radius: 6px;
`;

export const IconButtonCss = css<ButtonProps>`
  width: ${p => BUTTON_HEIGHT[p.size]};
  height: ${p => BUTTON_HEIGHT[p.size]};
  padding: 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconPrimaryButton = styled(PrimaryButton)`
  ${IconButtonCss};
`;

export const IconSecondaryButton = styled(SecondaryButton)`
  ${IconButtonCss};
`;

const FONT_SIZE: { [key in ButtonSize]: FontSize } = {
  small: FontSize.M,
  medium: FontSize.L,
  large: FontSize.H4,
};

const BUTTON_HEIGHT: { [key in ButtonSize]: string } = {
  small: grid(4),
  medium: grid(5),
  large: grid(7),
};

const BUTTON_MIN_WIDTH: { [key in ButtonSize]: string } = {
  small: grid(6),
  medium: grid(14),
  large: grid(20),
};

const BUTTON_BORDER_RADIUS: { [key in ButtonSize]: BorderRadius } = {
  small: BorderRadius.S,
  medium: BorderRadius.M,
  large: BorderRadius.L,
};
