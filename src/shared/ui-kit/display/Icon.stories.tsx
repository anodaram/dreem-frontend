import { Meta } from "@storybook/react";
import React from "react";
import { Icon, ICON_NAMES } from "./Icon";

export default {
  title: "display/Icon",
  component: Icon,
} as Meta;

export const IconsList = () => (
  <table>
    <thead>
      <tr>
        <th>Icon</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      {ICON_NAMES.map(iconName => (
        <tr>
          <td>
            <Icon name={iconName} />
          </td>
          <td>{iconName}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
