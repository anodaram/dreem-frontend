import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles } from "@material-ui/core";
import axios from "axios";
import URL from "shared/functions/getURL";
import "shared/ui-kit/Global.module.css";
import "./SignIn.css";
import { validEmail } from "shared/constants/constants";
import { useDispatch } from "react-redux";
import { setUser } from "store/actions/User";
import { trackPromise } from "react-promise-tracker";
import { setLoginBool } from "store/actions/LoginBool";
import { socket } from "./Auth";
import { ModalButton } from "shared/ui-kit/Buttons/ModalButton";
import { useAuth } from "shared/contexts/AuthContext";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as EyeSolid } from "assets/icons/eye-solid.svg";
import { Gradient } from "shared/ui-kit";
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
      width: "100%",
      textAlign: "center",
    },
    inputField: {
      display: "flex",
      alignItems: "center",
      margin: "auto",
      columnGap: 8,
      background: "#F7F8FA",
      // width: 560,
      border: "1px solid #99A1B3",
      boxSizing: "border-box",
      borderRadius: 12,
      position: "relative",
      height: "67px",
      marginTop: 16,
      "&:first-child": {
        marginTop: 32,
      },
      "& input": {
        fontSize: 18,
        lineHeight: "21px",
        margin: 0,
        color: "#000",
        background: "transparent",
        border: "none",
        width: "100%",
        "&:focus": {
          outline: "none",
        },
      },
      "& .eye": {
        position: "absolute",
        top: "50%",
        right: 15,
        transform: "translate(0, -50%)",
        display: "flex",
      },
      "&:focus": {
        outline: "none",
      },
    },
    button: {
      marginTop: 24,
      margin: "auto",
    },
    register: {
      margin: "16px 0 24px",
      fontSize: 18,
    },
    signUpLink: {
      fontWeight: "bold",
      color: "transparent",
      marginLeft: 8,
      cursor: "pointer",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      background: Gradient.Mint,
    },
  })
);

type SignInProps = {
  handleGoSignUp?: () => void;
  handleClose?: () => void;
};

const SignIn: React.FC<SignInProps> = ({ handleGoSignUp, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [email, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const { setSignedin } = useAuth();

  const validate = (values: { [key: string]: string }): { [key: string]: string } => {
    let errors: { [key: string]: string } = {};
    if (!validEmail(values.email)) {
      errors.email = "Please enter a valid email";
    }
    if (values.password.length < 6) {
      errors.password = "Password requires at least 6 characters";
    }
    return errors;
  };

  const handleSubmit = (event: FormElement) => {
    event.preventDefault();
    let values = { email, password };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      console.log("logging in");
      fetchUser();
    }
  };

  const fetchUser = async () => {
    const params = {
      email: email,
      password: password,
    };

    setDisableSubmit(true);

    trackPromise(
      axios
        .post(`${URL()}/user/signIn`, params)
        .then(res => {
          if (res.data.isSignedIn) {
            setSignedin(true);
            const data = res.data.userData;
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userSlug", data.urlSlug ?? data.id);

            axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken;
            dispatch(setLoginBool(true));
            if (handleClose) handleClose();
            history.push("/");
          } else {
            if (res.data.message) {
              setErrors({ auth: res.data.message });
            } else {
              setErrors({ auth: "User or password does not match" });
            }

            setDisableSubmit(false);
          }
        })
        .catch(async err => {
          setErrors({ auth: "Unable to connect to server" });
          console.log("Error in SignIn.tsx -> fetchUser() : ", err);

          setDisableSubmit(false);
        })
    );
  };

  return (
    <>
      <div className={classes.header}>Sign In</div>
      <div className={classes.description}>To create and monetize your content!</div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.inputField}>
          <InputWithLabelAndTooltip
            transparent
            overriedClasses=""
            type="text"
            inputValue={email}
            placeHolder="Email"
            onInputValueChange={user => setMail(user.target.value)}
            required
            style={{ margin: 0 }}
          />
        </div>
        {errors.email ? <div className="error">{errors.email}</div> : null}
        <div className={classes.inputField}>
          <InputWithLabelAndTooltip
            transparent
            overriedClasses=""
            type="password"
            inputValue={password}
            placeHolder="Password"
            reference={passwordRef}
            onInputValueChange={password => setPassword(password.target.value)}
            required
            autoComplete="on"
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
        {errors.auth ? <div className="error">{errors.auth}</div> : null}
        <div className={classes.register}>
          Still not registered?
          <span className={classes.signUpLink} onClick={() => handleGoSignUp && handleGoSignUp()}>
            Get an account now.
          </span>
        </div>
        <ModalButton className={classes.button} type="submit" disabled={disableSubmit}>
          Sign In
        </ModalButton>
      </form>
    </>
  );
};

export default SignIn;
