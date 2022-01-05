import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { confirmable, createConfirmation } from "react-confirm";

import { Modal } from "shared/ui-kit/Modal/Modal";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit/Buttons";

const useConfirmAlertModalStyles = makeStyles(theme => ({
  root: {
    borderRadius: "0px !important",
    background: "#212121 !important",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 32,
  },
  typo1: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    color: "#fff",
  },
  typo2: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Rany",
    color: "#fff",
  },
}));

const ConfirmAlertModal = props => {
  const { show, proceed, cancel, title, subTitle } = props;
  const classes = useConfirmAlertModalStyles();

  const handleOk = () => {
    proceed(true);
  };

  const handleCancel = () => {
    proceed(false);
  };

  return (
    <Modal isOpen={show} onClose={cancel} size="small" className={classes.root} showCloseIcon>
      <Box className={classes.container}>
        <Box className={classes.typo1}>{title}</Box>
        <Box className={classes.typo2} mt={1}>
          {subTitle}
        </Box>
        <Box display="flex" mt={5}>
          <SecondaryButton
            size="medium"
            style={{
              height: 59,
              background: "transparent",
              fontSize: 18,
              fontFamily: "Grifter",
              fontWeight: 700,
              color: "#fff",
              border: "1px solid #ffffff80",
              borderRadius: 70,
              paddingTop: 8,
              minWidth: 150,
            }}
            onClick={handleCancel}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            style={{
              height: 59,
              background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
              fontSize: 18,
              fontFamily: "Grifter",
              fontWeight: 700,
              color: "#212121",
              marginLeft: 24,
              borderRadius: 70,
              paddingTop: 8,
              minWidth: 150,
            }}
            onClick={handleOk}
          >
            Yes
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default createConfirmation(confirmable(ConfirmAlertModal));
