import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog } from "@material-ui/core";
import { Modal } from "shared/ui-kit";
import Waveform from "shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform";
import DiscordPhotoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";

import { saveAs } from "file-saver";

import Box from "shared/ui-kit/Box";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as DownloadSolid } from "assets/icons/download-solid.svg";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "../../../../shared/ipfs/get";
import { _arrayBufferToBase64 } from "../../../../shared/functions/commonFunctions";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { sanitizeIfIpfsUrl } from "shared/helpers";

const useStyles = makeStyles(theme => ({
  dialogContainer: {
    "& .MuiDialog-paperFullWidth": {
      paddingTop: theme.spacing(2),
      borderRadius: theme.spacing(2.5),
    },
  },
  discordPhotoFullModal: {
    "& path": {
      stroke: "white",
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
  noMessagesLabelChat: {
    fontSize: "14px",
    color: "grey",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "10px",
    width: "100%",
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

const MessageItemFC = ({ message, messageContentRef }) => {
  const playerVideo = React.useRef(null);
  const classes = useStyles();
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>("");
  const [selectedVideo, setSelectedVideo] = React.useState<string>("");
  const [openModalPhotoFullScreen, setOpenModalPhotoFullScreen] = React.useState<boolean>(false);
  const [openModalVideoFullScreen, setOpenModalVideoFullScreen] = React.useState<boolean>(false);
  const [isOwnMessage, setIsOwnMessage] = React.useState(false);

  const { downloadWithNonDecryption } = useIPFS();

  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [fileBlobIPFS, setFileBlobIPFS] = useState<any>(null);

  useEffect(() => {
    const user = message.from;
    const selfId = localStorage.getItem("userId");
    setIsOwnMessage(user.id === selfId);
  }, [message]);

  useEffect(() => {
    if (
      message &&
      message.type &&
      message.type !== "text" &&
      message?.message.newFileCID &&
      message?.message?.metadata?.properties?.name
    ) {
      getUserFileIpfs(message.message.newFileCID, message.message.metadata.properties.name, message.type);
    }
  }, [message]);

  const getUserFileIpfs = async (cid: any, fileName: string, type: string) => {
    let fileUrl: string = "";
    let files = await onGetNonDecrypt(cid, fileName, (fileCID, fileName, download) =>
      downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      if (type === "photo") {
        fileUrl = "data:image/png;base64," + base64String;
      } else if (type === "video") {
        fileUrl = "data:video/mp4;base64," + base64String;
      } else if (type === "audio") {
        fileUrl = "data:audio/mp3;base64," + base64String;
      } else {
        fileUrl = base64String;
        setFileBlobIPFS(files.blob);
      }
    }
    setFileIPFS(fileUrl);
  };

  const handleOpenModalPhotoFullScreen = () => {
    if (messageContentRef?.current) messageContentRef.current.style.overflowY = "hidden";
    setOpenModalPhotoFullScreen(true);
  };
  const handleCloseModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(false);
    if (messageContentRef?.current) messageContentRef.current.style.overflowY = "auto";
  };
  const handleOpenModalVideoFullScreen = () => {
    if (messageContentRef?.current) messageContentRef.current.style.overflowY = "hidden";
    setOpenModalVideoFullScreen(true);
  };

  const handleCloseModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(false);
    if (messageContentRef?.current) messageContentRef.current.style.overflowY = "auto";
  };

  const downloadFile = () => {
    if (fileBlobIPFS) {
      saveAs(
        fileBlobIPFS,
        message.message &&
          message.message.metadata &&
          message.message.metadata.properties &&
          message.message.metadata.properties.name
          ? message.message.metadata.properties.name
          : "File"
      );
    }
  };
  const downloadFileMediaOnCommunity = () => {
    saveAs(`${message.url}`, message.message);
  };

  return (
    <>
      <Box
        display="flex"
        width="100%"
        my="4px"
        className={!isOwnMessage ? "left-item" : "right-item"}
        id={message.id}
      >
        {!isOwnMessage && (
          <div className="avatar-container" style={{ background: "transparent" }}>
            <img
              src={message.from?.url || getDefaultAvatar()}
              alt="Avatar"
              className="message-item-avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
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
                setSelectedPhoto(`${fileIPFS}`);
                handleOpenModalPhotoFullScreen();
              }}
              style={{
                backgroundImage: `url(${fileIPFS ? sanitizeIfIpfsUrl(fileIPFS) : ""})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
            <div className="item-subtitle grey" style={{ marginLeft: !isOwnMessage ? 16 : 0 }}>
              <Moment fromNow className={classes.itemMeta}>
                {message.created}
              </Moment>
            </div>
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
                  if (fileIPFS) {
                    setSelectedVideo(fileIPFS);
                    handleOpenModalVideoFullScreen();
                  }
                }}
                url={fileIPFS}
                className={classes.videoPlayer}
                ref={playerVideo}
                progressInterval={200}
              />
            </div>
            <div className="item-subtitle grey" style={{ marginLeft: !isOwnMessage ? 16 : 0 }}>
              <Moment fromNow className={classes.itemMeta}>
                {message.created}
              </Moment>
            </div>
          </div>
        ) : message.type && message.type === "audio" ? (
          <div className={classes.container}>
            <div className={classes.itemMeta}>{message?.fromType?.toUpperCase()}</div>
            <div className={classes.audioContainer}>
              {fileIPFS ? (
                <Waveform
                  url={fileIPFS}
                  mine={false}
                  showTime={false}
                  onPauseFunction={null}
                  onPlayFunction={null}
                  onReadyFunction={null}
                />
              ) : (
                <p className={classes.noMessagesLabelChat}>Loading audio...</p>
              )}
            </div>
            <div className="item-subtitle grey" style={{ marginLeft: !isOwnMessage ? 16 : 0 }}>
              <Moment fromNow className={classes.itemMeta}>
                {message.created}
              </Moment>
            </div>
          </div>
        ) : message.type && message.type === "file" ? (
          <div className="item-content">
            <div className="item-subtitle">{message?.fromType?.toUpperCase()}</div>
            <div className="item-file">
              <div className="item-file-name">
                {message.message &&
                message.message.metadata &&
                message.message.metadata.properties &&
                message.message.metadata.properties.name
                  ? message.message.metadata.properties.name
                  : "File"}
              </div>
              <div
                onClick={() => {
                  downloadFile();
                }}
                className="item-file-icon"
              >
                <SvgIcon>
                  <DownloadSolid />
                </SvgIcon>
              </div>
            </div>
            <div className="item-subtitle grey" style={{ marginLeft: !isOwnMessage ? 16 : 0 }}>
              <Moment fromNow className={classes.itemMeta}>
                {message.created}
              </Moment>
            </div>
          </div>
        ) : (
          <>
            {typeof message.message === "string" && (
              <div className="item-content">
                <div className="item-message">{message.message}</div>
                <Moment fromNow className="item-subtitle">
                  {message.created}
                </Moment>
              </div>
            )}
          </>
        )}
      </Box>

      {selectedPhoto && openModalPhotoFullScreen && (
        <Modal
          size="medium"
          className={classes.discordPhotoFullModal}
          isOpen={openModalPhotoFullScreen}
          onClose={handleCloseModalPhotoFullScreen}
          theme="img-preview"
          showCloseIcon
        >
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

export const MessageItem = React.memo(MessageItemFC);
