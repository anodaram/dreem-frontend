import React, { createContext, useContext, useMemo, useState } from "react";
import { ShareMediaModal } from "shared/ui-kit/Modal/Modals/ShareMediaModal";

type ShareMediaContextProviderProps = {};

type ShareMediaContextType = {
  shareMedia(type: string, link: string);
};

const ShareMediaContext = createContext<ShareMediaContextType | null>(null);

export const ShareMediaContextProvider: React.FunctionComponent<ShareMediaContextProviderProps> = ({
  children,
}) => {
  const [shareLink, setShareLink] = useState("");
  const [shareType, setShareType] = useState("");

  const openShareModal = React.useMemo(() => !!(shareLink && shareType), [shareLink, shareType]);
  const handleClose = () => {
    setShareLink("");
    setShareType("");
  };

  const context = useMemo<ShareMediaContextType>(
    () => ({
      shareMedia(type, link) {
        const originPath = window.location.origin + "/#";
        setShareType(type);
        setShareLink(originPath + "/" + link);
      },
    }),
    []
  );

  return (
    <ShareMediaContext.Provider value={context}>
      {children}
      {openShareModal && (
        <ShareMediaModal
          shareType={shareType}
          shareLink={shareLink}
          open={openShareModal}
          handleClose={handleClose}
        />
      )}
    </ShareMediaContext.Provider>
  );
};

export const useShareMedia = () => {
  const context = useContext(ShareMediaContext);

  if (!context) {
    throw new Error("useShareMedia hook must be used inside ShareMediaContextProvider");
  }

  return context;
};
