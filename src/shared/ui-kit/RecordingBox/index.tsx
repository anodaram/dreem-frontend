import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import styles from "./index.module.scss";

import { ReactComponent as SendIcon } from "assets/icons/paper-plane-regular.svg";
import { ReactComponent as BackIcon } from "assets/icons/backspace-solid.svg";

export const RecordingBox = ({
    specialWidthInput = null,
    deleteVoiceMessage,
    sendVoiceMessage,
    setMediaBlobUrl,
}) => {
    const {
        status: recordingStatus,
        startRecording,
        stopRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({
        audio: true,
    });

    React.useEffect(() => {
        startRecording();

        return () => stopRecording();
    }, []);

    React.useEffect(() => {
        setMediaBlobUrl(mediaBlobUrl);
    }, [mediaBlobUrl]);

    return (
        <div
            className={styles.recoderBox}
            style={specialWidthInput ? { width: "calc(100% - 30px)" } : { width: "100%" }}
        >
            {recordingStatus === "recording" && (
                <button onClick={() => stopRecording()} style={{ margin: "10px" }}>
                    Stop
                </button>
            )}
            {recordingStatus === "recording" && (
                <>
                    <div
                        className={styles.sendDiscordMessage}
                        style={{ justifyContent: "center", alignItems: "center" }}
                    >
                        <div className={styles.circleRipple}></div>
                        <div className={styles.circleRipple2}></div>
                        <div className={styles.circle}>
                            <div className={styles.circle2}>
                                <img src={require("assets/icons/microphone.svg")} alt="" />
                            </div>
                        </div>
                    </div>
                </>
            )}
            {recordingStatus === "stopped" && (
                <>
                    <div className={styles.sendDiscordMessage}>
                        {mediaBlobUrl && (
                            <audio controls src={mediaBlobUrl}>
                                The “audio” tag is not supported by your browser. Click [here] to download the sound file.
                            </audio>
                        )}
                    </div>
                    <button
                        onClick={deleteVoiceMessage}
                        style={{
                            marginRight: "10px",
                            marginLeft: "10px",
                            marginTop: "6px",
                            padding: "0px 15px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <BackIcon style={{ width: "16px" }} />
                    </button>
                    <button
                        onClick={sendVoiceMessage}
                        style={{
                            padding: "0px 15px",
                            marginTop: "6px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <SendIcon style={{ width: "16px" }} />
                    </button>
                </>
            )}
        </div>
    );
};
