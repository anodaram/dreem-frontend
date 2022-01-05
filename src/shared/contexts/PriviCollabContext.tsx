import React from "react";

type ContextType = {
  openTab: OpenType | null;
  setOpenTab: (state: OpenType | null) => void;
  openCreateModal: boolean;
  setOpenCreateModal: (state: boolean) => void;
};

const PriviCollabContext: React.Context<ContextType> = React.createContext<ContextType>({
  openTab: null,
  setOpenTab: () => {},
  openCreateModal: false,
  setOpenCreateModal: () => {}
});

export enum OpenType {
  Discover = "Discover",
  MyCollabs = "My Collabs",
  Requested = "Requested",
  Accepted = "Accepted"
}

export default PriviCollabContext;
