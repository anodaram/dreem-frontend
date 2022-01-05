import React from "react";
import {
  AppBar as MuiAppBar,
  Tabs as MuiTabs,
  Tab,
  useMediaQuery,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import styled from "styled-components";
import { Color, FontSize } from "../../../constants/const";
import { Gradient } from "shared/ui-kit";

type TabNavigationProps = {
  tabs: Array<string>;
  currentTab: number;
  variant?: "primary" | "secondary";
  size?: "large" | "small" | "extralarge";
  padding?: number;
  showBorder?: boolean;
  onTabChange: (value: number) => void;
  theme?: "dark" | "light" | "black" | "green" | "cyan";
};

type AppBarProps = {
  type?: "primary" | "secondary";
  size?: "large" | "small" | "extralarge";
  $ismobile?: boolean;
  padding?: number;
  theme?: "dark" | "light" | "black" | "green";
};

const a11yProps = (index: number) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
};

const AppBar = styled(MuiAppBar) <AppBarProps>`
  && {
    margin-left: 0;
    background-color: ${props => (props.type === "primary" ? "white" : "transparent")};
    box-shadow: none;
    overflow-x: auto;
    border-radius: 0;
    margin-bottom: ${props => (props.type === "primary" ? 0 : -3)}px;

    .MuiTab-root.Mui-selected {
      font-weight: 800;
      z-index: 100;
    }

    .MuiTab-root {
      min-width: auto;
      color: ${props =>
    props.theme === "dark" ? Color.White : props.theme === "green" ? Color.GrayDark : Color.GrayTab};
      font-weight: ${props => (props.theme === "green" ? 800 : "inherit")};
      opacity: ${props => (props.theme === "green" ? 1 : "inherit")};
      text-transform: ${props => (props.theme === "green" ? "uppercase" : "none")};
      white-space: nowrap;
      padding: ${props => (props.padding !== undefined ? `${props.padding}px` : "6px 12px")};
      margin-right: ${props => (props.$ismobile ? "0px" : "10px")};
      margin-left: ${props => (props.$ismobile ? "0px" : "10px")};
      font-size: ${props =>
    props.size === "large" ? FontSize.L : props.size === "extralarge" ? "25px" : FontSize.M};
      font-family: Agrandir;
    }

    .MuiTab-root:first-child {
      margin-left: 0;
    }

    .MuiTab-root:hover {
      background-color: transparent;
    }

    .MuiTabScrollButton-root {
      color: ${Color.GrayTab};
    }
  }
`;

const Tabs = styled(MuiTabs)`
  && {
    .MuiTabs-scroller {
      overflow-x: auto;
    }
  }
`;

const useStyles = makeStyles(() =>
  createStyles({
    tabItem: {
      "&.Mui-selected": {
        "& span": {
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          background: Gradient.Mint,
        },
      },
    },
    tabItemDark: {
      "&.Mui-selected": {
        "& span": {
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          background: Gradient.BlueMagenta,
        },
      },
    },
    tabItemGreen: {
      "&.Mui-selected": {
        "& span": {
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          background: Gradient.Green,
        },
      },
    },
    tabItemBlack: {
      "&.Mui-selected": {
        "& span": {
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          background: "black",
        },
      },
    },
    tabItemCyan: {
      "&.Mui-selected": {
        "& span": {
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          background: "#431AB7",
        },
      },
    },
  })
);

export const TabNavigation = ({
  tabs,
  currentTab,
  variant,
  size,
  showBorder = true,
  padding,
  theme,
  onTabChange,
}: TabNavigationProps) => {
  const mobileMatches = useMediaQuery("(max-width:375px)");
  const handleChange = (e, value) => {
    onTabChange(value);
  };

  const classes = useStyles();

  return (
    <AppBar
      position="static"
      type={variant || "primary"}
      size={size}
      theme={theme}
      $ismobile={mobileMatches}
      padding={padding}
    >
      <Tabs
        TabIndicatorProps={{
          style: {
            background:
              theme === "dark"
                ? Gradient.BlueMagenta
                : theme === "light"
                  ? Gradient.Mint
                  : theme === "green"
                    ? Gradient.Green
                    : theme === "cyan"
                      ? "#431AB7"
                      : "black",
            height: showBorder ? "3px" : "0",
          },
        }}
        value={currentTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((name, index) => (
          <Tab
            label={name}
            key={index}
            {...a11yProps(index)}
            className={
              theme === "dark"
                ? classes.tabItemDark
                : theme === "light"
                  ? classes.tabItem
                  : theme === "green"
                    ? classes.tabItemGreen
                    : theme === "cyan"
                      ? classes.tabItemCyan
                      : classes.tabItemBlack
            }
          />
        ))}
      </Tabs>
    </AppBar>
  );
};
