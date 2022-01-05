import React from "react";
import { Modal } from "@material-ui/core";
import styles from "./MessageModal.module.scss";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
interface IMessageModalProps {
  open: boolean;
  icon: string;
  message: string;
  submitBtnTxt: string;
  handleClose?: () => void;
  handleOk?: () => void;
}

export const MessageModal: React.FC<IMessageModalProps> = ({
  open,
  icon,
  message,
  submitBtnTxt,
  handleClose,
  handleOk,
}) => {
  return (
    <Modal open={open}>
      <div className={styles.wrapper}>
        <div className={styles.modal}>
          <span className={styles.closeBtn} onClick={handleClose}>
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </span>
          <h1>{icon}</h1>
          <p className={styles.subtitle}>
            {message}
          </p>
          <button type="button" onClick={handleOk}>
            {submitBtnTxt}
          </button>
        </div>
      </div>
    </Modal>
  );
};
