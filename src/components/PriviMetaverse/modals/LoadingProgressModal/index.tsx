import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useLoadingProgressModalStyles } from "./index.styles";

require("dotenv").config();
const isProd = process.env.REACT_APP_ENV === "prod";

export default function LoadingProgressModal({
  open,
  title,
  onClose,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
}) {
  const classes = useLoadingProgressModalStyles();
  const { showAlertMessage } = useAlertMessage();

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="small">
      <div style={{ position: "relative" }}>
        <img className={classes.loader} src={require("assets/metaverseImages/loading.png")} />
        <Box className={classes.title} mt={4}>
          {title}
        </Box>
        <Box className={classes.header1} mt={2} mb={2}>Please wait...</Box>
      </div>
    </Modal>
  );
}
