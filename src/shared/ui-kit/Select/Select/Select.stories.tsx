import React from "react";
import { Meta } from "@storybook/react";
import { Dropdown } from "./Select";
import { BlockchainNets } from "shared/constants/constants";

export default {
  title: "inputs/forms/Select",
  component: Dropdown,
} as Meta;

export const dropdown = () => <Dropdown value={BlockchainNets[0].value} menuList={BlockchainNets} />;

export const imageDropdown = () => (
  <Dropdown value={BlockchainNets[0].value} menuList={BlockchainNets} hasImage />
);

export const errorImageDropdown = () => (
  <Dropdown value={BlockchainNets[0].value} menuList={BlockchainNets} hasImage helperText="Please select" />
);
