import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { Modal } from "shared/ui-kit";

const useStyles = makeStyles(theme => ({
  finalStepContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 32,

    "& .title": {
      fontSize: 30,
      marginTop: 16,
    },

    "& img": {
      width: 50,
      height: 50,

      "&.loading": {
        width: 75,
        height: 75,
      },
    },

    "& p": {
      fontSize: 18,
      color: "#707582",
      textAlign: "center",
      margin: "24px 0 48px 0",
    },
  },
}));

const FinalStepModal = ({
  isOpen,
  onClose,
  theme,
}: {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}) => {
  const classes = useStyles();

  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon theme={theme}>
      <div className={classes.finalStepContent}>
        <img src={require("assets/mediaIcons/pencil.svg")} alt="final step pencil" />
        <div className="title">Final Step!</div>
        <p>Your wallet will request you to sign to authenticate the process</p>
        <CircularProgress style={{ color: theme === "dark" ? "#A306BA" : "#23D0C6" }} />
      </div>
    </Modal>
  );
};

export default FinalStepModal;