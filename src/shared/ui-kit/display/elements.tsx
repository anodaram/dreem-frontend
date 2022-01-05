import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import { Divider } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import styles from "./elements.module.scss";
import { Modal } from "shared/ui-kit";

export const FinalStepModal = ({
  isOpen,
  onClose,
  theme,
}: {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}) => {
  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon theme={theme}>
      <div className={styles.finalStepContent}>
        <img src={require("assets/mediaIcons/pencil.svg")} alt="final step pencil" />
        <div className={styles.title}>Final Step!</div>
        <p>Your wallet will request you you to sign to authenticate the process</p>
        <CircularProgress style={{ color: theme === "dark" ? "#A306BA" : "#23D0C6" }} />
      </div>
    </Modal>
  );
};

export const WalletSignatureRequestModal = ({ isOpen, onClose, onPostProcess = () => {} }) => {
  const user = useTypedSelector(state => state.user);
  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
      <div className={styles.SignatureRequestContent}>
        <WalletSignatureRequest
          signatureInfo={{
            accountId: user.ethAccount,
            balance: user.ethBalance,
          }}
          handleSignIn={() => {
            onClose();
            if (onPostProcess) onPostProcess();
          }}
          handleCancel={onClose}
        />
      </div>
    </Modal>
  );
};

export const WalletSignatureRequest = ({
  signatureInfo,
  handleSignIn = () => {},
  handleCancel = () => {},
}) => {
  const { accountId, balance } = signatureInfo;

  return (
    <div className={styles.signatureRequestView}>
      <h3>Signature request</h3>
      <div className={styles.body}>
        <div className={styles.logo}>
          <div className={styles.container}>
            <div className={styles.fieldName}>Account</div>
            <div className={styles.fieldInfo}>{accountId}</div>
          </div>
          <img className={styles.tokenImage} src={require(`assets/tokenImages/ETH.png`)} alt="Etherum" />
          <div className={styles.container}>
            <div className={styles.fieldName}>Balance</div>
            <div className={styles.fieldInfo}>{`${balance[0].amount} ${balance[0].symbol}`}</div>
          </div>
        </div>
        <div className={styles.title}>Your signature is begin requested</div>
        <div className={styles.description}>You are signing:</div>
        <Divider />
        <div className={styles.longDesc}>
          <p className={styles.message}>Message:</p>
          <p className={styles.messageContent}>
            To avoid digital cat burglars, sign below to authenticate with CrypoKitties.
          </p>
        </div>
        <Divider />
        <div className={styles.action}>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
          <button className={styles.signBtn} onClick={handleSignIn}>
            Sign
          </button>
        </div>
      </div>
    </div>
  );
};
