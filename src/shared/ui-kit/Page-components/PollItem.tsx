import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Theme, makeStyles, createStyles, Grid } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Moment from "react-moment";
import { Color } from "shared/constants/const";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    voteBtn: {
      display: "flex",
    },
    timeWrapper: {
      background: "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
      borderRadius: 10,
      padding: 15,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginTop: 10,
    },
    timeImg: {
      width: 20,
      height: 20,
      color: "fff",
    },
    time: {
      fontSize: 22,
      fontWeight: 700,
      color: "#fff",
      marginLeft: "auto !important"
    },
    timeDiv: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      color: "#fff",
      marginLeft: "5px !important",
    },
    answers: {
      display: "flex",
      alignItems: "center",
      marginLeft: "0 !important",
    },
    vote: {
      color: "#828282 !important",
      fontSize: 14,
      marginLeft: 10,
    }
  })
);

export default function PollItem(props) {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = useStyles();

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false);
  const [status, setStatus] = useState<any>("");
  const [finished, setFinished] = useState<boolean>(false);

  const [votes, setVotes] = useState<any>([]);
  const [winningVote, setWinningVote] = useState<number>(0);

  const formatTimer = (date) => {
    let hours = date.split(":")[0].replace("-","")
    let minutes = date.split(":")[1]
    let seconds = date.split(":")[2]
    let formattedDate = hours + "h " + minutes + "m " + seconds + "s "

    return formattedDate;
  };

  //check if the user has previously voted
  useEffect(() => {
    if (props.item.EndingDate && new Date(props.item.EndingDate * 100).getTime() < new Date().getTime()) {
      setFinished(true);
    }

    let votesList = [] as any;

    if (props.item.PossibleAnswers) {
      props.item.PossibleAnswers.forEach(option => {
        votesList.push(0);
      });
    }

    if (props.item.Answers) {
      props.item.Answers.forEach(vote => {
        if (vote.VoteIndex !== undefined) {
          votesList[vote.VoteIndex] = votesList[vote.VoteIndex] + 1;
        }

        if (vote.UserId === userSelector.id) {
          setSelectedIndex(vote.VoteIndex);
          setAlreadyVoted(true);
        }
      });
    }

    if (props.item.EndingDate && new Date(props.item.EndingDate * 1000).getTime() < new Date().getTime()) {
      if (votesList.length > 0) {
        let winning = votesList[0];
        votesList.forEach((votes, index) => {
          if (votes > winning) {
            winning = votes;
          }
        });

        setWinningVote(votesList.indexOf(winning));
      }
    }

    setVotes(votesList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item, props.item?.EndingDate, props.item?.Answers, props.item?.PossibleAnswers]);

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
      <div
        className={
          props.scrollable
            ? "voting-content scrollable"
            : props.version
            ? `voting-content ${props.version === 2 ? "v2" : "v3"}`
            : "voting-content"
        }
      >
        {props.item.cofoundersOnly && <div className="tag">🔒 Co-Founders Only</div>}
        <Box
          fontWeight={props.version ? 800 : 400}
          fontSize={18}
          style={
            props.noMargin
              ? {
                  marginTop: "16px",
                  marginBottom: "16px",
                }
              : {}
          }
        >
          {props.item.Question ? props.item.Question : "No Question"}
        </Box>
        {finished ? (
          <div className="results">
            {votes.length > 0 && props.item.Answers.length > 0 && props.item.PossibleAnswers.length > 0 ? (
              props.item.PossibleAnswers.map((answer, index) => (
                <div className={winningVote === index ? "selected result" : "result"} key={`result-${index}`}>
                  <label className={"answer"}>{answer}</label>

                  <div className="quantity">
                    <div className="bar-container">
                      <div
                        className="bar-color"
                        style={{
                          width: `${(votes[index] / props.item.Answers.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span>{`${(votes[index] / props.item.Answers.length) * 100}%`}</span>
                  </div>
                </div>
              ))
            ) : (
              <div />
            )}
          </div>
        ) : (
          <div className="answers">
            {props.item.PossibleAnswers.length > 0 ? (
              props.item.PossibleAnswers.map((answer, index) => {
                return (
                  <label
                    style={
                      props.noMargin
                        ? {
                            marginBottom: "10px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            width: "calc(100% - 40px)",
                          }
                        : {}
                    }
                    key={`answer-${index}`}
                    className={selectedIndex === index ? "selected answer" : "answer"}
                  >
                    <StyledCheckbox
                      checked={index === selectedIndex ? true : false}
                      onChange={event => {
                        if (event.target.checked) {
                          setSelectedIndex(index);
                        }
                      }}
                      buttonColor={alreadyVoted ? Color.GrayDark : Color.Black}
                      disabled={alreadyVoted}
                    />
                    <p style={alreadyVoted ? { color: "grey", fontWeight: 400 } : { color: "black", fontWeight: 400 }}>{answer}</p>
                  </label>
                );
              })
            ) : (
              <p>No answers to choose</p>
            )}
          </div>
        )}

        <div className="bottom-items">
          {finished === false && alreadyVoted && (
            props.version ? (
              <Box color="#707582" fontSize="14px" display="flex" alignItems="center" marginTop="30px" paddingTop="10px" paddingBottom="10px" borderTop="1px dotted #1717171e" borderBottom="1px dotted #1717171e">
                <img src={require("assets/icons/emoji.png")} alt="emoji" style={{ marginRight: "8px" }} />
                You've already voted
              </Box>
            ) : (
              <div>
                <button
                  disabled
                  style={
                    props.noMargin
                      ? {
                          cursor: "auto",
                          marginBottom: "10px",
                          marginTop: "0px",
                        }
                      : {
                          cursor: "auto",
                          marginBottom: "10px",
                          padding: "9.5px 24px 9.5px 24px",
                        }
                  }
                >
                  You've already voted
                </button>
              </div>
            )
          )}
          {props.version && props.version === 3 && (
            <div>
              <Grid container direction="row" spacing={1} alignItems="center">
                <Grid item sm={12}>
                  {finished ? (
                    <></>
                  ) : (
                    <div className={classes.timeWrapper}>
                      <img className={classes.timeImg} src={require("assets/icons/clock.svg")} alt="flag" />
                      <div className={classes.timeDiv}>
                        Time left
                      </div>
                      <div className={classes.time}>
                        <Moment filter={formatTimer} durationFromNow format="hh:mm:ss" interval={1000}>{props.item?.EndingDate}</Moment>
                      </div>
                    </div>
                  )}
                </Grid>
                <Grid item sm={12}>
                  <div className={classes.answers}>
                    <img src={require("assets/icons/flag.png")} alt="clock" />
                    <p className={classes.vote}>{`${props.item.Answers?.length || 0} votes`}</p>
                  </div>
                </Grid>
              </Grid>
            </div>
          )}
          {finished === false && !alreadyVoted && (
            <div>
              <button
                onClick={addVote}
                style={
                  props.noMargin
                    ? {
                        cursor: "auto",
                        marginBottom: "10px",
                        marginTop: "0px",
                      }
                    : {
                        cursor: "auto",
                        marginBottom: "10px",
                        padding: "9.5px 24px 9.5px 24px",
                      }
                }
              >{`Vote`}</button>
            </div>
          )}
        </div>
        {status ? <AlertMessage message={status.msg} variant={status.variant} /> : ""}
      </div>
    );
  else return null;
}
