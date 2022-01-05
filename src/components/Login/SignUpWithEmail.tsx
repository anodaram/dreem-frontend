/**
 * DONE; Unless registration is replaced by mnemonic, check if email belongs to User
 * TODO: Users >0 or >18?
 */

import React, { useState, useRef } from "react";
import axios from "axios";
import { createStyles, makeStyles } from "@material-ui/core";
import URL from "shared/functions/getURL";
import { validEmail } from "shared/constants/constants";
import { trackPromise } from "react-promise-tracker";
import { ModalButton } from "shared/ui-kit/Buttons/ModalButton";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as EyeSolid } from "assets/icons/eye-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Gradient } from "shared/ui-kit";

type FormElement = React.FormEvent<HTMLFormElement>;

interface RegisterData {
  firstName: string;
  email: string;
  password: string;
  role: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      fontSize: 40,
      lineHeight: "100%",
      justifyContent: "center",
      textAlign: "center",
    },
    description: {
      fontSize: 18,
      marginTop: 16,
      justifyContent: "center",
      textAlign: "center",
    },
    signInLink: {
      fontSize: 18,
      fontWeight: "bold",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      background: Gradient.Mint,
      marginLeft: 8,
      cursor: "pointer",
    },
    form: {
      width: "100%",
      textAlign: "center",
    },
    button: {
      marginTop: 48,
    },
    inputField: {
      display: "flex",
      alignItems: "center",
      margin: "auto",
      columnGap: 8,
      background: "#F7F8FA",
      // width: 560,
      height: "67px",
      border: "1px solid #99A1B3",
      boxSizing: "border-box",
      borderRadius: 12,
      position: "relative",
      padding: "0px 0px 0px 16px",
      marginTop: 16,
      "& input": {
        margin: 0,
        fontSize: 18,
        lineHeight: "21px",
        color: "#000",
        background: "transparent",
        flex: 1,
        border: "none",
        outline: "none",
        padding: "0 !important",
      },
      "&:first-child": {
        marginTop: 32,
      },
      "& .eye": {
        position: "absolute",
        top: "50%",
        right: 15,
        transform: "translate(0, -50%)",
        display: "flex",
      },
    },
  })
);

const SignUpWithEmail = props => {
  const classes = useStyles();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [signedUp, setSignedUp] = useState<boolean>(false);

  const validate = (registerData: RegisterData): { [key: string]: string } => {
    var errors: { [key: string]: string } = {};
    if (!validEmail(registerData.email)) {
      errors.email = "Please enter an valid email";
    }
    if (registerData.password.length < 6) {
      errors.password = "Password requires at least 6 characters";
    }
    if (registerData.password !== confirmPassword) {
      errors.confirmPassword = "Please make sure your passwords match";
    }
    return errors;
  };

  const handleSubmit = (event: FormElement): void => {
    event.preventDefault();
    let validatedErrors = validate(registerData);
    console.log(registerData);
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      storeUser(registerData);
    }
  };

  const storeUser = async (registerData: RegisterData) => {
    setDisableSubmit(true);

    trackPromise(
      axios
        .post(`${URL()}/user/signUp`, registerData)
        .then(res => {
          if (res.data.success) {
            setSuccessMessage("Please check your email...");
            setSignedUp(true);
            // leave submit button as disabled
          } else {
            setErrors({ auth: "There was an error when creating User" });
            setDisableSubmit(false);
          }
        })
        .catch(async err => {
          console.log("Error in SignUp.tsx -> storeUser() : ", err);
          setErrors({ auth: "There was an error when creating User" });
          setDisableSubmit(false);
        })
    );
  };

  if (signedUp) {
    return (
      <div style={{ marginBottom: "32%" }}>
        <h3>Thanks for registering, please check your email.</h3>
      </div>
    );
  } else {
    return (
      <div className="register-form">
        <div className={classes.header}>Sign Up</div>
        <div className={classes.description}>
          Already registered?
          <span className={classes.signInLink} onClick={() => props.handleGoSignIn && props.handleGoSignIn()}>
            Sign In
          </span>
        </div>
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.inputField}>
            <img src={require("assets/icons/userIcon.svg")} alt="user-icon" />
            <InputWithLabelAndTooltip
              transparent
              overriedClasses=""
              type="text"
              inputValue={registerData.firstName}
              placeHolder="First Name"
              onInputValueChange={user =>
                setRegisterData({
                  ...registerData,
                  firstName: user.target.value,
                })
              }
              required
              style={{ margin: 0 }}
            />
          </div>
          {errors.firstName ? <div className="error">{errors.firstName}</div> : null}
          <div className={classes.inputField}>
            <img src={require("assets/icons/emailIcon.svg")} alt="user-icon" />
            <InputWithLabelAndTooltip
              transparent
              overriedClasses=""
              type="text"
              inputValue={registerData.email}
              placeHolder="Email"
              onInputValueChange={user =>
                setRegisterData({
                  ...registerData,
                  email: user.target.value,
                })
              }
              required
              style={{ margin: 0 }}
            />
          </div>
          {errors.email ? <div className="error">{errors.email}</div> : null}
          <div className={classes.inputField}>
            <img src={require("assets/icons/lockIcon.svg")} alt="user-icon" />
            <InputWithLabelAndTooltip
              transparent
              overriedClasses=""
              type="password"
              inputValue={registerData.password}
              placeHolder="Password"
              reference={passwordRef}
              onInputValueChange={user =>
                setRegisterData({
                  ...registerData,
                  password: user.target.value,
                })
              }
              required
              style={{ margin: 0 }}
            />
            <div
              className="clickable eye"
              onClick={() => {
                if (passwordRef.current?.type === "password") {
                  passwordRef.current.type = "text";
                } else if (passwordRef.current?.type === "text") {
                  passwordRef.current.type = "password";
                }
                setShowPassword(!showPassword);
              }}
            >
              <SvgIcon>
                <EyeSolid />
              </SvgIcon>
            </div>
          </div>
          {errors.password ? <div className="error">{errors.password}</div> : null}
          <div className={classes.inputField}>
            <img src={require("assets/icons/lockIcon.svg")} alt="user-icon" />
            <InputWithLabelAndTooltip
              transparent
              overriedClasses=""
              type="password"
              inputValue={confirmPassword}
              placeHolder="Pasword Confirmation"
              onInputValueChange={user => setConfirmPassword(user.target.value)}
              required
              style={{ margin: 0 }}
            />
          </div>
          {errors.confirmPassword ? <div className="error">{errors.confirmPassword}</div> : null}
          {errors.auth ? <div className="error">{errors.auth}</div> : null}
          {successMessage ? <div className="success">{successMessage}</div> : null}
          <ModalButton className={classes.button} type="submit" disabled={disableSubmit}>
            Sign Up
          </ModalButton>
        </form>
      </div>
    );
  }
};

export default SignUpWithEmail;
