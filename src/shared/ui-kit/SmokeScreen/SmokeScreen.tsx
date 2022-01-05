import React, { useState, useEffect } from 'react';
import './SmokeScreen.css';
import UseWindowDimensions from '../../hooks/useWindowDimensions';
import {validEmail} from '../../constants/constants';;
import { useTypedSelector } from 'store/reducers/Reducer';

type FormElement = React.FormEvent<HTMLFormElement>;

function validate(values: {
  [key: string]: string;
}): { [key: string]: string } {
  var errors: { [key: string]: string } = {};
  if (!validEmail(values.mail)) {
    errors.mail = 'Please enter an valid email';
  }
  return errors;
}

function SmokeScreen({ message }: { [key: string]: string }) {
  const user = useTypedSelector((state) => state.user);
  const { width } = UseWindowDimensions();
  const [mail, setMail] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (event: FormElement) => {
    event.preventDefault();
    let values = { mail };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      console.log('no errors');
    }
  };

  // case user is signed in, initialice mail var
  useEffect(() => {
    setMail('userMail@test.com');
  }, [user]);

  let myForm = (
    <form onSubmit={handleSubmit}>
      <label className="label-white">
        <input
          className="input"
          type="text"
          value={mail}
          placeholder="Email"
          onChange={(user) => setMail(user.target.value)}
          required
        />
      </label>
      {errors.mail ? <div className="error">{errors.mail}</div> : null}
      <div className="sizedBoxV50"></div>
      <button className="Button" type="submit">
        Join Waitlist
      </button>
    </form>
  );
  if (user.isSignedIn)
    myForm = (
      <form onSubmit={handleSubmit}>
        <button className="Button" type="submit">
          Join Waitlist
        </button>
      </form>
    );

  if (width > 750) {
    return (
      <div className="container smokeDivDesktop center v">
        <h2 className="title">{message}</h2>
        <div className="sizedBoxV100"></div>
        {myForm}
      </div>
    );
  } else {
    return (
      <div className="container smokeDivMobile center v">
        <h3 className="title"> {message} </h3>
        <div className="sizedBoxV100"></div>
        {myForm}
      </div>
    );
  }
}
export default SmokeScreen;
