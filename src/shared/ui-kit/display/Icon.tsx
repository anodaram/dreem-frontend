import React from "react";

const ICONS = {
  plus: require("assets/icons/plus.svg"),
  search: require("assets/icons/search.svg"),
  trash: require("assets/icons/trash.svg"),
};

export type IconName = keyof typeof ICONS;

export type IconProps = {
  name: IconName;
};

export const Icon: React.FunctionComponent<IconProps> = ({ name }) => <img src={ICONS[name]} alt={name} />;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];
