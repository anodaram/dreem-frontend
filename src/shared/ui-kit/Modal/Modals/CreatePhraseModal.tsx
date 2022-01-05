import React from "react";

// import styles from "./CreatePhraseModal.module.scss";
import { createPhraseModalStyles } from "./CreatePhraseModal.styles";

import { Modal } from "shared/ui-kit";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import { ReactComponent as DangerIcon } from "assets/icons/exclamation-triangle-solid.svg";
import { ReactComponent as RandomIcon } from "assets/icons/random-solid.svg";

export const CreatePhraseModal = ({
  open,
  onBack,
  onNext,
  phrases,
  onGenerate,
  onClose,
}: {
  open: boolean;
  onBack: () => void;
  onNext: () => void;
  phrases: string[];
  onGenerate: () => void;
  onClose: () => void;
}) => {
  const classes = createPhraseModalStyles();

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon>
      <div className={classes.content}>
        <div className={classes.main}>
          <h1>Create new wallet</h1>
          <h3>Your Mnemonic Phrase</h3>
          <div className={classes.seed}>
            {phrases.map((phrase, idx) => (
              <span className={classes.word} key={`${phrase}${idx}`}>{`${idx + 1}. ${phrase}`}</span>
            ))}
          </div>
          <button type="button" className={classes.random} onClick={onGenerate}>
            <RandomIcon style={{ width: 25 }} />
            <span>Random</span>
          </button>
          <button type="button" onClick={onNext}>
            I Wrote Down My Mnemonic Phrase
          </button>
          <button type="button" className={classes.goBack} onClick={onBack}>
            Go back
          </button>
          <div className={classes.danger}>
            <DangerIcon />
            <div className={classes.comment}>
              <b>DO NOT FORGET</b>
              Save your mnemonic phrase.
              <br />
              You will need this to access your wallet.
            </div>
          </div>
        </div>
        <div className={classes.other}>
          <i className={classes.image}></i>
          <span>ART CREDIT</span>
          <i>@Us3rNextboot</i>
        </div>
      </div>
    </Modal>
  );
};
