import React, { FC } from "react";
import { Box, SvgIcon } from "@material-ui/core";
import { Modal } from "shared/ui-kit";
import { ReactComponent as MetamaskSvg } from "assets/walletImages/metamask1.svg";
import { modalStyles } from "./modalStyles";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const NoMetamaskModal: FC<IProps> = ({ open, onClose }) => {
  const classes = modalStyles();

  return (
    <Modal isOpen={open} onClose={onClose} showCloseIcon size="small" className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <SvgIcon className={classes.logoImage}>
          <MetamaskSvg />
        </SvgIcon>
        <Box className={classes.subTitle} mt={4} mb={2}>Don’t have Metamask?</Box>
        <Box className={classes.description} mb={8}>
          You can download browser extension for Chrome, Firefox, Brave or Edge and connect it to get
          waitlisted.
        </Box>
        <button onClick={() => window.open("https://metamask.io/", "_blank")}>
          download NOW
        </button>
      </Box>
    </Modal>
  );
};

export default NoMetamaskModal;