import React, { useState, useEffect } from "react";
import "./Voting.css";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import axios from "axios";
import URL from "../../functions/getURL";
import AlertMessage from "../Alert/AlertMessage";
import Moment from "react-moment";
import StyledCheckbox from "../Checkbox";

export default function Voting(props) {
  const userSelector = useSelector((state: RootState) => state.user);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false);
  const [alreadyVoteIndex, setAlreadyVoteIndex] = useState<number>(-1);
  const [status, setStatus] = useState<any>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [winner, setWinner] = useState<number>(-1);

  //check if the user has previously voted
  useEffect(() => {
    if (props.item && props.item.Answers && props.item.PossibleAnswers) {
      let votes = [] as any;
      props.item.PossibleAnswers.forEach(answer => {
        votes.push(0);
      });

      props.item.Answers.forEach(vote => {
        if (vote.UserId === userSelector.id) {
          setSelectedIndex(vote.VoteIndex);
          setAlreadyVoteIndex(vote.VoteIndex);
          setAlreadyVoted(true);
        }

        if (new Date() >= new Date(props.item.EndingDate)) {
          votes[vote.VoteIndex]++;
        }
      });

      //set the wining answer
      setWinner(votes.indexOf(Math.max(...votes)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  const addVote = () => {
    let data: any = {
      userId: userSelector.id,
      voteIndex: selectedIndex,
      type: "regular",
      votationId: props.item.id,
      itemType: props.itemType,
      itemId: props.itemId,
    };
    axios
      .post(`${URL()}/voting/vote`, data)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "Vote made",
            key: Math.random(),
            variant: "success",
          });
          setTimeout(() => {
            props.onRefreshInfo();
            setStatus("");
          }, 1000);
        } else {
          console.log(resp.error);
          setStatus({
            msg: resp.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(err => {
        console.log("Error voting:", err);
        setStatus({
          msg: "Error voting",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  if (props.item)
    return (
      <div className={"voting-content"}>
        <div className="header">
          {props.item.EndingDate ? (
            <div className="status">{new Date() < new Date(props.item.EndingDate) ? "Ongoing" : "Ended"}</div>
          ) : null}
          {props.item.EndingDate ? (
            new Date() < new Date(props.item.EndingDate) ? (
              <Moment toNow>{props.item.EndingDate}</Moment>
            ) : (
              <Moment fromNow>{props.item.EndingDate}</Moment>
            )
          ) : null}
        </div>
        <h3>{props.item && props.item.Question ? props.item.Question : "No title"}</h3>
        <div className="description-voting">{props.item && props.item.Description ? props.item.Description : null}</div>
        <div className="bottom-items" style={{ marginTop: alreadyVoted ? 36 : 14 }}>
          {alreadyVoted ? (
            <div className="answers">
              {props.item && props.item.PossibleAnswers && props.item.PossibleAnswers.length > 0 ? (
                props.item.PossibleAnswers.map((answer, index) => {
                  return (
                    <label key={`answer-${index}`} className={selectedIndex === index ? "selected answer" : "answer"}>
                      <StyledCheckbox
                        buttonType="circle"
                        checked={index === selectedIndex ? true : false}
                        onChange={event => {
                          if (event.target.checked) {
                            setSelectedIndex(index);
                          }
                        }}
                      />
                      <p>{answer}</p>
                    </label>
                  );
                })
              ) : (
                <p>No answers to choose</p>
              )}
              {props.item.PossibleAnswers.length > 0 ? <button onClick={addVote}>{`Submit Vote`}</button> : null}
            </div>
          ) : new Date() >= new Date(props.item.EndingDate) ? (
            <div className="show-results">
              {showResults ? (
                <div className="results">
                  <div className={"answered"}>
                    {props.item &&
                    props.item.PossibleAnswers &&
                    props.item.PossibleAnswers.length > 0 &&
                    props.item.Answers &&
                    props.item.Answers.length > 0 ? (
                      props.item.PossibleAnswers.map((answer, index) => {
                        const perc = (
                          (props.item.Answers.filter(a => a.VoteIndex === index).length / props.item.Answers.length) *
                          100
                        ).toFixed(0);

                        return (
                          <label
                            key={`answered-${index}`}
                            className={winner === index ? "answered-item winner" : "answered-item"}
                          >
                            <span>{answer}</span>
                            <span>{perc}%</span>
                          </label>
                        );
                      })
                    ) : (
                      <p>No answers to this poll</p>
                    )}
                  </div>
                  <span>{`${props.item.Answers.length} Participants - ${0} Absents`}</span>
                  <button onClick={() => setShowResults(false)}>Hide results</button>
                </div>
              ) : (
                <button onClick={() => setShowResults(true)}>Show results</button>
              )}
            </div>
          ) : null}
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    );
  else
    return (
      <div className="centered-info">
        <p>No active voting</p>
      </div>
    );
}
