import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedUser } from "store/actions/SelectedUser";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors/user";

import { getDefaultAvatar } from "shared/services/user/getUserAvatar";

import "./MessageProfile.css";

const TopStatesItem = props => {
  const { title, value } = props;
  return (
    <div className="state">
      <div className="state-title">
        <img />
        <div>{title}</div>
      </div>
      <div className="state-value">{value}</div>
    </div>
  );
};

export const MessageProfile = ({ chat }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userSelector = useTypedSelector(getUser);

  const userInfo = React.useMemo(() => {
    if (chat && userSelector) {
      if (chat.users?.userFrom?.userId === userSelector.id) {
        return chat.users?.userTo;
      }
      return chat.users?.userFrom;
    }

    return null;
  }, [chat, useSelector]);

  const pathName = window.location.href; // If routing changes, change to pathname

  const handleViewProfile = () => {
    history.push(`/profile/${userInfo.urlSlug ?? userInfo.userId}`);
    dispatch(setSelectedUser(userInfo.userId));
  };

  if (userInfo !== undefined && (userInfo.userName || userInfo.urlSlug))
    return (
      <div>
        <img src={userInfo?.userFoto ?? getDefaultAvatar()} className="message-profile-avatar" />
        <div className="name">{userInfo && userInfo.userName}</div>
        <div className="slug-container">
          {userInfo && userInfo.urlSlug ? (
            <div className="slug-name">@{userInfo && userInfo.urlSlug ? userInfo.urlSlug : ""}</div>
          ) : null}
          {(userInfo && userInfo.userVerified) && (
          <img className="verified-label" src={require("assets/icons/profileVerified.svg")} alt={"check"} />
          )}
          {/* <span className="profile-level">level 1</span> */}
        </div>
        {userInfo ? (
          <div className="top-stats">
            <div className="title">Top States</div>
            <div className="stats">
              <TopStatesItem title="🌟 Followers" value={userInfo.numFollowers || 0} />
              <TopStatesItem title="💫 Following" value={userInfo.numFollowings || 0} />
            </div>
            <div className="stats">
              <TopStatesItem title="📹 Media" value={0} />
              <TopStatesItem title="🥇 Awards" value={userInfo.awards || ""} />
            </div>
          </div>
        ) : null}
        <div className="badges">
          <div className="title">💎 Badges</div>
        </div>
        <div className="button-container">
          <button onClick={handleViewProfile}>View Full Profile</button>
        </div>
      </div>
    );
  else return null;
};
