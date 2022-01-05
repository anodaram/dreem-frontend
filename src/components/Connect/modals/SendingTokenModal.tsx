import React, { FC } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import styled from "styled-components";
import { Modal } from "shared/ui-kit";
import { modalStyles } from "./modalStyles";

interface IProps {
  open: boolean;
  onClose?: () => void;
}

const SendingTokenModal: FC<IProps> = props => {
  const classes = modalStyles();

  const { open, onClose } = props;

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose}  size="small" className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={classes.progress}>
          <CircularProgress
            size={130}
            style={{ color: "#A0D800" }}
          />
        </Box>
        <Box className={classes.title} mt={8} mb={4}>
          <span className={classes.green}>We Are</span>&nbsp;Sending You 100K Test USDT&nbsp;
          <span className={classes.green}>To test Test TRAX</span>
        </Box>
        <Box className={classes.description}>
          You have not been selected to early test Trax. But we have good news. Trax will
          be live on Mainnet for everyone really shortly!
        </Box>
      </Box>
    </Modal>
  );
};

export default SendingTokenModal;

const LoaderDiv = styled("div")`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
`;
