import { Meta } from "@storybook/react";
import React from "react";
import { Input } from "./Input";

export default {
  title: "inputs/forms/Input",
  component: Input,
} as Meta;

export const medium = () => <Input placeholder="Enter value..." />;

export const large = () => <Input size="large" placeholder="Enter value..." />;
