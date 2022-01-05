import React, { useEffect, useState, useRef } from "react";
import { Modal, StyledDivider, Color, Avatar } from "shared/ui-kit";
import { createStyles, makeStyles, Grid } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IVoteProposal, voteCommunityTokenProposal } from "shared/services/API";
import {
  ProgressAcceptIcon,
  ProgressPendingIcon,
  ProgressDeclineIcon,
  Text,
  TitleGrandLight,
} from "shared/ui-kit/Icons/progressIcons/index.styles";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "auto !important",
      display: "flex",
      flexDirection: "column",
      minWidth: "663px",
    },
  })
);

export default function ReviewDAOTokenProposalModal({ open, handleClose, proposalId }) {
  //REDUX
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  //HOOKS
  const classes = useStyles();

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [community, setCommunity] = useState<any>({});
  const [proposal, setProposal] = useState<any>({});
  const [vestingTime, setVestingTime] = useState<string>("");

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleOpenSignatureModal = (vote: boolean) => {
    if (proposal?.ProposalId) {
      const payload: IVoteProposal = {
        ProposalId: proposal.ProposalId,
        CommunityId: proposal.CommunityId,
        Decision: vote,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    } else {
      setErrorMsg("Proposal Id missing");
      handleClickError();
    }
  };

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const createCommunityRes = await voteCommunityTokenProposal(payload, {});
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
            let proposalData = { ...resp.data };

            if (proposalData.CommunityId) {
              Axios.get(`${URL()}/community/getCommunity/${proposalData.CommunityId}`).then(res => {
                const resp = res.data;
                if (resp.success) {
                  const communityData = resp.data;
                  const approvals = proposalData?.Approvals ?? {};
                  let founders = [] as any[];
                  let key: string = "";
                  let value: any = null;
                  for ([key, value] of Object.entries(approvals)) {
                    founders.push({
                      Address: key,
                      Ownership: communityData?.Proposal?.FounderMap[key]?.Share ?? 0,
                      Status: value,
                    });
                  }
                  proposalData.FoundersData = founders;
                  setCommunity(communityData);
                }
              });
            }

            if (proposalData?.Proposal?.VestingTime) {
              let vTime = proposalData.Proposal.VestingTime;
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

              setVestingTime(`${days && days > 0 && `${days} days`}${days && days > 0 && `, `}${
                hours ? `${hours} hrs` : ""
              }${hours && hours > 0 ? `, ` : ""}
                ${minutes && minutes > 0 ? `${minutes} mins` : ""}`);
            }

            setProposal(proposalData);
          } else {
            setErrorMsg("Error loading proposal token; not found");
            handleClickError();
            setTimeout(() => {
              handleClose();
            }, 1000);
          }
        })
        .catch(e => {
          console.log(e);
          setErrorMsg("Error loading proposal token");
          handleClickError();
          setTimeout(() => {
            handleClose();
          }, 1000);
        });
    }
  }, [proposalId, open]);

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

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      theme="dark"
    >
      <LoadingWrapper loading={!proposal.ProposalId} theme="dark">
        <SignatureRequestModal
          theme="dark"
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleVote}
          handleClose={() => setOpenSignRequestModal(false)}
        />

        <TitleGrandLight disableUppercase fontSize="30px" mb={2}>
          Co-Funded DAO Token
        </TitleGrandLight>

        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>

        <Text bold mb={2} mt={2}>
          Acceptance
        </Text>

        <Box display="flex" justifyContent="space-between" mb={1} width="100%">
          <Text>Members</Text>
          <Text>Signatures (3 of 4 needed)</Text>
        </Box>

        <Box display="flex" flexDirection="column" maxHeight="200px" mb={1}>
          {proposal?.FoundersData &&
            proposal?.FoundersData.map(founder => {
              const thisUser = users.find(u => u.address === founder.Address);

              return (
                <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                  <Box display="flex" alignItems="center" mb={1} fontSize="14px">
                    <Avatar
                      url={
                        thisUser && thisUser.imageUrl && thisUser.imageUrl !== ""
                          ? `${thisUser.imageUrl}`
                          : "none"
                      }
                      size="medium"
                    />

                    <Box display="flex">
                      {thisUser ? thisUser.name : <Skeleton width={120} animation="wave" />} (Proposer)
                    </Box>
                  </Box>

                  {founder?.Status && founder?.Status?.isVoted ? (
                    founder?.Status?.vote ? (
                      <ProgressAcceptIcon />
                    ) : (
                      <ProgressDeclineIcon />
                    )
                  ) : (
                    <ProgressPendingIcon />
                  )}
                </Box>
              );
            })}
        </Box>
        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>

        <Text bold mb={2} mt={1}>
          Token Terms
        </Text>

        <Grid container spacing={1}>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Symbol
              </Text>
              <Box>{proposal?.Proposal?.TokenSymbol ?? ""}</Box>
            </>
          </Grid>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Funding Token
              </Text>
              <Box>{proposal?.Proposal?.FundingToken ?? "N/A"}</Box>
            </>
          </Grid>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                AMM Type
              </Text>
              <Box>{proposal?.Proposal?.AMM ?? "Linear"}</Box>
            </>
          </Grid>
        </Grid>

        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" margin={2} />
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Initial Supply
              </Text>
              <Box>{proposal?.Proposal?.InitialSupply ?? "N/A"}</Box>
            </>
          </Grid>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Initial Price
              </Text>
              <Box>{proposal?.Proposal?.InitialPrice ?? 0}</Box>
            </>
          </Grid>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Target Supply
              </Text>
              <Box>{proposal?.Proposal?.TargetSupply ?? "N/A"}</Box>
            </>
          </Grid>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Target Price
              </Text>
              <Box>{proposal?.Proposal?.TargetPrice ?? "N/A"}</Box>
            </>
          </Grid>
        </Grid>

        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" margin={2} />
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Immediate Allocation
              </Text>
              <Box>
                {proposal?.Proposal?.ImmediateAllocationPct
                  ? (proposal.Proposal.ImmediateAllocationPct * 100).toFixed(0)
                  : "N/A"}
              </Box>
            </>
          </Grid>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Vested Allocation
              </Text>
              <Box>
                {proposal?.Proposal?.VestedAllocationPct
                  ? (proposal.Proposal.VestedAllocationPct * 100).toFixed(0)
                  : "N/A"}
                %
              </Box>
            </>
          </Grid>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Taxation
              </Text>
              <Box>
                {proposal?.Proposal?.TaxationPct ? (proposal.Proposal.TaxationPct * 100).toFixed(0) : "N/A"}%
              </Box>
            </>
          </Grid>
          <Grid item xs={6} md={4}>
            <>
              <Text bold mb={2} mt={2}>
                Vesting Time
              </Text>
              <Box>{vestingTime}</Box>
            </>
          </Grid>
        </Grid>

        <Box mt={5} display="flex" justifyContent="space-between" width="100%">
          <DAOButton onClick={() => handleOpenSignatureModal(false)}>Decline</DAOButton>
          <DAOButton onClick={() => handleOpenSignatureModal(true)}>{`Accept & Sign`}</DAOButton>
        </Box>
      </LoadingWrapper>

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={handleCloseSuccess}
        />
      )}
      {openError && (
        <AlertMessage key={Math.random()} message={errorMsg} variant="error" onClose={handleCloseError} />
      )}
    </Modal>
  );
}
