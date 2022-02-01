import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@material-ui/core";
import axios from "axios";

import { openNewChatModal } from "store/actions/MessageActions";
import { getMessageBox } from "store/selectors/user";
import { RootState } from "store/reducers/Reducer";
import { openChatModal } from "store/actions/MessageActions";
import { ListItem } from "./ListItem";

import { HeaderBold4 } from "shared/ui-kit";
import { SearchInputBox } from "shared/ui-kit/SearchInputBox/SearchInputBox";
import URL from "shared/functions/getURL";

import "./MessageList.css";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

export const MessageList = (props: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const { newChatInList } = useSelector(getMessageBox);
  const userSelector = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const [chats, setChats] = useState<any[]>(props.chats || []);
  const [keyword, setKeyword] = useState<string>("");
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userSelector.id) getChats();
  }, [userSelector.id]);

  useEffect(() => {
    if (props.chats) {
      setChats(props.chats);
    }
  }, [props.chats]);

  useEffect(() => {
    if (!newChatInList || !newChatInList.users) return;
    const newChatItem = {
      ...newChatInList,
      lastMessageDate: new Date().getTime(),
      messages: [],
      created: new Date().getTime(),
    };
    dispatch(openChatModal(true));
    props.createChat(newChatItem);
    if (
      chats.findIndex(
        chat =>
          chat.users.userFrom.userId === newChatItem.users.userFrom.userId &&
          chat.users.userTo.userId === newChatItem.users.userTo.userId
      ) > -1 ||
      chats.findIndex(
        chat =>
          chat.users.userFrom.userId === newChatItem.users.userTo.userId &&
          chat.users.userTo.userId === newChatItem.users.userFrom.userId
      ) > -1
    ) {
      setCurrentChat(
        chats.find(
          chat =>
            (chat.users.userFrom.userId === newChatItem.users.userFrom.userId &&
              chat.users.userTo.userId === newChatItem.users.userTo.userId) ||
            (chat.users.userFrom.userId === newChatItem.users.userTo.userId &&
              chat.users.userTo.userId === newChatItem.users.userFrom.userId)
        )
      );
      return;
    }
    setCurrentChat(newChatItem);
    setChats([newChatItem, ...chats]);
    if (props.setChats !== undefined) {
      props.setChats([newChatItem, ...chats]);
    }
  }, [newChatInList]);

  const handleOpenNewChatModal = () => {
    dispatch(openNewChatModal());
  };

  const getChats = () => {
    setLoading(true);
    axios
      .post(`${URL()}/chat/getChats`)
      .then(response => {
        if (response.data.success) {
          const cs = response.data.data;
          if (cs && cs.length > 0) {
            setCurrentChat(cs[0]);
            let otherUserId: string = "-1";
            if (cs[0].users && cs[0].users.userFrom && cs[0].users.userFrom.userId === userSelector.id) {
              otherUserId = cs[0].users.userTo.userId;
            } else if (cs[0].users && cs[0].users.userTo && cs[0].users.userTo.userId === userSelector.id) {
              otherUserId = cs[0].users.userFrom.userId;
            }
            if (otherUserId !== "-1" && !isMobile) {
              dispatch(openChatModal(true));
              props.createChat(cs[0]);
            }
          }
          setChats(cs);
          if (props.setChats) {
            props.setChats(cs);
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="message-list-items">
      <div className="message-list-header">
        <div style={{display:"flex", alignItems:"center"}}>
          <HeaderBold4 theme="msg_title">Messages</HeaderBold4>
          <img
            src={require("assets/icons/trax_edit_icon.svg")}
            className="edit-icon"
            onClick={handleOpenNewChatModal}
            style={{paddingLeft:15}}
          />
        </div>
        <img src={require("assets/icons/msg_list_right.png")}/>
      </div>
      <SearchInputBox
        keyword={keyword}
        setKeyword={setKeyword}
        placeholder={"Search User"}
        // style={{ background: "#F2FBF6" }}
      />
      <LoadingWrapper loading={loading}>
        <div className="item-list">
          {chats && chats.length > 0 ? (
            chats
              .filter(chat => {
                if (keyword.length > 0) {
                  const name =
                    userSelector.id === chat.users.userTo.userId
                      ? chat.users.userFrom.userName
                      : chat.users.userTo.userName;
                  return name.toLowerCase().includes(keyword.toLowerCase());
                }
                return true;
              })
              .sort((a, b) => (b.lastMessageDate ?? 0) - (a.lastMessageDate ?? 0))
              .map((chat, i) => (
                <ListItem
                  key={i}
                  chat={chat}
                  setChat={() => props.createChat(chat)}
                  currentChat={currentChat}
                  setCurrentChat={setCurrentChat}
                  type={props.type}
                />
              ))
          ) : (
            <div className="noItemsLabel">No messages</div>
          )}
        </div>
      </LoadingWrapper>
    </div>
  );
};
