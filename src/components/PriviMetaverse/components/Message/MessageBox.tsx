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

export const MessageBox = () => {
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
        console.log('message', message);
        setMessages(msgs => {
          let msgsArray = [...msgs];
          msgsArray.push(message);
          return msgsArray;
        });

        let chatObj = {
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
    <MessageContent
      specialWidthInput={true}
      messages={messages}
      setMessages={msgs => setMessages(msgs)}
      getMessages={getMessages}
      loadingMessages={loadingMessages}
    />
  );
};
