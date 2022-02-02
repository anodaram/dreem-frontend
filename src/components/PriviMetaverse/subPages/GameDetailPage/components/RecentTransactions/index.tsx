import React from "react";

import Box from "shared/ui-kit/Box";
import { useStyles } from "./index.styles";

export default function RecentTransactions() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div className={classes.title}>Recent Transactions</div>
      <Box></Box>
    </Box>
  );
}
