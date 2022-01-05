import { Meta } from "@storybook/react";
import React from "react";
import { SearchInput } from "./SearchInput";

export default {
  title: "inputs/forms/SearchInput",
  component: SearchInput,
} as Meta;

export const medium = () => <SearchInput placeholder="Search..." />;

export const large = () => <SearchInput size="large" placeholder="Search..." />;
