import React from "react";
import Moment from "react-moment";
import URL from "shared/functions/getURL";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/styles";
import Waveform from "shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform";
import DiscordPhotoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";

import { saveAs } from "file-saver";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as DownloadSolid } from "assets/icons/download-solid.svg";
import { Modal } from "shared/ui-kit";
import { Dialog } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  dialogContainer: {
    "& .MuiDialog-paperFullWidth": {
      paddingTop: theme.spacing(2),
      borderRadius: theme.spacing(2.5),
    },
  },
  photoContainer: {
    cursor: "pointer",
    width: 180,
    height: 180,
    borderRadius: 20,
  },
  videoContainer: {
    cursor: "pointer",
    height: "180px",
    width: "180px !important",
    maxWidth: "180px",
    color: "white",
    borderRadius: 20,
    backgroundColor: "rgba(219, 223, 224, 0.4)",
    position: "relative",
  },
  iconVideoWrapper: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    backgroundColor: "rgb(128 128 128 / 40%)",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    borderRadius: "20px",
  },
  playIconVideo: {
    width: "32px",
    height: "32px",
  },
  audioContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  videoPlayer: {
    cursor: "pointer",
    width: "180px !important",
    height: "180px !important",
    borderRadius: 20,
    transform: "none",
    "& > video": {
      width: "180px !important",
      borderRadius: 20,
      objectFit: "cover",
    },
  },
  itemMeta: {
    fontSize: 8,
    color: "grey",
    display: "flex",
    paddingTop: "4px",
  },
  itemMetaSelf: {
    fontSize: 8,
    color: "grey",
    display: "flex",
    paddingTop: "4px",
    justifyContent: "flex-end",
  },
  container: {
    display: "flex",
    flexDirection: "column",
  },
}));

export const MessageItem = ({ key, user, message, chat, lastRow, mediaOnCommunity }) => {
  const { userInfo } = chat;
  const playerVideo = React.useRef(null);
  const classes = useStyles();
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>("");
  const [selectedVideo, setSelectedVideo] = React.useState<string>("");
  const [openModalPhotoFullScreen, setOpenModalPhotoFullScreen] = React.useState<boolean>(false);
  const [openModalVideoFullScreen, setOpenModalVideoFullScreen] = React.useState<boolean>(false);
  const isLeftItem =
    (mediaOnCommunity && user && user !== message.from) || (userInfo && userInfo.id === message.from);
  const isRightItem =
    (mediaOnCommunity && user && user === message.from) || (userInfo && userInfo.id === message.to);
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

  const downloadFile = () => {
    saveAs(`${message.url}`, message.message);
  };
  const downloadFileMediaOnCommunity = () => {
    saveAs(`${message.url}`, message.message);
  };

  if (!isLeftItem && !isRightItem) return null;
  return (
    <>
      <div className={isLeftItem ? "left-item" : "right-item"} id={message.id} key={key}>
        {isLeftItem && (
          <div className="avatar-container">
            <img
              src={user.ipfsImage ?
                user.ipfsImage : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`
              }
              alt="Avatar"
              className="message-item-avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                marginTop: "8px",
              }}
            />
          </div>
        )}

        {message.type && message.type === "photo" ? (
          <div className={classes.container}>
            <div className={classes.itemMeta}>{message?.fromType?.toUpperCase()}</div>
            <div
              className={classes.photoContainer}
              onClick={() => {
                setSelectedPhoto(`${message.url}?${Date.now()}`);
                handleOpenModalPhotoFullScreen();
              }}
              style={{
                backgroundImage: `url(${message.url.startsWith('https://') ? message.url : 'https://' + message.url}?${Date.now()})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
            <Moment fromNow className={classes.itemMeta}>
              {message.created}
            </Moment>
          </div>
        ) : message.type && message.type === "video" ? (
          <div className={classes.container}>
            <div className={classes.itemMeta}>{message?.fromType?.toUpperCase()}</div>
            <div className={classes.videoContainer}>
              <div className={classes.iconVideoWrapper}>
                <SvgIcon className={classes.playIconVideo}>
                  <PlaySolid />
                </SvgIcon>
              </div>
              <ReactPlayer
                onClick={() => {
                  console.log(message);
                  setSelectedVideo(`${message.url}`);
                  handleOpenModalVideoFullScreen();
                }}
                url={`${message.url}`}
                className={classes.videoPlayer}
                ref={playerVideo}
                progressInterval={200}
              />
            </div>
            <Moment fromNow className={classes.itemMeta}>
              {message.created}
            </Moment>
          </div>
        ) : message.type && message.type === "audio" ? (
          <div className={classes.container}>
            <div className={classes.itemMeta}>{message?.fromType?.toUpperCase()}</div>
            <div className={classes.audioContainer}>
              <Waveform
                url={
                  mediaOnCommunity
                    ? `${URL()}/mediaOnCommunity/getMessageAudio/${message.chatId}/${message.from}/${
                        message.id
                      }`
                    : `${URL()}/chat/getMessageAudio/${chat.room}/${message.from}/${message.id}`
                }
                mine={false}
                showTime={false}
                onPauseFunction={null}
                onPlayFunction={null}
                onReadyFunction={null}
              />
            </div>
            <Moment fromNow className={classes.itemMeta}>
              {message.created}
            </Moment>
          </div>
        ) : message.type && message.type === "file" ? (
          <div className="item-content">
            <div className="item-subtitle">{message?.fromType?.toUpperCase()}</div>
            <div className="item-file">
              <div className="item-file-name">{message.message.originalname || "file"}</div>
              <div
                onClick={() => {
                  if (mediaOnCommunity) {
                    downloadFileMediaOnCommunity();
                  } else {
                    downloadFile();
                  }
                }}
                className="item-file-icon"
              >
                <SvgIcon>
                  <DownloadSolid />
                </SvgIcon>
              </div>
            </div>
            <Moment fromNow className={classes.itemMeta}>
              {message.created}
            </Moment>
          </div>
        ) : (
          <>
            {typeof message.message === "string" && (
              <div className="item-content">
                <div className="item-subtitle">{message?.fromType?.toUpperCase()}</div>
                <div className="item-message">
                  {message.message.includes("data:audio/wav;") ? (
                    <audio style={{ width: "200px" }} controls src={JSON.parse(message.message)}>
                      The “audio” tag is not supported by your browser. Click [here] to download the sound
                      file.
                    </audio>
                  ) : (
                    message.message
                  )}
                </div>
                <Moment fromNow className="item-subtitle">
                  {message.created}
                </Moment>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPhoto && openModalPhotoFullScreen && (
        <Modal className="modal" size="medium" isOpen={openModalPhotoFullScreen} onClose={handleCloseModalPhotoFullScreen} showCloseIcon>
          <DiscordPhotoFullScreen onCloseModal={handleCloseModalPhotoFullScreen} url={selectedPhoto} />
        </Modal>
      )}
      {selectedVideo && openModalVideoFullScreen && (
        <Dialog
          className={`modal ${classes.dialogContainer}`}
          open={openModalVideoFullScreen}
          onClose={handleCloseModalVideoFullScreen}
          maxWidth={"md"}
          fullWidth
        >
          <DiscordVideoFullScreen onCloseModal={handleCloseModalVideoFullScreen} url={selectedVideo} />
        </Dialog>
      )}
    </>
  );
};
