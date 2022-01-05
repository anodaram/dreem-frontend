import React from "react";

type PageRefreshContextType = {
  requireMediaPageReload: boolean;
  setRequireMediaPageReload: (val: boolean) => void;
  requireMarketPlacePageReload: boolean;
  setRequireMarketPlacePageReload: (val: boolean) => void;
  profileAvatarChanged: number;
  setProfileAvatarChanged: (val: number) => void;
};

const PageRefreshContext = React.createContext<PageRefreshContextType | null>(null);

export const PageRefreshContextProvider: React.FC = ({ children }) => {
  const [requireMediaPageReload, setRequireMediaPageReload] = React.useState<boolean>(false);
  const [requireMarketPlacePageReload, setRequireMarketPlacePageReload] = React.useState<boolean>(false);
  const [profileAvatarChanged, setProfileAvatarChanged] = React.useState<number>(0);

  const context = {
    requireMediaPageReload,
    setRequireMediaPageReload,
    requireMarketPlacePageReload,
    setRequireMarketPlacePageReload,
    profileAvatarChanged,
    setProfileAvatarChanged,
  };
  return <PageRefreshContext.Provider value={context}>{children}</PageRefreshContext.Provider>;
};

export const usePageRefreshContext = () => {
  const context = React.useContext(PageRefreshContext);
  if (!context) {
    throw new Error("usePageRefreshContext hook must be used inside PageRefreshContextProvider");
  }
  return context;
};
