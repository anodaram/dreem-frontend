import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Moment from "react-moment";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { saveAs } from "file-saver";

import SvgIcon from "@material-ui/core/SvgIcon";

import Box from "shared/ui-kit/Box";
import { socket, setSocket } from "components/Login/Auth";
import { RootState } from "store/reducers/Reducer";
import { setSelectDiscordRoom } from "store/actions/SelectedDiscordRoom";
import { setterUsersDiscordRoom } from "store/actions/UsersDiscordRoom";
import { setterUsersTypesDiscordRoom } from "store/actions/UsersTypesDiscordRoom";
import GiveTipModal from "shared/ui-kit/Modal/Modals/GiveTipModal";
import Waveform from "./DiscordAudioWavesurfer/Waveform";
import DiscussionSidebar from "shared/ui-kit/Sidebar/DiscussionSidebar";
import { RecordingBox } from "shared/ui-kit/RecordingBox";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import EmojiPane from "shared/ui-kit/EmojiPane";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import { ReactComponent as ThumbsUpSolid } from "assets/icons/thumbs-up-solid.svg";
import { ReactComponent as ThumbsDownSolid } from "assets/icons/thumbs-down-solid.svg";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as DownloadSolid } from "assets/icons/download-solid.svg";
import { ReactComponent as SendIcon } from "assets/icons/paper-plane-regular.svg";
import { ReactComponent as MessageIcon } from "assets/icons/comment-alt-solid.svg";
import { ReactComponent as EmojiIcon } from "assets/icons/laugh-solid.svg";
import { ReactComponent as LockIcon } from "assets/icons/lock-solid.svg";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";
import { TitleGrandLight } from "shared/ui-kit/Icons/progressIcons/index.styles";
import { Modal } from "shared/ui-kit";

import DiscordVideoFullScreen from "./DiscordVideoFullScreen/DiscordVideoFullScreen";
import DiscordPhotoFullScreen from "./DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import DiscordReplyModal from "./DiscordReplyModal/DiscordReplyModal";
import DiscordSettings from "./DiscordSettings/DiscordSettings";
import DiscordUsersModal from "./DiscordUsersModal/DiscordUsersModal";
import { setSelectedUser } from "store/actions/SelectedUser";
import { updateTask } from "../../../functions/updateTask";
import { useHistory } from "react-router-dom";
import AlertMessage from "../../Alert/AlertMessage";
import { PrimaryButton } from "../../Buttons";
import URL, { default as ServerURL } from "../../../functions/getURL";
import "./Discord.css";
import "./DiscordDark.css";

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.discordId === currProps.discordId &&
    prevProps.sidebar === currProps.sidebar &&
    prevProps.type === currProps.type &&
    prevProps.id === currProps.id &&
    prevProps.showAll === currProps.showAll
  );
};

