import React from "react";

import { Modal, PrimaryButton } from "shared/ui-kit";
import { connectPriviWalletModalStyles } from "./ConnectPriviWalletModal.styles";

const connectIcon = require("assets/walletImages/connect.svg");

interface IConnectPriviWalletModalProps {
  open: boolean;
  handleClose: () => void;
  handleConnect?: () => void;
}

export const ConnectPriviWalletModal: React.FC<IConnectPriviWalletModalProps> = ({
  open,
  handleClose,
  handleConnect,
}) => {
  const classes = connectPriviWalletModalStyles();

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
      <div className={classes.content}>
        <div className={classes.iconBar}>
          <div className={classes.priviIcon}>
            <img
              src={require("assets/logos/PRIVILOGO.png")}
              style={{ width: 70, marginTop: 13, marginRight: 9 }}
              alt="priviWallet"
            />
            <h5>Privi</h5>
            <h6>www.privi.io</h6>
          </div>
          <div className={classes.connectorIcon}>
            <img src={connectIcon} alt="connect" />
          </div>
          <div className={classes.priviIcon}>
            <img src={require("assets/tokenImages/PRIVI.png")} style={{ width: 70 }} alt="priviWallet" />
            <h5>Privi Wallet</h5>
          </div>
        </div>
        <h3 className={classes.title}>
          Privi would like to <br></br> connect to your account
        </h3>
        <p className={classes.description}>
          This site is requesting access to view your current account address. Always make sure you trust the
          sites you interact with
        </p>
        <p className={classes.mainNetwork}>Main Network: hyper ledger fabrik</p>
        <PrimaryButton size="medium" onClick={handleConnect}>
          Connect
        </PrimaryButton>
      </div>
    </Modal>
  );
};
