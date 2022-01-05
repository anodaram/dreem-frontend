import React from "react";

import Box from "shared/ui-kit/Box";

import { ownersStyles } from "./index.styles";
import OwnersList from "../OwnersList";

export default function Owners() {
  const classes = ownersStyles();

  return (
    <Box width={1}>
      <OwnersList />
    </Box>
  );
}
