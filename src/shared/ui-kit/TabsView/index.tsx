import React, { useState } from "react";
import { tabViewStyles } from "./index.styles";
import { Box, BoxProps } from "@material-ui/core";
import clsx from "clsx";

export interface TabItem {
  key: string;
  title: string;
}

type TabViewProps = {
  tabs: TabItem[];
  onSelectTab: (tab: TabItem) => void;
  equalTab?: boolean;
} & BoxProps;

const TabsView: React.FC<TabViewProps> = ({ equalTab, tabs, onSelectTab, ...props }: TabViewProps) => {
  const classes = tabViewStyles();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const handleSelectTab = (index: number, tab: TabItem) => {
    setSelectedTab(index);
    onSelectTab && onSelectTab(tab);
  };

  return (
    <Box className={classes.root} {...props}>
      {tabs.map((tab, index) => (
        <Box
          className={clsx(
            classes.tab,
            index === selectedTab && classes.selected,
            equalTab && classes.equalized
          )}
          onClick={() => handleSelectTab(index, tab)}
        >
          {tab.title}
        </Box>
      ))}
    </Box>
  );
};

export default TabsView;
