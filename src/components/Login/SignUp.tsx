/**
 * DONE; Unless registration is replaced by mnemonic, check if email belongs to User
 * TODO: Users >0 or >18?
 */

import React, { useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import URL from "shared/functions/getURL";
import priviBW from "assets/logos/PRIVILOGO.png";
import { useDispatch } from "react-redux";
//import { setUser } from 'store/actions/User';
import { setSelectedAuthPage } from "store/actions/SelectedAuthPage";
import { validEmail } from "shared/constants/constants";
import UseWindowDimensions from "shared/hooks/useWindowDimensions";
import "shared/ui-kit/Global.module.css";
import "./SignUp.css";
import { trackPromise } from "react-promise-tracker";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as EyeSolid } from "assets/icons/eye-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

//const genders = ["Male", "Female", "Rather not say"];
const currencies = ["USD", "EUR", "GBP"];

type FormElement = React.FormEvent<HTMLFormElement>;

interface RegisterData {
  firstName: string;
  country: string;
  currency: string;
  email: string;
  password: string;
  role: string;
}

const SignUp = () => {
  const dispatch = useDispatch();
  const passwordRef = useRef<HTMLInputElement>(null);
  const { width } = UseWindowDimensions();

  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    country: "",
    currency: "USD",
    email: "",
    password: "",
    role: "USER",
  });
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
    return errors;
  };

  const handleSubmit = (event: FormElement): void => {
    event.preventDefault();
    let validatedErrors = validate(registerData);
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      storeUser(registerData);
    }
  };

  // Go to SignIn screen
  const handlePageChange = page => {
    dispatch(setSelectedAuthPage(page));
  };

  /*const showResendEmailValidation = () => {
    handlePageChange(4);
  };*/

  const showForgotPasswordPage = () => {
    handlePageChange(3);
  };

  /* const showSignupPage = () => {
  handlePageChange(2);
  };*/

  const showSigninPage = () => {
    handlePageChange(1);
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

  let contentClass = "container center desktopSignUpBox";
  if (width <= 750) contentClass = "container center mobileSignUpBox";

  return (
    <div>
      <div className={contentClass}>
        <img
          src={priviBW}
          height={150}
          style={{ cursor: "pointer" }}
          alt="logo"
          onClick={() => showSigninPage()}
        />

        {signedUp ? (
          <div style={{ marginBottom: "32%" }}>
            <h3>Thanks for registering, please check your email.</h3>
          </div>
        ) : (
          <div className="register-form">
            <h1 className="title-desktop-register">REGISTER</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <div className="v">
                  <label>
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
                  </label>
                  {errors.firstName ? <div className="error">{errors.firstName}</div> : null}
                </div>
              </div>
              <div>
                <div className="v f2">
                  <label>
                    <InputWithLabelAndTooltip
                      transparent
                      overriedClasses=""
                      type="text"
                      inputValue={registerData.country}
                      placeHolder="Country"
                      onInputValueChange={user =>
                        setRegisterData({
                          ...registerData,
                          country: user.target.value,
                        })
                      }
                      required
                      style={{ margin: 0 }}
                    />
                  </label>
                  {errors.country ? <div className="error">{errors.country}</div> : null}
                </div>
                <div className="v">
                  <label>
                    <StyledSelect
                      disableUnderline
                      name="default currency"
                      defaultValue="USD"
                      id="currency"
                      onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                        setRegisterData({
                          ...registerData,
                          currency: event.target.value as string,
                        })
                      }
                    >
                      {currencies.map((currency: string, i: number) => {
                        return (
                          <StyledMenuItem key={i} value={currency}>
                            {currency}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledSelect>
                  </label>
                  {errors.currency ? <div className="error">{errors.currency}</div> : null}
                </div>
              </div>
              <div>
                <div className="v">
                  <label>
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
                  </label>
                  {errors.email ? <div className="error">{errors.email}</div> : null}
                </div>
                <div className="v">
                  <label className="label-password">
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
                  </label>
                  {errors.password ? <div className="error">{errors.password}</div> : null}
                </div>
              </div>

              {errors.auth ? <div className="error">{errors.auth}</div> : null}

              {successMessage ? <div className="success">{successMessage}</div> : null}

              <button type="submit" className="RegisterButton" disabled={disableSubmit}>
                SIGN UP
              </button>
            </form>
            <div className="clickable alignRight" onClick={showForgotPasswordPage}>
              <Link to="/forgot" className="link">
                Forgot password?
              </Link>
            </div>
            <div className="clickable" onClick={showSigninPage}>
              <Link to="/signin" className="link">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
