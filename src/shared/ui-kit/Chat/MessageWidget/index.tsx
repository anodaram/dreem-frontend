import React, { useEffect, useRef, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { TextareaAutosize } from "@material-ui/core";
import { MessageItem } from "../MessageItem";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { socket } from "components/Login/Auth";
import axios from "axios";
import URL, { default as ServerURL } from "../../../functions/getURL";
import { ReactComponent as SendIcon } from "assets/icons/paper-plane-regular.svg";

import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { RecordingBox } from "shared/ui-kit/RecordingBox";
import AlertMessage from "../../Alert/AlertMessage";
import EmojiPane from "shared/ui-kit/EmojiPane";

import "../../Page-components/Discord/Discord.css";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      height: "632px",
      [theme.breakpoints.down("xs")]: {
        height: "540px",
        paddingBottom: "66px",
      },
    },
    noItemsLabel: {
      width: "100%",
      color: "grey",
      fontSize: "16px",
      textAlign: "center",
      marginTop: "20px",
    },
    main: {
      overflow: "scroll",
      height: "670px",
    },
    inputPanel: {
      display: "flex",
      alignItems: "center",
    },
    senderContentPanel: {
      display: "flex",
      margin: "16px 0px",
    },
    inputMessage: {
      background: "#F7F9FE",
      border: "1px solid #707582",
      boxSizing: "border-box",
      borderRadius: "11.36px",
      padding: "12px 16px",
      fontSize: 14,
      lineHeight: 1.2,
      width: "100%",
      resize: "none",
      marginLeft: "5px",
      outline: "none",
    },
    sendButton: {
      width: "40px",
      height: "40px",
      marginLeft: "10px",
      padding: "11px 11px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    sendImg: {
      width: "18px",
      height: "18px",
    },
    timestamp: {
      fontSize: "11px",
      color: "#707582",
      textAlign: "center",
      width: "100%",
      marginTop: "24px",
    },
    divider: {
      margin: "8px 0px",
    },
    mediaAvatar: {
      width: 32,
      height: 32,
    },
    content: {
      fontSize: 14,
      color: "#707582",
      background: "#EFF2F8",
      borderRadius: 10,
      padding: "13px 11px 16px 12px",
      width: "222px",
      boxSizing: "border-box",
      marginLeft: "8px",
    },
    selfContent: {
      fontSize: 14,
      color: "#707582",
      background: "transparent",
      border: "1px solid #EFF2F8",
      borderRadius: 10,
      padding: "13px 11px 16px 12px",
      width: "222px",
      boxSizing: "border-box",
      margin: "16px 0px",
      marginLeft: "auto",
    },
    itemList: {
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      scrollbarWidth: "none",
      height: "calc(100% - 44px)",
      "& .left-item": {
        marginTop: "10px",
        marginBottom: "10px",
        display: "flex",
        width: "50%",
      },
      "& .right-item": {
        marginTop: "10px",
        marginBottom: "10px",
        display: "flex",
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      "& .item-content": {
        background: "#eff2f8",
        borderRadius: "10px",
        color: "#949bab",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      },
      "& .right-item .item-content": {
        border: "1px solid #eff2f8",
        borderRadius: "10px",
        color: "#949bab",
        padding: "15px",
      },
      "& .avatar-container": {
        borderRadius: "50%",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
        marginRight: "20px",
      },
      "& .avatar-container .message-item-avatar": {
        borderRadius: "50%",
        width: "40px",
        height: "40px",
      },
    },

    rootDark: {
      display: "flex",
      flexDirection: "column",
      height: "867px",
      "& button": {
        bakground: "transparent !important",
        borderRadius: 0,
        backgroundColor: "transparent !important",
      },
      "& input": {
        width: "100%",
        background: "transparent",
        margin: "0px",
        padding: "0px !important",
        border: "none",
        color: "white",
        fontSize: "14px",
        fontFamily: "Agrandir",
        boxShadow: "none !important",
      },
      "& textarea": {
        width: "100%",
        background: "transparent",
        margin: "0px",
        padding: "0px !important",
        border: "none",
        color: "white",
        fontSize: "14px",
        fontFamily: "Agrandir",
        boxShadow: "none !important",
      },
    },
    inputPanelDark: {
      width: "100%",
      background: "rgba(255, 255, 255, 0.16)",
      border: "1px solid #FFFFFF",
      padding: "20px 16px",
      "& form": {
        width: "100%",
      },
    },
  })
);

