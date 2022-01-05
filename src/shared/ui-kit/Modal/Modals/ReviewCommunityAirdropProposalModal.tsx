import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Modal, PrimaryButton, SecondaryButton, Header3, StyledDivider, Header5, FontSize, Avatar } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { voteAirdropProposal, voteAllocateTokenProposal, getProposal, getCommunity } from "shared/services/API";
import { ProgressAcceptIcon, ProgressDeclineIcon, ProgressPendingIcon, Text, Color, Gradient } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const useStyles = makeStyles(() => ({
  darkColor: {
    color: `${Color.GrayDark} !important`,
  },
  back: {
    cursor: "pointer",
  },
  autoHeight: {
    marginTop: 24,
    marginBottom: 36,
    "& .MuiGrid-item": {
      "& > div": {
        height: "100%",
      }
    }
  },
  receiver: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  userSlug: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: Gradient.Magenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  timeCard: {
    borderRadius: 10,
    height: 48,
    background: Gradient.Mint,
    paddingLeft: 16,
    paddingRight: 24,
    "& span, h4": {
      color: Color.White,
    },
    "& svg": {
      marginRight: 8,
    }
  },
  table: {
    "& .MuiTableHead-root": {
      backgroundColor: Color.GrayInputBackground
    },
    "& .MuiTableCell-root": {
      fontFamily: "inherit",
      border: 0,
    },
    "& .MuiTableCell-head": {
      textTransform: "uppercase",
      fontSize: 14,
      color: Color.GrayInputBorderSelected,
      fontWeight: 800,
    },
    "& .MuiTableCell-body": {
      fontSize: 14,
      color: Color.GrayDark,
    }
  }
}));

export default function ReviewCommunityAirdropProposalModal({ open, handleClose, proposalId }) {

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
  const [totalAirdropAmount, setTotalAirdropAmount] = useState<any>(0);
  const [community, setCommunity] = useState<any>({});
  const [foundersVotingTime, setFoundersVotingTime] = useState<string>("");

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [creator, setCreator] = useState<any>({});

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
      const payload: any = {
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
        if (proposal?.ProposalType == 'CommunityAirdrop') {
          resp = await voteAirdropProposal(payload, {});
        }
        else if (proposal?.ProposalType == 'CommunityAllocation') {
          resp = await voteAllocateTokenProposal(payload, {});
        }
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
            if (proposalData.CommunityId) {
              getCommunity(proposalData.CommunityId)
                .then(resp => {
                  if (resp.success) {
                    const communityData = resp.data;
                    const approvals = proposalData?.Approvals ?? {};
                    let founders = [] as any[];
                    let key: string = '';
                    let value: any = null;
                    for ([key, value] of Object.entries(approvals)) {
                      founders.push({ Address: key, Ownership: communityData?.Proposal?.FounderMap[key]?.Share ?? 0, Status: value });
                    }
                    proposalData.FoundersData = founders;
                    setCommunity(communityData);
                  }
                });
            }

            // calculate total amount
            const addresses = proposalData?.Proposal?.Addresses ?? proposalData?.Addresses;
            if (addresses) {
              let total = 0;
              Object.values(addresses).forEach((amount: any) => total += amount);
              setTotalAirdropAmount(total);
            }

            // set the creator
            const proposalCreator = proposalData?.ProposalCreator;
            if (proposalCreator) {
              const foundUser = users.find(u => u.address == proposalCreator);
              if (foundUser) setCreator(foundUser);
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
          setErrorMsg("Error loading proposal");
          handleClickError();
        });
    }
  }, [proposalId, open]);

  if (proposal && open)
    return (
      <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon>
        <LoadingWrapper loading={!Object.keys(proposal).length}>
          <Box>
            <SignatureRequestModal
              open={openSignRequestModal}
              address={user.address}
              transactionFee="0.0000"
              detail={signRequestModalDetail}
              handleOk={handleVote}
              handleClose={() => setOpenSignRequestModal(false)}
            />
            <Box display="flex" flexDirection="column" alignItems="center">
              <img src={require("assets/emojiIcons/handshake.png")} alt="handshake" width={50} height={50} />
              <Header3>Token {proposal?.ProposalType == 'CommunityAirdrop'? 'Airdrop':'Allocation'} Proposal</Header3>
            </Box>
            <StyledDivider type="solid" mt={1} mb={2} />
            <Header5 noMargin>Proposal Details</Header5>
            <StyledDivider type="dashed" margin={2} />
            <Text size={FontSize.M}>User</Text>
            <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
              <Avatar size="small" url={creator.imageUrl? `${creator.imageUrl}`: require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")} />
              <Text size={FontSize.M} ml={1}>@{creator.name}</Text>
            </Box>
            <Text size={FontSize.M} bold className={classes.darkColor}>Has made a proposal of</Text>
            <Text className={classes.receiver}>{totalAirdropAmount} {community?.TokenSymbol}</Text>
            <StyledDivider type="solid" margin={2} />
            <Header5 noMargin>Proposal Acceptation</Header5>
            <StyledDivider type="dashed" margin={2} />
            {proposal.FoundersData && (
              <Box>
                <Box display="flex" flexDirection="row" justifyContent="space-between" my={1}>
                  <Text size={FontSize.M} bold className={classes.darkColor}>Member</Text>
                  <Text size={FontSize.M} bold className={classes.darkColor}>Status</Text>
                </Box>
                <Box maxHeight={300} overflow="scroll">
                  {proposal.FoundersData.map((founder, index) => {
                    const thisUser = users.find(u => u.address === founder.Address);
                    return (
                      <Box key={`cofounder-${index}`} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={1.5}>
                        <Box display="flex" alignItems="center">
                          <Avatar size="medium" url={thisUser?.imageUrl ? thisUser.imageUrl : ""} />
                          <Box display="flex" flexDirection="column">
                            <Text bold size={FontSize.M}>{thisUser ? thisUser.name : "User name"}</Text>
                            <Text size={FontSize.M} className={classes.userSlug}>
                              @{thisUser ? thisUser.urlSlug ?? thisUser.name : "User name"}
                            </Text>
                          </Box>
                        </Box>
                        {
                          founder?.Status && founder?.Status?.isVoted ?
                            (founder?.Status?.vote ?
                              <ProgressAcceptIcon />
                              :
                              <ProgressDeclineIcon />)
                            :
                            <ProgressPendingIcon />
                        }
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
            <StyledDivider type="dashed" margin={2} />
            <Box display="flex" flexDirection="row" alignItems="center">
              <img src={require("assets/emojiIcons/urn.png")} alt="urn" />
              <Box display="flex" flexDirection="column" ml={1}>
                <Text size={FontSize.M} bold className={classes.darkColor}>Voting time</Text>
                <Text>{foundersVotingTime ?? "unknown"}</Text>
              </Box>
              <Box display="flex" flexDirection="column" ml={3}>
                <Text size={FontSize.M} bold className={classes.darkColor}>Consensus</Text>
                <Text>
                  {community?.FoundersConsensus ? (Number(community.FoundersConsensus) * 100).toFixed(0) : 0}%
                </Text>
              </Box>
            </Box>
            <StyledDivider type="solid" margin={2} />
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <SecondaryButton onClick={() => handleOpenSignatureModal(false)} size="medium">
                Decline
              </SecondaryButton>
              <PrimaryButton onClick={() => handleOpenSignatureModal(true)} size="medium">
                {`Accept & Sign`}
              </PrimaryButton>
            </Box>
          </Box>

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
        </LoadingWrapper>
      </Modal>
    );
  else return null;
}
