import React from "react";
import { useHistory } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useLoadingProgressModalStyles } from "./index.styles";

require("dotenv").config();
const isProd = process.env.REACT_APP_ENV === "prod";

export default function LoadingProgressModal({
  open,
  type,
  onClose,
}: {
  open: boolean;
  type: string;
  onClose: () => void;
}) {
  const history = useHistory();
  const classes = useLoadingProgressModalStyles();
  const { showAlertMessage } = useAlertMessage();

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="small">
      <div>
        <img className={classes.loader} src={require("assets/metaverseImages/loading.png")} />
        <Box className={classes.title} mt={4}>
          Uploading the draft
        </Box>
        <Box className={classes.header1} mt={2} mb={2}>We are currently uploading your draft files.<br/>This can take a moment, please be patient...</Box>
        <button className={classes.button} onClick={() => history.push("/")}>Back To Home</button>
      </div>
    </Modal>
  );
}
