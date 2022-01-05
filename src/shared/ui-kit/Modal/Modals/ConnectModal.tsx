import React, { useState, useEffect } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "../../../functions/getURL";
import { Modal } from "@material-ui/core";
import ConnectWalletTab from "../../../connectors/bridge/Connect";
import MyWalletsTab from "../../../connectors/bridge/MyWallets";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./ConnectModal.css";
import {
  VIEW_WALLET_NORMAL,
  VIEW_WALLET_CONNECT_PRIVI,
  VIEW_WALLET_SIGN_IN_ALERT,
  VIEW_WALLET_SIGNATURE_REQUEST,
  VIEW_WALLET_CONNECT_SERVICE,
} from "./ModalConstants";
import { TabNavigation } from "../../index";

const tabOptions = ["connect wallet", "my wallets"];

export const ConnectPriviWalletView = ({ handleCancel = () => {}, handleConnect = () => {} }) => {
  return (
    <div className="wallet-view">
      <h3>Connect Wallet</h3>
      <div className="body">
        <div className="connection">
          <img src={require("assets/walletImages/privi_wallet.svg")} />
          <img src={require("assets/walletImages/privi_wallet.svg")} />
        </div>
        <div className="title">Privi would like to connect to your account</div>
        <div className="description">
          This site is requesting access to view your current account address. Always make sure you trust the
          sites you interact with
        </div>
        <div className="main-network">Main Network: hyper ledger fabrik</div>
      </div>
      <div className="action">
        <button onClick={handleCancel} className="cancel-btn">
          Cancel
        </button>
        <button onClick={handleConnect} className="connect-btn">
          Connect
        </button>
      </div>
    </div>
  );
};

export const WalletSignInAlert = ({ handleSignIn = () => {} }) => {
  return (
    <div className="sign-in-view">
      <div>
        <img src={require("assets/walletImages/pencil.svg")} />
      </div>
      <div className="title">Final step! Your wallet will ask you to digitally sign in your wallet</div>
      <div className="action">
        <button onClick={handleSignIn}>sign</button>
      </div>
    </div>
  );
};

