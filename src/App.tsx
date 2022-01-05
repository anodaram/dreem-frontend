import { hot } from "react-hot-loader/root";
import React from "react";
import { Provider as StoreProvider } from "react-redux";
import { Web3ReactProvider as Web3Provider } from "@web3-react/core";
import { UseWalletProvider as WalletProvider } from "use-wallet";
import { store } from "store/store";
import Auth from "components/Login/Auth";
import getLibrary from "shared/functions/getLibrary";
import Interceptor from "store/interceptor/interceptor";
import { walletConnect, chainId } from "shared/constants/constants";
import { SnackbarProvider } from "notistack";
import MetamaskProvider from "./provider/MetamaskProvider";

Interceptor.interceptor(store);

const App = ({ hideLoader }) => {
  React.useEffect(hideLoader, []);

  return (
    <WalletProvider chainId={chainId} connectors={walletConnect}>
      <Web3Provider getLibrary={getLibrary}>
        <MetamaskProvider>
          {/* <SubstrateProvider> */}
          <StoreProvider store={store}>
            <SnackbarProvider maxSnack={3}>
              <Auth />
            </SnackbarProvider>
          </StoreProvider>
          {/* </SubstrateProvider> */}
        </MetamaskProvider>
      </Web3Provider>
    </WalletProvider>
  );
};

export default process.env.NODE_ENV === "development" ? hot(App) : App;
