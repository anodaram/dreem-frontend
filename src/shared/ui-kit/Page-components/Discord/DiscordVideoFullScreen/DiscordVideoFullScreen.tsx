import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./DiscordVideoFullScreen.css";

const DiscordVideoFullScreen = (props: any) => {
  let playerVideo: any = useRef();

  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);

  return (
    <div className={`modalDiscordFullScreen ${props.theme && props.theme === "dark" ? "dark" : ""}`}>
      <ReactPlayer
        url={props.url}
        className={`react-player ${props.theme && props.theme === "dark" ? "dark" : ""}`}
        ref={playerVideo}
        width="100%"
        progressInterval={200}
        playing={videoPlaying}
        onEnded={() => {
          playerVideo.current.seekTo(0);
          setVideoPlaying(false);
        }}
        controls
      />
    </div>
  );
};

export default DiscordVideoFullScreen;
