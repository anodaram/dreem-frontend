import "./Button.css";
import React, { useEffect, useState, Fragment } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import ConnectModal from "../Modal/Modals/ConnectModal";
import { SupportedNetworksName as supportedNetworks } from "../../connectors/bridge/classes/supportedNetwork";
import styled from "styled-components";

const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;

  button {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const ConnectButton = styled(Button)`
  background-color: transparent;
  font-weight: bold;
  margin: 0 10px 0 0;
  color: #151414;
  border: 2px solid #99a1b3;

  &:hover {
    background-color: #5b6372;
  }
`;

const SignInButton = styled.button`
  background: #000;
  color: #fff;
`;

const noop = () => { };
export default function Buttons(props) {
  //menu functions
  const [openConnect, setOpenConnect] = useState<boolean>(false);
  const user = useTypedSelector(state => state.user);
  const [netId, setNetId] = useState<any>(undefined);
  useEffect(() => {
    const _load = async () => {
      if (user.web3) {
        const networkId = await user.web3.eth.net.getId();
        setNetId(networkId);
      }
    };
    _load();
  }, [user.web3]);

  const handleOpenConnect = () => {
    if (props.refreshWallet) props.refreshWallet();
    setOpenConnect(true);
  };

  const handleCloseConnect = () => {
    if (props.refreshWallet) props.refreshWallet();
    setOpenConnect(false);
  };

  const showAccount = () => {
    if (user.ethAccount && user.ethBalance && user.web3 && netId) {
      //const balance = Math.round(user.ethBalance[0].amount * 1000) / 1000;
      const account = user.ethAccount.slice(0, 4) + ".." + user.ethAccount.slice(-4);
      return /*balance + (netId && netId !== 97 ? ' ETH | ' : ' BNB | ') +*/ account;
    } else {
      return "Account Not Connected";
    }
  };

  // const handleOpenPRIVIScan = () => {
  //   const newWindow = window.open(
  //     "https://priviscan.io",
  //     "_blank",
  //     "noopener,noreferrer"
  //   );
  //   if (newWindow) newWindow.opener = null;
  // };

  return (
    <Fragment>
      <ConnectButton onClick={handleOpenConnect}>
        {user.ethAccount === "" ? (
          <span>Connect Wallet</span>
        ) : netId && netId !== 97 && supportedNetworks[netId] ? (
          <span className="connected">
            {supportedNetworks[netId]}{" "}
            <img src={require("assets/icons/ethereum-brands.svg")} alt={"ethereum-brands"} /> {showAccount()}
          </span>
        ) : netId && netId === 97 && supportedNetworks[netId] ? (
          <span className="connected">
            {supportedNetworks[netId]}
            <img className="iconn" src={require("assets/tokenImages/BNB.png")} alt={"BNB"} />
            {showAccount()}
          </span>
        ) : (
          <span className="connected">Unsupported Network</span>
        )}
      </ConnectButton>
      {openConnect && (
        <ConnectModal
          open={openConnect}
          handleClose={handleCloseConnect}
          refreshWallet={props.refreshWallet || undefined}
        />
      )}

      <SignInButton onClick={noop}>Sign In</SignInButton>
    </Fragment>
  );
}
