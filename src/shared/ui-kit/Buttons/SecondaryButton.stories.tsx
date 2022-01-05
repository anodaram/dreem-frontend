import { Meta } from "@storybook/react";
import React from "react";
import { SecondaryButton } from "./Button";

export default {
  title: "inputs/buttons/SecondaryButton",
  component: SecondaryButton,
} as Meta;

export const small = () => <SecondaryButton size="small">Button</SecondaryButton>;

export const medium = () => <SecondaryButton size="medium">Button</SecondaryButton>;

export const large = () => <SecondaryButton size="large">Button</SecondaryButton>;

export const block = () => (
  <SecondaryButton size="medium" block>
    Button
  </SecondaryButton>
);
