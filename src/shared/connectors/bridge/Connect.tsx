import React, { useEffect } from "react";

import Web3 from "web3";
import axios from "axios";
import { useDispatch } from "react-redux";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useTypedSelector } from "store/reducers/Reducer";
import { updateTask } from "../../functions/updateTask";
import { setWeb3 } from "store/actions/User";
import { setEthAccount } from "store/actions/User";
import { WalletButton } from "shared/ui-kit/Buttons/WalletButton";
import UpdateBalance from "./classes/UpdateBalance";

import URL from "../../functions/getURL";
import "./Connect.css";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const metaMaskIcon = require("assets/walletImages/metamask.svg");
const walletConnectIcon = require("assets/walletImages/wallet_connect.svg");
const waxIcon = require("assets/tokenImages/WAX.png");

declare let window: any;

const Connect = props => {
  const { handleMetamask, handleWalletConnect, disabled } = props;
  const [waxWallet, setWaxWallet] = React.useState<any>();
  const [isDataLoading, setIsDataLoading] = React.useState<boolean>(false);
  const user = useTypedSelector(state => state.user);
  const updateBalance = new UpdateBalance();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsDataLoading(true);
    axios
      .get(`${URL()}/wallet/getUserRegisteredWallets`)
      .then(res => {
        if (res.data.success) {
          const wallets = res.data.data.filter(w => w.walletType === "WAX");
          if (wallets.length > 0) {
            setWaxWallet(wallets[0]);
          }
        }
        setIsDataLoading(false);
      })
      .catch(err => {
        setIsDataLoading(false);
        console.error("Swap-Modal connect getUserRegisteredEthAccount failed", err);
      });
  }, []);

  /**
   * Connect to User's wallet through an Ethereum web browser (Metamask)
   * and store the account and balance into state variables
   */
  const handleConnectWithMetaMask = async (): Promise<any> => {
    let account = "";
    try {
      let web3: any;
      // Ask User permission to connect to Ethereum (Metamask)
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" }).then(newAccounts => {
          dispatch(setEthAccount(newAccounts[0], "injected"));
          account = newAccounts[0];
        });
      } else if (window.ethereum) {
        web3 = new Web3(window.ethereum);
      } else {
        window.alert("Non-Ethereum browser detected. Please install MetaMask extension in your browser");
        return;
      }

      // Save web3 in state
      dispatch(setWeb3(web3));

      // Update account balance
      updateBalance.updateAccount(web3, account);

      // Listen for account change in Ethereum browser
      window.ethereum.on("accountsChanged", (addr: string) => {
        if (addr.length > 0) {
          dispatch(setEthAccount(addr[0], "injected"));
          updateBalance.updateAccount(web3, addr[0]);
          updateTask(user.id, "Connect Metamask wallet");
        } else {
          // User disconnects from the PRIVI web in Metamask
          updateBalance.removeAccount();
        }
      });

      // Listen for chain change in Ethereum browser
      window.ethereum.on("chainChanged", async (chainId: string) => {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" }).then(newAccounts => {
          dispatch(setEthAccount(newAccounts[0], "injected"));
          account = newAccounts[0];
        });
        dispatch(setWeb3(web3));
        updateBalance.updateAccount(web3, account);
      });

      // register user eth address in db
      handleMetamask(account, window.ethereum);
    } catch (err) {
      console.log("Error in Connect.tsx -> handleConnect(): ", err);
    }
  };

  const handleConnectWithWalletConnect = async (): Promise<any> => {
    let account = "";
    try {
      let web3: any;
      const provider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.infura.io/v3/a12bea19c1bd4b239b130026b0138e4b",
          3: "https://ropsten.infura.io/v3/a12bea19c1bd4b239b130026b0138e4b",
          100: "https://dai.poa.network",
          // ...
        },
        qrcodeModalOptions: {
          mobileLinks: ["rainbow", "metamask", "argent", "trust", "imtoken", "pillar"],
        },
      });
      await provider.enable();
      // Ask User permission to connect to Ethereum (Metamask)
      if (provider) {
        web3 = new Web3(provider as any);
        account = await web3.eth.getAccounts();
        dispatch(setEthAccount(account[0], "walletconnect"));
      } else if (window.ethereum) {
        web3 = new Web3(window.ethereum);
      } else {
        window.alert("Non-Ethereum browser detected. Please install MetaMask extension in your browser");
        return;
      }

      // Save web3 in state
      dispatch(setWeb3(web3));

      // Update account balance
      updateBalance.updateAccount(web3, account[0]);

      // register user eth address in db
      handleWalletConnect(account[0], provider);
    } catch (err) {
      console.log("Error in Connect.tsx -> handleConnect(): ", err);
    }
  };

  return (
    <div className="connect-options">
      <WalletButton
        icon={metaMaskIcon}
        type="normal"
        handleClick={() => handleConnectWithMetaMask()}
        walletName="MetaMask"
        walletAddress=""
        disabled={disabled}
      />
      <WalletButton
        icon={walletConnectIcon}
        walletName="WalletConect"
        walletAddress=""
        handleClick={() => handleConnectWithWalletConnect()}
        disabled={disabled}
      />
      <LoadingWrapper loading={isDataLoading}>
        {waxWallet && (
          <WalletButton
            icon={waxIcon}
            walletName="WAX Wallet"
            walletAddress={waxWallet.address}
            handleClick={() => props.handleWaxConnect && props.handleWaxConnect(waxWallet)}
            disabled={disabled}
          />
        )}
      </LoadingWrapper>
      <br />
    </div>
  );
};

export default Connect;
