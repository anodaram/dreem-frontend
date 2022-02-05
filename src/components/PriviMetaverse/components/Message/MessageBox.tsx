import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import { socket } from "components/Login/Auth";
import { MessageContent } from "./MessageContent";

import { RootState } from "store/reducers/Reducer";
import { openMessageBox, sentMessage } from "store/actions/MessageActions";
import { getMessageBox } from "store/selectors/user";
import { GLOBAL_CHAT_ROOM } from "shared/constants/constants";
import URL from "shared/functions/getURL";

import "./MessageBox.css";

export const MessageBox = ({ roomId }: { roomId: string }) => {
  const dispatch = useDispatch();

  const sourceRef = useRef<any>();
  const userSelector = useSelector((state: RootState) => state.user);
  const messageBoxInfo = useSelector(getMessageBox);
  const { isOpenMessageBox, isSendMessage, message, chat: messageBoxChat } = messageBoxInfo;

  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    if (socket) {
      const userId = localStorage.getItem("userId") || userSelector.id;

      socket.off("message");
      socket.on("message", message => {
        if (message.room !== roomId) {
          return;
        }

        setMessages(msgs => {
          let msgsArray = [...msgs];
          msgsArray.push(message);
          return msgsArray;
        });

        let chatObj = {
          room: roomId,
          userId: userId,
          lastView: Date.now(),
        };

        axios
          .post(`${URL()}/chat/lastView`, chatObj)
          .then(response => {
            if (response.data.success) {
              socket.emit("numberMessages", userId);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });

      if (roomId) {
        socket.emit("subscribe", roomId);
        setMessages([]);
      }
    }
  }, [socket, roomId]);

  useEffect(() => {
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
      setMessages(messageBoxChat.messages);
      dispatch(sentMessage());
    }
  }, [isSendMessage]);

  const getMessages = (room: string, isNew?: boolean) => {
    if (!isNew && !hasMore && !roomId) {
      return false;
    }
    if (isNew) {
      sourceRef.current?.cancel();
    }
    const cancelToken = axios.CancelToken;
    sourceRef.current = cancelToken.source();
    setLoadingMessages(true);

    axios
      .post(
        `${URL()}/chat/getMessages`,
        {
          room,
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
          return hasMore;
        }
      })
      .catch(error => {
        setLoadingMessages(false);
        console.log(error);
        return false;
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      style={{
        background: "#212121",
        border: "2px solid #151515",
        boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.5), 0px 16px 1px -488px rgba(0, 0, 0, 0.18)",
      }}
      height="50%"
      overflow="hidden"
    >
      <MessageContent
        specialWidthInput={true}
        messages={messages}
        setMessages={msgs => setMessages(msgs)}
        getMessages={getMessages}
        loadingMessages={loadingMessages}
        room={roomId}
      />
    </Box>
  );
};
