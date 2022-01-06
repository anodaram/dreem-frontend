import React, { FC } from "react";

import Box from "shared/ui-kit/Box";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { statsStyles } from "./index.styles";

type Item = {
  title: string;
  number?: number | string;
};

interface IProps {
  items: Item[];
  title: string;
}

const Stats: FC<IProps> = ({ items, title }) => {
  const classes = statsStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Box className={classes.root} width={isMobile ? 1 : 0.5}>
      <h3 className={classes.title}>{title}</h3>
      <div className={classes.itemsWrapper}>
        {items.map(item => (
          <Box key={item.title + item.number} className={classes.item} width={1 / items.length}>
            <div className={classes.itemInner}>
              <p className={classes.itemNumber}>{item.number}</p>
              <p className={classes.itemTitle}>{item.title}</p>
            </div>
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default Stats;
