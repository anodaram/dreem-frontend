import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { MessageItem } from "./MessageItem";
import { socket } from "components/Login/Auth";
import { RootState } from "store/reducers/Reducer";
import { setChat, setMessage } from "store/actions/MessageActions";

import { default as ServerURL } from "shared/functions/getURL";
import { RecordingBox } from "shared/ui-kit/RecordingBox";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import EmojiPane from "shared/ui-kit/EmojiPane";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import FileAttachment, { FileType } from "shared/ui-kit/FileAttachment";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import { Box } from "@material-ui/core";

import "./MessageBox.css";
import Moment from "react-moment";

export const MessageFooter = props => {
  const { chat, messages, setMessages, specialWidthInput, type = "social", setMediaUpdate } = props;
  const dispatch = useDispatch();
  const userSelector = useSelector((state: RootState) => state.user);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  const [audioMessage, setAudioMessage] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [mediaBlobUrl, setMediaBlobUrl] = React.useState<any>();
  const [status, setStatus] = useState<any>("");
  const emojiRef = useRef<any>();
  const inputRef = useRef<any>();

  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const onChangeMessagePhoto = async (file: any) => {
    try {
      let from: string = "";
      let to: string = "";
      if (userSelector.id === chat.users.userFrom.userId) {
        from = chat.users.userFrom.userId;
        to = chat.users.userTo.userId;
      } else {
        from = chat.users.userTo.userId;
        to = chat.users.userFrom.userId;
      }

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file, false));

      axios
        .post(`${ServerURL()}/chat/addMessagePhoto/${chat.room}/${from}/${to}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              ...chat,
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

  const onChangeMessageAudio = async (file: any) => {
    try {
      let from: string = "";
      let to: string = "";
      if (userSelector.id === chat.users.userFrom.userId) {
        from = chat.users.userFrom.userId;
        to = chat.users.userTo.userId;
      } else {
        from = chat.users.userTo.userId;
        to = chat.users.userFrom.userId;
      }

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file, false));

      axios
        .post(`${ServerURL()}/chat/addMessageAudio/${chat.room}/${from}/${to}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              ...chat,
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
              msg: "Audio uploaded successfully",
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
            msg: "Error uploading audio",
            key: Math.random(),
            variant: "error",
          });
        });
    } catch (error) {
      console.log(error);
      setStatus({
        msg: "Error uploading audio",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const onChangeMessageOther = async (file: any) => {
    try {
      let from: string = "";
      let to: string = "";
      if (userSelector.id === chat.users.userFrom.userId) {
        from = chat.users.userFrom.userId;
        to = chat.users.userTo.userId;
      } else {
        from = chat.users.userTo.userId;
        to = chat.users.userFrom.userId;
      }

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file, false));

      axios
        .post(`${ServerURL()}/chat/addMessageFile/${chat.room}/${from}/${to}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              ...chat,
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
      let from: string = "";
      let to: string = "";
      if (userSelector.id === chat.users.userFrom.userId) {
        from = chat.users.userFrom.userId;
        to = chat.users.userTo.userId;
      } else {
        from = chat.users.userTo.userId;
        to = chat.users.userFrom.userId;
      }

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file, false));

      axios
        .post(`${ServerURL()}/chat/addMessageVideo/${chat.room}/${from}/${to}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              ...chat,
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
      case FileType.AUDIO:
        onChangeMessageAudio(file);
        break;
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

  const startAudioRecording = () => {
    setAudioMessage(true);
  };

  const deleteVoiceMessage = () => {
    setAudioMessage(false);
  };

  function b64toBlob(dataURI) {
    let byteString = atob(dataURI.split(",")[1]);
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  }

  const sendVoiceMessage = async () => {
    if (mediaBlobUrl) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob";

      xhr.onload = function () {
        var recoveredBlob = xhr.response;

        var reader = new FileReader();

        reader.onload = async function () {
          const blobAsDefaultURL = reader.result;
          if (blobAsDefaultURL) {
            onChangeMessageAudio(b64toBlob(blobAsDefaultURL));
            setAudioMessage(false);
          }
        };

        reader.readAsDataURL(recoveredBlob);
      };

      xhr.open("GET", mediaBlobUrl);
      xhr.send();
    }
  };

  const sendMessage = (audioMsg?: string) => {
    const trimMsg = msg.replace(/^\s+|\s+$/g, "");
    if (trimMsg || audioMsg) {
      setAudioMessage(false);
      let messageObj: any = {};
      if (userSelector.id === chat.users.userFrom.userId) {
        messageObj = {
          room: chat.room,
          message: trimMsg || audioMsg,
          from: chat.users.userFrom.userId,
          to: chat.users.userTo.userId,
          created: Date.now(),
          seen: false,
        };
      } else {
        messageObj = {
          room: chat.room,
          message: trimMsg || audioMsg,
          from: chat.users.userTo.userId,
          to: chat.users.userFrom.userId,
          created: Date.now(),
          seen: false,
        };
      }

      socket.emit("add-message", messageObj);
      let messagesCopy = [...messages];
      messagesCopy.push(messageObj);
      setMessages(messagesCopy);

      const chatObj = {
        ...chat,
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

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  const addEmoji = (e, emojiObject) => {
    let emoji = emojiObject.emoji;
    setMsg(msg + emoji);
    setShowEmoji(false);
  };

  useEffect(() => {
    if (!showEmoji && inputRef && inputRef.current) {
      inputRef.current.click();
    }
  }, [showEmoji]);

  return (
    <div className="message-footer1">
      {!audioMessage && (
        <>
          <FileAttachment setStatus={setStatus} onFileChange={onFileChange} />
          <img
            src={require("assets/icons/emoji_icon.svg")}
            className="emoji-icon"
            onClick={toggleEmojiPicker}
            ref={emojiRef}
          />
          {showEmoji && (
            <EmojiPane
              open={showEmoji}
              anchorEl={emojiRef.current}
              handleClose={() => setShowEmoji(false)}
              addEmoji={addEmoji}
            />
          )}
        </>
      )}
      {!audioMessage && (
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
          style={{ background: "#F7F9FE" }}
          reference={inputRef}
          multiline
        />
      )}

      {!audioMessage && (
        <div className="send-icon" onClick={() => sendMessage()}>
          <img src={require("assets/icons/send_icon.svg")} />
        </div>
      )}
      {audioMessage && (
        <RecordingBox
          specialWidthInput={specialWidthInput}
          deleteVoiceMessage={deleteVoiceMessage}
          sendVoiceMessage={sendVoiceMessage}
          setMediaBlobUrl={setMediaBlobUrl}
        />
      )}
    </div>
  );
};

export const MessageContent = ({
  chat,
  messages,
  setMessages,
  specialWidthInput,
  getMessages,
  loadingMessages,
  setChat,
}) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const itemListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMore(true);
    setFirstLoading(true);
  }, [chat]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        if (itemListRef && itemListRef.current && (!loadingMessages || firstLoading)) {
          itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
        }
        setFirstLoading(false);
      }, 100);
    }
  }, [messages.length]);

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && hasMore) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        const hasMoreMessage = await getMessages();
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
                      user={
                        chat.users.userFrom.userId === userSelector.id
                          ? chat.users.userTo
                          : chat.users.userFrom
                      }
                      message={item}
                      messageContentRef={itemListRef}
                    />
                  </>
                );
              })}
          </div>
        ) : (
          <div className="no-items-label">
            <img src={require("assets/icons/messages.png")} alt="messages" style={{ width: "100px" }} />
            <div style={{ fontSize: 14 }}>No messages in the chat yet.</div>
          </div>
        )}
      </div>
      <MessageFooter
        chat={chat}
        setChat={setChat}
        messages={messages}
        specialWidthInput={specialWidthInput}
        setMessages={msgs => setMessages(msgs)}
      />
    </div>
  );
};
