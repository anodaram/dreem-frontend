import React, { FC } from "react";
import cls from "classnames";
import styles from "./NoMetamaskModal.module.scss";
import { Modal } from "../Modal";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as MetamaskSvg } from "assets/walletImages/metamask1.svg";
interface IProps {
  open: boolean;
  onClose: () => void;
}

export const NoMetamaskModal: FC<IProps> = props => {
  const { open, onClose } = props;

  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <Modal isOpen={open} onClose={handleClose} size="small">
      <div className={cls(styles.wrapper)}>
        <div className={styles.modal}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
            className={styles.closeButton}
            onClick={handleClose}
          />
          <SvgIcon className={styles.image}>
            <MetamaskSvg />
          </SvgIcon>
          <h1>Don’t have Metamask?</h1>
          <span>
            You can download browser extension for Chrome, Firefox, Brave or Edge and connect it to get
            waitlisted.
          </span>
          <a type="button" target="_blank" href="https://metamask.io/" className={styles.submit}>
            Go to Metamask Website
          </a>
        </div>
      </div>
    </Modal>
  );
};
