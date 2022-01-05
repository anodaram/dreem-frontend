import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { createStyles, makeStyles } from "@material-ui/core";
import { ModalButton } from "shared/ui-kit/Buttons/ModalButton";
import { setSelectedAuthPage } from "store/actions/SelectedAuthPage";
import SignIn from "./SignIn";
import SignInWallet from "./SignInWallet";
import SignUp from "./SignUpNew";
import SingUpWithEmail from "./SignUpWithEmail";
import SingUpWithWallet from "./SignUpWithWallet";
import ForgotPassword from "./ForgotPassword";
import ResendEmailValidation from "./ResendEmailValidation";
import { Modal } from "shared/ui-kit";

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      fontSize: 40,
      lineHeight: "100%",
      textAlign: "center",
    },
    description: {
      fontSize: 18,
      marginTop: 10,
      textAlign: "center",
    },
    closeButton: {
      cursor: "pointer",
      position: "absolute",
      top: 30,
      right: 30,
    },
    button: {
      display: "block",
      margin: "auto",
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
  })
);

export default function SignInModal(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [type, setType] = useState<string>("signIn");

  const handlePageChange = page => {
    dispatch(setSelectedAuthPage(page));
  };

  const showResendEmailValidation = () => {
    handlePageChange(4);
    setType("resendEmailValidation");
  };

  const showForgotPasswordPage = () => {
    handlePageChange(3);
    setType("forgotPassword");
  };

  const showSignupPage = () => {
    setType("signUp");
    handlePageChange(2);
  };

  const handleClose = () => {
    setType("signIn");
    props.handleClose && props.handleClose();
  };

  return (
    <Modal
      isOpen={props.open}
      onClose={handleClose}
      size="small"
    >
      <div>
        <img
          src={require("assets/icons/x_darkblue.png")}
          alt={"x"}
          className={classes.closeButton}
          onClick={handleClose}
        />
        {type === "signIn" && (
          <>
            <div className={classes.header}>Sign In</div>
            <div className={classes.description}>To create and monetize your content!</div>
            <ModalButton className={classes.button} variant="outlined" onClick={() => setType("signInEmail")}>
              Sign In with Email
            </ModalButton>
            <ModalButton className={classes.button} onClick={() => setType("signInWallet")}>
              Sign In with Wallet
            </ModalButton>
          </>
        )}
        {type === "signInEmail" && (
          <SignIn handleGoSignUp={() => setType("signUp")} handleClose={handleClose} />
        )}
        {(type === "signIn" || type === "signInEmail") && (
          <>
            <div>
              <div className={classes.linkButton} onClick={showForgotPasswordPage}>
                Forgot your password?
              </div>
              <div className={classes.linkButton} onClick={showSignupPage}>
                Sign Up
              </div>
              <div className={classes.linkButton} onClick={showResendEmailValidation}>
                Resend Email Validation
              </div>
            </div>
          </>
        )}
        {type === "signInWallet" && <SignInWallet />}
        {type === "signUp" && <SignUp handleGoSignIn={() => setType("signIn")} setType={setType} />}
        {type === "signUpWithEmail" && <SingUpWithEmail handleGoSignIn={() => setType("signIn")} />}
        {type === "signUpWithWallet" && <SingUpWithWallet handleCloseModal={handleClose} />}
        {type === "forgotPassword" && <ForgotPassword handleGoSignIn={() => setType("signIn")} />}
        {type === "resendEmailValidation" && (
          <ResendEmailValidation handleGoSignIn={() => setType("signIn")} />
        )}
      </div>
    </Modal>
  );
}
