import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import { ConnectPriviWalletModal, MnemonicWordsInputModal } from "shared/ui-kit/Modal/Modals";
import { generatePriviWallet } from "shared/helpers";

interface IConnectPriviWallet {
  onClose?: () => void;
  walletList?: any;
  setWalletList?: (any) => void;
}

enum CONNECTSTEP {
  INIT,
  MNEMONIC,
}

const ConnectPriviWallet: FC<IConnectPriviWallet> = props => {
  const userId = localStorage.getItem("userId");
  const [step, setStep] = useState(CONNECTSTEP.INIT);
  const { walletList, setWalletList } = props;
  const { onClose } = props;

  const handleConnect = () => {
    setStep(CONNECTSTEP.MNEMONIC);
  };

  const handleSubmit = async (phrases: string[]) => {
    const { address, privateKey } = await generatePriviWallet(phrases);
    axios
      .post(`${URL()}/wallet/connectPriviWallet`, {
        userId,
        address,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setWalletList && setWalletList([...walletList, resp.wallet]);
          handleClose();
        } else {
          // Wallet Creation failed
          alert(resp.message);
        }
      });
  };
  const handleClose = () => {
    setStep(CONNECTSTEP.INIT);
    onClose && onClose();
  };

  useEffect(() => {}, []);

  return (
    <>
      <ConnectPriviWalletModal
        open={step === CONNECTSTEP.INIT}
        handleConnect={handleConnect}
        handleClose={handleClose}
      />
      <MnemonicWordsInputModal
        open={step === CONNECTSTEP.MNEMONIC}
        title="Connect Privi Wallet"
        submitBtnTxt="Connet Wallet"
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </>
  );
};

export default ConnectPriviWallet;
