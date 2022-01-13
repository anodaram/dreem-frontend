import React, { useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns/esm";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import Box from "shared/ui-kit/Box";
import { Notification } from "shared/services/API/NotificationsAPI";
import { Avatar, Color, FontSize, grid } from "shared/ui-kit";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { NotificationButtons } from "./NotificationButtons";
import { NotificationContent } from "./NotificationContent/NotificationContent";

type NotificationsPopperContentProps = {
  notifications: Notification[];
  onDismissNotification: (notificationId: string) => void;
  onRefreshAllProfile: (userId: string) => void;
  removeNotification: (notificationId: string) => void;
  handleClosePopper: () => void;
  viewMore: (value: string) => void;
  setSelectedNotification?: any;
  handleShowContributionModal: () => void;
  handleHidePopper: () => void;
  theme?: "dark" | "light";
};

export const NotificationsPopperContent: React.FunctionComponent<NotificationsPopperContentProps> = ({
  notifications,
  onDismissNotification,
  onRefreshAllProfile,
  removeNotification,
  viewMore,
  setSelectedNotification,
  handleClosePopper,
  handleShowContributionModal,
  handleHidePopper,
  theme = "light",
}) => {
  const history = useHistory();

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const [avatar, setAvatar] = useState<string>("");

    useEffect(() => {
      (async () => {
        if (notification && notification.typeItemId === "NftMarketplace") {
          setAvatar(notification.externalData.nft.image);
        } else {
          if (notification && notification.avatar) {
            setAvatar(notification.avatar);
          } else {
            setAvatar(getDefaultAvatar());
          }
        }
      })();
    }, [notification]);

    return (
      <NotificationContainer key={notification.date}>
        <AvatarContainer>
          <Avatar noBorder={theme === "dark"} url={avatar} size="medium" />
        </AvatarContainer>
        <ContentContainer>
          <NotificationMessage theme={theme}>
            <NotificationContent notification={notification} />
          </NotificationMessage>
          <TimeLabel>{formatDistanceToNowStrict(new Date(notification.date), { addSuffix: true })}</TimeLabel>
          <NotificationButtons
            theme={theme}
            notification={notification}
            onDismissNotification={() => {
              onDismissNotification(notification.id);
            }}
            refreshAllProfile={onRefreshAllProfile}
            viewMore={viewMore}
            setSelectedNotification={setSelectedNotification}
            handleShowContributionModal={handleShowContributionModal}
            handleClosePopper={handleClosePopper}
            handleHidePopper={handleHidePopper}
          />
          {/* <RemoveButtonWrapper onClick={() => { removeNotification(notification.id) }}>
      </RemoveButtonWrapper> */}
        </ContentContainer>
        <div
          onClick={() => removeNotification(notification.id)}
          style={{ paddingTop: 14, cursor: "pointer" }}
        >
          <RemoveIcon />
        </div>
      </NotificationContainer>
    );
  };

  return (
    <div onClick={() => {}}>
      <Box fontSize={18} fontWeight={700} fontFamily="GRIFTER" color="#fff">
        Notifications
      </Box>
      <TimeDivider theme={theme} />
      {notifications && notifications.length > 0 ? (
        <>
          {notifications
            .filter((v, i) => i < 10)
            .map((n, index) => (
              <NotificationItem notification={n} />
            ))}
          <ShowAllButtton
            onClick={() => {
              history.push(`/notifications`);
              handleClosePopper();
            }}
          >
            See All Notifications
          </ShowAllButtton>
        </>
      ) : (
        <Box display="flex" justifyContent="center" color="#ffffff" py={2}>
          No Notifications
        </Box>
      )}
    </div>
  );
};

const RemoveIcon = () => (
  <svg width="10" height="10" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.5416 2.45801L2.45825 20.5414M2.45827 2.45801L20.5416 20.5414"
      stroke="white"
      strokeWidth="3"
      stroke-linecap="square"
    />
  </svg>
);

const NotificationContainer = styled.div`
  padding: ${grid(2)} ${grid(2)} ${grid(2)} 0;
  display: flex;
  align-items: stretch;
  position: relative;
`;

const AvatarContainer = styled.div`
  flex-grow: 0;
  margin-right: ${grid(2)};
`;

const ContentContainer = styled.div`
  width: 100%;
`;

type NotificationMessageProps = React.PropsWithChildren<{
  theme?: "dark" | "light";
}>;

const NotificationMessage = styled.div<NotificationMessageProps>`
  margin-top: 0;
  margin-bottom: ${grid(1)};
  line-height: 18px;
  font-size: ${FontSize.M};
  color: ${p => (p.theme === "dark" ? Color.White : "#181818")};
  word-break: break-word;

  label {
    font-size: 14px;
    color: ${p => (p.theme === "dark" ? Color.White : "#181818")};
    margin: 0;
    margin-bottom: 10px;
    display: block;
  }

  b {
    font-weight: bold;
    cursor: pointer;
  }

  em {
    font-style: normal;
    font-weight: bold;
  }
`;

const TimeLabel = styled.p`
  margin-top: 8px;
  color: ${Color.GrayDark};
  font-size: ${FontSize.S};
`;

const TimeDivider = styled.div<NotificationMessageProps>`
  opacity: 0.1;
  border: 1px solid ${p => (p.theme === "dark" ? Color.White : Color.Black)};
  margin-top: 20px;
`;

const ShowAllButtton = styled.div`
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: center;
  color: #99a1b3;
  cursor: pointer;
`;
