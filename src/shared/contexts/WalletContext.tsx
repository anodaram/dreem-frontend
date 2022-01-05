import React from "react";
type ContextType = {
  openTab: { type: OpenType; id: string | undefined } | null;
  setOpenTab: (state: { type: OpenType; id: string | undefined } | null) => void;
};

const WalletContext: React.Context<ContextType> = React.createContext<ContextType>({
  openTab: null,
  setOpenTab: () => {},
});

export enum OpenType {
  Home = "HOME",
  Manager = "Wallet Manager",
  BTC = "Get PRIVI with BTC",
  Swap = "Atomic Swap",
  Send = "Send Tokens",
}

export default WalletContext;
