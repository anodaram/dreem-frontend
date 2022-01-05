import React, { FC } from "react";
import cls from "classnames";
import styles from "./UnlockPriviWalletModal.module.scss";
import { Modal } from "@material-ui/core";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
interface IProps {
  open: boolean;
  onClose: () => void;
}

export const UnlockPriviWalletModal: FC<IProps> = props => {
  const { open, onClose } = props;

  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={cls(styles.wrapper)}>
        <div className={styles.modal}>
          <span className={styles.closeBtn} onClick={handleClose}>
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </span>
          <h1>{`🎉`}</h1>
          <div>Success</div>
          <span>You have created you wallet successfully.</span>
          <button type="button" onClick={handleClose} className={styles.submit}>
            Unlock Wallet
          </button>
        </div>
      </div>
    </Modal>
  );
};
