import React from "react";

import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useModalStyles } from "./index.styles";

const EditDraftContentModal = ({ open, onClose }) => {
  const classes = useModalStyles();

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box className={classes.content}></Box>
    </Modal>
  );
};

export default EditDraftContentModal;
