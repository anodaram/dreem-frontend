import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";

import MuiAlert from "@material-ui/lab/Alert";
import { createStyles, Grid, makeStyles, Snackbar } from "@material-ui/core";

import { Modal, StyledDivider, Color, Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IVoteCreationProposal, voteCreationProposal } from "shared/services/API";
import {
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  Text,
} from "shared/ui-kit/Icons/progressIcons/index.styles";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";
import { Skeleton } from "@material-ui/lab";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "auto !important",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "536px",
    },
    content: {
      width: "536px",
      display: "flex",
      flexDirection: "column",
      color: "white",
      fontSize: "18px",
    },
    centered: {
      display: "flex",
      justifyContent: "center",
      fontSize: "14px",
      "& *": {
        fontSize: "14px !important",
      },
    },
  })
);

export default function ReviewDAOProposalModal({ open, handleClose, proposalId }) {
  //REDUX
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  //HOOKS
  const classes = useStyles();

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [proposal, setProposal] = useState<any>({});
  const [foundersVotingTime, setFoundersVotingTime] = useState<string>("");
  const [treasuryVotingTime, setTreasuryVotingTime] = useState<string>("");

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };
  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleOpenSignatureModal = (vote: boolean) => {
    if (proposal?.ProposalId) {
      const payload: IVoteCreationProposal = {
        ProposalId: proposal.ProposalId,
        Decision: vote,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    } else {
    }
  };

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const createCommunityRes = await voteCreationProposal(payload, {});
        if (createCommunityRes.success) {
          setSuccessMsg("Vote submited");
          handleClickSuccess();
          setTimeout(() => {
            handleClose();
          }, 1000);
        } else {
          setErrorMsg("Vote submission failed");
          handleClickError();
        }
      }
    } catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };

  useEffect(() => {
    if (proposalId && open) {
      Axios.get(`${URL()}/community/getProposal/${proposalId}`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            let data = { ...resp.data };

            const approvals = data?.Approvals ?? {};
            let founders = [] as any[];
            Object.entries(data?.Proposal?.Founders ?? {}).forEach(([key, value]) => {
              founders.push({ Address: key, Ownership: value, Status: approvals[key] });
            });
            data.FoundersData = founders;

            if (data?.Proposal?.FoundersVotingTime) {
              let vTime = data.Proposal.FoundersVotingTime;
              let today = Math.floor(new Date().getTime() / 1000);

              let difference = vTime - today;
              // calculate (and subtract) whole days
              let days = Math.floor(difference / (3600 * 24));
              difference -= days * (3600 * 24);

              // calculate (and subtract) whole hours
              let hours = Math.floor(difference / 3600) % 24;
              difference -= hours * 3600;

              // calculate (and subtract) whole minutes
              let minutes = Math.floor(difference / 60) % 60;
              difference -= minutes * 60;

              setFoundersVotingTime(`${days && days > 0 && `${days} days`}${days && days > 0 && `, `}${
                hours && hours > 0 && `${hours} hrs`
              }${hours && hours > 0 && `, `}
              ${minutes && minutes > 0 && `${minutes} mins`}`);
            }

            if (data?.Proposal?.TreasuryVotingTime) {
              let vTime = data.Proposal.TreasuryVotingTime;
              let today = Math.floor(new Date().getTime() / 1000);

              let difference = vTime - today;
              // calculate (and subtract) whole days
              let days = Math.floor(difference / (3600 * 24));
              difference -= days * (3600 * 24);

              // calculate (and subtract) whole hours
              let hours = Math.floor(difference / 3600) % 24;
              difference -= hours * 3600;

              // calculate (and subtract) whole minutes
              let minutes = Math.floor(difference / 60) % 60;
              difference -= minutes * 60;
              setTreasuryVotingTime(`${days && days > 0 ? `${days} days` : ""}${
                days && days > 0 ? `, ` : ""
              }${hours && hours > 0 ? `${hours} hrs` : ""}${hours && hours > 0 ? `, ` : ""}
              ${minutes && minutes > 0 ? `${minutes} mins` : ""}`);
            }
            setProposal(data);
          } else {
            setErrorMsg("Error loading proposal; not found");
            handleClickError();
            setTimeout(() => {
              handleClose();
            }, 1000);
          }
        })
        .catch(e => {
          console.log(e);
          setErrorMsg("Error loading proposal");
          handleClickError();
          setTimeout(() => {
            handleClose();
          }, 1000);
        });
    }
  }, [proposalId, open]);

  if (proposal && open)
    return (
      <Modal
        className={classes.root}
        size="medium"
        isOpen={open}
        onClose={handleClose}
        showCloseIcon
        theme="dark"
      >
        <LoadingWrapper loading={!proposal.Proposal} theme="dark">
          <div className={classes.content}>
            <SignatureRequestModal
              theme={"dark"}
              open={openSignRequestModal}
              address={user.address}
              transactionFee="0.0000"
              detail={signRequestModalDetail}
              handleOk={handleVote}
              handleClose={() => setOpenSignRequestModal(false)}
            />
            <Box
              alignSelf="center"
              width="460px"
              fontFamily="Agrandir GrandLight"
              fontSize="30px"
              textAlign="center"
            >
              Co-Funded DAO Proposal
            </Box>

            <Box width="100%">
              <StyledDivider color={Color.White} type="solid" margin={2} />
            </Box>

            <Text bold mb={2}>
              Founder Terms
            </Text>

            <Grid container>
              <Grid item xs={12} md={4} className={classes.centered}>
                <Text bold>Members</Text>
              </Grid>
              <Grid item xs={12} md={4} className={classes.centered}>
                <Text bold>Ownership</Text>
              </Grid>
              <Grid item xs={12} md={4} className={classes.centered}>
                <Text bold>Acceptation</Text>
              </Grid>

              {proposal.FoundersData &&
                proposal.FoundersData.map(founder => {
                  const thisUser = users.find(u => u.address === founder.Address);

                  return (
                    <>
                      <Grid item xs={12} md={4}>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            url={
                              thisUser && thisUser.imageUrl && thisUser.imageUrl !== ""
                                ? thisUser.imageUrl
                                : "none"
                            }
                            size="medium"
                          />
                          <Box ml={1} fontSize="14px">
                            {thisUser?.name ?? <Skeleton width={120} animation="wave" />}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4} className={classes.centered}>
                        <Text bold>
                          {founder.Ownership ? (Number(founder.Ownership) * 100).toFixed(0) : 0}%
                        </Text>
                      </Grid>
                      <Grid item xs={12} md={4} className={classes.centered}>
                        {founder?.Status && founder?.Status?.isVoted ? (
                          founder?.Status?.vote ? (
                            <ProgressAcceptIcon />
                          ) : (
                            <ProgressDeclineIcon />
                          )
                        ) : (
                          <ProgressPendingIcon />
                        )}
                      </Grid>
                    </>
                  );
                })}
            </Grid>

            <Box width="100%">
              <StyledDivider color={Color.White} type="solid" margin={2} />
            </Box>

            <Box display="flex">
              <Box display="flex" flexDirection="column" mr={8}>
                <Text mb={1}>Voting Time</Text>
                <Box>{foundersVotingTime ?? "unknown"}</Box>
              </Box>
              <Box display="flex" flexDirection="column">
                <Text mb={1}>Consensus</Text>
                <Box>
                  {proposal?.Proposal?.FoundersConsensus
                    ? (Number(proposal.Proposal.FoundersConsensus) * 100).toFixed(0)
                    : 0}
                  %
                </Box>
              </Box>
            </Box>

            <Box width="100%">
              <StyledDivider color={Color.White} type="solid" margin={2} />
            </Box>

            <Text mb={2}>Treasury Terms</Text>

            <Box display="flex">
              <Box display="flex" flexDirection="column" mr={8}>
                <Text mb={1}>Voting Time</Text>
                <Box>{treasuryVotingTime ?? "unknown"}</Box>
              </Box>
              <Box display="flex" flexDirection="column">
                <Text mb={1}>Consensus</Text>
                <Box>
                  {proposal?.Proposal?.TreasuryConsensus
                    ? (Number(proposal.Proposal.TreasuryConsensus) * 100).toFixed(0)
                    : 0}
                  %
                </Box>
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={5}>
              <DAOButton onClick={() => handleOpenSignatureModal(false)}>Decline</DAOButton>
              <DAOButton onClick={() => handleOpenSignatureModal(true)}>{`Accept & Sign`}</DAOButton>
            </Box>
          </div>
        </LoadingWrapper>
        {openSuccess ? (
          <Snackbar open={openSuccess} autoHideDuration={4000} onClose={handleCloseSuccess}>
            <Alert onClose={handleCloseSuccess} severity="success">
              {successMsg}
            </Alert>
          </Snackbar>
        ) : null}
        {openError ? (
          <Snackbar open={openError} autoHideDuration={4000} onClose={handleCloseError}>
            <Alert onClose={handleCloseError} severity="error">
              {errorMsg}
            </Alert>
          </Snackbar>
        ) : null}
      </Modal>
    );
  else return null;
}
