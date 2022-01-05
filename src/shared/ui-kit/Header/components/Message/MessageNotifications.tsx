import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { HeaderBold4 } from "shared/ui-kit";
import { SearchInputBox } from "shared/ui-kit/SearchInputBox/SearchInputBox";
import { openChatModal, openNewChatModal } from "store/actions/MessageActions";
import { RootState } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { ListItem } from "./ListItem";
import URL from "shared/functions/getURL";
import { messageNotificationsStyles } from "./MessageNotifications.styles";

type MessageNotificationsProps = {
  handleClosePopper?: () => void;
};

export const MessageNotifications: React.FC<MessageNotificationsProps> = ({ handleClosePopper }) => {
  const history = useHistory();
  const classes = messageNotificationsStyles();

  const dispatch = useDispatch();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);
  const [chats, setChats] = useState<any[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [chatsCharged, setChatsCharged] = useState<boolean>(false);

  const isTrax = window.location.href.includes("/trax/");

  useEffect(() => {
    getChats();
  }, []);

  const handleOpenNewChatModal = () => {
    dispatch(openNewChatModal());
    if (handleClosePopper) handleClosePopper();
  };

  const getChats = () => {
    axios
      .post(`${URL()}/chat/getChats`, {
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let cs = [] as any;
          if (usersInfo && usersInfo.length > 0) {
            response.data.data.forEach((chat, index) => {
              cs.push(chat);
              if (usersInfo.some(user => user.id === chat.users.userFrom.userId)) {
                cs[index].users.userFrom.userFoto =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].imageURL;
                cs[index].users.userFrom.userName =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].name;
              }
              if (usersInfo.some(user => user.id === chat.users.userTo.userId)) {
                cs[index].users.userTo.userFoto =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].imageURL;
                cs[index].users.userTo.userName =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].name;
              }
            });
          }
          cs.sort((a, b) => (b.lastMessageDate ?? 0) - (a.lastMessageDate ?? 0));
          setChatsCharged(true);
          setChats(cs);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className={classes.message_notifications}>
      <div className={classes.message_notifications_header}>
        <HeaderBold4>Messages</HeaderBold4>
        {window.location.href.includes("/pix") ? (
          <img
            src={require("assets/icons/pix_edit_icon.svg")}
            className={classes.edit_icon}
            onClick={handleOpenNewChatModal}
          />
        ) : isTrax ? (
          <img
            src={require("assets/icons/trax_edit_icon.svg")}
            className={classes.edit_icon}
            onClick={handleOpenNewChatModal}
          />
        ) : (
          <img
            src={require("assets/icons/edit_icon.svg")}
            className={classes.edit_icon}
            onClick={handleOpenNewChatModal}
          />
        )}
      </div>
      <SearchInputBox
        keyword={keyword}
        setKeyword={setKeyword}
        placeholder="Search user"
        style={isTrax ? { background: "#F2FBF6" } : {}}
      />
      <div className={classes.item_list}>
        <LoadingWrapper loading={!chatsCharged}>
          {
            <>
              {chats &&
                chats
                  .filter(chat => {
                    if (keyword.length > 0) {
                      return chat.users.userTo.userName.toLowerCase().includes(keyword.toLowerCase());
                    } else return true;
                  })
                  .slice(0, 3)
                  .map(chat => {
                    return <ListItem chat={chat} key={chat.room} handleClosePopper={handleClosePopper} />;
                  })}
            </>
          }
        </LoadingWrapper>
      </div>
      <div
        className={classes.message_notifications_footer}
        onClick={() => {
          if (window.location.href.includes("/pix")) {
            history.push(`/pix/${userSelector.urlSlug}/messages`);
          } else if (window.location.href.includes("/trax")) {
            history.push(`/trax/${userSelector.urlSlug}/messages`);
          } else {
            history.push(`/social/${userSelector.urlSlug}/messages`);
          }
          dispatch(openChatModal(false));
          if (handleClosePopper) handleClosePopper();
        }}
      >
        See All Messages
      </div>
    </div>
  );
};
