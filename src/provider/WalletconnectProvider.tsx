import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const walletconnect = new WalletConnectConnector({
  rpc: {
    137: "https://polygon-rpc.com",
    80001: "https://matic-testnet-archive-rpc.bwarelabs.com/",
  },
  infuraId: "eda1216d6a374b3b861bf65556944cdb",
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 15000,
});