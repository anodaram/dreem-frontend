import React from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import { ModalButton } from "shared/ui-kit/Buttons/ModalButton";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "48px !important",
      position: "relative",
    },
    header: {
      fontSize: 40,
      lineHeight: "100%",
      textAlign: 'center',
    },
    description: {
      fontSize: 18,
      marginTop: 16,
      textAlign: 'center',
    },
    closeButton: {
      cursor: "pointer",
      position: "absolute",
      top: 30,
      right: 30,
    },
    button: {
      display: 'block',
      margin: 'auto',
      marginTop: 24,
    },
    linkButton: {
      marginTop: 8,
      fontSize: 14,
      color: "#000",
      textAlign: "center",
      cursor: "pointer",
      "&:first-child": {
        marginTop: 24,
      },
    },
    signInLink: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#03EAA5",
      marginLeft: 8,
      cursor: "pointer",
    },
  })
);

export default function SignUpNew({ setType, handleGoSignIn }) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.header}>Sign Up</div>
      <div className={classes.description}>
        To create and monetize your content!
      </div>
      <ModalButton
        className={classes.button}
        variant="outlined"
        onClick={() => setType("signUpWithEmail")}
      >
        Register with Email
      </ModalButton>
      <ModalButton
        className={classes.button}
        onClick={() => setType("signUpWithWallet")}
      >
        Register with Wallet
      </ModalButton>
      <div className={classes.description}>
        Already registered?
        <span
          className={classes.signInLink}
          onClick={() => handleGoSignIn && handleGoSignIn()}
        >
          Sign In
        </span>
      </div>
    </>
  );
}