export const WalletSignatureRequest = ({
  signatureInfo,
  handleSignIn = () => {},
  handleCancel = () => {},
}) => {
  const { accountId, balance } = signatureInfo;

  return (
    <div className="signature-request-view">
      <h3>Signature request</h3>
      <div className="body">
        <div className="logo">
          <img src={require("assets/walletImages/privi_wallet.svg")} />
        </div>
        <div className="title">Your signature is begin requested</div>
        <div className="container">
          <div className="field-name">Account</div>
          <div className="field-info linear-green">{accountId}</div>
        </div>
        <div className="container">
          <div className="field-name">Balance</div>
          <div className="field-info">{balance}</div>
        </div>
        <div className="description">You are signing:</div>
        <div className="long-desc">
          <p>
            Ultricies adipiscing pharetra dignissim consectetur elit faucibus urna odio congue. Feugiat lorem
            eros, erat integer. Cras est viverra. Tellus facilisis consequat integer justo, imperdiet ut est.
            Magna sed at amet ac tempor. Ac pulvina.
          </p>
          <p>
            commodo nisl dignissim nisl ornare nunc. Eu quisque mi, felis bibendum mattis ac. Urna enim sit
            sapien, feugiat dapibus cras eget. Nec tempus blandit amet sit. Adipiscing libero.
          </p>
        </div>
        <div className="action">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="sign-btn" onClick={handleSignIn}>
            Sign
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ConnectModal(props) {
  // type of swaps
  enum SwapTypes {
    SWAP_APPROVE_ERC20 = "ERC20 Approve",
    WITHDRAW_ERC20 = "ERC20 Withdraw",
    SWAP_TRANSFER_ERC20 = "ERC20 Deposit",
    WITHDRAW_ETH = "ETH Withdraw",
    SWAP_TRANSFER_ETH = "ETH Deposit",
  }

  const user = useTypedSelector(state => state.user);
  const [status, setViewStatus] = React.useState<string>(VIEW_WALLET_NORMAL);

  const [menuSelection, setMenuSelection] = useState<number>(0);
  const [walletList, setWalletList] = useState<{}>({});
  const handleChangeTabs = value => {
    setMenuSelection(value);
  };

  useEffect(() => {
    getWallets();
  }, [menuSelection, status]);

  const newWallet = async (walletType, address) => {
    try {
      await axios
        .post(`${URL()}/wallet/registerUserEthAccount`, {
          userId: user.id,
          address: address,
          walletStatus: true,
          walletType: walletType,
        })
        .then(res => {
          if (res.data.success) {
            getWallets();
            setViewStatus(VIEW_WALLET_NORMAL);
          }
        });
    } catch (err) {
      console.error("handleConnect registerUserEthAccount failed", err);
    }
  };
  const getWallets = async () => {
    try {
      await axios.get(`${URL()}/wallet/getUserRegisteredWallets`).then(res => {
        if (res.data.success) {
          setWalletList(res.data.data);
        }
      });
    } catch (err) {
      console.error("handleConnect getUserRegisteredEthAccount failed", err);
    }
  };

  const removeWallet = async address => {
    try {
      await axios
        .post(`${URL()}/wallet/removeUserRegisteredWallet`, {
          userId: user.id,
          address: address,
        })
        .then(res => {
          if (res.data.success) {
            getWallets();
          }
        });
    } catch (err) {
      console.error("handleConnect removeUserRegisteredAccount failed", err);
    }
  };

  const signatureInfo = {
    accountId: "Art Gallery #01",
    balance: "1,992,304.00 ETH",
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content w50 connect-modal" style={{ width: 576, minHeight: 350 }}>
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>

        {status !== VIEW_WALLET_NORMAL ? (
          (status === VIEW_WALLET_CONNECT_PRIVI && (
            <ConnectPriviWalletView
              handleConnect={() => {
                setMenuSelection(1);
                setViewStatus(VIEW_WALLET_NORMAL);
              }}
              handleCancel={() => {
                setMenuSelection(0);
                setViewStatus(VIEW_WALLET_NORMAL);
              }}
            />
          )) ||
          (status === VIEW_WALLET_SIGN_IN_ALERT && (
            <WalletSignInAlert
              handleSignIn={() => {
                setViewStatus(VIEW_WALLET_SIGNATURE_REQUEST);
              }}
            />
          )) ||
          (status === VIEW_WALLET_SIGNATURE_REQUEST && (
            <WalletSignatureRequest
              signatureInfo={{
                accountId: user.ethAccount,
                balance: user.ethBalance,
              }}
              handleSignIn={() => {
                setMenuSelection(1);
                setViewStatus(VIEW_WALLET_NORMAL);
              }}
              handleCancel={() => {
                setMenuSelection(0);
                setViewStatus(VIEW_WALLET_NORMAL);
              }}
            />
          )) ||
          (status === VIEW_WALLET_CONNECT_SERVICE && (
            <ConnectPriviWalletView
              handleConnect={() => {
                setMenuSelection(1);
                setViewStatus(VIEW_WALLET_NORMAL);
              }}
              handleCancel={() => {
                setMenuSelection(0);
                setViewStatus(VIEW_WALLET_NORMAL);
              }}
            />
          ))
        ) : (
          <>
            <TabNavigation
              tabs={tabOptions}
              currentTab={menuSelection}
              variant="primary"
              size="small"
              onTabChange={handleChangeTabs}
            />

            <div className="content">
              {menuSelection === 0 ? (
                <ConnectWalletTab
                  handlePriviWallet={() => setViewStatus(VIEW_WALLET_CONNECT_PRIVI)}
                  handleMetamask={address => {
                    setMenuSelection(1);
                    newWallet(user.id, address);
                  }}
                  handleWalletConnect={() => setViewStatus(VIEW_WALLET_CONNECT_SERVICE)}
                />
              ) : menuSelection === 1 ? (
                <MyWalletsTab
                  dataList={walletList}
                  handleAddWallet={() => setMenuSelection(0)}
                  handleDisconnect={removeWallet}
                />
              ) : null}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
