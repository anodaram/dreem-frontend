import React, { useEffect, useRef, useState } from "react";
import "./Waveform.css";
import WaveSurfer from "wavesurfer.js";
import { useLogin } from "shared/hooks/useLogin";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as PauseSolid } from "assets/icons/pause-solid.svg";

const formWaveSurferOptions = ref => ({
  container: ref,
  waveColor: "#ffffff80",
  progressColor: "White",
  cursorColor: "transparent",
  height: 50,
  barWidth: 3,
  barGap: 2,
  barRadius: 2,
  responsive: true,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
});

const formWaveSurferBlueOptions = ref => ({
  container: ref,
  waveColor: "#0818318c",
  progressColor: "#1a2f55",
  cursorColor: "transparent",
  height: 50,
  barWidth: 3,
  barGap: 2,
  barRadius: 2,
  responsive: true,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
});

const formWaveSurferOptionsShowTime = ref => ({
  container: ref,
  waveColor: "#ffffff80",
  progressColor: "White",
  cursorColor: "transparent",
  height: 40,
  barWidth: 2,
  barGap: 1,
  barRadius: 0,
  responsive: true,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
});

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
    isFromProfilePane = false,
  } = props;
  const isLogin = useLogin();
  const waveformRef = useRef<any>(null);
  const wavesurfer = useRef<any>(null);
  const [playing, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = !showTime
      ? mine === true
        ? formWaveSurferOptions(waveformRef.current)
        : formWaveSurferBlueOptions(waveformRef.current)
      : formWaveSurferOptionsShowTime(waveformRef.current);
    wavesurfer.current = WaveSurfer.create({ ...options, backend: "MediaElement", mediaType: "audio" });

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function () {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);

      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.loaded = true;
        wavesurfer.current.setVolume(1);
        if (onReadyFunction !== null) onReadyFunction();
      }
    });
    wavesurfer.current.on("error", function (err) {
      wavesurfer.current.destroy();
      console.log("--error-wave", url, err);
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    wavesurfer.current.on("finish", function () {
      if (onPauseFunction !== null) onPauseFunction();
      if (wavesurfer.current) {
        setPlay(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wavesurfer.current]);

  const handlePlayPause = () => {
    if (isLogin) {
      if (playing) {
        if (onPauseFunction !== null) onPauseFunction();
      } else {
        if (onPlayFunction !== null) onPlayFunction();
      }
      setPlay(!playing);
      if (wavesurfer && wavesurfer.current && wavesurfer) {
        wavesurfer.current.playPause();
      }
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (wavesurfer.current && wavesurfer.current.isPlaying()) {
  //       setCurrentTime(
  //         wavesurfer.current && wavesurfer.current.isPlaying()
  //           ? `${(wavesurfer.current.getCurrentTime() / 60).toFixed(0)}:${
  //               Number((wavesurfer.current.getCurrentTime() % 60).toFixed(0)) < 10 ? "0" : ""
  //             }${(wavesurfer.current.getCurrentTime() % 60).toFixed(0)}`
  //           : "0:00"
  //       );
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [wavesurfer.current]);

  return (
    <div className="audioPlayerContainer" style={{ width: showTime ? "100%" : "auto" }}>
      <div
        className={`audioPlayer ${showTime ? "showTime" : ""} ${fullWidth && "fullWidth"}`}
        style={
          isFromProfilePane
            ? {
                position: "relative",
                width: "50px",
              }
            : {}
        }
      >
        <div
          className="controls"
          style={
            isFromProfilePane
              ? {
                  position: "absolute",
                  left: 0,
                }
              : {}
          }
        >
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
        <div
          ref={waveformRef}
          style={{
            display: `${showFrame ? "block" : "none"}`,
            width: isFromProfilePane ? "25px" : "auto",
            position: isFromProfilePane ? "absolute" : "inherit",
            left: isFromProfilePane ? "21px" : "0px",
          }}
        />
        {showTime ? <span className="duration">{currentTime}</span> : null}
      </div>
    </div>
  );
});

export default Waveform;
