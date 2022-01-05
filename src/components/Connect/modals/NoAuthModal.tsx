import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { Modal } from "shared/ui-kit";
import { modalStyles } from "./modalStyles";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const NoAuthModal: FC<IProps> = props => {
  const classes = modalStyles();

  const { open, onClose } = props;

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} showCloseIcon size="small" className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={classes.cryIcon} mb={4}>
          😢
        </Box>
        <Box className={classes.title} mb={4}>We are sorry</Box>
        <Box className={classes.description}>
          You have not been selected to early test Privi Exchange. But we have good news. Privi Exchange will
          be live on Mainnet for everyone really shortly!
        </Box>
      </Box>
    </Modal>
  );
};

export default NoAuthModal;