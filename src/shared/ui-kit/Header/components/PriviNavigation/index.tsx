import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Box from 'shared/ui-kit/Box';
import { Text } from "shared/ui-kit/common";
import { FontSize, Gradient } from "shared/constants/const";

interface PriviNavigationProps {
  navigations: string[];
  selected: string;
  onNavSelect: (nav: string) => void;
  theme?: "dark" | "light";
}

const useStyles = makeStyles({
  navText: {
    fontSize: 16,
    color: "#E0DFF0",
    cursor: "pointer",
  },
  navTextLight: {
    fontSize: 16,
    color: "black",
    cursor: "pointer",
  },
  selectedLight: {
    color: "#04C800",
  },
  selectedDark: {
    background: Gradient.Magenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
});

const PriviNavigation = ({ navigations, onNavSelect, selected, theme }: PriviNavigationProps) => {
  const classes = useStyles();
  const handleSelect = (nav: string) => () => {
    onNavSelect(nav);
  };

  return (
    <Box display="flex" flexDirection="row">
      {navigations.map((nav, index) => (
        <Box key={`privi-nav-${index}`} onClick={handleSelect(nav)} ml={2}>
          <span
            className={`${theme === "light" ? classes.navTextLight : classes.navText} ${selected === nav ? (theme === "light" ? classes.selectedLight : classes.selectedDark) : ""
              }`}
          >
            {nav}
          </span>
        </Box>
      ))}
    </Box>
  );
};

export default PriviNavigation;
