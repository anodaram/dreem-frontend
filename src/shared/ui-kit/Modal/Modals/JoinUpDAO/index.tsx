import React from "react";

import { joinupDAOModalStyles } from "./index.styles";
import { Modal } from "shared/ui-kit";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";

const JoinUpDAOModal = ({ open, joinType, onClose, onAccept }) => {
  const classes = joinupDAOModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon theme="dark">
      <div className={classes.content}>
        <div className={classes.imgContainer}>{joinType === 0 ? "🎉" : joinType === 1 ? "⏳" : "🤑"}</div>
        <div className={classes.title}>
          {joinType === 0 ? "Congratulations!" : joinType === 1 ? "Wait a minute!" : "Stake First"}
        </div>
        <div className={classes.description}>
          {joinType === 0
            ? "You are now part of the DAO."
            : joinType === 1
            ? "Your request must be accepted by one of the DAO founders. We'll let you know once the process is over."
            : "To be part of this DAO you have to stake an amount of ETH 23"}
        </div>
        <DAOButton onClick={onAccept}>
          {joinType === 0 ? "Go to DAO" : joinType === 1 ? "Back to DAO" : "Continue"}
        </DAOButton>
      </div>
    </Modal>
  );
};

export default JoinUpDAOModal;
