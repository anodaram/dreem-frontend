import React from "react";

import { joinupCommunityModalStyles } from "./index.styles";
import { Modal, PrimaryButton } from "shared/ui-kit";

const JoinUpCommunityModal = ({ open, joinType, onCloseDialog }) => {
  const classes = joinupCommunityModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onCloseDialog} showCloseIcon>
      <div className={classes.content}>
        <div className={classes.imgContainer}>{joinType === 0 ? "🎉" : joinType === 1 ? "⏳" : "🤑"}</div>
        <div className={classes.title}>
          {joinType === 0 ? "Congratulations!" : joinType === 1 ? "Wait a minute!" : "Stake First"}
        </div>
        <div className={classes.description}>
          {joinType === 0
            ? "You are now part of the community."
            : joinType === 1
            ? "Your request must be accepted by one of the community founders. We'll let you know once the process is over."
            : "To be part of this community you have to stake an amount of ETH 23"}
        </div>
        <PrimaryButton size="medium" onClick={onCloseDialog}>
          {joinType === 0 ? "Go to Community" : joinType === 1 ? "Back to Community" : "Continue"}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default JoinUpCommunityModal;
