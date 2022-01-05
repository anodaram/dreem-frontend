import axios from "axios";
import React, { useEffect, useState } from "react";

import { useTypedSelector } from "store/reducers/Reducer";

import { Modal, grid, Header3 } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import styled from "styled-components";
import styles from "./ChooseWalletModal.module.scss";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

type ChooseWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  theme?: "dark" | "light";
};

export const ChooseWalletModal: React.FunctionComponent<ChooseWalletModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  theme,
}) => {
  const [walletList, setWalletList] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<any>();
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);
  const user = useTypedSelector(state => state.user);

  useEffect(() => {
    if (user && user.id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const selectWalletHandle = wallet => {
    setSelectedWallet(wallet);
    onAccept();
  };

  const loadData = () => {
    setIsWalletLoading(true);
    axios
      .get(`${URL()}/wallet/getUserRegisteredWallets`)
      .then(res => {
        if (res.data.success) {
          setWalletList(res.data.data);
        }
        setIsWalletLoading(false);
      })
      .catch(err => {
        setIsWalletLoading(false);
        console.error("handleConnect getUserRegisteredEthAccount failed", err);
      });
  };

  return (
    <Modal
      size="small"
      isOpen={isOpen}
      onClose={onClose}
      showCloseIcon
      className={theme === "dark" ? styles.darkContent : undefined}
    >
      <ModalHeader>
        <div className={styles.title}>Choose Wallet</div>
      </ModalHeader>

      <div className={styles.modalWrapper}>
        <LoadingWrapper loading={isWalletLoading}>
          <section>
            {walletList && walletList.length > 0 ? (
              <div className={styles.wallets}>
                {walletList.map((wallet, index) => (
                  <WalletTile
                    theme={theme}
                    className={selectedWallet && wallet === selectedWallet ? styles.selectedWallet : ""}
                    key={`wallet-${index}`}
                    onClick={() => {
                      selectWalletHandle(wallet);
                    }}
                  >
                    <div className={styles.walletInfo}>
                      <h4>{wallet && wallet.name ? wallet.name : "name"}</h4>
                      <p>Buy with your Privi Wallet</p>
                    </div>
                    <div className={styles.walletIcon}>
                      {wallet.name && wallet.name.toUpperCase().includes("METAMASK") ? (
                        <img src={require("assets/walletImages/metamask.svg")} width={35} alt="meta mask" />
                      ) : wallet.walletType && wallet.walletType.toUpperCase().includes("WAX") ? (
                        <img src={require("assets/walletImages/waxWallet.png")} width={35} alt="wax wallet" />
                      ) : (
                        <img src={require("assets/logos/PRIVILOGO.png")} width={35} alt="privi wallet" />
                      )}
                    </div>
                  </WalletTile>
                ))}
              </div>
            ) : (
              <h5>No active wallets</h5>
            )}
          </section>
        </LoadingWrapper>
        <section>
          <div className={styles.goToWallet}>
            Can't find your wallet?
            <p>Go to Wallet Manager</p>
          </div>
        </section>
      </div>
    </Modal>
  );
};

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(2)};
`;

type WalletTileProps = React.PropsWithChildren<{
  theme?: "dark" | "light";
}>;

const WalletTile = styled.div<WalletTileProps>`
  background: ${p => `${p.theme && p.theme === "dark" ? "rgba(255, 255, 255, 0.16)" : "#ffffff"}`};
  box-shadow: ${p => `${!p.theme ? " 0px 2px 12px rgba(0, 0, 0, 0.1)" : "none"}`};
  border-radius: ${p => (!p.theme ? "20px" : "0")};
  font-family: ${p => `${p.theme && p.theme === "dark" ? "Agrandir GrandLight" : "Agrandir"}`};
  display: flex;
  justify-content: space-between;
  padding: 32px;
  margin: ${p => `${!p.theme ? "16px 0px" : "0px 0px 16px"}`};
  cursor: pointer;
`;
