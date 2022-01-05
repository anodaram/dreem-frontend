import React , {useEffect, useRef, useState} from "react";

import { Grid } from "@material-ui/core";

import { newProposalModalStyles } from "./ReviewCommunityMemberProposal.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import { Modal, PrimaryButton, SecondaryButton, HeaderBold6, StyledDivider, Avatar, FontSize } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IVoteProposal, voteTreasurerProposal, resolveJoiningRequest, voteEjectMemberProposal, getProposal, getCommunity } from "shared/services/API";
import { Text } from "shared/ui-kit";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const checkRoundIcon = require("assets/icons/check_green_round.svg");
const clockGrayIcon = require("assets/icons/clock_gray.png");
const redCrossIcon = require("assets/icons/red_cross_outline.png");

const ReviewCommunityMemberProposal = ({ open, handleClose, proposalId, proposalType }) => {
  const classes = newProposalModalStyles();

   //REDUX
   const user = useTypedSelector(state => state.user);
   const users = useTypedSelector(state => state.usersInfoList);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [proposal, setProposal] = useState<any>({});
  const [community, setCommunity] = useState<any>({});
  const [proposedUser, setProposedUser] = useState<any>({});
  const [foundersVotingTime, setFoundersVotingTime] = useState<string>("");

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
    if (proposal?.ProposalId && proposal?.CommunityId) {
      let payload: IVoteProposal = {
        ProposalId: proposal.ProposalId,
        CommunityId: proposal.CommunityId,
        Decision: vote,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
    else {
      setErrorMsg("Proposal or Community Id not found");
      handleClickError();
    }
  }

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        let resp;
        if (proposalType.toLowerCase().includes('treasurer')) resp = await voteTreasurerProposal(payload, {});
        else if (proposalType == 'addMember') resp = await resolveJoiningRequest(payload, {});
        else if (proposalType == 'ejectMember') resp = await voteEjectMemberProposal(payload, {});
        if (resp && resp.success) {
          setSuccessMsg("Vote submited");
          handleClickSuccess();
          setTimeout(() => {
            handleClose();
          }, 1000);
        }
        else {
          setErrorMsg("Vote submission failed");
          handleClickError();
        }
      }
    }
    catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };

  useEffect(() => {
    if (proposalId && open) {
      getProposal(proposalId).then(resp => {
          if (resp.success) {
            let proposalData = { ...resp.data };
            const approvals = proposalData?.Approvals ?? {};
            const founders:any[] = [];
            let key:any = '';
            let value:any = null;
            for ([key, value] of Object.entries(approvals)) {
                founders.push({ Address: key, Status: value });
            }
            proposalData.FoundersData = founders;

            getCommunity(proposalData.CommunityId)
                .then(resp => {
                    if (resp.success) {
                    const communityData = resp.data;
                    setCommunity(communityData);
                    }
            });


            // set the proposedUser
            let proposedUserAddress;
            if (proposalType.toLowerCase().includes('member')) proposedUserAddress = proposalData?.Address ?? proposalData?.MemberAddresses;
            else proposedUserAddress = (proposalData?.Addresses ?? []).length ? proposalData?.Addresses[0]:'';
            if (proposedUserAddress) {
              const foundUser = users.find(u => u.address == proposedUserAddress);
              if (foundUser) setProposedUser(foundUser);
            }

            if (proposalData?.ProposalEndingTime) {
              let vTime = proposalData.ProposalEndingTime;
              let today = Math.floor(new Date().getTime());

              let difference = Math.floor((vTime - today) / 1000);
              // calculate (and subtract) whole days
              let days = Math.floor(difference / (3600 * 24));
              difference -= days * (3600 * 24);

              // calculate (and subtract) whole hours
              let hours = Math.floor(difference / 3600) % 24;
              difference -= hours * 3600;

              // calculate (and subtract) whole minutes
              let minutes = Math.floor(difference / 60) % 60;
              difference -= minutes * 60;

              setFoundersVotingTime(`${days && days > 0 && `${days} days`}${days && days > 0 && `, `}${hours && hours > 0 && `${hours} hrs`}${hours && hours > 0 && `, `}
              ${minutes && minutes > 0 && `${minutes} mins`}`);
            }
            setProposal(proposalData);
          } else {
            setErrorMsg("Error loading proposal; not found");
            handleClickError();
          }
        })
        .catch(e => {
          console.log(e);
          setErrorMsg("Error loading proposal: " + e);
          handleClickError();
        });
    }
  }, [proposalId, open]);


  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
        <SignatureRequestModal
            open={openSignRequestModal}
            address={user.address}
            transactionFee="0.0000"
            detail={signRequestModalDetail}
            handleOk={handleVote}
            handleClose={() => setOpenSignRequestModal(false)}
        />
      <Box textAlign="center" fontSize={50}>
        🤝
      </Box>
      <Box textAlign="center" fontSize={30} fontWeight={400} color="#181818">
      {proposalType.toLowerCase().includes('add') ? 'Add': 'Eject'} {proposalType.toLowerCase().includes('treasurer') ? 'Treasurer': 'Member'} Proposal
      </Box>
      <StyledDivider type="solid" />
      <Box fontSize={18} fontWeight={400} color="#181818" mt={2} mb={2}>
        Proposal Details
      </Box>
      <StyledDivider type="dashed" />
      <Box fontSize={14} fontWeight={800} color="#707582" mt={1} mb={2}>
        User
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
        <Avatar size="small" url={proposedUser.imageUrl? `${proposedUser.imageUrl}`: require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")} />
        <Text size={FontSize.M} ml={1}>@{proposedUser.name}</Text>
      </Box>
      <HeaderBold6 className={classes.darkColor}>Has been proposed for</HeaderBold6>
      <span className={proposalType.toLowerCase().includes('add')? classes.add : classes.remove}> be {proposalType.toLowerCase().includes('add') ? 'added':'removed'} as Community {proposalType.toLowerCase().includes('treasurer') ? 'Treasurer':'Member'}.</span>
      <StyledDivider type="solid" />
      <Box fontSize={18} fontWeight={400} color="#181818" mt={2} mb={2}>
        Proposal Acceptation
      </Box>
      <StyledDivider type="dashed" />
      <Grid container>
        <Grid container item
              xs={12} md={12}
              justify="space-between"
              className={classes.acceptionSection}>
          <Box fontSize={14} fontWeight={700} color="#707582">
            Member
          </Box>
          <Box fontSize={14} fontWeight={700} color="#707582">
            Status
          </Box>
        </Grid>
        {proposal?.FoundersData && proposal.FoundersData.map((founder, index) => {
          console.log(founder)
            const thisUser = users.find(u => u.address === founder.Address);
            return (
                <Grid container item
                    xs={12} md={12}
                    justify="space-between">
                    <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                        <Avatar size="medium" url={thisUser?.imageUrl ? thisUser.imageUrl : ""} />
                        <Box display="flex" flexDirection="column">
                        <Box ml={1} fontSize={14} fontWeight={700} color="#181818">
                            {thisUser?.name ?? ''}
                        </Box>
                        <Box ml={1} fontSize={14} fontWeight={400} color="#FF79D1">
                            @{thisUser?.twitter ?? ''}
                        </Box>
                        </Box>
                    </Box>
                    <Box>
                        {!founder?.Status?.isVoted && <img src={clockGrayIcon} alt={"clock"} />}
                        {founder?.Status?.isVoted && founder?.Status?.vote && <img src={checkRoundIcon} alt={"check"} />}
                        {founder?.Status?.isVoted && !founder?.Status?.vote && <img src={redCrossIcon} alt={"cross"} />}
                    </Box>
                </Grid>
            );
        })}
      </Grid>
      <StyledDivider type="dashed" />
      <Box display="flex" flexDirection="row" mt={2} mb={2}>
        <div>🗳</div>
        <Grid container>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" ml={2}>
              <Box fontSize={14} fontWeight={700} color="#707582">
                Voting Time
              </Box>
              <Box fontSize={18} fontWeight={400} color="#707582">
                {foundersVotingTime}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box fontSize={14} fontWeight={700} color="#707582">
              Consensus
            </Box>
            <Box fontSize={18} fontWeight={400} color="#707582">
            {community?.FoundersConsensus ? (Number(community.FoundersConsensus) * 100).toFixed(0) : 0}%
            </Box>
          </Grid>
        </Grid>
      </Box>
      <StyledDivider type="solid" />
      <Grid container item
            xs={12} md={12}
            justify="space-between"
            className={classes.buttonGroup}>
        <SecondaryButton size="medium" onClick={() => handleOpenSignatureModal(false)}>
          Decline
        </SecondaryButton>
        <PrimaryButton size="medium" onClick={() => handleOpenSignatureModal(true)}>
          Accept & Sign
        </PrimaryButton>
      </Grid>

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={handleCloseSuccess}
        />
      )}
      {openError && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={handleCloseError}
        />
      )}
    </Modal>
  );
};

export default ReviewCommunityMemberProposal;
