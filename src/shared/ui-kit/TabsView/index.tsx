import React, { useState } from "react";
import { tabViewStyles } from "./index.styles";
import { Box, BoxProps } from "@material-ui/core";
import clsx from "clsx";

export interface TabItem {
  key: string;
  title: string;
  badge?: string | number;
}

type TabViewProps = {
  tabs: TabItem[];
  equalTab?: boolean;
  percentagedTab?: boolean;
  onSelectTab: (tab: TabItem) => void;
  renderTab?: (tab: TabItem) => React.ReactNode;
  extendedClasses?: any;
  seletedTabIndex?: number;
} & BoxProps;

const TabsView: React.FC<TabViewProps> = ({
  equalTab,
  percentagedTab,
  tabs,
  onSelectTab,
  renderTab,
  extendedClasses,
  seletedTabIndex,
  ...props
}: TabViewProps) => {
  // extend classes when given
  const classes = extendedClasses ? { ...tabViewStyles(), ...extendedClasses } : tabViewStyles();

  const [selectedTab, setSelectedTab] = useState<number>(
    seletedTabIndex && seletedTabIndex > 0 ? seletedTabIndex : 0
  );
  const handleSelectTab = (index: number, tab: TabItem) => {
    setSelectedTab(index);
    onSelectTab && onSelectTab(tab);
  };

  return (
    <Box className={classes.root} {...props}>
      {tabs.map((tab, index) => (
        <Box
          key={tab.key}
          className={clsx(
            classes.tab,
            index === selectedTab && classes.selected,
            equalTab && classes.equalized,
            percentagedTab && classes.percentaged
          )}
          onClick={() => handleSelectTab(index, tab)}
        >
          {renderTab ? renderTab(tab) : tab.title}
        </Box>
      ))}
    </Box>
  );
};

export default TabsView;
