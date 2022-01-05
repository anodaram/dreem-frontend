import React from "react";
import { Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { notAppModalStyles } from "./index.styles";
import { forceDownload } from "shared/helpers/file_download";
import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getOperatingSystem } from "shared/helpers/platform";

const FILE_LINK_MAC = "https://dreem.fra1.digitaloceanspaces.com/Dreem.dmg";
const FILE_LINK_WINDOWS = "https://dreem.fra1.digitaloceanspaces.com/Dreem.msi";

const NotAppModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const classes = notAppModalStyles();

  const { isSignedin, setSignedin } = useAuth();
  const { showAlertMessage } = useAlertMessage();

  const handleDownload = () => {
    if (!isSignedin) {
      showAlertMessage("Sign in required", { variant: "error" });
      return;
    }

    //download file
    const os = getOperatingSystem(window);
    if (os === "Mac") {
      forceDownload(FILE_LINK_MAC);
    } else if (os === "Windows") {
      forceDownload(FILE_LINK_WINDOWS);
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box className={classes.container} height={1}>
        <Box className={classes.title}>OOPS!</Box>
        <Box className={classes.description}>
          Looks like you don’t have your Dreem app installed. Please click Download
          <br />
          button below to download and Install the app so you could enter Dreem!
        </Box>
        <PrimaryButton
          size="medium"
          style={{
            width: "70%",
            height: 56,
            background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
            color: "#212121",
            fontFamily: "GRIFTER",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 18,
            lineHeight: "120%",
            textAlign: "center",
            textTransform: "uppercase",
            marginTop: 60,
            borderRadius: "100vh",
          }}
          onClick={handleDownload}
        >
          download dreem app
        </PrimaryButton>
      </Box>
    </Modal>
  );
};

export default NotAppModal;
