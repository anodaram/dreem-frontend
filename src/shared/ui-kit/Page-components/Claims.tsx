import React, { useState, useEffect } from 'react';
import './Claims.css';
import { useTypedSelector } from 'store/reducers/Reducer';

export default function Claims(props) {
  const user = useTypedSelector((state) => state.user);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  //check if the user has previously voted
  useEffect(() => {
    if (props.item) {
      props.item.votes.forEach((vote) => {
        if (vote.id === user.id) {
          setSelectedIndex(vote.answer);
        }
      });
    }
  }, [props.item]);

  const addVote = (index) => {
    setSelectedIndex(index);
    //TODO: process vote, add to collection or wherever it is stored
  };

  if (props.item)
    return (
      <div className={'claims-content'}>
        <h3>{props.item.title ? props.item.title : 'No title'}</h3>
        <p>
          {`Claim Value`}
          <span>{`${props.item.value ? props.item.value : 'N/A'} ${
            props.item.token ? props.item.token : ''
          }`}</span>
        </p>

        <div className="claims-options">
          {props.item.options.length > 0 ? (
            <div className="answers">
              <button
                className={
                  selectedIndex === 0 ? 'selected-green-button' : 'green-button'
                }
                onClick={() => {
                  addVote(0);
                }}
              >
                {selectedIndex === 0
                  ? `${props.item.options[0]}d`
                  : props.item.options[0]}
              </button>
              <button
                className={
                  selectedIndex === 1 ? 'selected-red-button' : 'red-button'
                }
                onClick={() => {
                  addVote(1);
                }}
              >
                {selectedIndex === 1
                  ? `${props.item.options[1]}d`
                  : props.item.options[1]}
              </button>
            </div>
          ) : (
            <p>No answers to choose</p>
          )}
        </div>
      </div>
    );
  else return null;
}
