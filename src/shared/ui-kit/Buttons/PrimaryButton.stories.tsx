import { Meta } from "@storybook/react";
import React from "react";
import { PrimaryButton } from "./Button";

export default {
  title: "inputs/buttons/PrimaryButton",
  component: PrimaryButton,
} as Meta;

export const small = () => <PrimaryButton size="small">Button</PrimaryButton>;

export const medium = () => <PrimaryButton size="medium">Button</PrimaryButton>;

export const large = () => <PrimaryButton size="large">Button</PrimaryButton>;

export const block = () => (
  <PrimaryButton size="medium" block>
    Button
  </PrimaryButton>
);
