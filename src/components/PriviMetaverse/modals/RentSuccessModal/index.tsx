import React from "react";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { RentSuccessModalStyles } from "./index.style";

export default function RentSuccessModal({ open, handleClose = () => {} }) {
  const classes = RentSuccessModalStyles();

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box className={classes.borderBox} mb={5}>
        <Box className={classes.box}>
          <img src={"https://d3uo2nnehyvpin.cloudfront.net/images/house/house_001_001_010.png"} alt="nft" />
          <Box className={classes.tag}>RENTED</Box>
          <Box className={classes.gameName} mt={2}>
            Game Name
          </Box>
        </Box>
      </Box>
      <Box className={classes.title} mb={1}>
        You’ve rented GAME NFT.
      </Box>
      <Box className={classes.description} mb={5}>
        Congrat’s you’ve succesfully rented <span>[GAME NFT name]</span> at{" "}
        <span>[Price per sec]. You can go to</span> Management and enjoy your Synthetic GAME
      </Box>
      <PrimaryButton size="medium">done</PrimaryButton>
    </Modal>
  );
}
