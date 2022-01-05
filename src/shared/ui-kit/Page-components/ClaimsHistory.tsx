import React, { useState, useEffect } from 'react';
import './ClaimsHistory.css';

export default function ClaimsHistory(props) {
  const [firstOptionWidth, setFirstOptionWidth] = useState<number>(0);
  const [secondOptionWidth, setSecondOptionWidth] = useState<number>(0);

  //check and set % of votes
  useEffect(() => {
    if (props.item) {
      let votes_option_1 = 0;
      let votes_option_2 = 0;

      props.item.votes.forEach((vote) => {
        if (vote.answer === 0) {
          votes_option_1++;
        } else if (vote.answer === 1) {
          votes_option_2++;
        }
      });

      let total_votes = votes_option_1 + votes_option_2;

      setFirstOptionWidth((votes_option_1 / total_votes) * 100);
      setSecondOptionWidth((votes_option_2 / total_votes) * 100);
    }
  }, [props.item]);

  if (props.item)
    return (
      <div className={'claims-history-content'}>
        <h3>{props.item.title ? props.item.title : 'No title'}</h3>

        <div className="claims-history-results">
          {props.item.votes.length > 0 ? (
            <div className="results">
              <div className="claims-history-area">
                <div
                  className="green-area"
                  style={{ width: `calc(${firstOptionWidth}% - 1px)` }}
                />
                <div
                  className="red-area"
                  style={{ width: `calc(${secondOptionWidth}% - 1px)` }}
                />
              </div>
              <div className="answers">
                <p>{props.item.answers[0]}</p>
                <p>{props.item.answers[1]}</p>
              </div>
            </div>
          ) : (
            <p>No votes</p>
          )}
        </div>

        <p>
          {`Claim Value`}
          <span>{`${props.item.value ? props.item.value : 'N/A'} ${
            props.item.token ? props.item.token : ''
          }`}</span>
        </p>
      </div>
    );
  else return null;
}
