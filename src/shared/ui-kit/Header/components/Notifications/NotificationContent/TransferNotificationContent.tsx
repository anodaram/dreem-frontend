import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Notification } from "shared/services/API/NotificationsAPI";
import { setSelectedUser } from "store/actions/SelectedUser";
import { TransferType } from "./types";

type TransferNotificationContentProps = {
  notification: Notification;
};

export const TransferNotificationContent: React.FunctionComponent<TransferNotificationContentProps> = ({
  notification: { type, itemId, follower, comment, token, amount, otherItemId: mediaSymbol },
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const isIncoming = type === 128;
  const transferType = comment as TransferType;

  const userLink = itemId ? (
    <b
      onClick={() => {
        history.push(`/profile/${itemId}`);
        dispatch(setSelectedUser(itemId));
      }}
    >
      {follower}
    </b>
  ) : (
    follower
  );

  const transferText = (
    <>
      <b>{transferType.toLocaleLowerCase()}</b> transfer
    </>
  );

  const transferTextWithMediaSymbol = mediaSymbol ? (
    <>
      {transferText} for <b>{mediaSymbol}</b>
    </>
  ) : (
    transferText
  );

  return isIncoming ? (
    <div>
      {userLink} made a {transferTextWithMediaSymbol} of {amount} {token} to you
    </div>
  ) : (
    <div>
      You have made {transferTextWithMediaSymbol} of {amount} {token} to {userLink}
    </div>
  );
};
