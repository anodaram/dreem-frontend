import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { RootState } from "store/reducers/Reducer";
import { socket } from "components/Login/Auth";
import URL, { default as ServerURL } from "shared/functions/getURL";
import "./Chat.css";
import { Modal, Dialog } from "@material-ui/core";
import axios from "axios";
import DiscordPhotoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";
import Waveform from "shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform";
import { RecordingBox } from "shared/ui-kit/RecordingBox";
import AlertMessage from "../../../Alert/AlertMessage";
import Moment from "react-moment";
import { saveAs } from "file-saver";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import EmojiPane from "shared/ui-kit/EmojiPane";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as DownloadSolid } from "assets/icons/download-solid.svg";

export default function Chat(props) {
  const location = useLocation();
  const isPix = useMemo(() => {
    return location.pathname.includes("/pix");
  }, [location]);
  const userSelector = useSelector((state: RootState) => state.user);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<any>();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<any>("");
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>("");
  const [openModalPhotoFullScreen, setOpenModalPhotoFullScreen] = React.useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = React.useState<string>("");
  const [openModalVideoFullScreen, setOpenModalVideoFullScreen] = React.useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [paginationLoading, setPaginationLoading] = React.useState<boolean>(false);
  const itemListRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<any>();
  const playerVideo = React.useRef(null);

  const handleOpenModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(true);
  };

  const handleCloseModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(false);
  };

  const handleOpenModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(true);
  };

  const handleCloseModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(false);
  };

  const [audioMessage, setAudioMessage] = useState<boolean>(false);

  useEffect(() => {
    setPageIndex(messages.length);
    if (itemListRef && itemListRef.current && !paginationLoading)
      itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
    setPaginationLoading(false);

    console.log("messages", messages);
  }, [messages]);

  useEffect(() => {
    if (props.chat && props.chat.room) {
      if (props.mediaMarketing) {
        setMessages(props.messages);
        socket.off("message-marketing-media-community");
        socket.on("message-marketing-media-community", message => {
          setMessages(msgs => {
            let msgsArray = [...msgs];
            msgsArray.push(message);
            return msgsArray;
          });

          let chatObj = {
            room: props.chat.room,
            userId: userSelector.id,
            lastView: Date.now(),
          };

          axios
            .post(`${URL()}/media/marketingMediaCommunity/chats/lastView`, chatObj)
            .then(response => {
              if (response.data.success) {
                // socket.emit("numberMessages", props.chat.room);
              }
            })
            .catch(error => {
              console.log(error);
            });
        });
      } else {
        setMessages([]);
        getMessages(true);
        socket.off("message");
        socket.on("message", message => {
          setMessages(msgs => {
            let msgsArray = [...msgs];
            msgsArray.push(message);
            return msgsArray;
          });

          let chatObj = {
            room: props.chat.room,
            userId: userSelector.id,
            lastView: Date.now(),
          };

          axios
            .post(`${URL()}/chat/lastView`, chatObj)
            .then(response => {
              if (response.data.success) {
                let id;
                if (props.chatsUsers["userTo"].userId === userSelector.id) {
                  id = props.chatsUsers["userTo"].userId;
                } else if (props.chatsUsers["userFrom"].userId === userSelector.id) {
                  id = props.chatsUsers["userFrom"].userId;
                }

                socket.emit("numberMessages", id);
              }
            })
            .catch(error => {
              console.log(error);
            });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chat]);

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

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangeMessagePhoto(files[i]);
      } else {
        files[i]["invalid"] = true;
      }
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

  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        if (validateFileVideo(files[i])) {
          onChangeMessageVideo(files[i]);
          // TODO: have to upload image file here, check Discord.tsx Line 872
        } else {
          files[i]["invalid"] = true;
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

  const onChangeMessageOther = (file: any) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let from: string = "";
    let to: string = "";
    if (userSelector.id === props.chat.users.userFrom.userId) {
      from = props.chat.users.userFrom.userId;
      to = props.chat.users.userTo.userId;
    } else {
      from = props.chat.users.userTo.userId;
      to = props.chat.users.userFrom.userId;
    }

    axios
      .post(`${ServerURL()}/chat/addMessageFile/${props.chat.room}/${from}/${to}`, formData, config)
      .then(response => {
        if (response.data && response.data.success) {
          let msg: any = response.data.data;
          msg.noAddMessage = true;
          socket.emit("add-message", msg);
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

  const onChangeMessagePhoto = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("image", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    let from: string = "";
    let to: string = "";
    if (userSelector.id === props.chat.users.userFrom.userId) {
      from = props.chat.users.userFrom.userId;
      to = props.chat.users.userTo.userId;
    } else {
      from = props.chat.users.userTo.userId;
      to = props.chat.users.userFrom.userId;
    }

    axios
      .post(`${URL()}/chat/addMessagePhoto/${props.chat.room}/${from}/${to}`, formData, config)
      .then(response => {
        if (response.data && response.data.success) {
          let msg: any = response.data.data;
          msg.noAddMessage = true;
          socket.emit("add-message", msg);
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

    let from: string = "";
    let to: string = "";
    if (userSelector.id === props.chat.users.userFrom.userId) {
      from = props.chat.users.userFrom.userId;
      to = props.chat.users.userTo.userId;
    } else {
      from = props.chat.users.userTo.userId;
      to = props.chat.users.userFrom.userId;
    }

    axios
      .post(`${URL()}/chat/addMessageAudio/${props.chat.room}/${from}/${to}`, formData, config)
      .then(response => {
        if (response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          socket.emit("add-message", msg);

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

  const onChangeMessageVideo = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("video", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let from: string = "";
    let to: string = "";
    if (userSelector.id === props.chat.users.userFrom.userId) {
      from = props.chat.users.userFrom.userId;
      to = props.chat.users.userTo.userId;
    } else {
      from = props.chat.users.userTo.userId;
      to = props.chat.users.userFrom.userId;
    }

    axios
      .post(`${URL()}/chat/addMessageVideo/${props.chat.room}/${from}/${to}`, formData, config)
      .then(response => {
        if (response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          socket.emit("add-message", msg);

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

  const handleFilesAttachment = files => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image")) handleFiles({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("audio")) handleFilesAudio({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("video")) handleFilesVideo({ 0: files[i], length: 1 });
      else handleFilesOthers({ 0: files[i], length: 1 });
    }
  };

  const fileInputMessageAttachment = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesAttachment(files);
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

  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  const getMessages = (isNew?: boolean): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (messagesLoading || !hasMore)) {
        resolve(0);
        return;
      }
      setMessagesLoading(true);
      axios
        .post(`${URL()}/chat/getMessages`, {
          room: props.chat.room,
          pageIndex: isNew ? 0 : pageIndex,
        })
        .then(response => {
          if (response.data.success) {
            if (isNew) setMessages(response.data.data);
            else setMessages([...response.data.data, ...messages]);
            setHasMore(response.data.hasMore);
            setMessagesLoading(false);
            resolve(response.data.data.length);
          }
        })
        .catch(error => {
          setMessagesLoading(false);
          reject(error);
          console.log(error);
        });
    });
  };

  const sendMessage = (audioMessage?: string) => {
    if (props.mediaMarketing) {
      if (message || audioMessage) {
        setAudioMessage(false);
        let messageObj: any = {
          mediaId: props.mediaId,
          communityId: props.communityId,
          message: audioMessage ? audioMessage : message,
          fromId: userSelector.id,
          fromName: userSelector.firstName,
        };

        socket.emit("add-message-marketing-media-community", messageObj);
        let messagesCopy = [...messages];
        messagesCopy.push(messageObj);
        setMessages(messagesCopy);

        setMessage("");
        let chatObj = {
          room: props.chat.room,
          userId: userSelector.id,
          lastView: Date.now(),
        };

        axios
          .post(`${URL()}/media/marketingMediaCommunity/chats/lastView`, chatObj)
          .then(response => {})
          .catch(error => {
            console.log(error);
          });
      }
    } else {
      let messageObj;
      if (message || audioMessage) {
        setAudioMessage(false);
        if (userSelector.id === props.chat.users.userFrom.userId) {
          messageObj = {
            room: props.chat.room,
            message: audioMessage ? audioMessage : message,
            from: props.chat.users.userFrom.userId,
            to: props.chat.users.userTo.userId,
            created: Date.now(),
            seen: false,
          };
        } else {
          messageObj = {
            room: props.chat.room,
            message: audioMessage ? audioMessage : message,
            from: props.chat.users.userTo.userId,
            to: props.chat.users.userFrom.userId,
            created: Date.now(),
            seen: false,
          };
        }

        socket.emit("add-message", messageObj);
        let messagesCopy = [...messages];
        messagesCopy.push(messageObj);
        setMessages(messagesCopy);

        setMessage("");
        let chatObj = {
          room: props.chat.room,
          userId: userSelector.id,
          lastView: Date.now(),
        };

        axios
          .post(`${URL()}/chat/lastView`, chatObj)
          .then(response => {
            if (response.data.success) {
              let id;
              if (props.chatsUsers["userTo"].userId === userSelector.id) {
                id = props.chatsUsers["userTo"].userId;
              } else if (props.chatsUsers["userFrom"].userId === userSelector.id) {
                id = props.chatsUsers["userFrom"].userId;
              }

              socket.emit("numberMessages", id);
            }
          })
          .catch(error => {
            console.log(error);
          });
        socket.emit("numberMessages", messageObj.to);
      }
    }
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

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  const addEmoji = (e, emojiObject) => {
    let emoji = emojiObject.emoji;
    setMessage(message + emoji);
    setShowEmoji(false);
  };

  const downloadFile = (item: any) => {
    saveAs(`${item.url}`, item.message);
  };

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && messages.length > 0) {
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

  return (
    <div className="p2p-chat" style={props.wip ? { height: "55vh" } : {}}>
      {props.mediaMarketing ? (
        <div className="headerNameP2PChat">{props.chat.communityName || ""}</div>
      ) : (
        <div className="headerNameP2PChat">
          {props.chatsUsers["userTo"].userId === userSelector.id
            ? props.chatsUsers["userFrom"].userName
            : props.chatsUsers["userFrom"].userId === userSelector.id
            ? props.chatsUsers["userTo"].userName
            : null}
        </div>
      )}

      <div className="messages" id="messageContainer" ref={itemListRef} onScroll={handleScroll}>
        <LoadingWrapper loading={messagesLoading}>
          {messages &&
            messages.length > 0 &&
            messages.map(item => {
              return (
                <div
                  className={props.chatsUsers.userFrom.userId === item.from ? "mine" : "notmine"}
                  key={item.id}
                  id={item.id}
                >
                  {props.chatsUsers.userFrom.imageURL || props.chatsUsers.userFrom.userImage ? (
                    <div
                      className="image"
                      style={{
                        backgroundImage:
                          props.chatsUsers.userFrom.imageURL && props.chatsUsers.userFrom.imageURL.length > 0
                            ? `url(${props.chatsUsers.userFrom.imageURL})`
                            : props.chatsUsers.userFrom.userImage &&
                              props.chatsUsers.userFrom.userImage.length > 0
                            ? `url(${props.chatsUsers.userFrom.userImage})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : null}
                  <div className={"bubble"}>
                    {(item.type === "text" || !item.type) &&
                    item.message &&
                    item.message.includes("data:audio/wav;") ? (
                      <div>
                        <audio style={{ width: "200px" }} controls src={JSON.parse(item.message)}>
                          The “audio” tag is not supported by your browser. Click [here] to download the sound
                          file.
                        </audio>
                        <div
                          className="messageChatDateFromNow"
                          style={
                            item.from === userSelector.id ? { textAlign: "right" } : { textAlign: "left" }
                          }
                        >
                          <Moment fromNow>{item.created}</Moment>
                        </div>
                      </div>
                    ) : item.type === "photo" ? (
                      <div className={"container"}>
                        <div
                          className={"photoContainer"}
                          onClick={() => {
                            setSelectedPhoto(`${item.url}`);
                            handleOpenModalPhotoFullScreen();
                          }}
                          style={{
                            backgroundImage: `url(${item.url})`,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                          }}
                        ></div>
                        <div
                          className="messageChatDateFromNow"
                          style={
                            item.from === userSelector.id ? { textAlign: "right" } : { textAlign: "left" }
                          }
                        >
                          <Moment fromNow>{item.created}</Moment>
                        </div>
                      </div>
                    ) : item.type === "video" ? (
                      <div className={"container"}>
                        <div className="videoContainer">
                          <div className="iconVideoWrapper">
                            <SvgIcon className="playIconVideo">
                              <PlaySolid />
                            </SvgIcon>
                          </div>
                          <ReactPlayer
                            onClick={() => {
                              setSelectedVideo(`${item.url}`);
                              handleOpenModalVideoFullScreen();
                            }}
                            url={`${item.url}`}
                            className="videoPlayer"
                            ref={playerVideo}
                            progressInterval={200}
                          />
                        </div>
                        <div
                          className="messageChatDateFromNow"
                          style={
                            item.from === userSelector.id ? { textAlign: "right" } : { textAlign: "left" }
                          }
                        >
                          <Moment fromNow>{item.created}</Moment>
                        </div>
                      </div>
                    ) : item.type === "audio" ? (
                      <div className="container">
                        <div className="audioContainer">
                          <Waveform
                            url={`${URL()}/chat/getMessageAudio/${item.room}/${item.from}/${item.id}`}
                            mine={props.chatsUsers.userFrom.userId === item.from}
                            showTime={false}
                            onPauseFunction={null}
                            onPlayFunction={null}
                            onReadyFunction={null}
                          />
                        </div>
                        <div
                          className="messageChatDateFromNow"
                          style={
                            item.from === userSelector.id ? { textAlign: "right" } : { textAlign: "left" }
                          }
                        >
                          <Moment fromNow>{item.created}</Moment>
                        </div>
                      </div>
                    ) : item.type === "file" ? (
                      <div className="item-content">
                        <div className="item-file">
                          <div className="item-file-name">{item.message.originalname || "file"}</div>
                          <div onClick={() => downloadFile(item)} className="item-file-icon">
                            <SvgIcon>
                              <DownloadSolid />
                            </SvgIcon>
                          </div>
                        </div>
                        <div
                          className="messageChatDateFromNow"
                          style={
                            item.from === userSelector.id ? { textAlign: "right" } : { textAlign: "left" }
                          }
                        >
                          <Moment fromNow>{item.created}</Moment>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={item.from === userSelector.id ? { textAlign: "right" } : { textAlign: "left" }}
                      >
                        {item.message}
                        <div
                          className="messageChatDateFromNow"
                          style={
                            item.from === userSelector.id ? { textAlign: "right" } : { textAlign: "left" }
                          }
                        >
                          <Moment fromNow>{item.created}</Moment>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </LoadingWrapper>
      </div>
      <div className="message-footer-wip">
        {!audioMessage ? (
          <>
            {!isPix && (
              <img
                src={require("assets/mediaIcons/old/audio_live.png")}
                alt={"Record your voice"}
                onClick={startAudioRecording}
                className="audio-icon"
              />
            )}
            <img
              className="attachment-icon"
              src={require(isPix ? "assets/icons/pix_attachment_icon.svg" : "assets/icons/attachment_icon.svg")}
              alt="Attachment"
              onClick={uploadAttachment}
            />
            <img
              src={require(isPix ? "assets/icons/pix_emoji_icon.svg" : "assets/icons/emoji_icon.svg")}
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
        ) : null}
        {!audioMessage && (
          <input
            className="input"
            value={message}
            placeholder="Message"
            onChange={e => setMessage(e.target.value)}
            onKeyUp={e => {
              e.key === "Enter" && sendMessage();
            }}
          />
        )}

        {!audioMessage && (
          <div className="send-icon" onClick={() => sendMessage()}>
            <img src={require("assets/icons/send_icon.svg")} />
          </div>
        )}
        {audioMessage && (
          <RecordingBox
            deleteVoiceMessage={deleteVoiceMessage}
            sendVoiceMessage={sendVoiceMessage}
            setMediaBlobUrl={setMediaBlobUrl}
          />
        )}
        {selectedPhoto && (
          <Modal className="modal" open={openModalPhotoFullScreen} onClose={handleCloseModalPhotoFullScreen}>
            <DiscordPhotoFullScreen onCloseModal={handleCloseModalPhotoFullScreen} url={selectedPhoto} />
          </Modal>
        )}
        {selectedVideo && openModalVideoFullScreen && (
          <Dialog
            className="modal"
            open={openModalVideoFullScreen}
            onClose={handleCloseModalVideoFullScreen}
            maxWidth={"md"}
            fullWidth
          >
            <DiscordVideoFullScreen onCloseModal={handleCloseModalVideoFullScreen} url={selectedVideo} />
          </Dialog>
        )}
      </div>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
}
