import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { BorderRadius, grid } from "../../constants/const";
import { shadowDepth0, shadowDepth1, shadowDepth2, shadowDepth3 } from "../../constants/mixins";

type PanelShadow = 0 | 1 | 2 | 3;

type PanelBorderRadius = "xlarge" | "large" | "medium" | "small";

type PanelProps = {
  shadow: PanelShadow;
  borderRadius: PanelBorderRadius;
  noPadding?: boolean;
};

export const Panel = styled.div<PanelProps>`
  ${p => PANEL_SHADOW[p.shadow]};
  border-radius: ${p => PANEL_BORDER_RADIUS[p.borderRadius]};

  ${p =>
    !p.noPadding &&
    css`
      padding: ${grid(3)} ${grid(4)};
    `}

  &:not(:last-child) {
    margin-bottom: ${grid(2)};
  }
`;

const PANEL_SHADOW: { [key in PanelShadow]: FlattenSimpleInterpolation } = {
  0: shadowDepth0,
  1: shadowDepth1,
  2: shadowDepth2,
  3: shadowDepth3,
};

const PANEL_BORDER_RADIUS: { [key in PanelBorderRadius]: BorderRadius } = {
  small: BorderRadius.S,
  medium: BorderRadius.M,
  large: BorderRadius.L,
  xlarge: BorderRadius.XL,
};
