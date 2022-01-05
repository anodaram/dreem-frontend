import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import axios from "axios";
import URL from "shared/functions/getURL";
import "shared/ui-kit/Global.module.css";
import { validEmail } from "shared/constants/constants";
import { trackPromise } from "react-promise-tracker";
import { ModalButton } from "shared/ui-kit/Buttons/ModalButton";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

type FormElement = React.FormEvent<HTMLFormElement>;

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
    form: {
      width: 390,
      textAlign: "center",
      margin: "auto",
      marginTop: 32,
    },
    input: {
      width: "100%",
      padding: "20px 17px !important",
      margin: "0 !important",
      fontSize: 18,
      background: "#F7F8FA",
      border: "1px solid #99A1B3",
      borderRadius: 12,
      "&:focus": {
        outline: "none",
      },
    },
    buttons: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      rowGap: 16,
      marginTop: 32,
    },
  })
);

const ForgotPassword = props => {
  const classes = useStyles();
  const [email, setMail] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const validate = (values: { [key: string]: string }): { [key: string]: string } => {
    let errors: { [key: string]: string } = {};
    if (!validEmail(values.email)) {
      errors.email = "Please enter a valid email";
    }
    return errors;
  };

  const handleSubmit = (event: FormElement) => {
    event.preventDefault();
    let values = { email };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      console.log("submit forgot password");
      requestForgotPassword();
    }
  };

  const requestForgotPassword = async () => {
    const params = {
      email: email,
    };

    setDisableSubmit(true);

    trackPromise(
      axios
        .post(`${URL()}/user/forgot_password`, params)
        .then(res => {
          if (res.data.success) {
            setSuccessMessage(res.data.message);
            // leave submit button as disabled
          } else {
            setErrors({ auth: res.data.message });
            setDisableSubmit(false);
          }
        })
        .catch(async err => {
          setErrors({ auth: "Unable to connect to server" });
          console.log("Error in ForgotPassword.tsx -> requestForgotPassword() : ", err);

          setDisableSubmit(false);
        })
    );
  };

  return (
    <>
      <div className={classes.header}>Forgot Pasword?</div>
      <div className={classes.description}>Enter your recovery email address</div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <InputWithLabelAndTooltip
          overriedClasses={classes.input}
          type="text"
          inputValue={email}
          placeHolder="Enter your Email"
          onInputValueChange={user => setMail(user.target.value)}
          required
        />
        {errors.email ? <div className="error">{errors.email}</div> : null}
        {errors.auth ? <div className="error">{errors.auth}</div> : null}
        {successMessage ? <div className="success">{successMessage}</div> : null}
        <div className={classes.buttons}>
          <ModalButton style={{ width: "75%" }} type="submit" disabled={disableSubmit}>
            Submit
          </ModalButton>
          <ModalButton
            style={{ width: "75%" }}
            type="button"
            onClick={() => props.handleGoSignIn && props.handleGoSignIn()}
          >
            Back to Sign In
          </ModalButton>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword;
