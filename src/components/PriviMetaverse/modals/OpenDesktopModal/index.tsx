import React from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { openDesktopModalStyles } from "./index.styles";

const OpenDesktopModal = ({
  open,
  onClose,
  isPlay,
}: {
  open: boolean;
  onClose: () => void;
  isPlay?: boolean;
}) => {
  const classes = openDesktopModalStyles();

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        <svg width="38" height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.8851 33.7056H27.2185M15.0245 26.5414V33.7053M22.6459 26.5414V33.7053M2.40723 2.40723H35.7594V26.4438H2.40723V2.40723Z"
            stroke="url(#download_linear_2958_17509)"
            strokeWidth="3"
            strokeLinecap="square"
          />
          <defs>
            <linearGradient
              id="download_linear_2958_17509"
              x1="22.7353"
              y1="26.9728"
              x2="-2.92647"
              y2="10.1632"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ED7B7B" />
              <stop offset="1" stopColor="#EDFF1C" />
            </linearGradient>
          </defs>
        </svg>
        <Box className={classes.gradientText} my={2}>
          open on desktop
          <br /> {isPlay ? "to play" : "to download"}
        </Box>
        <Box className={classes.text}>
          Dreem is available on your Windows or Mac PC. Open it on your computer and enjoy the experience, and
          let us know how we’re doing in our Discord!
        </Box>
      </Box>
    </Modal>
  );
};

export default OpenDesktopModal;
