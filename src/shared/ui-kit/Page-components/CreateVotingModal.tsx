import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { useMediaQuery } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { createVotingModalStyles } from "./CreateVotingModal.styles";
import URL from "../../functions/getURL";
import AlertMessage from "../Alert/AlertMessage";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { Modal } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { RootState } from "store/reducers/Reducer";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import Box from "shared/ui-kit/Box";

const infoIcon = require("assets/icons/info_icon.png");

const CreateVotingModal = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = createVotingModalStyles();

  const [voting, setVoting] = useState<any>({
    startingDate: new Date().getTime(),
    endingDate: new Date().getTime(),
  });
  const [possibleAnswers, setPossibleAnswers] = useState<any[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [status, setStatus] = useState<any>("");
  const mobileMatches = useMediaQuery("(max-width:375px)");

  const handleStartingDate = (elem: any) => {
    let votingCopy = { ...voting };
    votingCopy.startingDate = new Date(elem).getTime();
    setVoting(votingCopy);
  };

  const handleEndingDate = (elem: any) => {
    let votingCopy = { ...voting };
    votingCopy.endingDate = new Date(elem).getTime();
    setVoting(votingCopy);
  };

  const createVoting = () => {
    if (voting.startingDate && voting.endingDate && voting.startingDate < voting.endingDate) {
      if (
        voting &&
        voting.question &&
        voting.question !== "" &&
        possibleAnswers &&
        possibleAnswers.length > 0 &&
        voting.description &&
        voting.description !== ""
      ) {
        voting.possibleAnswers = [...possibleAnswers];
        voting.type = "regular";
        voting.itemType = props.type;
        voting.itemId = props.id;
        voting.creatorAddress = userSelector.id;
        voting.creatorId = userSelector.id;
        voting.userId = userSelector.id;

        axios
          .post(`${URL()}/voting/create`, voting)
          .then(res => {
            const resp = res.data;
            if (resp.success) {
              setStatus({
                msg: "Voting created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                props.onRefreshInfo();
                props.onClose();
              }, 300);
            } else {
              setStatus({
                msg: "Error creating Voting",
                key: Math.random(),
                variant: "error",
              });
            }
          })
          .catch(err => {
            console.log(err);
            setStatus({
              msg: "An error has occur",
              key: Math.random(),
              variant: "error",
            });
          });
      } else {
        setStatus({
          msg: "Fill in all fields",
          key: Math.random(),
          variant: "error",
        });
      }
    } else {
      setStatus({
        msg: "Ending date has to be bigger that Starting date",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const renderInputsVoting = (p: any) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        mr={p.index === 0 ? 1 : 0}
        ml={p.index === 1 ? 1 : 0}
      >
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={""}
          inputValue={voting[p.item]}
          minValue={`${p.min || 0}`}
          type={p.type}
          onInputValueChange={e => {
            let votignCopy = { ...voting };
            votignCopy[p.item] = e.target.value;
            setVoting(votignCopy);
          }}
          placeHolder={p.placeholder}
          style={{ marginBottom: 0 }}
        />
      </Box>
    );
  };

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <div className={classes.firstPartCreateVoting}>
        <div className={classes.titleVotingModal}>{props.title}</div>
        {props.type === "Community" && (
          <div className={classes.subTitleCommunitiesModal}>General poll info</div>
        )}
      </div>
      <div className={classes.bodyCreateVoting}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid container direction="column" item xs={12} sm={6}>
            <Grid item>
              {renderInputsVoting({
                name: "Question",
                placeholder: "Write your question",
                type: "text",
                item: "question",
                index: 2,
              })}
            </Grid>
            <Grid item style={{ marginTop: "24px" }}>
              {renderInputsVoting({
                name: "Description",
                placeholder: "Poll description",
                type: "text",
                item: "description",
                index: 2,
              })}
            </Grid>
          </Grid>
          {!mobileMatches && (
            <Grid item xs={12} sm={6}>
              <div className={classes.flexRowInputsVotingModal}>
                <div className={classes.infoHeaderVotingModal}>Starting date</div>
                <img className={classes.infoIconVotingModal} src={infoIcon} alt={"info"} />
              </div>
              <Box mb={3}>
                <DateInput
                  id="date-picker-starting-date"
                  height={46}
                  customStyle={{ marginTop: 8 }}
                  minDate={new Date()}
                  format="MM.dd.yyyy"
                  placeholder="Select date..."
                  value={voting.startingDate}
                  onChange={(event: any) => {
                    handleStartingDate(event);
                  }}
                />
              </Box>
              <div className={classes.flexRowInputsVotingModal}>
                <div className={classes.infoHeaderVotingModal}>Ending date</div>
                <img className={classes.infoIconVotingModal} src={infoIcon} alt={"info"} />
              </div>
              <Box>
                <DateInput
                  id="date-picker-expiration-date"
                  height={46}
                  customStyle={{ marginTop: 8 }}
                  className={classes.datePickerVoting}
                  minDate={new Date()}
                  format="MM.dd.yyyy"
                  placeholder="Select date..."
                  value={voting.endingDate}
                  onChange={(event: any) => {
                    handleEndingDate(event);
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        {possibleAnswers &&
          possibleAnswers.map((item, i) => {
            return (
              <Box key={i} className={classes.flexBox} mt={2}>
                <Box width={1}>
                  <InputWithLabelAndTooltip
                    labelName={`Answer ${i + 1}`}
                    tooltip=""
                    type="text"
                    inputValue={item}
                    placeHolder="Write possible answer"
                    disabled
                    style={{ marginBottom: 0 }}
                  />
                </Box>
                <Box ml={2}>
                  <SecondaryButton
                    size="medium"
                    onClick={() => {
                      if (item && item !== "") {
                        let answersCopy = [...possibleAnswers];
                        answersCopy.splice(i, 1);
                        setPossibleAnswers(answersCopy);
                      }
                    }}
                  >
                    - Remove
                  </SecondaryButton>
                </Box>
              </Box>
            );
          })}
        <Box className={classes.flexBox} mt={2}>
          <Box width={1}>
            <InputWithLabelAndTooltip
              labelName="Answer"
              tooltip=""
              type="text"
              inputValue={answer}
              placeHolder="Write possible answer"
              style={{ marginBottom: 0 }}
              onInputValueChange={e => setAnswer(e.target.value)}
            />
          </Box>
          <Box ml={2}>
            <SecondaryButton
              size="medium"
              onClick={() => {
                if (answer && answer !== "") {
                  let answersCopy = [...possibleAnswers];
                  answersCopy.push(answer);
                  setAnswer("");
                  setPossibleAnswers(answersCopy);
                }
              }}
            >
              + Add
            </SecondaryButton>
          </Box>
        </Box>
      </div>
      {!mobileMatches && (
        <Box className={classes.postBtnBox} mt={2}>
          <PrimaryButton size="medium" onClick={() => createVoting()} className="createButtonVoting">
            Post Voting
          </PrimaryButton>
        </Box>
      )}
      {mobileMatches && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <div className={classes.flexRowInputsVotingModal}>
              <div className={classes.infoHeaderVotingModal}>Starting date</div>
              <img className={classes.infoIconVotingModal} src={infoIcon} alt={"info"} />
            </div>
            <Box mb={3}>
              <DateInput
                id="date-picker-starting-date"
                height={46}
                customStyle={{ marginTop: 8 }}
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={voting.startingDate}
                onChange={(event: any) => {
                  handleStartingDate(event);
                }}
              />
            </Box>
            <div className={classes.flexRowInputsVotingModal}>
              <div className={classes.infoHeaderVotingModal}>Ending date</div>
              <img className={classes.infoIconVotingModal} src={infoIcon} alt={"info"} />
            </div>
            <Box>
              <DateInput
                id="date-picker-expiration-date"
                height={46}
                customStyle={{ marginTop: 8 }}
                className={classes.datePickerVoting}
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={voting.endingDate}
                onChange={(event: any) => {
                  handleEndingDate(event);
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <PrimaryButton
              size="medium"
              onClick={() => createVoting()}
              className={classes.createButtonVoting}
            >
              Create
            </PrimaryButton>
          </Grid>
        </Grid>
      )}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
};

export default CreateVotingModal;
