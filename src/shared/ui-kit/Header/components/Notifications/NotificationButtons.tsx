import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Notification } from "shared/services/API/NotificationsAPI";
import URL from "shared/functions/getURL";
import { getUser } from "store/selectors/user";
import EditCommunityWIPModal from "shared/ui-kit/Modal/Modals/EditCommunityWIPModal";
import { CircularLoadingIndicator, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

// import { useStreaming } from "shared/contexts/StreamingContext";
import ReviewCommunityAirdropProposalModal from "shared/ui-kit/Modal/Modals/ReviewCommunityAirdropProposalModal";
import ReviewCommunityMemberProposalModal from "shared/ui-kit/Modal/Modals/ReviewCommunityMemberProposal";
import ReviewCommunityMediaAcquisitionProposalModal from "shared/ui-kit/Modal/Modals/ReviewCommunityMediaAcquisitionProposalModal";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import RequestedJoinDAOModal from "shared/ui-kit/Modal/Modals/RequestedJoinDAO";
import { notificationButtonStyles } from "./NotificationButtons.styles";

type NotificationButtonsProps = {
  notification: Notification;
  onDismissNotification: () => void;
  refreshAllProfile: (userId: string) => void;
  viewMore?: (value: any) => void;
  setSelectedNotification: (value: Notification) => void;
  handleShowContributionModal: () => void;
  handleClosePopper: () => void;
  handleHidePopper: () => void;
  theme?: "dark" | "light";
};

const ButtonContainer = styled.div`
  button {
    margin-bottom: 0 !important;
  }
`;

export const NotificationButtons: React.FunctionComponent<NotificationButtonsProps> = ({
  notification,
  onDismissNotification: dismissNotification,
  refreshAllProfile,
  handleClosePopper,
  theme = "light",
}) => {
  const classes = notificationButtonStyles();
  let userSelector = useSelector(getUser);

  const [community, setCommunity] = useState<any>({});

  const [openModalEditCommunityWIP, setOpenModalEditCommunityWIP] = useState<boolean>(false);
  const [openModalAcceptJoiningRequest, setOpenModalAcceptJoiningRequest] = useState<boolean>(false);

  const [openReviewCommunityProposal, setOpenReviewCommunityProposal] = useState<boolean>(false);
  const [isLoadingAccept, setIsLoadingAccept] = useState<boolean>(false);
  const [proposalType, setProposalType] = useState<string>("");

  const [status, setStatus] = React.useState<any>("");

  const handleCloseModalEditCommunityWIP = () => {
    setOpenModalEditCommunityWIP(false);
  };

  const handleCloseReviewCommunityProposal = () => {
    setOpenReviewCommunityProposal(false);
    setProposalType("");
    handleClosePopper();
  };

  // Functions Notifications
  const acceptDeclineFollowing = (user, boolUpdateFollowing, idNotification) => {
    if (!user || !user.id) return;

    setIsLoadingAccept(true)
    if (boolUpdateFollowing) {
      // accept
      axios
        .post(`${URL()}/user/connections/acceptFollowUser`, {
          userToAcceptFollow: {
            id: user.id,
          },
          idNotification: idNotification,
        })
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            dismissNotification();
            setStatus({
              msg: "Accepted following request",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(resp.error);
            setStatus({
              msg: "Error accept request",
              key: Math.random(),
              variant: "error",
            });
          }
          setIsLoadingAccept(false)
        });
    } else {
      // decline
      axios
        .post(`${URL()}/user/connections/declineFollowUser`, {
          userToDeclineFollow: {
            id: user.id,
          },
          user: {
            id: userSelector.id,
          },
          idNotification: idNotification,
        })
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            dismissNotification();
            setStatus({
              msg: "Declined request",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(resp.error);
            setStatus({
              msg: "Error decline request",
              key: Math.random(),
              variant: "error",
            });
          }
        });
    }
  };

  const getWIPCommunity = (communityId: string, notificationId: any) => {
    if (communityId) {
      axios
        .get(`${URL()}/community/getWIP/${communityId}/${userSelector.id}/${notificationId}`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            let data = { ...resp.data };
            setCommunity(data);
          } else {
            setStatus({
              msg: "Error getting Community",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(e => {
          console.log(e);
          setStatus({
            msg: "Error getting Community",
            key: Math.random(),
            variant: "error",
          });
        });
    } else {
      setStatus({
        msg: "Error getting Community",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  return (
    <>
      <ButtonContainer>
        
        {notification.type === 1 ? (
          <>
            {isLoadingAccept ? (
              <Box display="flex" justifyContent="center" width={1}>
                <CircularLoadingIndicator />
              </Box>
            ) : (
              <>
                <SecondaryButton
                  className={classes.darkButton}
                  size="small"
                  onClick={() => acceptDeclineFollowing({ id: notification.itemId }, false, notification.id)}
                >
                  Decline
                </SecondaryButton>
                <PrimaryButton
                  className={classes.acceptButton}
                  size="small"
                  onClick={() => acceptDeclineFollowing({ id: notification.itemId }, true, notification.id)}
                >
                  Accept
                </PrimaryButton>
              </>
            )}
          </>
        ) : null}
      </ButtonContainer>
      {openModalAcceptJoiningRequest && (
        <RequestedJoinDAOModal
          open={openModalAcceptJoiningRequest}
          userId={notification.itemId}
          CommunityAddress={notification.pod}
          onCloseDialog={setOpenModalAcceptJoiningRequest(false)}
        />
      )}

      <EditCommunityWIPModal
        community={community}
        open={openModalEditCommunityWIP}
        handleClose={handleCloseModalEditCommunityWIP}
        isCreator={community.Creator === userSelector.id}
        refreshCommunity={() => getWIPCommunity(community.id, null)}
        refreshAllProfile={() => refreshAllProfile(userSelector.id)}
      />
      {(proposalType == "airdrop" || proposalType == "allocation") && (
        <ReviewCommunityAirdropProposalModal
          open={openReviewCommunityProposal}
          handleClose={handleCloseReviewCommunityProposal}
          proposalId={notification.itemId}
        />
      )}
      {(proposalType == "addTreasurer" ||
        proposalType == "ejectTreasurer" ||
        proposalType == "addMember" ||
        proposalType == "ejectMember") && (
        <ReviewCommunityMemberProposalModal
          open={openReviewCommunityProposal}
          handleClose={handleCloseReviewCommunityProposal}
          proposalId={notification.itemId}
          proposalType={proposalType}
        />
      )}
      {proposalType == "mediaAcquisition" && (
        <ReviewCommunityMediaAcquisitionProposalModal
          open={openReviewCommunityProposal}
          handleClose={handleCloseReviewCommunityProposal}
          proposalId={notification.itemId}
        />
      )}

      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus("")}
        />
      )}
    </>
  );
};
