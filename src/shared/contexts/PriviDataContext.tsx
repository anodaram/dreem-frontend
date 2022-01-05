import React from "react";

type ContextType = {
  openTab: OpenType | null;
  setOpenTab: (state: OpenType | null) => void;
};

const PriviDataContext: React.Context<ContextType> = React.createContext<ContextType>({
  openTab: null,
  setOpenTab: () => {},
});

export enum OpenType {
  Home = "HOME",
  Advertise = "ADVERTISE",
  BuyDATAp = "BUY DATAP",
}
export default PriviDataContext;
