import React from "react";

import { Modal, PrimaryButton } from "shared/ui-kit";
import { createPriviWalletModalStyles } from "./CreatePriviWalletModal.styles";

interface ICreatePriviWalletModalProps {
  open: boolean;
  handleClose: () => void;
  handleOk?: () => void;
}

export const CreatePriviWalletModal: React.FC<ICreatePriviWalletModalProps> = ({
  open,
  handleClose,
  handleOk,
}) => {
  const classes = createPriviWalletModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
      <div className={classes.content}>
        <h1>{`👛`}</h1>
        <h3 className={classes.title}>Create a new wallet</h3>
        <p className={classes.subtitle}>
          Generate your own unique Ethereum wallet and receive a public address (0x...).
        </p>
        <PrimaryButton size="medium" onClick={handleOk}>
          Get Started
        </PrimaryButton>
      </div>
    </Modal>
  );
};
