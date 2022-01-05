import { Meta } from "@storybook/react";
import React from "react";
import { TabNavigation } from "./index";

export default {
  title: "inputs/Navigation/TabsNavigation",
  component: TabNavigation,
} as Meta;

const tabs = ['Tab1', 'Tab2', 'Tab3'];
let selectedTab = 0;

const handleTabChange = (value) => {
  selectedTab = value;
}

export const Tabs = () => (
  <TabNavigation
    tabs={tabs}
    currentTab={selectedTab}
    variant="primary"
    size="small"
    onTabChange={handleTabChange}
  />
);
