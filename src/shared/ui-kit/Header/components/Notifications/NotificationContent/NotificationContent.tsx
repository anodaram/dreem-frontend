import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Notification } from "shared/services/API/NotificationsAPI";
import { setSelectedUser } from "store/actions/SelectedUser";

type NotificationContentProps = {
  notification: Notification;
  isFromPage?: boolean;
};

// TODO: Please refactor me to something shorter and configurable :""""(
export const NotificationContent: React.FunctionComponent<NotificationContentProps> = ({
  notification,
  isFromPage = false,
}) => {
  const { type, itemId, follower, otherItemId } = notification;

  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();

  const handleProfileRouting = () => {
    if (location) {
      const pathContextList = location.pathname.split("/");
      if (pathContextList.length > 0) {
        history.push(`/${pathContextList[1]}/profile/${itemId}`);
      }
    }

    dispatch(setSelectedUser(itemId));
  };

  return (
    <>
      {type === 1 ? (
        <div>
          You are getting noticed! Do you want to accept{" "}
          <b onClick={handleProfileRouting} style={isFromPage ? { color: "#EEFF21" } : {}}>
            {follower}
          </b>{" "}
          request to follow?
        </div>
      ) : type === 2 ? (
        <div>
          Your network is expanding! <b onClick={handleProfileRouting}>{follower}</b> accepts your request to
          follow.
        </div>
      ) : null}
    </>
  );
};
