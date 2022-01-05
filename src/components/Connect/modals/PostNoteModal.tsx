import React, { FC, useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { Modal } from "shared/ui-kit";
import { modalStyles } from "./modalStyles";

declare let window: any;
const isDev = process.env.REACT_APP_ENV === "dev";

interface IProps {
  open: boolean;
  onClose: () => void;
  onNext?: () => void;
}

const PostNoteModal: FC<IProps> = props => {
  const classes = modalStyles();
  const { chainId } = useWeb3React();

  const { open, onClose, onNext } = props;
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
    }
  }, [open]);

  const handleClose = () => {
    onClose && onClose();
  };

  useEffect(() => {
    if (chainId === 80001 && isSubmitted) {
      onNext && onNext();
    }
  }, [chainId]);

  const onSuccess = async () => {
    if (chainId !== 80001 && isDev) {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
        setSubmitted(true);
      }
    } else {
      onNext && onNext();
    }
  };

  return (
    <Modal isOpen={open} onClose={handleClose} size="small" className={`${classes.container} ${classes.gradientContainer}`}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={classes.warning} mb={4}>⚠️</Box>
        <Box className={classes.title} mb={4}>IMPORTANT</Box>
        <Box className={classes.description} mb={4}>
          The platform is running on <b>MUMBAI TESTNET</b><br />here, make sure to at no times send any tokens from<br /> your <b>BSC OR ETHEREUM MAINNET</b><br />addresses to any of the addresses here.
        </Box>
        <button onClick={onSuccess}>
          {chainId !== 80001 && isDev ? "I understood it. Connect me to mumbai" : "I understood it"}
        </button>
      </Box>
    </Modal>
  );
};

export default PostNoteModal;