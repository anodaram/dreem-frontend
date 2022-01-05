import React from "react";
import styled, { FlattenSimpleInterpolation } from "styled-components";
import { Color } from "../../constants/const";
import { shadowDepth1 } from "../../constants/mixins";
import { ExtendableStyled } from "shared/types/Avatar";

type AvatarSize = "xxlarge" | "xlarge" | "large" | "medium" | "small";

type AvatarProps = ExtendableStyled<{
  url: string;
  alt?: string;
  size: AvatarSize;
  noBorder?: boolean;
  title?: string;
  onClick?: () => any
}>;

export const Avatar: React.FunctionComponent<AvatarProps> = React.memo(
  ({ url, alt, size, noBorder, title, ...props }) => (
    <AvatarImage src={url} alt={alt} size={size} noBorder={noBorder} title={title} {...props} />
  )
);

const AVATAR_SIZES: { [key in AvatarSize]: number } = {
  small: 32,
  medium: 48,
  large: 72,
  xlarge: 120,
  xxlarge: 180,
};

const AVATAR_BORDERS: { [key in AvatarSize]: number } = {
  small: 1,
  medium: 2,
  large: 2,
  xlarge: 3,
  xxlarge: 5,
};

const AVATAR_SHADOW: { [key in AvatarSize]: FlattenSimpleInterpolation } = {
  small: shadowDepth1,
  medium: shadowDepth1,
  large: shadowDepth1,
  xxlarge: shadowDepth1,
  xlarge: shadowDepth1,
};

const AvatarImage = styled.img<{ size: AvatarSize; noBorder?: boolean }>`
  object-fit: cover;
  border-radius: 50%;
  width: ${p => AVATAR_SIZES[p.size]}px;
  height: ${p => AVATAR_SIZES[p.size]}px;
  border: ${p => (p.noBorder ? "none" : `${AVATAR_BORDERS[p.size]}px solid ${Color.White}`)};
  ${p => AVATAR_SHADOW[p.size]};
`;
