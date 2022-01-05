import React, { useCallback, useEffect, useRef, useState } from "react";
import "./DiscordReplyModal.css";
import Moment from "react-moment";
import axios from "axios";
import URL from "shared/functions/getURL";
import { socket } from "components/Login/Auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { setSelectedUser } from "store/actions/SelectedUser";
import { useHistory } from "react-router-dom";
import { updateTask } from "shared/functions/updateTask";
import ReactPlayer from "react-player";
import GiveTipModal from "shared/ui-kit/Modal/Modals/GiveTipModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ThumbsUpSolid } from "assets/icons/thumbs-up-solid.svg";
import { ReactComponent as ThumbsDownSolid } from "assets/icons/thumbs-down-solid.svg";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as PauseSolid } from "assets/icons/pause-solid.svg";
import { ReactComponent as UndoSolid } from "assets/icons/undo-solid.svg";
import { ReactComponent as MusicIcon } from "assets/icons/music-solid.svg";
import { ReactComponent as SendIcon } from "assets/icons/paper-plane-regular.svg";

const DiscordReplyModal = (props: any) => {
  const dispatch = useDispatch();
  const history = useHistory();

  let player: any = useRef();
  let playerVideo: any = useRef();
  const size = useWindowSize();

  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [onProgressAudio, setOnProgressAudio] = useState<any>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [onDurationAudio, setOnDurationAudio] = useState<number>(1);
  const [typeMessage, setTypeMessage] = useState<any>("");

  const [startingAudioBar, setStartingAudioBar] = useState<number>(0);
  const [widthAudioBar, setWidthAudioBar] = useState<number>(0);
  const divAudioBar = useCallback(
    node => {
      if (node !== null) {
        setStartingAudioBar(node.getBoundingClientRect().x);
        setWidthAudioBar(node.getBoundingClientRect().width);
      }
    },
    [size]
  );

  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [onProgressVideo, setOnProgressVideo] = useState<any>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [onDurationVideo, setOnDurationVideo] = useState<number>(1);

  const [startingVideoBar, setStartingVideoBar] = useState<number>(0);
  const [widthVideoBar, setWidthVideoBar] = useState<number>(0);
  const divVideoBar = useCallback(
    node => {
      if (node !== null) {
        setStartingVideoBar(node.getBoundingClientRect().x);
        setWidthVideoBar(node.getBoundingClientRect().width);
      }
    },
    [size]
  );

  let userSelector = useSelector((state: RootState) => state.user);
  let users = useSelector((state: RootState) => state.usersInfoList);

  const [message, setMessage] = useState<any>({});
  const [messageReply, setMessageReply] = useState("");
  const [messagesReply, setMessagesReply] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [openGiveTipModal, setOpenGiveTipModal] = useState<boolean>(false);
  const handleOpenGiveTipModal = () => {
    setOpenGiveTipModal(true);
  };
  const handleCloseGiveTipModal = () => {
    setOpenGiveTipModal(false);
  };

  useEffect(() => {
    getMessagesReply();
    setMessage(props.message);
  }, [users]);

  const handleSeekProgressBarAudio = (x: number, y: number) => {
    let positionClick: number = +((x - startingAudioBar) / widthAudioBar).toFixed(2);
    //player.current.seekTo(positionClick, 'fraction');
    //TODO: why seekTo is always starting audio and not seek to position?
  };

  const getMessagesReply = () => {
    setIsDataLoading(true);
    axios
      .post(`${URL()}/chat/discord/getReplies`, {
        discordMessageId: props.message.id,
      })
      .then(response => {
        if (response.data.success) {
          let replies = [...response.data.data];

          if (users && users.length > 0) {
            users.forEach(user => {
              replies.forEach((reply, index) => {
                if (user.id === reply.from) {
                  replies[index].user.imageURL = user.imageURL;
                  return;
                }
              });
            });
          }

          setMessagesReply(replies);
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
      });
  };

  const replySendMessage = () => {
    if (messageReply) {
      let messageObj: any = {
        discordRoom: props.message.discordRoom,
        discordMessage: props.message.id,
        message: messageReply,
        from: userSelector.id,
      };

      socket.emit("add-reply-discord", messageObj);
      messageObj.user = {
        name: userSelector.firstName,
        level: userSelector.level || 1,
        cred: /*userSelector.cred ||*/ 0,
        salutes: /*userSelector.salutes ||*/ 0,
        imageURL:
          !userSelector.anon && userSelector.hasPhoto && userSelector.url
            ? `${userSelector.url}?${Date.now()}`
            : userSelector.anon && userSelector.anonAvatar.length > 0
              ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
              : "",
      };
      let messagesCopy: any = [...messagesReply];
      messagesCopy.push(messageObj);
      setMessagesReply(messagesCopy);

      setMessageReply("");
    }
  };

  const likeMessage = (message: any) => {
    axios
      .post(`${URL()}/chat/discord/likeMessage`, {
        discordMessageId: message.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          updateTask(userSelector.id, "Give 1st cred");

          let data = response.data.data;

          let msg = { ...message };
          msg.likes = data.likes;
          msg.dislikes = data.dislikes;
          msg.numLikes = data.numLikes;
          msg.numDislikes = data.numDislikes;
          setMessage(msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const dislikeMessage = (message: any) => {
    axios
      .post(`${URL()}/chat/discord/dislikeMessage`, {
        discordMessageId: message.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let msg = { ...message };
          msg.likes = data.likes;
          msg.dislikes = data.dislikes;
          msg.numLikes = data.numLikes;
          msg.numDislikes = data.numDislikes;
          setMessage(msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const likeReplyMessage = (messageProps: any) => {
    axios
      .post(`${URL()}/chat/discord/reply/likeMessage`, {
        discordMessageId: message.id,
        discordMessageReplyId: messageProps.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let msgs = [...messagesReply];
          let msgIndex = msgs.findIndex(msg => msg.id === data.id);
          msgs[msgIndex].likes = data.likes;
          msgs[msgIndex].dislikes = data.dislikes;
          msgs[msgIndex].numLikes = data.numLikes;
          msgs[msgIndex].numDislikes = data.numDislikes;
          setMessagesReply(msgs);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const dislikeReplyMessage = (messageProps: any) => {
    axios
      .post(`${URL()}/chat/discord/reply/dislikeMessage`, {
        discordMessageId: message.id,
        discordMessageReplyId: messageProps.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let msgs = [...messagesReply];
          let msgIndex = msgs.findIndex(msg => msg.id === data.id);
          msgs[msgIndex].likes = data.likes;
          msgs[msgIndex].dislikes = data.dislikes;
          msgs[msgIndex].numLikes = data.numLikes;
          msgs[msgIndex].numDislikes = data.numDislikes;
          setMessagesReply(msgs);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const ReplyMessage = (propsFunction: any) => {
    return (
      <div className="messageDiscordChatReply">
        <div className="messageRowDiscordChatReply">
          <div
            onClick={() => {
              history.push(`/profile/${propsFunction.message.from}`);
              dispatch(setSelectedUser(propsFunction.message.from));
            }}
            className="userPhotoReply"
            style={{
              backgroundImage:
                propsFunction.message.user.imageURL && propsFunction.message.user.imageURL.length > 0
                  ? `url(${propsFunction.message.user.imageURL})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
          ></div>
          <div className="messageInfoDiscordChatReply">
            <div className="userInfoReply">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  history.push(`/profile/${propsFunction.message.from}`);
                  dispatch(setSelectedUser(propsFunction.message.from));
                }}
              >
                {propsFunction.message.user.name}
              </span>
              &nbsp;
              <span className="spanInfoDiscordChatReply">
                (lvl&nbsp;{propsFunction.message.user.level}, &nbsp;
                {propsFunction.message.user.cred}&nbsp;cred, &nbsp;
                {propsFunction.message.user.salutes}&nbsp;salutes)
              </span>
            </div>
            <div className="messageInfoReply">{propsFunction.message.message}</div>
            <div className="actionsRowReply">
              {propsFunction.message.likes &&
                propsFunction.message.likes.findIndex(user => user === userSelector.id) !== -1 ? (
                <div className="iconCenterFlex">
                  <SvgIcon htmlColor={"green"}>
                    <ThumbsUpSolid />
                  </SvgIcon>
                  &nbsp;{propsFunction.message.numLikes || 0}
                </div>
              ) : (
                <div className="iconCenterFlex" onClick={() => likeReplyMessage(propsFunction.message)}>
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
                <div className="iconCenterFlex" onClick={() => dislikeReplyMessage(propsFunction.message)}>
                  <SvgIcon>
                    <ThumbsDownSolid />
                  </SvgIcon>
                  &nbsp;{propsFunction.message.numDislikes || 0}
                </div>
              )}
              &nbsp;&nbsp;&nbsp;
              <div className="iconCenterFlex" onClick={handleOpenGiveTipModal}>
                Give tip
              </div>
              <GiveTipModal
                open={openGiveTipModal}
                handleClose={handleCloseGiveTipModal}
                recipient={propsFunction.message.from}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (message && message.id) {
    //console.log(message);
    return (
      <div className="modalDiscordReply">
        <div className="exit" onClick={props.onCloseModal}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="messageDiscordChatReplyModal">
          <div className="messageRowDiscordChatReplyModal">
            <div
              onClick={() => {
                history.push(`/profile/${message.from}`);
                dispatch(setSelectedUser(message.from));
              }}
              className="userPhotoReplyModal"
              style={{
                backgroundImage:
                  message.user.imageURL && message.user.imageURL.length > 0
                    ? `url(${message.user.imageURL})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
            ></div>
            <div className="messageInfoDiscordChatReplyModal">
              <div className="messageRowDiscordChatReplyModal">
                <div className="userInfoReplyModal">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      history.push(`/profile/${message.from}`);
                      dispatch(setSelectedUser(message.from));
                    }}
                  >
                    {message.user.name}
                  </span>
                  &nbsp;
                  <span className="spanInfoDiscordChatReplyModal">
                    (lvl&nbsp;{message.user.level}, &nbsp;{message.user.cred}
                    &nbsp;cred, &nbsp;{message.user.salutes}&nbsp;salutes)
                  </span>
                </div>
                <div className="dateDiscordMessageReplyModal">
                  <Moment fromNow>{message.created}</Moment>
                </div>
              </div>
              {!message.type || message.type === "text" ? (
                <div className="messageInfoReplyModal">{message.message}</div>
              ) : message.type === "photo" ? (
                <div
                  className="messageInfoPhotoReplyModal"
                  style={{
                    backgroundImage:
                      props.discordId && message.discordRoom && message && message.id
                        ? `url(${URL()}/chat/discord/getMessagePhoto/${props.discordId}/${message.discordRoom
                        }/${message.id})`
                        : "none",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                ></div>
              ) : message.type === "video" ? (
                <div className="messageInfoVideoReplyModal">
                  <ReactPlayer
                    url={`${message.url}`}
                    className="react-player"
                    ref={playerVideo}
                    width="100%"
                    progressInterval={200}
                    playing={videoPlaying}
                    onProgress={progress => {
                      setOnProgressVideo(progress);
                    }}
                    onDuration={duration => {
                      setOnDurationVideo(duration);
                    }}
                    onEnded={() => {
                      playerVideo.current.seekTo(0);
                      setVideoPlaying(false);
                    }}
                  />
                  <div className="messageAudioRow">
                    <div className="progressBarAudioRow">
                      <div
                        style={{
                          marginRight: "10px",
                          width: "20px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {videoPlaying ? (
                          <div
                            style={{ fontSize: "20px", cursor: "pointer" }}
                            onClick={() => setVideoPlaying(false)}
                          >
                            <SvgIcon>
                              <PauseSolid />
                            </SvgIcon>
                          </div>
                        ) : (
                          <div
                            style={{ fontSize: "20px", cursor: "pointer" }}
                            onClick={() => setVideoPlaying(true)}
                          >
                            <SvgIcon>
                              <PlaySolid />
                            </SvgIcon>
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                          marginRight: "10px",
                          width: "20px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => playerVideo.current.seekTo(0)}
                      >
                        <SvgIcon>
                          <UndoSolid />
                        </SvgIcon>
                      </div>
                      <div
                        className="progressBarAudio"
                        ref={divVideoBar}
                        onClick={event => {
                          handleSeekProgressBarAudio(event.clientX, event.clientY);
                        }}
                      >
                        <div
                          className="progressBarAudioLoaded"
                          /*style={{width: '80%'}}*/
                          style={{
                            width: (onProgressVideo.loadedSeconds / onDurationVideo) * 100 + "%",
                          }}
                        ></div>
                        <div
                          className="progressBarAudioPlayed"
                          /*style={{width: '50%'}}*/
                          style={{
                            width: (onProgressVideo.playedSeconds / onDurationVideo) * 100 + "%",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          marginLeft: "10px",
                          width: "50px",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {onDurationVideo.toFixed(0)} s
                      </div>
                    </div>
                  </div>
                </div>
              ) : message.type === "audio" ? (
                <div className="messageInfoAudioReplyModal">
                  <div className="messageAudioRow">
                    <div
                      style={{
                        fontSize: "24px",
                        marginRight: "10px",
                        width: "30px",
                      }}
                    >
                      <MusicIcon />
                    </div>
                    <div className="progressBarAudioRow">
                      <div
                        style={{
                          marginRight: "10px",
                          width: "20px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {audioPlaying ? (
                          <div
                            style={{ fontSize: "20px", cursor: "pointer" }}
                            onClick={() => setVideoPlaying(false)}
                          >
                            <SvgIcon>
                              <PauseSolid />
                            </SvgIcon>
                          </div>
                        ) : (
                          <div
                            style={{ fontSize: "20px", cursor: "pointer" }}
                            onClick={() => setAudioPlaying(true)}
                          >
                            <SvgIcon>
                              <PlaySolid />
                            </SvgIcon>
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                          marginRight: "10px",
                          width: "20px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => player.current.seekTo(0)}
                      >
                        <SvgIcon>
                          <UndoSolid />
                        </SvgIcon>
                      </div>
                      <div
                        className="progressBarAudio"
                        ref={divAudioBar}
                        onClick={event => {
                          handleSeekProgressBarAudio(event.clientX, event.clientY);
                        }}
                      >
                        <div
                          className="progressBarAudioLoaded"
                          /*style={{width: '80%'}}*/
                          style={{
                            width: (onProgressAudio.loadedSeconds / onDurationAudio) * 100 + "%",
                          }}
                        ></div>
                        <div
                          className="progressBarAudioPlayed"
                          /*style={{width: '50%'}}*/
                          style={{
                            width: (onProgressAudio.playedSeconds / onDurationAudio) * 100 + "%",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          marginLeft: "10px",
                          width: "50px",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {onDurationAudio.toFixed(0)} s
                      </div>
                    </div>
                  </div>
                  <ReactPlayer
                    url={`${message.url}`}
                    className="react-player"
                    ref={player}
                    width="100%"
                    height="100%"
                    style={{ display: "none" }}
                    progressInterval={200}
                    playing={audioPlaying}
                    onProgress={progress => {
                      setOnProgressAudio(progress);
                    }}
                    onDuration={duration => {
                      setOnDurationAudio(duration);
                    }}
                    onEnded={() => {
                      player.current.seekTo(0);
                      setAudioPlaying(false);
                    }}
                  />
                </div>
              ) : null}
              <div className="actionsRowReplyModal">
                {message.likes && message.likes.findIndex(user => user === userSelector.id) !== -1 ? (
                  <div className="iconCenterFlex">
                    <SvgIcon htmlColor={"green"}>
                      <ThumbsUpSolid />
                    </SvgIcon>
                    &nbsp;{message.numLikes || 0}
                  </div>
                ) : (
                  <div className="iconCenterFlex" onClick={() => likeMessage(message)}>
                    <SvgIcon>
                      <ThumbsUpSolid />
                    </SvgIcon>
                    &nbsp;{message.numLikes || 0}
                  </div>
                )}
                &nbsp;&nbsp;&nbsp;
                {message.dislikes && message.dislikes.findIndex(user => user === userSelector.id) !== -1 ? (
                  <div className="iconCenterFlex">
                    <SvgIcon htmlColor={"red"}>
                      <ThumbsDownSolid />
                    </SvgIcon>
                    &nbsp;{message.numDislikes || 0}
                  </div>
                ) : (
                  <div className="iconCenterFlex" onClick={() => dislikeMessage(message)}>
                    <SvgIcon>
                      <ThumbsDownSolid />
                    </SvgIcon>
                    &nbsp;{message.numDislikes || 0}
                  </div>
                )}
                &nbsp;&nbsp;&nbsp;
                <div className="iconCenterFlexReplyModal">Give tip</div>
                <GiveTipModal
                  open={openGiveTipModal}
                  handleClose={handleCloseGiveTipModal}
                  recipient={message.from}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="responsesPartReplyModal">
          <LoadingWrapper loading={isDataLoading}>
            {messagesReply.map((msg, i) => {
              return <ReplyMessage message={msg} key={i} />;
            })}
          </LoadingWrapper>
          <div className="inputDiscordChatReplyModal">
            <form
              className="sendDiscordMessageReplyModal"
              onSubmit={e => {
                e.preventDefault();
                replySendMessage();
              }}
            >
              <input
                autoComplete="off"
                placeholder="Write a message..."
                type="text"
                ref={inputRef}
                autoFocus
                value={messageReply}
                onChange={elem => {
                  setMessageReply(elem.target.value);
                }}
              />
              <button style={{ backgroundColor: "#64c89e" }}>
                <div style={{ color: "white", height: 25, width: 25 }}><SendIcon /></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

export default DiscordReplyModal;

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};
