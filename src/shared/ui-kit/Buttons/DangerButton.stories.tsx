import { Meta } from "@storybook/react";
import React from "react";
import { DangerButton } from "./Button";

export default {
  title: "inputs/buttons/DangerButton",
  component: DangerButton,
} as Meta;

export const example = () => <DangerButton size="medium">Perform Dangerous Action</DangerButton>;
