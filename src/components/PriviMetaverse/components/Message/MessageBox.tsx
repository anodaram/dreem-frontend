import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import { socket } from "components/Login/Auth";
import { MessageContent } from "./MessageContent";

import { RootState } from "store/reducers/Reducer";
import { openMessageBox, sentMessage } from "store/actions/MessageActions";
import { getMessageBox } from "store/selectors/user";
import URL from "shared/functions/getURL";

import "./MessageBox.css";

export const MessageBox = ({ type = "live" }) => {
  const dispatch = useDispatch();

  const sourceRef = useRef<any>();
  const userSelector = useSelector((state: RootState) => state.user);
  const messageBoxInfo = useSelector(getMessageBox);
  const { isOpenMessageBox, isSendMessage, message, chat: messageBoxChat } = messageBoxInfo;

  const [chats, setChats] = useState<any[]>([]);
  const [chatsUsers, setChatsUsers] = useState<any>({});
  const [chat, setChat] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    if (chat && chat.room && socket) {
      socket.off("message");
      socket.on("message", message => {
        if (message.room !== chat.room) {
          return;
        }
        setMessages(msgs => {
          let msgsArray = [...msgs];
          msgsArray.push(message);
          return msgsArray;
        });

        let chatObj = {
          room: chat.room,
          userId: userSelector.id,
          lastView: Date.now(),
        };

        axios
          .post(`${URL()}/chat/lastView`, chatObj)
          .then(response => {
            if (response.data.success) {
              let id;
              if (chatsUsers["userTo"].userId === userSelector.id) {
                id = chatsUsers["userTo"].userId;
              } else if (chatsUsers["userFrom"].userId === userSelector.id) {
                id = chatsUsers["userFrom"].userId;
              }

              socket.emit("numberMessages", id);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }, [chat, socket]);

  useEffect(() => {
    //this opens message box when navigating to /social/:id/messages
    if (!isOpenMessageBox) {
      if (!message) {
        dispatch(openMessageBox(true));
      }
    }
  }, []);

  useEffect(() => {
    setPageIndex(messages.length);
  }, [messages]);

  useEffect(() => {
    if (isSendMessage === true) {
      const newChats = chats.map(item => {
        if (
          item.room === messageBoxChat.room ||
          (item.users?.userFrom?.userId === messageBoxChat.users?.userFrom?.userId &&
            item.users?.userTo?.userId === messageBoxChat.users?.userTo?.userId)
        ) {
          return messageBoxChat;
        }
        return item;
      });
      setChats(newChats);

      // If currently selected chat in the profile message is same as the chatmodal
      if (
        chat.room === messageBoxChat.room ||
        (chat.users?.userFrom?.userId === messageBoxChat.users?.userFrom?.userId &&
          chat.users?.userTo?.userId === messageBoxChat.users?.userTo?.userId)
      ) {
        setChat(messageBoxChat);
        setMessages(messageBoxChat.messages);
      }
      dispatch(sentMessage());
    }
  }, [isSendMessage]);

  const beforeCreateChat = (chat: any) => {
    let differentUser;
    if (
      chat &&
      chat.users &&
      chat.users.userFrom &&
      chat.users.userFrom.userId &&
      chat.users.userFrom.userId !== userSelector.id
    ) {
      differentUser = chat.users.userFrom;
    } else if (
      chat &&
      chat.users &&
      chat.users.userTo &&
      chat.users.userTo.userId &&
      chat.users.userTo.userId !== userSelector.id
    ) {
      differentUser = chat.users.userTo;
    }

    if (differentUser) {
      createChat(differentUser);
    }
  };

  const createChat = (user: any) => {
    let users: any = {
      userFrom: {
        userId: userSelector.id,
        userName: userSelector.firstName,
        userConnected: true,
        lastView: new Date(),
      },
      userTo: {
        userId: user.userId,
        userName: user.userName,
        userConnected: false,
        lastView: null,
      },
    };

    setChatsUsers(users);
    axios
      .post(`${URL()}/chat/newChat`, { users: users })
      .then(async response => {
        if (response.data.success) {
          setChat(response.data.data);
          setMessages([]);
          await getMessages(response.data.data, true);
          socket.emit("subscribe", users);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getMessages = (chatInfo?: any, isNew?: boolean): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (loadingMessages || !hasMore)) {
        resolve(true);
        return;
      }
      if (isNew && loadingMessages) {
        sourceRef.current?.cancel();
      }
      const cancelToken = axios.CancelToken;
      sourceRef.current = cancelToken.source();
      setLoadingMessages(true);
      axios
        .post(
          `${URL()}/chat/getMessages`,
          {
            room: chatInfo ? chatInfo.room : chat.room,
            pageIndex: isNew ? 0 : pageIndex,
          },
          {
            cancelToken: sourceRef.current.token,
          }
        )
        .then(response => {
          if (response.data.success) {
            let newMessages = response.data.data;
            if (!isNew) {
              newMessages = [...response.data.data, ...messages];
            }
            setMessages(newMessages);
            setHasMore(response.data.hasMore);
            setLoadingMessages(false);
            resolve(response.data.hasMore);
          }
        })
        .catch(error => {
          setLoadingMessages(false);
          reject(error);
          console.log(error);
        });
    });
  };

  const handleSetChat = newChat => {
    setChat(newChat);
    setMessages(newChat.messages);
    const newChats = chats.map(item => {
      if (
        item.room === newChat.room ||
        (item.users?.userFrom?.userId === newChat.users?.userFrom?.userId &&
          item.users?.userTo?.userId === newChat.users?.userTo?.userId)
      ) {
        return newChat;
      }
      return item;
    });
    setChats(newChats);
  };

  return (
    <MessageContent
      chat={chat}
      setChat={handleSetChat}
      specialWidthInput={true}
      messages={messages}
      setMessages={msgs => setMessages(msgs)}
      getMessages={getMessages}
      loadingMessages={loadingMessages}
    />
  );
};
