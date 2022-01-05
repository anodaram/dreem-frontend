import React, { useState } from "react";

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";

import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { ShareWithQRCode } from "shared/ui-kit/Modal/Modals/ShareWithQRCode";

export const SharePopup = ({ item, openMenu, anchorRef, handleCloseMenu }) => {
  const [openQrCodeModal, setOpenQrCodeModal] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string>("");
  const { shareMedia } = useShareMedia();

  const getPrefixURL = () => {
    return window.location.origin + "/#";
  };

  const handleShareWithQR = () => {
    if (item.Type === "Character") {
      setShareLink(`${getPrefixURL()}/realms/${item.realm?.id}/${item.id}`);
    } else if (item?.MediaSymbol || item.PodAddress) {
      setShareLink(
        `${getPrefixURL()}/${item.PodAddress ? "pod" : ""}/${item.MediaSymbol || item.PodAddress || item.id}`
      );
    } else if (item?.collectionId && item?.tokenId) {
      setShareLink(`${getPrefixURL()}/gameNFT/${item.collectionId}/${item.tokenId}`);
    } else {
      setShareLink(`${getPrefixURL()}/pod_post/${item.id}`);
    }
    handleCloseMenu();
    setOpenQrCodeModal(!openQrCodeModal);
  };

  const hideQRCodeModal = () => {
    setOpenQrCodeModal(false);
  };

  const handleOpenShareModal = () => {
    handleCloseMenu();
    if (item.Type === "Character") {
      shareMedia(item.Type, `realms/${item.realm?.id}/${item.id}`);
    } else if (item?.MediaSymbol || item.PodAddress) {
      shareMedia(item.Type, item.MediaSymbol ? "" : `pod/${item.PodAddress}`);
    } else if (item?.collectionId && item?.tokenId) {
      shareMedia("gameNFT", `gameNFT/${item.collectionId}/${item.tokenId}`);
    } else {
      shareMedia(item.Type, item.MediaSymbol ? "" : `pod_post/${item.id}`);
    }
  };

  return (
    <>
      <Popper
        open={openMenu}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        style={{ position: "inherit", zIndex: 9999 }}
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleCloseMenu}>
                <MenuList autoFocusItem={openMenu} id="menu-list-grow">
                  <MenuItem onClick={handleOpenShareModal}>
                    <img
                      src={require("assets/icons/butterfly.png")}
                      alt={"spaceship"}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                    Share on social media
                  </MenuItem>
                  <MenuItem onClick={handleShareWithQR}>
                    <img
                      src={require("assets/icons/qrcode_small.png")}
                      alt={"spaceship"}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                    Share With QR Code
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      {openQrCodeModal && (
        <ShareWithQRCode isOpen={openQrCodeModal} onClose={hideQRCodeModal} shareLink={shareLink} />
      )}
    </>
  );
};
