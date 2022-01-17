import React from "react";

import Box from "shared/ui-kit/Box";
import { Modal } from "shared/ui-kit";
import { useModalStyles } from "./index.styles";

export default function NoLiquidationPossibleModal({
  open,
  collateral,
  onClose,
}: {
  open: boolean;
  collateral: Number;
  onClose: () => void;
}) {
  const classes = useModalStyles();

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="small">
      <img src={require("assets/metaverseImages/result_fail.png")} width="135px" height="135px" />
      <Box className={classes.title} mt={4}>
        No liquidation possible at this time
      </Box>
      <Box className={classes.header1} mt={2} mb={2}>
        The buyer has provided sufficient collateral. You can only liquidate a blocked reservation if the
        level of collateral is under {collateral}%
      </Box>
    </Modal>
  );
}
