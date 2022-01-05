import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {Theme} from '@material-ui/core';
import Box from "shared/ui-kit/Box";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as SpeakerIcon } from "assets/icons/speaker.svg";
import { ReactComponent as SpeakerWhiteIcon } from "assets/icons/speaker_white.svg";
import { RecordingBox } from "shared/ui-kit/RecordingBox";
import { default as ServerURL } from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
export interface StyleProps {
    type: any;
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  container: {
    background: ({ type }) =>
      type === "pix" ? "#DDFF57" : "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
    boxShadow: ({ type }) => (type === "pix" ? "0px 4px 8px #9EACF2" : "0px 2px 8px rgba(0, 0, 0, 0.12)"),
    borderRadius: ({ type }) => (type === "pix" ? theme.spacing(2) : 20),
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    color: ({ type }) => (type === "pix" ? "#431AB7" : "#ffffff"),
    marginBottom: theme.spacing(2),
    height: "auto",
    width: "100%",
    maxWidth: 906,
    fontSize: 26,
    [theme.breakpoints.down("xs")]: {
      padding: `${theme.spacing(2)}px`,
    },
  },
  header1: {
    fontSize: 26,
    fontWeight: 800,
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  header2: {
    fontSize: 20,
    fontWeight: 400,
    lineHeight: "24px",
    [theme.breakpoints.down("xs")]: {
      lineHeight: "30px",
      fontSize: 16,
    },
  },
  iconBtn: {
    cursor: "pointer",
  },
}));

type ShareVoiceTheme = "pix" | "flix";

const ShareVoiceMessage: React.FC<{ theme: ShareVoiceTheme; handleShare?: any }> = ({
  theme = "pix",
  handleShare = null,
}) => {
  const classes = useStyles({ type: theme });
  const userSelector = useSelector((state: RootState) => state.user);
  const [audioMessage, setAudioMessage] = useState<boolean>(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<any>();

  const startAudioRecording = () => {
    setAudioMessage(true);
  };

  const closeAudioRecording = () => {
    setAudioMessage(false);
  };

  const b64toBlob = dataURI => {
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };

  const handleShareAudio = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("audio", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(`${ServerURL()}/chat/shareAudio/${userSelector.id}`, formData, config)
      .then(response => {
        if (response.data && response.data.success) {
          const audio: any = response.data.data;
          handleShare && handleShare(audio);
        } else {
          console.log(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

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
            handleShareAudio(b64toBlob(blobAsDefaultURL));
            setAudioMessage(false);
          }
        };

        reader.readAsDataURL(recoveredBlob);
      };

      xhr.open("GET", mediaBlobUrl);
      xhr.send();
    }
  };

  return (
    <Box className={classes.container}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gridRowGap={10}
        height={1}
      >
        <Box maxWidth="90%">
          <Box className={classes.header1}>What are you thinking about?</Box>
          <Box className={classes.header2}>Share a voice memo with your followers.</Box>
        </Box>

        {audioMessage ? (
          <Box maxWidth={400} flex="1">
            <RecordingBox
              deleteVoiceMessage={closeAudioRecording}
              sendVoiceMessage={sendVoiceMessage}
              setMediaBlobUrl={setMediaBlobUrl}
            />
          </Box>
        ) : theme === "pix" ? (
          <SpeakerIcon className={classes.iconBtn} onClick={startAudioRecording} />
        ) : (
          <SpeakerWhiteIcon className={classes.iconBtn} onClick={startAudioRecording} />
        )}
      </Box>
    </Box>
  );
};

export default ShareVoiceMessage;