const Discord = React.memo((props: any) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<any>();

  const [status, setStatus] = useState<any>("");

  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const [discord, setDiscord] = useState<any>({});
  const [message, setMessage] = useState<string>("");
  const [audioMessage, setAudioMessage] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [isSideBar, setIsSideBar] = useState<boolean>(false);
  const [selectedDiscordRoom, setSelectedDiscordRoom] = useState<any>({
    room: "",
  });
  const [usersDiscordRoom, setUsersDiscordRoom] = useState<any>({});
  const [usersTypesDiscordRoom, setUsersTypesDiscordRoom] = useState<any>([]);
  const [informationRooms, setInformationRooms] = useState<any[]>([]);
  const [discussionRooms, setDiscussionRooms] = useState<any[]>([]);
  const [supportRooms, setSupportRooms] = useState<any[]>([]);
  const [podDiscussionRooms, setPodDiscussionRooms] = useState<any[]>([]);

  const [selectedMessage, setSelectedMessage] = useState<any>({});
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [openModalDiscordReply, setOpenModalDiscordReply] = useState<boolean>(false);
  const [openModalDiscordPhotoFullScreen, setOpenModalDiscordPhotoFullScreen] = useState<boolean>(false);
  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] = useState<boolean>(false);
  const [openModalDiscordSettings, setOpenModalDiscordSettings] = useState<boolean>(false);
  const [openModalDiscordUsers, setOpenModalDiscordUsers] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [paginationLoading, setPaginationLoading] = React.useState<boolean>(false);
  const itemListRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<any>();
  const inputRef: any = useRef([]);

  useEffect(() => {
    if (!socket && localStorage.getItem("userId")) {
      const sock = io(URL(), { query: { token: localStorage.getItem("token")?.toString() || "" } });
      sock.connect();
      setSocket(sock);
      sock.emit("add user", localStorage.getItem("userId")?.toString() || "");
    }
  }, []);

  useEffect(() => {
    setPageIndex(messages.length);
    setTimeout(() => {
      if (itemListRef && itemListRef.current && !paginationLoading) {
        itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
      }
    }, 100);
    setPaginationLoading(false);
  }, [messages.length, setPageIndex, setPaginationLoading]);

  const handleOpenModalDiscordReply = () => {
    setOpenModalDiscordReply(true);
  };

  const handleCloseModalDiscordReply = () => {
    if (selectedDiscordRoom) {
      axios
        .post(`${ServerURL()}/chat/discord/getMessage`, {
          discordChatId: props.discordId,
          discordRoom: selectedDiscordRoom.room,
          messageId: selectedMessage.id,
        })
        .then(response => {
          if (response.data.success) {
            const data = [...messages];
            let message = response.data.data;
            const index = data.findIndex(msg => msg.id === message.id);
            //load images
            if (usersList && usersList.length > 0) {
              if (usersList.some(user => user.id === message.user.id)) {
                const thisUser = usersList[usersList.findIndex(user => user.id === message.user.id)];
                if (thisUser) {
                  message.user = {
                    ...message.user,
                    imageURL: thisUser.imageURL,
                    connected: thisUser.connected,
                  };
                } else {
                  message.user = {
                    ...message.user,
                    imageURL: "",
                    connected: false,
                  };
                }
              }
            }
            data[index] = message;
            setMessages(data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    setOpenModalDiscordReply(false);
  };

  const handleOpenModalDiscordUsers = () => {
    setOpenModalDiscordUsers(true);
  };

  const handleCloseModalDiscordUsers = () => {
    getChatInfo(props.discordId, true);
    selectDiscordRoom(selectedDiscordRoom, false);
    setOpenModalDiscordUsers(false);
  };

  const handleOpenModalDiscordSettings = () => {
    setOpenModalDiscordSettings(true);
  };

  const handleCloseModalDiscordSettings = () => {
    getChatInfo(props.discordId, true);
    setOpenModalDiscordSettings(false);
  };

  const handleOpenModalDiscordPhotoFullScreen = () => {
    setOpenModalDiscordPhotoFullScreen(true);
  };

  const handleCloseModalDiscordPhotoFullScreen = () => {
    setOpenModalDiscordPhotoFullScreen(false);
  };

  const handleOpenModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(true);
  };

  const handleCloseModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(false);
  };

  const addEmoji = (e, emojiObject) => {
    let emoji = emojiObject.emoji;
    setMessage(message + emoji);
    setShowEmoji(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  useEffect(() => {
    dispatch(setSelectDiscordRoom(null));
    setIsSideBar(props.sidebar);
    setIsDarkTheme(props.theme && props.theme === "dark");
  }, []);

  useEffect(() => {
    getChatInfo(props.discordId, false);

    if (socket) {
      socket.off("message-discord");
      socket.on("message-discord", message => {
        setMessages(msgs => {
          let msgsArray = [...msgs];
          msgsArray.push(message);
          return msgsArray;
        });

        let chatObj = {
          discordChat: props.discordId,
          discordRoom: selectedDiscordRoom.room || "",
          userId: userSelector.id,
          lastView: Date.now(),
        };

        axios
          .post(`${ServerURL()}/chat/discord/lastView`, chatObj)
          .then(response => {
            if (response.data.success) {
              socket.emit("numberMessages-discord", selectedDiscordRoom.room);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
      socket.off("update-message-discord");
      socket.on("update-message-discord", updatedMessage => {
        let foundMessageIndex = messages.findIndex((msg, i) => msg.id === updatedMessage.id);
        let msgs: any = [...messages];
        msgs[foundMessageIndex] = updatedMessage;

        //load images
        if (usersList && usersList.length > 0) {
          msgs.forEach((message, index) => {
            if (usersList.some(user => user.id === message.user.id)) {
              const thisUser = usersList[usersList.findIndex(user => user.id === message.user.id)];
              if (thisUser) {
                msgs[index].user = {
                  ...message.user,
                  imageURL: thisUser.imageURL,
                  connected: thisUser.connected,
                };
              } else {
                msgs[index].user = {
                  ...message.user,
                  imageURL: "",
                  connected: false,
                };
              }
            }
          });
        }

        setMessages(msgs);
      });
      socket.off("user_connect_status");
      socket.on("user_connect_status", connectStatus => {
        setMessages(
          messages.map(message => {
            if (message.user.id === connectStatus.userId) {
              return {
                ...message,
                user: {
                  ...message.user,
                  connected: connectStatus.connected,
                },
              };
            }
            return message;
          })
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersList]);

  useEffect(() => {
    if (socket) {
      socket.emit("user_connect_status", {
        userId: userSelector.id,
        connected: true,
      });
    }
  }, [userSelector]);

  const downloadFile = message => {
    saveAs(
      `${URL()}/chat/discord/downloadFile/${props.discordId}/${selectedDiscordRoom.room}/${message.id}/${
        message.message
      }`,
      message.message
    );
  };

  // Chat Functions
  const getChatInfo = (chatId, updateUsers) => {
    axios
      .post(`${ServerURL()}/chat/discord/getChat`, {
        discordChat: chatId,
      })
      .then(response => {
        if (response.data.success) {
          let data = { ...response.data.data };
          console.log("===================", data);

          let userIndex;
          if (data.admin.id.includes("0x")) {
            userIndex = usersList.findIndex(user => user.address === data.admin.id);
          } else {
            userIndex = usersList.findIndex(user => user.id === data.admin.id);
          }

          //load images
          if (usersList && usersList.length > 0) {
            if (data.admin && userIndex) {
              data.admin.imageURL = usersList[userIndex]?.imageURL
                ? usersList[userIndex]?.imageURL
                : usersList[userIndex]?.imageUrl
                ? usersList[userIndex]?.imageUrl
                : usersList[userIndex]?.anonAvatar
                ? require(`assets/anonAvatars/${usersList[userIndex]?.anonAvatar}`)
                : "";
            }
            if (data.users && data.users.length > 0) {
              data.users.forEach((member, index) => {
                if (member.id.includes("0x")) {
                  userIndex = usersList.findIndex(user => user.address === member.id);
                } else {
                  userIndex = usersList.findIndex(user => user.id === member.id);
                }
                if (userIndex) {
                  const user = usersList[userIndex];
                  data.users[index].imageURL = user?.imageURL
                    ? user?.imageURL
                    : user?.imageUrl
                    ? user?.imageUrl
                    : user?.anonAvatar
                    ? require(`assets/anonAvatars/${user.anonAvatar}`)
                    : "";
                  data.users[index].urlSlug = user?.urlSlug ?? "";
                  data.users[index]["userSlug"] = user
                    ? user?.urlSlug !== ""
                      ? user?.urlSlug
                      : user?.name
                    : "";
                }
              });
            }
          }

          setDiscord(data);
          let infoRooms: any[] = data.discordRooms.filter((room: any) => room.type === "Information");
          let discussionRooms: any[] = data.discordRooms.filter((room: any) => room.type === "Discussions");
          let supportRooms: any[] = data.discordRooms.filter((room: any) => room.type === "Support");
          let podDiscussionRooms: any[] = data.discordRooms.filter(
            (room: any) => room.type === "PodDiscussions"
          );

          setInformationRooms(infoRooms);
          setDiscussionRooms(discussionRooms);
          setSupportRooms(supportRooms);
          setPodDiscussionRooms(podDiscussionRooms);

          if (data.admin && data.admin.id && data.admin.id === userSelector.id) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }

          if (updateUsers) {
            let selectedRoom = data.discordRooms.find(room => room.room === selectedDiscordRoom.room);
            selectDiscordRoom(selectedRoom, false);
          } else if (podDiscussionRooms.length) {
            selectDiscordRoom(podDiscussionRooms[0], false);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const sendMessage = (audioMessage?: string) => {
    if (message || audioMessage) {
      setAudioMessage(false);
      let messageObj: any = {
        discordRoom: selectedDiscordRoom.room,
        discordChatId: props.discordId,
        message: message ? message : audioMessage,
        from: userSelector.id,
      };

      if (socket) {
        socket.emit("add-message-discord", messageObj);
      }
      messageObj.user = {
        name: userSelector.firstName,
        level: userSelector.level || 1,
        cred: /*userSelector.cred ||*/ 0,
        salutes: /*userSelector.salutes ||*/ 0,
        connected: userSelector.connected || false,
        imageURL:
          userSelector.anon === false && userSelector.hasPhoto && userSelector.url
            ? `${userSelector.url}?${Date.now()}`
            : userSelector.anon && userSelector.anonAvatar.length > 0
            ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
            : "",
      };
      messageObj.likes = [];
      messageObj.dislikes = [];
      messageObj.numLikes = 0;
      messageObj.numDislikes = 0;
      let messagesCopy = [...messages];
      messagesCopy.push(messageObj);
      setMessages(messagesCopy);

      setMessage("");
      let chatObj = {
        discordChat: props.discordId,
        discordRoom: selectedDiscordRoom.room,
        userId: userSelector.id,
        lastView: Date.now(),
      };

      axios
        .post(`${ServerURL()}/chat/discord/lastView`, chatObj)
        .then(response => {
          if (response.data.success) {
            if (socket) {
              socket.emit("numberMessages-discord", selectedDiscordRoom.room);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });

      if (socket) {
        socket.emit("numberMessages", selectedDiscordRoom.room);
      }
    }
  };

  const selectDiscordRoom = (room, showAll) => {
    setMessagesLoading(true);
    setSelectedDiscordRoom(room);
    dispatch(setSelectDiscordRoom(room));

    if (room && room.userRoom) {
      let isAdmin = room.userRoom.findIndex(usr => usr.userId === userSelector.id);
      if (isAdmin !== -1) {
        setIsAdmin(true);
      } else {
        if (discord.admin && discord.admin.id && discord.admin.id === userSelector.id) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    }

    if (socket) {
      socket.emit("subscribe-discord", {
        discordChatId: props.discordId,
        discordRoomId: room.room,
      });
    }

    let usersFiltered: any = {};
    let usersRoom: any[] = [...room.users];

    //load images
    if (usersList && usersList.length > 0) {
      usersRoom.forEach((member, index) => {
        const thisUser = usersList.find(user => user.id === member.userId);
        if (thisUser) {
          usersRoom[index].imageURL = thisUser.imageURL;
        } else {
          usersRoom[index].imageURL = "";
        }
      });
    }

    usersRoom.forEach((user, i) => {
      if (user.type in usersFiltered) {
        usersFiltered[user.type].push(user);
      } else {
        usersFiltered[user.type] = [user];
      }
    });

    if (showAll) {
      autoAddUserToDiscordRoom(room);
    }

    setUsersDiscordRoom(usersFiltered);
    let keysUsers = Object.keys(usersFiltered);
    setUsersTypesDiscordRoom(keysUsers);
    dispatch(setterUsersTypesDiscordRoom(keysUsers));
    dispatch(setterUsersDiscordRoom(usersFiltered));
    setMessages([]);
    getMessages(room, true);
  };

  const getMessages = (room: any, isNew?: boolean): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (messagesLoading || !hasMore)) {
        resolve(0);
        return;
      }
      setMessagesLoading(true);
      axios
        .post(`${ServerURL()}/chat/discord/getMessages`, {
          discordChatId: props.discordId,
          discordRoom: room.room,
          pageIndex: isNew ? 0 : pageIndex,
        })
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;

            //load images
            if (usersList && usersList.length > 0) {
              data.forEach((message, index) => {
                if (usersList.some(user => user.id === message.user.id)) {
                  const thisUser = usersList[usersList.findIndex(user => user.id === message.user.id)];
                  if (thisUser) {
                    data[index].user = {
                      ...message.user,
                      imageURL: thisUser.imageURL,
                      connected: thisUser.connected,
                    };
                  } else {
                    data[index].user = {
                      ...message.user,
                      imageURL: "",
                      connected: false,
                    };
                  }
                }
              });
            }
            if (isNew) setMessages(data);
            else setMessages([...data, ...messages]);
            setHasMore(response.data.hasMore);
            setMessagesLoading(false);
            resolve(response.data.data.length);
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && messages.length > 0) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        setPaginationLoading(true);
        const count = await getMessages(selectedDiscordRoom);
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

  const autoAddUserToDiscordRoom = room => {
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(`${ServerURL()}/chat/discord/addUserToRoom`, {
            discordChatId: props.discordId,
            discordRoomId: room.room,
            userId: userSelector.id,
            adminRequired: false,
          })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              let findUser = data.users.find(usr => usr.userId === userSelector.id);
              if (findUser) {
                resolve(findUser);
              } else {
                reject("Error adding user");
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  };

  const likeMessage = (message: any) => {
    axios
      .post(`${ServerURL()}/chat/discord/likeMessage`, {
        discordMessageId: message.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          updateTask(userSelector.id, "Give 1st cred");
          let data = response.data.data;

          let msgs = [...messages];
          let msgIndex = msgs.findIndex(msg => msg.id === data.id);
          msgs[msgIndex].likes = data.likes;
          msgs[msgIndex].dislikes = data.dislikes;
          msgs[msgIndex].numLikes = data.numLikes;
          msgs[msgIndex].numDislikes = data.numDislikes;
          setMessages(msgs);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const dislikeMessage = (message: any) => {
    axios
      .post(`${ServerURL()}/chat/discord/dislikeMessage`, {
        discordMessageId: message.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let msgs = [...messages];
          let msgIndex = msgs.findIndex(msg => msg.id === data.id);
          msgs[msgIndex].likes = data.likes;
          msgs[msgIndex].dislikes = data.dislikes;
          msgs[msgIndex].numLikes = data.numLikes;
          msgs[msgIndex].numDislikes = data.numDislikes;
          setMessages(msgs);
        }
      })
      .catch(error => {
        console.log(error);
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
    axios
      .post(
        `${ServerURL()}/chat/discord/addMessagePhoto/${props.discordId}/${selectedDiscordRoom.room}/${
          userSelector.id
        }`,
        formData,
        config
      )
      .then(response => {
        if (response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          if (socket) {
            socket.emit("add-message-discord", msg);
          }
          msg.user = {
            name: userSelector.firstName,
            level: userSelector.level || 1,
            cred: /*userSelector.cred ||*/ 0,
            salutes: /*userSelector.salutes ||*/ 0,
            connected: userSelector.connected || false,
            imageURL:
              !userSelector.anon && userSelector.hasPhoto && userSelector.url
                ? `${userSelector.url}?${Date.now()}`
                : userSelector.anon && userSelector.anonAvatar.length > 0
                ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
                : "",
          };
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

  const onChangeMessageFile = (file: any) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(
        `${ServerURL()}/chat/discord/addMessageFile/${props.discordId}/${selectedDiscordRoom.room}/${
          userSelector.id
        }`,
        formData,
        config
      )
      .then(response => {
        if (response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          if (socket) {
            socket.emit("add-message-discord", msg);
          }
          msg.user = {
            name: userSelector.firstName,
            level: userSelector.level || 1,
            cred: /*userSelector.cred ||*/ 0,
            salutes: /*userSelector.salutes ||*/ 0,
            connected: userSelector.connected || false,
            imageURL:
              !userSelector.anon && userSelector.hasPhoto && userSelector.url
                ? `${userSelector.url}?${Date.now()}`
                : userSelector.anon && userSelector.anonAvatar.length > 0
                ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
                : "",
          };
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

  const onChangeMessageAudio = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("audio", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(
        `${ServerURL()}/chat/discord/addMessageAudio/${props.discordId}/${selectedDiscordRoom.room}/${
          userSelector.id
        }`,
        formData,
        config
      )
      .then(response => {
        if (response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          if (socket) {
            socket.emit("add-message-discord", msg);
          }
          msg.user = {
            name: userSelector.firstName,
            level: userSelector.level || 1,
            cred: /*userSelector.cred ||*/ 0,
            salutes: /*userSelector.salutes ||*/ 0,
            connected: userSelector.connected || false,
            imageURL:
              !userSelector.anon && userSelector.hasPhoto && userSelector.url
                ? `${userSelector.url}?${Date.now()}`
                : userSelector.anon && userSelector.anonAvatar.length > 0
                ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
                : "",
          };
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
    axios
      .post(
        `${ServerURL()}/chat/discord/addMessageVideo/${props.discordId}/${selectedDiscordRoom.room}/${
          userSelector.id
        }`,
        formData,
        config
      )
      .then(response => {
        if (response.data && response.data.success) {
          let msg: any = response.data.data;

          msg.noAddMessage = true;
          if (socket) {
            socket.emit("add-message-discord", msg);
          }
          msg.user = {
            name: userSelector.firstName,
            level: userSelector.level || 1,
            cred: /*userSelector.cred ||*/ 0,
            salutes: /*userSelector.salutes ||*/ 0,
            connected: userSelector.connected || false,
            imageURL:
              !userSelector.anon && userSelector.hasPhoto && userSelector.url
                ? `${userSelector.url}?${Date.now()}`
                : userSelector.anon && userSelector.anonAvatar.length > 0
                ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
                : "",
          };
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

  const fileInputMessageAttachment = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesAttachment(files);
    }
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
          msg: "File too big (< 5Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const handleFilesOthers = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].size);
      if (files[i].size / 1024 <= 51200) {
        onChangeMessageFile(files[i]);
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

  const handleFilesAttachment = files => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image")) handleFiles({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("audio")) handleFilesAudio({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("video")) handleFilesVideo({ 0: files[i], length: 1 });
      else handleFilesOthers({ 0: files[i], length: 1 });
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
    console.log(file);
    const validTypes = ["audio/mp3", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/mpeg"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const GroupDiscordRoom = (discordRoomHeader: string, discordRooms: any[], showAll: boolean) => {
    return (
      <div className="groupDiscordRoom">
        {discordRooms && discordRooms.length > 0 ? (
          <div style={{ width: "100%" }}>
            <div className="discordRoomHeader">{discordRoomHeader}</div>
            {discordRooms.map((room, i) => {
              if (showAll) {
                return DisplayRooms(room, i, showAll);
              } else {
                if (room.users && room.users.length > 0) {
                  return DisplayRooms(room, i, showAll);
                }
              }
            })}
          </div>
        ) : (
          <div />
        )}
      </div>
    );
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

  const DisplayRooms = (room: any, i: any, showAll: any, theme?: "dark" | "light") => {
    return (
      <div
        className={`discordRoom ${
          selectedDiscordRoom && selectedDiscordRoom.room === room.room ? "selected" : ""
        }
            ${isDarkTheme ? "dark" : ""}`}
        key={`room-${i}`}
        onClick={
          selectedDiscordRoom && selectedDiscordRoom.room === room.room
            ? undefined
            : () => selectDiscordRoom(room, showAll)
        }
      >
        <Box mb={isDarkTheme ? 2 : "10px"} className="discordRoomContent">
          <div>
            {room.users.map((user, index) => {
              if (user.type === "Admin" && (!isDarkTheme || (isDarkTheme && index < 1))) {
                let userIndex;
                if (user.userId.includes("0x")) {
                  userIndex = usersList.findIndex(u => u.address === user.userId);
                } else {
                  userIndex = usersList.findIndex(u => u.id === user.userId);
                }

                let userImage = "";
                let userName = "";
                if (userIndex) {
                  userImage = usersList[userIndex]?.imageURL
                    ? usersList[userIndex]?.imageURL
                    : usersList[userIndex]?.imageUrl
                    ? usersList[userIndex]?.imageUrl
                    : usersList[userIndex]?.anonAvatar
                    ? require(`assets/anonAvatars/${usersList[userIndex]?.anonAvatar}`)
                    : "";
                  userName = usersList[userIndex]?.name ?? "";
                }

                return (
                  <Box
                    display="flex"
                    alignItems="center"
                    width={isDarkTheme ? "20%" : "auto"}
                    maxWidth={isDarkTheme ? "20%" : "auto"}
                    key={user.userId}
                  >
                    <div
                      key={user.userId}
                      className="user-admin-bubble"
                      style={{
                        backgroundImage: userImage ? `url(${userImage})` : "none",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        borderRadius: "50%",
                        width: isDarkTheme ? "48px" : "64px",
                        height: isDarkTheme ? "48px" : "64px",
                        minWidth: isDarkTheme ? "48px" : "64px",
                        border: isDarkTheme ? "none" : "2px solid white",
                        boxShadow: isDarkTheme ? "none" : "0px 2px 4px rgb(0 0 0 / 25%)",
                        marginRight: isDarkTheme ? "8px" : "20px",
                      }}
                    />
                    {isDarkTheme && (!selectedDiscordRoom.room || selectedDiscordRoom.room === "") && (
                      <Box ml={1} fontFamily="Agrandir GrandLight" color="white" fontSize="18px">
                        {userName}
                      </Box>
                    )}
                  </Box>
                );
              }
            })}
          </div>
          {!isDarkTheme && (
            <Box
              display="flex"
              mr={3}
              alignItems="center"
              justifyContent="center"
              className={`members-bubbles`}
            >
              {room.users.map((user, index) => {
                if (index < 2) {
                  // const userImage = usersList[usersList.findIndex(u => u.id === user.userId)]?.imageURL ?? "";
                  let userIndex;
                  if (user.userId?.includes("0x")) {
                    userIndex = usersList.findIndex(u => u.address === user.userId);
                  } else {
                    userIndex = usersList.findIndex(u => u.id === user.userId);
                  }

                  let userImage = "";
                  if (userIndex) {
                    userImage = usersList[userIndex]?.imageURL
                      ? usersList[userIndex]?.imageURL
                      : usersList[userIndex]?.imageUrl
                      ? usersList[userIndex]?.imageUrl
                      : usersList[userIndex]?.anonAvatar
                      ? require(`assets/anonAvatars/${usersList[userIndex]?.anonAvatar}`)
                      : "";
                  }
                  return (
                    <div
                      className="user-bubble"
                      key={index}
                      style={{
                        backgroundImage: userImage.length > 0 ? `url(${userImage})` : "none",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  );
                }
              })}
              {room.users.length >= 3 ? (
                <div className="user-more-count">+{room.users.length - 2}</div>
              ) : null}
            </Box>
          )}

          <Box
            className="discordRoomInfo"
            pl={!isDarkTheme ? "30px" : 3}
            pr={!isDarkTheme ? "20px" : 0}
            maxWidth={isDarkTheme ? "80%" : "calc(100% - 145px)"}
            style={{ borderLeft: !isDarkTheme ? "1px solid #e7e7e7" : "none" }}
          >
            <Box display="flex" className={"discordRoomName"} key={i}>
              <Box
                component={"p"}
                margin={0}
                color={isDarkTheme ? "white" : "#181818"}
                fontWeight={isDarkTheme ? 800 : 600}
                fontSize={isDarkTheme ? "18px" : "16px"}
              >
                {!isDarkTheme && (
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      color: "rgb(79, 189, 143)",
                    }}
                  >
                    {room.private ? (
                      <div style={{ marginRight: "3px" }}>
                        <LockIcon />
                      </div>
                    ) : null}
                  </span>
                )}
                {room.name}
              </Box>
            </Box>
            <Box className="last-message" mt={isDarkTheme ? 2 : 0}>
              <Box
                component={"p"}
                margin={0}
                color={isDarkTheme ? "white" : "#5a5a5a"}
                fontSize={isDarkTheme ? "18px" : "14"}
                maxHeight={isDarkTheme && !selectedDiscordRoom ? "initial" : "40px"}
              >
                {room.lastMessage
                  ? room.lastMessage.startsWith(`"data:audio/`)
                    ? "🎤 Audio file"
                    : room.lastMessage.startsWith(`"data:video/`)
                    ? "📹 Video file"
                    : room.lastMessage.startsWith(`"data:image/`) || room.lastMessage.startsWith(`"data:img/`)
                    ? "📷 Image file"
                    : room.lastMessage
                  : ""}
              </Box>
            </Box>
          </Box>
          <div className="arrow-down">
            <img
              src={require(`assets/icons/arrow${isDarkTheme ? "_white" : ""}.png`)}
              alt=""
              style={{
                transform: isDarkTheme
                  ? selectedDiscordRoom && selectedDiscordRoom.room === room.room
                    ? "rotate(180deg)"
                    : "rotate(270deg)"
                  : "none",
              }}
            />
          </div>
        </Box>
      </div>
    );
  };

  const DiscordRoomList = () => {
    return (
      <div style={!props.theme ? (isAdmin ? { marginTop: "10px" } : { marginTop: "20px" }) : {}}>
        {GroupDiscordRoom("INFORMATION", informationRooms, props.showAll)}
        {GroupDiscordRoom("DISCUSSION", discussionRooms, props.showAll)}
        {GroupDiscordRoom("SUPPORT", supportRooms, props.showAll)}
        {GroupDiscordRoom("POD DISCUSSION", podDiscussionRooms, props.showAll)}

        <Modal
          showCloseIcon
          size="medium"
          isOpen={openModalDiscordSettings}
          onClose={handleCloseModalDiscordSettings}
          theme={props.theme}
        >
          <DiscordSettings
            onCloseModal={handleCloseModalDiscordSettings}
            type={props.type}
            id={props.id}
            discord={discord}
            theme={props.theme}
          />
        </Modal>
        <Modal
          showCloseIcon
          size="small"
          isOpen={openModalDiscordUsers}
          onClose={handleCloseModalDiscordUsers}
          theme={props.theme}
        >
          <DiscordUsersModal
            onCloseModal={handleCloseModalDiscordUsers}
            room={selectedDiscordRoom}
            discord={discord}
            type={props.type}
            id={props.id}
            theme={props.theme}
          />
        </Modal>
      </div>
    );
  };

  const MessageDiscordChat = React.memo((propsFunction: any) => {
    let playerVideo: any = useRef();

    const [typeMessage, setTypeMessage] = useState<any>("");

    const [showActions, setShowActions] = useState<boolean>(false);

    const [openGiveTipModal, setOpenGiveTipModal] = useState<boolean>(false);
    const handleOpenGiveTipModal = () => {
      setOpenGiveTipModal(true);
    };
    const handleCloseGiveTipModal = () => {
      setOpenGiveTipModal(false);
    };

    const Created = ({ message }) => {
      if (message.created)
        return (
          <span className="created">{`${new Date(message.created).getHours() < 10 ? "0" : ""}${new Date(
            message.created
          ).getHours()}:${new Date(message.created).getMinutes() < 10 ? "0" : ""}${new Date(
            message.created
          ).getMinutes()}
                    `}</span>
        );
      else return null;
    };

    return (
      <div className={"messageDiscordChatContainer"}>
        {props.theme &&
          props.theme === "dark" &&
          (propsFunction.index === 0 ||
            (propsFunction?.message?.created &&
              messages[propsFunction.index + 1]?.message?.created &&
              propsFunction.message.created - 86400000 <
                messages[propsFunction.index + 1].message.created)) && (
            <div className="messageDate">
              <Moment calendar>{propsFunction.message.created}</Moment>
            </div>
          )}
        <div
          className={`messageDiscordChat ${
            userSelector.id === propsFunction.message.from ? "mine" : "notmine"
          }`}
          onMouseLeave={() => {
            setShowActions(false);
          }}
          onMouseEnter={() => {
            setShowActions(true);
          }}
        >
          <div className={`messageRowDiscordChat`}>
            {(propsFunction.message.from !== userSelector.id &&
              messages[propsFunction.index + 1] &&
              messages[propsFunction.index + 1].from !== propsFunction.message.from) ||
            (propsFunction.message.from !== userSelector.id && propsFunction.index + 1 >= messages.length) ? (
              <div
                onClick={() => {
                  history.push(`/profile/${propsFunction.message.from}`);
                  dispatch(setSelectedUser(propsFunction.message.from));
                }}
                className="userPhoto"
                style={{
                  backgroundImage:
                    propsFunction.message.user &&
                    propsFunction.message.user.imageURL &&
                    propsFunction.message.user.imageURL.length > 0
                      ? `url(${propsFunction.message.user.imageURL})`
                      : "none",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                {!propsFunction.theme && (
                  <span
                    className={
                      propsFunction.message.user.connected === true ||
                      propsFunction.message.user.id === userSelector.id
                        ? "online"
                        : "offline"
                    }
                  >
                    ●
                  </span>
                )}
              </div>
            ) : null}
            <div className="messageColumnInfoDiscordChat">
              {showActions ? (
                <div className="actionsRow">
                  {propsFunction.message.likes &&
                  propsFunction.message.likes.findIndex(user => user === userSelector.id) !== -1 ? (
                    <div className="iconCenterFlex">
                      <SvgIcon htmlColor={"green"}>
                        <ThumbsUpSolid />
                      </SvgIcon>
                      &nbsp;{propsFunction.message.numLikes || 0}
                    </div>
                  ) : (
                    <div className="iconCenterFlex" onClick={() => likeMessage(propsFunction.message)}>
                      <SvgIcon>
                        <ThumbsUpSolid />
                      </SvgIcon>
                      &nbsp;{propsFunction.message.numLikes || 0}
                    </div>
                  )}
                  &nbsp;&nbsp;&nbsp;
                  {propsFunction.message.dislikes &&
                  propsFunction.message.dislikes.findIndex(user => user === userSelector.id) !== -1 ? (
                    <div className="iconCenterFlex">
                      <SvgIcon htmlColor={"red"}>
                        <ThumbsDownSolid />
                      </SvgIcon>
                      &nbsp;{propsFunction.message.numDislikes || 0}
                    </div>
                  ) : (
                    <div className="iconCenterFlex" onClick={() => dislikeMessage(propsFunction.message)}>
                      <SvgIcon>
                        <ThumbsDownSolid />
                      </SvgIcon>
                      &nbsp;{propsFunction.message.numDislikes || 0}
                    </div>
                  )}
                  &nbsp;&nbsp;&nbsp;
                  <EmojiIcon />
                  &nbsp;&nbsp;&nbsp;
                  {!props.theme && (
                    <div
                      className="iconCenterFlex"
                      onClick={() => {
                        setSelectedMessage(propsFunction.message);
                        handleOpenModalDiscordReply();
                      }}
                    >
                      <MessageIcon />
                      &nbsp;{propsFunction.message.numReplies || 0}
                    </div>
                  )}
                  &nbsp;&nbsp;&nbsp;
                  {propsFunction.message.from !== userSelector.id ? (
                    <div className="iconCenterFlex" onClick={handleOpenGiveTipModal}>
                      <img
                        src={require("assets/icons/hand-holding-water-solid.svg")}
                        alt={"hand-holding-water-solid"}
                      />
                    </div>
                  ) : null}
                  {!props.theme && propsFunction.message.from !== userSelector.id ? (
                    <GiveTipModal
                      open={openGiveTipModal}
                      handleClose={handleCloseGiveTipModal}
                      recipient={propsFunction.message.from}
                      theme={propsFunction.theme}
                    />
                  ) : null}
                </div>
              ) : null}
              <div className={`messageInfoDiscordChat`}>
                {!typeMessage || typeMessage === "text" ? (
                  typeof propsFunction.message.message === "string" && (
                    <div className="messageInfo bubble">
                      {propsFunction.message.message.includes("data:audio/wav;") ? (
                        <audio controls src={JSON.parse(propsFunction.message.message)}>
                          The “audio” tag is not supported by your browser. Click [here] to download the sound
                          file.
                        </audio>
                      ) : (
                        propsFunction.message.message
                      )}
                      {!propsFunction.theme && <Created message={propsFunction.message} />}
                    </div>
                  )
                ) : typeMessage === "photo" ? (
                  <div className="bubble">
                    <div
                      className="messageInfoPhoto"
                      onClick={() => {
                        setSelectedPhoto(
                          `${ServerURL()}/chat/discord/getMessagePhoto/${props.discordId}/${
                            selectedDiscordRoom.room
                          }/${propsFunction.message.id}`
                        );
                        handleOpenModalDiscordPhotoFullScreen();
                      }}
                      style={{
                        backgroundImage:
                          props.discordId &&
                          selectedDiscordRoom.room &&
                          propsFunction.message &&
                          propsFunction.message.id
                            ? `url(${ServerURL()}/chat/discord/getMessagePhoto/${props.discordId}/${
                                selectedDiscordRoom.room
                              }/${propsFunction.message.id})`
                            : "none",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    ></div>
                    {!propsFunction.theme && <Created message={propsFunction.message} />}
                  </div>
                ) : typeMessage === "video" ? (
                  <div className="bubble">
                    <div className="messageInfoVideo">
                      <div className="iconVideoWrapperJarr">
                        <div className="playIconVideoJarr">
                          <SvgIcon>
                            <PlaySolid />
                          </SvgIcon>
                        </div>
                      </div>
                      <ReactPlayer
                        onClick={() => {
                          setSelectedVideo(`${propsFunction.message.url}`);
                          handleOpenModalDiscordVideoFullScreen();
                        }}
                        url={`${propsFunction.message.url}`}
                        className="react-player"
                        ref={playerVideo}
                        progressInterval={200}
                      />
                    </div>
                    {!propsFunction.theme && <Created message={propsFunction.message} />}
                  </div>
                ) : typeMessage === "audio" ? (
                  <div className="bubble">
                    <div className="messageInfoAudio">
                      <Waveform
                        theme={propsFunction.theme}
                        url={`${ServerURL()}/chat/discord/getMessageAudio/${props.discordId}/${
                          selectedDiscordRoom.room
                        }/${propsFunction.message.id}`}
                        mine={userSelector.id === propsFunction.message.from}
                        showTime={false}
                        onPauseFunction={null}
                        onPlayFunction={null}
                        onReadyFunction={null}
                      />
                    </div>
                    {!propsFunction.theme && <Created message={propsFunction.message} />}
                  </div>
                ) : typeMessage === "file" ? (
                  <div className="messageInfo bubble">
                    <div className="item-file">
                      <div className="item-file-name">{propsFunction.message.message}</div>
                      <div onClick={() => downloadFile(propsFunction.message)} className="item-file-icon">
                        <SvgIcon>
                          <DownloadSolid />
                        </SvgIcon>
                      </div>
                    </div>
                    {!propsFunction.theme && <Created message={propsFunction.message} />}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <Modal
            showCloseIcon
            size="medium"
            theme={props.theme}
            isOpen={
              openModalDiscordPhotoFullScreen &&
              selectedPhoto ===
                `${ServerURL()}/chat/discord/getMessagePhoto/${props.discordId}/${selectedDiscordRoom.room}/${
                  propsFunction.message.id
                }`
            }
            onClose={handleCloseModalDiscordPhotoFullScreen}
          >
            <DiscordPhotoFullScreen
              theme={props.theme}
              onCloseModal={handleCloseModalDiscordPhotoFullScreen}
              url={selectedPhoto}
            />
          </Modal>
          <Modal
            showCloseIcon
            size={"medium"}
            theme={props.theme}
            isOpen={
              openModalDiscordVideoFullScreen &&
              `${ServerURL()}/chat/discord/getMessageVideo/${props.discordId}/${selectedDiscordRoom.room}/${
                propsFunction.message.id
              }` === selectedVideo
            }
            onClose={handleCloseModalDiscordVideoFullScreen}
          >
            <DiscordVideoFullScreen
              theme={props.theme}
              onCloseModal={handleCloseModalDiscordVideoFullScreen}
              url={selectedVideo}
            />
          </Modal>
        </div>
      </div>
    );
  });

  return (
    <div className={`community-page discordFullPage ${props.theme && props.theme === "dark" ? "dark" : ""}`}>
      <Box mb={props.theme && props.theme === "dark" ? 5 : "25px"}>
        {isAdmin ? (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {props.theme && props.theme === "dark" ? (
              <TitleGrandLight fontSize="30px" disableUppercase bold>
                Jarr
              </TitleGrandLight>
            ) : (
              <div />
            )}

            <Box
              display="flex"
              alignContent="flex-end"
              alignItems="center"
              className={!props.theme ? "rowSettingsDiscord" : undefined}
            >
              <Box color={props.theme && props.theme === "dark" ? "white" : "#181818"} fontSize="14px" mr={5}>
                Select a room
              </Box>
              {selectedDiscordRoom &&
              selectedDiscordRoom.room &&
              selectedDiscordRoom.room !== "" &&
              selectedDiscordRoom.private ? (
                props.theme && props.theme === "dark" ? (
                  <DAOButton
                    onClick={() => {
                      handleOpenModalDiscordUsers();
                    }}
                  >
                    Users
                  </DAOButton>
                ) : (
                  <PrimaryButton
                    size="medium"
                    onClick={() => {
                      handleOpenModalDiscordUsers();
                    }}
                  >
                    <SvgIcon>
                      <PlusSolid />
                    </SvgIcon>
                    &nbsp; Users
                  </PrimaryButton>
                )
              ) : null}
              {props.theme && props.theme === "dark" ? (
                <DAOButton
                  onClick={() => {
                    handleOpenModalDiscordSettings();
                  }}
                >
                  Settings
                </DAOButton>
              ) : (
                <PrimaryButton
                  size="medium"
                  onClick={() => {
                    handleOpenModalDiscordSettings();
                  }}
                >
                  Settings
                </PrimaryButton>
              )}
            </Box>
          </Box>
        ) : null}
      </Box>
      <Box
        display="flex"
        minHeight={props.theme && props.theme === "dark" ? "867px" : "660px"}
        height="100%"
        width="100%"
        className={
          selectedDiscordRoom && selectedDiscordRoom.room && selectedDiscordRoom.room !== ""
            ? "discordGrid selected"
            : "discordGrid"
        }
      >
        <div className="discordRoomList">{DiscordRoomList()}</div>
        <div className="discordChatGrid">
          {selectedDiscordRoom && selectedDiscordRoom.room && selectedDiscordRoom.room !== "" ? (
            <div className="discordChat">
              <div
                className="messagesDiscordChat"
                id="messageContainer"
                ref={itemListRef}
                onScroll={handleScroll}
              >
                <LoadingWrapper loading={messagesLoading} theme={props.theme} />
                {messages.map((item, i) => {
                  return (
                    <div key={i} id={item.id}>
                      <MessageDiscordChat message={item} index={i} theme={props.theme} />
                    </div>
                  );
                })}
              </div>
              <div className="inputDiscordChat">
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
                {!audioMessage && (
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
                      value={message}
                      onChange={elem => {
                        setMessage(elem.target.value);
                      }}
                      placeholder="Write a message..."
                    />
                    <textarea
                      autoComplete="off"
                      name="DiscordMessage"
                      ref={el => (inputRef.current[0] = el)}
                      autoFocus
                      value={message}
                      onChange={elem => {
                        setMessage(elem.target.value);
                      }}
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
                      {isDarkTheme ? (
                        <img src={require("assets/icons/send_white_2.png")} alt="send" />
                      ) : (
                        <SendIcon />
                      )}
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

              <Modal
                showCloseIcon
                size="medium"
                theme={props.theme}
                isOpen={openModalDiscordReply}
                onClose={handleCloseModalDiscordReply}
              >
                <DiscordReplyModal
                  onCloseModal={handleCloseModalDiscordReply}
                  message={selectedMessage}
                  discordId={props.discordId}
                  roomId={selectedDiscordRoom.room}
                  user={userSelector}
                />
              </Modal>
            </div>
          ) : null}
        </div>
        {/* <DiscussionSidebar
          theme={props.theme}
          discordId={props.discordId}
          communityPhoto={props.community.HasPhoto ? `${props.community.Url}?${Date.now()})` : undefined}
        /> */}
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
}, arePropsEqual);

export default Discord;
