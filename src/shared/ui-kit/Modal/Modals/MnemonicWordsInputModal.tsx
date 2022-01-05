import React, { useState } from "react";

import { Modal } from "shared/ui-kit";
import { mnemonicWordsInputModalStyles } from "./MnemonicWordsInputModal.styles";

interface IInputWordProps {
  number: number;
  value: string;
  onChange: (s: string) => void;
}
const InputWord: React.FC<IInputWordProps> = ({ number, value, onChange }) => {
  const classes = mnemonicWordsInputModalStyles();

  return (
    <div className={classes.word}>
      <span>{`${number}. `}</span>
      <input type="text" value={value} onChange={ev => onChange(ev.target.value)} />
    </div>
  );
};

interface IMnemonicWordsInputModalProps {
  open: boolean;
  title?: string;
  submitBtnTxt?: string;
  handleSubmit: (phrases: string[]) => void;
  handleClose: () => void;
  onBack?: () => void;
}

export const MnemonicWordsInputModal: React.FC<IMnemonicWordsInputModalProps> = ({
  open,
  title = "Verification",
  submitBtnTxt = "Verify Mnemonic Phrase Key",
  handleSubmit,
  handleClose,
  onBack,
}) => {
  const classes = mnemonicWordsInputModalStyles();

  const [phrases, setPhrases] = useState<string[]>(Array(12).fill(""));

  const handleClickVerify = async () => {
    if (phrases.some(phrase => phrase === "")) {
      alert("Please type all input phrases!");
      return;
    }
    handleSubmit(phrases);
  };

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
      <div className={classes.content}>
        <h1>{`🔎`}</h1>
        <h3>{title}</h3>
        <span>Please enter and fill the empty boxes to verify you mnemonic phrase key</span>
        <div className={classes.seed}>
          {phrases.map((phrase, idx) => (
            <InputWord
              key={idx}
              number={idx + 1}
              value={phrase}
              onChange={s => {
                const temp = [...phrases];
                temp[idx] = s;
                setPhrases(temp);
              }}
            />
          ))}
        </div>
        <button type="button" onClick={handleClickVerify} className={classes.submit}>
          {submitBtnTxt}
        </button>
        {onBack && (
          <button type="button" onClick={onBack}>
            Go Back
          </button>
        )}
      </div>
    </Modal>
  );
};
