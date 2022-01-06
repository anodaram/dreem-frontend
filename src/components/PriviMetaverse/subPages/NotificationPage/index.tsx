import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Box from "shared/ui-kit/Box";

import { notificationPageStyles } from "./index.styles";
import { useNotifications } from "shared/contexts/NotificationsContext";
import { Avatar, Color, FontSize, grid } from "shared/ui-kit";
import { NotificationContent } from "shared/ui-kit/Header/components/Notifications/NotificationContent";
import { NotificationButtons } from "shared/ui-kit/Header/components/Notifications/NotificationButtons";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import Moment from "react-moment";
import { Hidden } from "@material-ui/core";

export default function NotificationPage() {
  const classes = notificationPageStyles();

  const { notifications } = useNotifications();

  return (
    <Box className={classes.content}>
      <Box className={classes.background}>
        <Box className={classes.title}>Notifications</Box>
        {notifications.map(n => (
          <NotificationItem notification={n} />
        ))}
      </Box>
    </Box>
  );
}

const NotificationItem = ({ notification }) => {
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (notification && notification.avatar) {
        setAvatar(notification.avatar);
      } else {
        setAvatar(getDefaultAvatar());
      }
    })();
  }, [notification]);

  return (
    <NotificationContainer key={notification.date}>
      <AvatarContainer>
        <Avatar noBorder url={avatar} size="medium" />
      </AvatarContainer>
      <ContentContainer>
        <Hidden mdUp>
          <TimeLabel>
            <Moment format="YYYY-MM-DD hh:mm:ss">{new Date(notification.date)}</Moment>
          </TimeLabel>
        </Hidden>
        <NotificationMessage theme="dark">
          <NotificationContent notification={notification} isFromPage />
        </NotificationMessage>
        <NotificationButtons
          notification={notification}
          onDismissNotification={() => {}}
          refreshAllProfile={() => {}}
          viewMore={() => {}}
          setSelectedNotification={() => {}}
          handleShowContributionModal={() => {}}
          handleClosePopper={() => {}}
          handleHidePopper={() => {}}
        />
      </ContentContainer>
      <Hidden smDown>
        <TimeLabel>
          <Moment format="YYYY-MM-DD hh:mm:ss">{new Date(notification.date)}</Moment>
        </TimeLabel>
      </Hidden>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  padding: ${grid(2)} ${grid(2)} ${grid(2)} ${grid(2)};
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  position: relative;
  width: 100%;
  max-width: 1280px;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 12px;
  align-items: center;
`;

const AvatarContainer = styled.div`
  flex-grow: 0;
  margin-right: ${grid(2)};
`;

const ContentContainer = styled.div`
  flex: 1;
`;

type NotificationMessageProps = React.PropsWithChildren<{
  theme?: "dark" | "light";
}>;

const NotificationMessage = styled.div<NotificationMessageProps>`
  margin-top: 0;
  margin-bottom: ${grid(1)};
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
  color: ${Color.White};
  font-size: ${FontSize.S};
`;
