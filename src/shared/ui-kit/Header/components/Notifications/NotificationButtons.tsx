import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Notification } from "shared/services/API/NotificationsAPI";
import URL from "shared/functions/getURL";
import { getUser } from "store/selectors/user";
import { CircularLoadingIndicator, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
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

  const [isLoadingAccept, setIsLoadingAccept] = useState<boolean>(false);

  const [status, setStatus] = React.useState<any>("");

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
