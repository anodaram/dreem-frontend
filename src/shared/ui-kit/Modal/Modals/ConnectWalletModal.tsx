import React from "react";
import { Box, makeStyles } from "@material-ui/core";

import { Modal } from "shared/ui-kit";
import { SecondaryButton } from "shared/ui-kit/Buttons";

interface IConnectWalletModalProps {
  open: boolean;
  handleClose: () => void;
  handleWallectConnect?: () => void;
  handleMetamaskConnect?: () => void;
}

const ConnectWalletModal = ({
  open,
  handleClose,
  handleWallectConnect,
  handleMetamaskConnect,
}: IConnectWalletModalProps) => {
  const classes = useStyles();

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
      <SecondaryButton size="medium" onClick={handleMetamaskConnect} className={classes.button}>
        <img src={require("assets/walletImages/metamask.svg")} alt="metamask"/>
        <Box flex={1} display="flex" justifyContent="center">
          Metamask Connect
        </Box>
      </SecondaryButton>
      <SecondaryButton size="medium" onClick={handleWallectConnect} className={classes.button}>
        <img src={require("assets/walletImages/wallet_connect.svg")} alt="metamask"/>
        <Box flex={1} display="flex" justifyContent="center">
          Wallet Connect
        </Box>
      </SecondaryButton>
    </Modal>
  )
}

export default ConnectWalletModal;


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "64px !important",
    paddingBottom: "64px !important",
  },
  button: {
    display: "flex",
    alignItems: "center",
    width: "320px !important",
    height: "80px !important",
    fontSize: "20px !important",
    fontWeight: 800,
    "& img": {
      marginRight: 24,
    },
    "& + &": {
      marginLeft: "0 !important",
      marginTop: 24,
    }
  }
}));