import React, { useState } from "react";
import "./Waveform.css";
import ReactWaves from "@dschoon/react-waves";
import { useLogin } from "shared/hooks/useLogin";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as PauseSolid } from "assets/icons/pause-solid.svg";

const formWaveSurferOptions = {
  waveColor: 'red',//"#ffffff80",
  progressColor: "White",
  cursorColor: "transparent",
  hideScrollbar: true,
  height: 50,
  barWidth: 3,
  barGap: 2,
  barRadius: 2,
  responsive: true,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
};

const formWaveSurferBlueOptions = {
  waveColor: "#0818318c",
  progressColor: "#1a2f55",
  cursorColor: "transparent",
  hideScrollbar: true,
  height: 50,
  barWidth: 3,
  barGap: 2,
  barRadius: 2,
  responsive: true,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
};

const formWaveSurferOptionsShowTime = {
  waveColor: "#ffffff80",
  progressColor: "White",
  cursorColor: "transparent",
  hideScrollbar: true,
  height: 40,
  barWidth: 2,
  barGap: 1,
  barRadius: 0,
  responsive: true,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
};

const Waveform = React.memo((props: any) => {
  const {
    url,
    mine,
    showTime,
    onPlayFunction,
    onPauseFunction,
    onReadyFunction,
    showFrame = true,
    fullWidth = false,
  } = props;
  const isLogin = useLogin();
  const [playing, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");

  const handlePlayPause = () => {
    if (isLogin) {
      if (playing) {
        if (onPauseFunction !== null) onPauseFunction();
      } else {
        if (onPlayFunction !== null) onPlayFunction();
      }
      setPlay(!playing);
    }
  };

  return (
    <div className="audioPlayerContainer" style={{ width: showTime ? "100%" : "auto" }}>
      <div className={`audioPlayer ${showTime ? "showTime" : ""} ${fullWidth && "fullWidth"}`}>
        <div className="controls">
          {playing ? (
            <div
              className="play-button"
              style={{
                fontSize: "20px",
                cursor: "pointer",
                background: showTime ? "white" : "none",
                border: showTime ? "5px solid white" : "3px solid rgb(69, 207, 234)",
                borderRadius: showTime ? "50%" : 0,
                color: showTime
                  ? "black"
                  : mine || (props.theme && props.theme === "dark")
                  ? "white"
                  : "#0818318c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handlePlayPause}
            >
              <SvgIcon>
                <PauseSolid />
              </SvgIcon>
            </div>
          ) : (
            <div
              className="play-button"
              style={{
                fontSize: "20px",
                cursor: "pointer",
                background: showTime ? "white" : "none",
                border: showTime ? "5px solid white" : "3px solid rgb(69, 207, 234)",
                borderRadius: showTime ? "50%" : 0,
                color: showTime
                  ? "black"
                  : mine || (props.theme && props.theme === "dark")
                  ? "white"
                  : "#0818318c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handlePlayPause}
            >
              <SvgIcon>
                <PlaySolid />
              </SvgIcon>
            </div>
          )}
        </div>
        <ReactWaves
          audioFile={url}
          options={
            !showTime
              ? mine === true
                ? formWaveSurferOptions
                : formWaveSurferBlueOptions
              : formWaveSurferOptionsShowTime
          }
          volume={1}
          zoom={1}
          playing={playing}
          style={!showFrame ? { visibility: "hidden" } : {}}
        />
        {showTime ? <span className="duration">{currentTime}</span> : null}
      </div>
    </div>
  );
});

export default Waveform;