type MessageWidgetProps = {
  media: any;
  chat: any;
  messages: any[];
  setMessages: any;
  typeChat: string;
  getMessages: (chatInfo?: any, isNew?: boolean) => Promise<number>;
  loadingMessages: boolean;
  theme?: "dark" | "light";
};

const MessageWidget: React.FC<MessageWidgetProps> = ({
  media,
  chat,
  messages,
  setMessages,
  typeChat,
  getMessages,
  loadingMessages,
  theme,
}) => {
  const classes = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<any>();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const emojiRef = useRef<any>();
  const [audioMessage, setAudioMessage] = useState<boolean>(false);
  const [paginationLoading, setPaginationLoading] = React.useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const itemListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (itemListRef && itemListRef.current && !paginationLoading)
      itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
    setPaginationLoading(false);
    setIsDarkTheme(theme !== undefined && theme === "dark" ? true : false);
  }, [messages]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const inputRef: any = useRef([]);

  const [status, setStatus] = React.useState<any>("");
  const addEmoji = (e, emojiObject) => {
    let emoji = emojiObject.emoji;
    setInputMessage(inputMessage + emoji);
    setShowEmoji(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  const startAudioRecording = () => {
    setAudioMessage(true);
  };

  const deleteVoiceMessage = () => {
    setAudioMessage(false);
  };

  const sendVoiceMessage = async () => {
    if (mediaBlobUrl) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob";

      xhr.onload = function () {
        var recoveredBlob = xhr.response;

        var reader = new FileReader();

        reader.onload = function () {
          const blobAsDefaultURL = reader.result;
          sendMessage(JSON.stringify(blobAsDefaultURL));
        };

        reader.readAsDataURL(recoveredBlob);
      };

      xhr.open("GET", mediaBlobUrl);
      xhr.send();
    }
  };

  const uploadAttachment = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "*";
    inputElement.multiple = true;

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputMessageAttachment);

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
  };

  const handleFilesAttachment = files => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image")) handleFiles({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("audio")) handleFilesAudio({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("video")) handleFilesVideo({ 0: files[i], length: 1 });
      else handleFilesOthers({ 0: files[i], length: 1 });
    }
  };

  const handleFilesOthers = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        onChangeMessageOther(files[i]);
      } else {
        setStatus({
          msg: "File too big (< 50Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const onChangeMessageOther = (file: any) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let url: string = "";
    if (typeChat === "ClaimableSongs") {
      url = `${URL()}/claimableSongs/addMessageFile/${chat.chat.id}/${userSelector.id}`;
    } else {
      url = `${URL()}/mediaOnCommunity/addMessageFile/${chat.chat.id}/${userSelector.id}/${typeChat}`;
    }

    axios
      .post(url, formData, config)
      .then(response => {
        if (socket && response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          socket.emit("add-message-mediaOnCommunity", msg);

          setMessages(msgs => {
            let msgsArray = [...msgs];
            msgsArray.push(msg);
            return msgsArray;
          });

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
  };

  const fileInputMessageAttachment = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesAttachment(files);
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileVideo = file => {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileAudio = file => {
    const validTypes = ["audio/mp3", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/mpeg"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const onChangeMessagePhoto = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("image", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let url: string = "";
    if (typeChat === "ClaimableSongs") {
      url = `${URL()}/claimableSongs/addMessagePhoto/${chat.chat.id}/${userSelector.id}`;
    } else {
      url = `${URL()}/mediaOnCommunity/addMessagePhoto/${chat.chat.id}/${userSelector.id}/${typeChat}`;
    }

    axios
      .post(url, formData, config)
      .then(response => {
        if (socket && response.data && response.data.success) {
          console.log(response.data);
          let msg: any = response.data.data;
          msg.noAddMessage = true;
          socket.emit("add-message-mediaOnCommunity", msg);
          setMessages(msgs => {
            let msgsArray = [...msgs];
            msgsArray.push(msg);
            return msgsArray;
          });

          setStatus({
            msg: "Photo uploaded successfully",
            key: Math.random(),
            variant: "success",
          });
        } else {
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
  };

  const onChangeMessageAudio = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("audio", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let url: string = "";
    if (typeChat === "ClaimableSongs") {
      url = `${URL()}/claimableSongs/addMessageAudio/${chat.chat.id}/${userSelector.id}`;
    } else {
      url = `${URL()}/mediaOnCommunity/addMessageAudio/${chat.chat.id}/${userSelector.id}/${typeChat}`;
    }

    axios
      .post(url, formData, config)
      .then(response => {
        if (socket && response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          console.log(msg);

          socket.emit("add-message-mediaOnCommunity", msg);
          setMessages(msgs => {
            let msgsArray = [...msgs];
            msgsArray.push(msg);
            return msgsArray;
          });

          setStatus({
            msg: "Audio uploaded successfully",
            key: Math.random(),
            variant: "success",
          });
        } else {
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
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangeMessagePhoto(files[i]);
      } else {
        files[i]["invalid"] = true;
        console.log("No valid file");
        // Alert invalid image
      }
    }
  };

  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].size);
      if (files[i].size / 1024 <= 51200) {
        if (validateFileVideo(files[i])) {
          onChangeMessageVideo(files[i]);
        } else {
          files[i]["invalid"] = true;
          console.log("No valid file");
          // Alert invalid image
          setStatus({
            msg: "Not valid format",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setStatus({
          msg: "File too big (< 50Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const onChangeMessageVideo = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("video", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let url: string = "";
    if (typeChat === "ClaimableSongs") {
      url = `${URL()}/claimableSongs/addMessageVideo/${chat.chat.id}/${userSelector.id}`;
    } else {
      url = `${URL()}/mediaOnCommunity/addMessageVideo/${chat.chat.id}/${userSelector.id}/${typeChat}`;
    }

    axios
      .post(url, formData, config)
      .then(response => {
        if (socket && response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          console.log(msg);

          socket.emit("add-message-mediaOnCommunity", msg);
          setMessages(msgs => {
            let msgsArray = [...msgs];
            msgsArray.push(msg);
            return msgsArray;
          });

          setStatus({
            msg: "Video uploaded successfully",
            key: Math.random(),
            variant: "success",
          });
        } else {
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
  };

  const handleFilesAudio = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 4096) {
        if (validateFileAudio(files[i])) {
          onChangeMessageAudio(files[i]);
        } else {
          files[i]["invalid"] = true;
          console.log("No valid file");
          // Alert invalid image
          setStatus({
            msg: "Not valid format",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setStatus({
          msg: "File too big (< 5Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const sendMessage = (audioMessage?: string) => {
    if (inputMessage || audioMessage) {
      let messageObj: any = {};
      messageObj = {
        chatId: chat.chat.id,
        message: inputMessage ? inputMessage : audioMessage,
        from: userSelector.id,
        fromType: typeChat,
        type: "text",
      };

      if (socket) {
        if (typeChat === "ClaimableSongs") {
          socket.emit("add-message-claimablePods", messageObj);
        } else {
          socket.emit("add-message-mediaOnCommunity", messageObj);
        }
      }

      let messagesCopy = [...messages];
      messagesCopy.push(messageObj);
      console.log(messagesCopy);
      setMessages(messagesCopy);

      setInputMessage("");
      setAudioMessage(false);
      let chatObj = {
        chatId: chat.chat.id,
        userId: userSelector.id,
        lastView: Date.now(),
      };
      let url: string = "";
      if (typeChat === "ClaimableSongs") {
        url = `${URL()}/claimableSongs/chat/lastView`;
      } else {
        url = `${URL()}/mediaOnCommunity/chat/lastView`;
      }

      axios
        .post(url, chatObj)
        .then(response => {
          if (response.data.success) {
            // socket.emit("numberMessages", userSelector.id);
          }
        })
        .catch(error => {
          console.log(error);
        });
      // socket.emit("numberMessages", messageObj.to);
    }
  };

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && messages?.length > 0) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        setPaginationLoading(true);
        const count = await getMessages();
        if (count === 0) {
          setPaginationLoading(false);
        }
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

  if (!media) return null;
  return (
    <div className={isDarkTheme ? classes.rootDark : classes.root}>
      <div className={classes.itemList} id="messageContainer" ref={itemListRef} onScroll={handleScroll}>
        <LoadingWrapper loading={loadingMessages} theme={theme} />
        {messages && messages.length > 0 ? (
          messages.map((item, index) => (
            <MessageItem
              key={index}
              user={userSelector.id}
              message={item}
              chat={chat}
              mediaOnCommunity={false}
              lastRow={index + 1 === messages.length}
            />
          ))
        ) : (
          <div className={classes.noItemsLabel}>No messages</div>
        )}
      </div>
      <div className={isDarkTheme ? classes.inputPanelDark : classes.inputPanel}>
        {!audioMessage && !isDarkTheme && (
          <div className="iconsDiscordMessage">
            <div className="iconImgDiscordMessage">
              <img
                src={require("assets/mediaIcons/old/audio_live.png")}
                alt={"upload audio"}
                onClick={startAudioRecording}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>

            <div className="iconImgDiscordMessage">
              <img
                src={require(`assets/icons/attachment_icon.svg`)}
                alt={"Attachment"}
                onClick={uploadAttachment}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>

            <div className="iconImgDiscordMessage" ref={emojiRef}>
              <img
                src={require(`assets/icons/emoji_icon.svg`)}
                alt={"emoji"}
                onClick={toggleEmojiPicker}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>

            {showEmoji && (
              <EmojiPane
                open={showEmoji}
                anchorEl={emojiRef.current}
                handleClose={() => setShowEmoji(false)}
                addEmoji={addEmoji}
              />
            )}
          </div>
        )}

        {!audioMessage && isDarkTheme && (
          <form
            className="sendDiscordMessage"
            onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              autoComplete="off"
              name="DiscordMessage"
              ref={el => (inputRef.current[0] = el)}
              type="text"
              autoFocus
              value={inputMessage}
              onChange={handleChange}
              placeholder="Write a message..."
            />
            <textarea
              autoComplete="off"
              name="DiscordMessage"
              ref={el => (inputRef.current[0] = el)}
              autoFocus
              value={inputMessage}
              onChange={handleChange}
              placeholder="Write a message..."
            />
            {isDarkTheme && !audioMessage && (
              <div className="iconImgDiscordMessage" ref={emojiRef}>
                <img
                  src={require(`assets/icons/emoji_icon_white.svg`)}
                  alt={"emoji"}
                  onClick={toggleEmojiPicker}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
            {isDarkTheme && !audioMessage && showEmoji && (
              <EmojiPane
                open={showEmoji}
                anchorEl={emojiRef.current}
                handleClose={() => setShowEmoji(false)}
                addEmoji={addEmoji}
              />
            )}
            {isDarkTheme && !audioMessage && (
              <div className="iconImgDiscordMessage">
                <img
                  src={require(`assets/icons/attachment_icon_white.svg`)}
                  alt={"Attachment"}
                  onClick={uploadAttachment}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
            <button>
              {isDarkTheme ? <img src={require("assets/icons/send_white_2.png")} alt="send" /> : <SendIcon />}
            </button>
          </form>
        )}

        {audioMessage && (
          <RecordingBox
            deleteVoiceMessage={deleteVoiceMessage}
            sendVoiceMessage={sendVoiceMessage}
            setMediaBlobUrl={setMediaBlobUrl}
          />
        )}
      </div>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default MessageWidget;
