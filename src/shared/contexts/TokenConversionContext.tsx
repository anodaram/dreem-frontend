import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import { roundFloat } from "shared/helpers/number";

type TokenConversionContextType = {
  convertTokenToUSD(tokenType: string, value: number): number;
};

const TokenConversionContext = createContext<TokenConversionContextType | null>(null);

export const TokenConversionContextProvider: React.FunctionComponent = ({ children }) => {
  const [tokenRates, setTokenRates] = useState<Record<string, number>>({});

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
      const resp = res.data;

      if (resp.success) {
        const data: Record<string, string> = resp.data;

        const parsedTokens: Record<string, number> = Object.fromEntries(
          Object.entries(data).map(([token, rate]) => [token.toUpperCase(), parseFloat(rate)])
        );

        setTokenRates(parsedTokens);
      }
    });
  }, []);

  const context = useMemo<TokenConversionContextType>(
    () => ({
      convertTokenToUSD(tokenType: string, value: number) {
        const normalizedTokenType = tokenType?.toUpperCase() ?? "";
        const rate = tokenRates[normalizedTokenType] || 1;

        return roundFloat((value * rate), 8);
      },
    }),
    [tokenRates]
  );

  return <TokenConversionContext.Provider value={context}>{children}</TokenConversionContext.Provider>;
};

export const useTokenConversion = () => {
  const context = useContext(TokenConversionContext);
  if (!context) {
    throw new Error("useTokenConversion hook must be used inside TokenConversionContextProvider");
  }
  return context;
};
