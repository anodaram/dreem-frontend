import React from "react";
import { useHistory } from "react-router-dom";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { becomeCreatorModalStyles } from "./index.styles";

const BecomeCreatorModal = (props: any) => {
  const classes = becomeCreatorModalStyles();
  const history = useHistory();

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        px={"60px"}
        py={4}
      >
        <img src={require("assets/metaverseImages/medium_planet.png")} />
        <div className={classes.typo1}>Become Dreem Creator</div>
        <Box className={classes.typo2} mt={"12px"}>
          Becoming the Creator allows you to upload and Share content on Privi Dreem and and build your
          personal experience
        </Box>
        <Box className={classes.typo2} mt={5} mb={1}>
          Currently supported plaforms.
        </Box>
        <img src={require("assets/metaverseImages/unity.png")} />
        <div className={classes.confirmBtn} onClick={() => history.push("/create")}>
          Confirm & go to Creators Page
        </div>
      </Box>
    </Modal>
  );
};

export default BecomeCreatorModal;
