import React, { FC } from "react";
import { Box } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import { Modal } from "shared/ui-kit";
import { modalStyles } from "./modalStyles";
import { ReactComponent as MetamaskSvg } from "assets/walletImages/metamask1.svg";

declare let window: any;

interface IProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  account: string;
}

const USDTGetModal: FC<IProps> = (props) => {
  const classes = modalStyles();

  const { open, onClose, amount, account } = props;

  const handleClose = () => {
    onClose && onClose();
  };

  const onAddTrax = async () => {
    if (!window.ethereum) {
      return;
    }
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0xaE502540f0CEa5475D23EbbA48AacD8469bceFe4",
          symbol: "TRAX",
          decimals: 18,
          image:
            "https://uploadsdev.ams3.digitaloceanspaces.com/launchpad/tokenFunding-app-token-photo/7183d138-585a-4886-868d-e83454d81b562WAkNq2M7nIg6Iu0HzBA.gif",
        },
      },
    });
    handleClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} showCloseIcon size="small" className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={require("assets/tokenImages/USDT.png")} alt="USDT" width={96} height={96} />
        <Box className={`${classes.subTitle} ${classes.green}`} mt={4} mb={4}>Received {amount}<br />Test USDT Tokens</Box>
        <Box className={classes.description} mb={4}>
          You have just received&nbsp;<b>{amount} USDT Testnet Tokens</b>&nbsp;to try out the Privi
          Exchange features before we rollout the Mainnet version shortly.
          <br />
          <br />
          <strong>Include USDT Test Token</strong>&nbsp;on your token list with Metamask. The address is
          <br />
          <Box className={classes.green}>{account}</Box>
        </Box>
        <button onClick={onAddTrax}>
          Add USDT to Metamask&nbsp;&nbsp;+&nbsp;&nbsp;
          <SvgIcon className={classes.buttonImage}>
            <MetamaskSvg />
          </SvgIcon>
        </button>
      </Box>
    </Modal>
  );
};

export default USDTGetModal;