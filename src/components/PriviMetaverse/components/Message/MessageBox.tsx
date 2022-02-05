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

export const MessageBox = ({ roomId = GLOBAL_CHAT_ROOM }: { roomId?: string }) => {
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

      socket.emit("subscribe", roomId);
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
    }
  }, [socket]);

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

  const getMessages = (isNew?: boolean): Promise<boolean> => {
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
            room: roomId,
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

  return (
    <Box
      style={{
        background: "#212121",
        border: "2px solid #151515",
        boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.5), 0px 16px 1px -488px rgba(0, 0, 0, 0.18)",
        height: "44%",
      }}
    >
      <Box display="flex" bgcolor="#151515" p="8px" width="fit-content" mx="19px" mt="22px">
        <Box className={"tab selected"}>Live Chat</Box>
      </Box>
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
