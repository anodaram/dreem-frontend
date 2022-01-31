import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";

import { RootState } from "store/reducers/Reducer";
import { openChatModal } from "store/actions/MessageActions";
import { socket } from "components/Login/Auth";

import { Color } from "shared/ui-kit";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { checkUserConnected } from "shared/services/API";

export const ListItem: React.FunctionComponent<any> = ({
  chat,
  setChat,
  currentChat,
  setCurrentChat,
  type = "social",
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);

  let pathName = window.location.href; // If routing changes, change to
  let idUrl =
    userSelector && userSelector.urlSlug && userSelector.urlSlug.length > 0
      ? userSelector.urlSlug
      : localStorage.getItem("userSlug");

  const [otherUser, setOtherUser] = useState<any>({});
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (otherUser.userId) {
      checkUserConnected(otherUser.userId)
        .then(res => {
          if (res.success) {
            setConnected(res.connected);
          } else {
            setConnected(false);
          }
        })
        .catch(e => {})
        .finally(() => {
          if (socket) {
            socket.on("user_connect_status", connectStatus => {
              if (connectStatus.userId === otherUser.userId) {
                setConnected(connectStatus.connected);
              }
            });
          }
        });
    }
  }, [otherUser]);

  useEffect(() => {
    if (chat) {
      if (chat.users && chat.users.userFrom && chat.users.userFrom.userId === userSelector.id) {
        setOtherUser(chat.users.userTo);
      } else if (chat.users && chat.users.userTo && chat.users.userTo.userId === userSelector.id) {
        setOtherUser(chat.users.userFrom);
      }
    }
  }, [chat]);

  const handleClick = () => {
    setCurrentChat(chat);
    dispatch(openChatModal(true));
    setChat();
    if (!pathName.includes("messages")) history.push(`/social/${idUrl}/messages`);
  };

  return (
    <div
      className={`item ${
        currentChat &&
        ((chat.users.userFrom.userId === currentChat.users.userFrom.userId &&
          chat.users.userTo.userId === currentChat.users.userTo.userId) ||
          (chat.users.userFrom.userId === currentChat.users.userTo.userId &&
            chat.users.userTo.userId === currentChat.users.userFrom.userId))
          ? "selected"
          : ""
      }`}
      onClick={handleClick}
    >
      <div className="avatar-container">
        <div
          className="message-list-avatar"
          style={{
            backgroundImage: `url("${otherUser.userFoto ?? getDefaultAvatar()}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="item-content">
        <div className="name">{otherUser.userName}</div>
        {/* <div className="message">{chat.lastMessage}</div> */}
        {typeof chat.lastMessage === "string" && (
          <div className="message" style={{ color: type === "pix" ? "#54658F" : "#949BAB" }}>
            {chat.lastMessage.includes("data:audio/wav;") ? (
              <div style={{ display: "flex" }}>
                <img src={require("assets/icons/music-solid.svg")} alt={"music-solid"} />
                &nbsp;Audio
              </div>
            ) : chat.lastMessage.length > 75 ? (
              `${chat.lastMessage.substring(0, 75)} ...`
            ) : (
              chat.lastMessage.substring(0, 75)
            )}
          </div>
        )}
        {chat.lastMessage && (
          <div
            className="date"
            style={{
              color:
                type === "pix"
                  ? "rgba(84, 101, 143, 0.6)"
                  : type === "trax"
                  ? Color.MusicDAOGreen
                  : "#949BAB",
            }}
          >
            Last message: <Moment fromNow>{chat.lastMessageDate}</Moment>
          </div>
        )}
      </div>
      {connected && <div className="connect-status" />}
    </div>
  );
};
