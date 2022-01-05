import React from 'react';
import { useHistory } from 'react-router-dom';
import './Button.css';

export default function BackButton() {
  const history = useHistory();

  return (
    <>
      <button onClick={() => history.goBack()} className="button back-button">
        <img
          src={require('assets/icons/arrow_right_white.png')}
          alt="back"
        />
      </button>
    </>
  );
}
