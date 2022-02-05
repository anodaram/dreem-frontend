import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { useTheme, useMediaQuery } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import Moment from "react-moment";
import { socket } from "components/Login/Auth";
import { MessageItem } from "./MessageItem";
import { setChat, setMessage } from "store/actions/MessageActions";

import { default as ServerURL } from "shared/functions/getURL";
import { GLOBAL_CHAT_ROOM } from "shared/constants/constants";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import EmojiPane from "shared/ui-kit/EmojiPane";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import FileAttachment, { FileType } from "shared/ui-kit/FileAttachment";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onUploadNonEncrypt } from "shared/ipfs/upload";

import "./MessageBox.css";

export const MessageFooter = props => {
  const { messages, setMessages, setMediaUpdate, room = GLOBAL_CHAT_ROOM } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();
  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  const [audioMessage, setAudioMessage] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [status, setStatus] = useState<any>("");
  const emojiRef = useRef<any>();
  const inputRef = useRef<any>();

  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (!showEmoji && inputRef && inputRef.current) {
      inputRef.current.click();
    }
  }, [showEmoji]);

  const onChangeMessagePhoto = async (file: any) => {
    try {
      let from: string = localStorage.getItem("userId") || "";
      if (!from) return;

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file, false));

      axios
        .post(`${ServerURL()}/chat/addMessagePhoto/${room}/${from}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              lastMessage: msg.type,
              lastMessageDate: msg.created,
              messages: messagesCopy,
            };
            if (props.setChat) {
              props.setChat(chatObj);
            }

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            setStatus({
              msg: "Photo uploaded successfully",
              key: Math.random(),
              variant: "success",
            });

            setMediaUpdate(Math.random());
          } else {
            console.log(response.data);
            setStatus({
              msg: response.data.error,
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error uploading photo",
            key: Math.random(),
            variant: "error",
          });
        });
    } catch (error) {
      console.log(error);
      setStatus({
        msg: "Error uploading photo",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const onChangeMessageOther = async (file: any) => {
    try {
      let from: string = localStorage.getItem("userId") || "";
      if (!from) return;

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file, false));

      axios
        .post(`${ServerURL()}/chat/addMessageFile/${room}/${from}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              lastMessage: msg.type,
              lastMessageDate: msg.created,
              messages: messagesCopy,
            };
            if (props.setChat) {
              props.setChat(chatObj);
            }

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            setStatus({
              msg: "File uploaded successfully",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(response.data);
            setStatus({
              msg: response.data.error,
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error uploading file",
            key: Math.random(),
            variant: "error",
          });
        });
    } catch (error) {
      console.log(error);
      setStatus({
        msg: "Error uploading file",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const onChangeMessageVideo = async (file: any) => {
    try {
      let from: string = localStorage.getItem("userId") || "";
      if (!from) return;

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file, false));

      axios
        .post(`${ServerURL()}/chat/addMessageVideo/${room}/${from}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              lastMessage: msg.type,
              lastMessageDate: msg.created,
              messages: messagesCopy,
            };
            if (props.setChat) {
              props.setChat(chatObj);
            }

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            setStatus({
              msg: "Video uploaded successfully",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(response.data);
            setStatus({
              msg: response.data.error,
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error uploading video",
            key: Math.random(),
            variant: "error",
          });
        });
    } catch (error) {
      console.log(error);
      setStatus({
        msg: "Error uploading video",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const onFileChange = (file: any, type: FileType) => {
    switch (type) {
      case FileType.IMAGE:
        onChangeMessagePhoto(file);
        break;
      case FileType.VIDEO:
        onChangeMessageVideo(file);
        break;

      default:
        onChangeMessageOther(file);
        break;
    }
  };

  const sendMessage = (audioMsg?: string) => {
    const trimMsg = msg.replace(/^\s+|\s+$/g, "");
    let userId: any = localStorage.getItem("userId");
    if (socket && userId && (trimMsg || audioMsg)) {
      setAudioMessage(false);
      let messageObj: any = {
        room,
        message: trimMsg || audioMsg,
        from: {
          id: userId,
        },
        created: Date.now(),
      };

      socket.emit("add-message", messageObj);
      let messagesCopy = [...messages];
      messagesCopy.push(messageObj);
      setMessages(messagesCopy);

      const chatObj = {
        lastMessage: messageObj.message,
        lastMessageDate: messageObj.created,
        messages: messagesCopy,
      };
      if (props.setChat) {
        props.setChat(chatObj);
      }

      dispatch(setChat(chatObj));
      dispatch(setMessage(msg));
    }
    setMsg("");
  };

  const addEmoji = (e, emojiObject) => {
    let emoji = emojiObject.emoji;
    setMsg(msg + emoji);
    setShowEmoji(false);
  };

  return (
    <div className="message-footer1">
      {!audioMessage && (
        <Box display="flex" alignItems="top">
          <Box
            display="flex"
            alignItems="top"
            bgcolor="rgba(21, 21, 21, 0.3)"
            style={{
              border: "2px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <InputWithLabelAndTooltip
              overriedClasses="input"
              inputValue={msg}
              placeHolder="Message"
              type="text"
              onInputValueChange={e => setMsg(e.target.value)}
              onKeyDown={e => {
                if (!e.shiftKey && e.key === "Enter") {
                  sendMessage();
                  e.preventDefault();
                }
              }}
              style={{
                background: "transparent",
                borderRadius: 0,
                border: "none",
                color: "white",
                fontFamily: "Rany",
                fontWeight: 500,
              }}
              reference={inputRef}
              multiline
            />
            <Box component="span" onClick={() => sendMessage()} mx="8px" mt="8px">
              <img src={require("assets/icons/send_icon.svg")} alt="" />
            </Box>
          </Box>
          {!isMobile && !isTablet && (
            <Box display="flex" alignItems="center" marginTop="10px" height="fit-content">
              <Box className="emoji-icon" onClick={() => setShowEmoji(!showEmoji)} component="span">
                <img src={require("assets/icons/emoji_icon.png")} ref={emojiRef} />
              </Box>
              {showEmoji && (
                <EmojiPane
                  open={showEmoji}
                  anchorEl={emojiRef.current}
                  handleClose={() => setShowEmoji(false)}
                  addEmoji={addEmoji}
                />
              )}
              <FileAttachment setStatus={setStatus} onFileChange={onFileChange} />
            </Box>
          )}
        </Box>
      )}
    </div>
  );
};

export const MessageContent = ({
  messages,
  setMessages,
  specialWidthInput,
  getMessages,
  loadingMessages,
  room,
}) => {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const itemListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        if (itemListRef && itemListRef.current && (!loadingMessages || firstLoading)) {
          itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
        }
        setFirstLoading(false);
      }, 100);
    } else {
      getMessages(room);
    }
  }, [messages.length, room]);

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && hasMore) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        const hasMoreMessage = await getMessages(room);
        setHasMore(hasMoreMessage);
        if (lastMsgID) {
          const el = document.getElementById(lastMsgID);
          const itemList = document.getElementById("messageContainer");
          if (itemListRef && itemListRef.current && el && itemList) {
            itemListRef.current.scrollTop = Math.max(
              0,
              el.getBoundingClientRect().y - itemList.getBoundingClientRect().y - 90
            );
          }
        }
      }
    },
    [getMessages]
  );

  return (
    <div className="message-content-container">
      <div className="item-list-container" id="messageContainer" ref={itemListRef} onScroll={handleScroll}>
        <div>
          {loadingMessages || messages?.length > 0 ? (
            <div className="item-list" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {loadingMessages && (
                <Box width="100%" display="flex" justifyContent="center" alignItems="center" flex={1}>
                  <LoadingWrapper loading={loadingMessages} />
                </Box>
              )}
              {messages?.length > 0 &&
                messages.map((item, index) => {
                  // set date for new day message
                  let hasDate = false;
                  const today = new Date().getDate();
                  const curMsgDate = new Date(messages[index].created).getDate();
                  const lastMsgDate = index === 0 ? 0 : new Date(messages[index - 1].created).getDate();

                  if (index === 0) {
                    hasDate = true;
                  } else if (curMsgDate !== lastMsgDate) {
                    hasDate = true;
                  }
                  if (hasDate) {
                    curMsgDate === today;
                  }

                  return (
                    <>
                      {hasDate && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "24px 0",
                            color: "#7E7D95",
                            opacity: "0.6",
                          }}
                        >
                          <div
                            style={{
                              flex: "1",
                              height: "1px",
                              background: "#7E7D95",
                              marginRight: "10px",
                              opacity: "0.1",
                            }}
                          />
                          {curMsgDate === today ? (
                            <div style={{ color: "#65CB63" }}>Today</div>
                          ) : (
                            <>
                              {today - curMsgDate > 1 ? (
                                <Moment format="DD MMM YYYY hh:mm A">{item.created}</Moment>
                              ) : (
                                <div>Yesterday</div>
                              )}
                            </>
                          )}
                          <div
                            style={{
                              flex: "1",
                              height: "1px",
                              background: "#7E7D95",
                              marginLeft: "10px",
                              opacity: "0.1",
                            }}
                          />
                        </div>
                      )}
                      <MessageItem
                        key={item.id ?? `message-${index}`}
                        message={item}
                        messageContentRef={itemListRef}
                      />
                    </>
                  );
                })}
            </div>
          ) : (
            <div className="no-items-label">
              <div style={{ fontSize: 14 }}>No messages in the chat yet.</div>
            </div>
          )}
        </div>
      </div>
      <MessageFooter
        setChat={setChat}
        messages={messages}
        specialWidthInput={specialWidthInput}
        setMessages={msgs => setMessages(msgs)}
        room={room}
      />
    </div>
  );
};
