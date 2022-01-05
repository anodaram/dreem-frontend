import React, { useEffect, useState } from "react";
import { Injected } from "./connectors";
import { useWeb3React } from "@web3-react/core";

function MetamaskProvider({ children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React();
  const [loaded, setLoaded] = useState(false);

  const isSignedIn = localStorage.getItem("token");

  useEffect(() => {
    Injected.isAuthorized()
      .then(isAuthorized => {
        setLoaded(true);
        if (isAuthorized && !networkActive && !networkError && isSignedIn) {
          activateNetwork(Injected);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [activateNetwork, networkActive, networkError]);
  if (loaded) {
    return children;
  }
  return <>Loading</>;
}

export default MetamaskProvider;
