import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { Fade, Tooltip } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";

import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import { mediaNFTMediaTabStyles } from "./MediaNFTMediaTab.styles";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as PauseSolid } from "assets/icons/pause-solid.svg";
import { ReactComponent as UndoSolid } from "assets/icons/undo-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
const infoIcon = require("assets/icons/info.svg");
const workInProgress = require("assets/backgrounds/workInProgress.jpeg");
const audioPhoto = require("assets/backgrounds/audio.png");
const videoPhoto = require("assets/backgrounds/video.png");
const audioLivePhoto = require("assets/backgrounds/live_audio_1.png");
const videoLivePhoto = require("assets/backgrounds/live_video.png");
const digitalArtPhoto = require("assets/backgrounds/digital_art_1.png");
const blogPhoto = require("assets/backgrounds/blog.png");
const blogSnapPhoto = require("assets/backgrounds/blog_snap.png");

const typeFileList: string[] = [
  "Choose Media Type",
  "Audio",
  "Video",
  "Blog",
  "Live Audio Streaming",
  "Live Video Streaming",
  "Blog Snaps",
  "Digital Art",
];

const MediaNFTMediaTab = (props: any) => {
  const classes = mediaNFTMediaTabStyles();

  const [mediaArray, setMediaArray] = useState<any[]>([
    {
      SellingToken: "ETH",
      ReleaseDate: new Date(),
      Collabs: {},
      Title: "",
      Description: "",
      Symbol: "",
      TypeFile: typeFileList[1],
    },
  ]);

  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [indexMediaSelected, setIndexMediaSelected] = useState<number>(0);
  const [file, setFile] = useState<any>(null);
  const [fileShow, setFileShow] = useState<any>(null);

  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    if (props.pod) {
      const media = [...props.pod.Media];

      if (media.length !== 0) {
        setMediaArray(media);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.isCreator !== undefined) {
      setIsCreator(props.isCreator);
    }
  }, [props.isCreator]);

  const onFileChange = (files: any, type: any) => {
    setFile(files[0]);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (type === "Video") {
        setFileShow(window.URL.createObjectURL(files[0]));
      } else if (type === "Audio") {
        setFileShow(window.URL.createObjectURL(files[0]));
      } else {
        setFileShow(reader.result);
      }
      /*console.log(
        files[0],
        reader.result,
        window.URL.createObjectURL(files[0]),
        mediaArray[indexMediaSelected].TypeFile
      );*/
    });
    reader.readAsDataURL(files[0]);
  };

  const dragOver = e => {
    e.preventDefault();
  };

  const dragEnter = e => {
    e.preventDefault();
  };

  const dragLeave = e => {
    e.preventDefault();
  };

  const fileDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const fileInput = e => {
    e.preventDefault();
    //console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (mediaArray[indexMediaSelected].TypeFile === "Audio") {
        if (validateFileAudio(files[i])) {
          onFileChange(files, "Audio");
        } else {
          files[i]["invalid"] = true;
          // Alert invalid image
        }
      } else if (mediaArray[indexMediaSelected].TypeFile === "Video") {
        if (validateFileVideo(files[i])) {
          onFileChange(files, "Video");
        } else {
          files[i]["invalid"] = true;
          // Alert invalid image
        }
      } else {
        if (validateFile(files[i])) {
          onFileChange(files, "Image");
        } else {
          files[i]["invalid"] = true;
          // Alert invalid image
        }
      }
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
    //console.log(file);
    const validTypes = ["audio/mp3", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/mpeg"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };
  const removeImage = () => {
    setFileShow(null);
    setFile(null);
  };

  const handleSeekProgressBarAudio = (x: number, y: number) => {
    /*let positionClick: number = +(
        (x - startingAudioBar) /
        widthAudioBar
      ).toFixed(2);*/
    //player.current.seekTo(positionClick, 'fraction');
    //TODO: why seekTo is always starting audio and not seek to position?
  };

  const VideoPlayerMediaList = (props: any) => {
    let playerVideoItem: any = useRef();
    const [videoPlayingItem, setVideoPlayingItem] = useState<boolean>(false);
    const [onProgressVideoItem, setOnProgressVideoItem] = useState<any>({
      played: 0,
      playedSeconds: 0,
      loaded: 0,
      loadedSeconds: 0,
    });
    const [onDurationVideoItem, setOnDurationVideoItem] = useState<number>(1);
    const [startingVideoBarItem, setStartingVideoBarItem] = useState<number>(0);
    const [widthVideoBarItem, setWidthVideoBarItem] = useState<number>(0);

    const divVideoBarItem = useCallback(node => {
      if (node !== null) {
        setStartingVideoBarItem(node.getBoundingClientRect().x);
        setWidthVideoBarItem(node.getBoundingClientRect().width);
      }
    }, []);

    return (
      <div className="messageInfoVideo">
        <ReactPlayer
          url={props.fileShow}
          className="react-player imageMediaListNFTPod"
          ref={playerVideoItem}
          progressInterval={200}
          playing={videoPlayingItem}
          onProgress={progress => {
            setOnProgressVideoItem(progress);
          }}
          onDuration={duration => {
            setOnDurationVideoItem(duration);
          }}
          onEnded={() => {
            //player.current.seekTo(0);
            setVideoPlayingItem(false);
          }}
        />
        <div className="progressBarAudioRow">
          <div
            style={{
              marginRight: "10px",
              width: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {videoPlayingItem ? (
              <div style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => setVideoPlayingItem(false)}>
                <SvgIcon>
                  <PauseSolid />
                </SvgIcon>
              </div>
            ) : (
              <div style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => setVideoPlayingItem(true)}>
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
            onClick={() => playerVideoItem.current.seekTo(0)}
          >
            <SvgIcon>
              <UndoSolid />
            </SvgIcon>
          </div>
          <div
            className="progressBarAudio"
            ref={divVideoBarItem}
            onClick={event => {
              handleSeekProgressBarAudio(event.clientX, event.clientY);
            }}
          >
            <div
              className="progressBarAudioLoaded"
              /*style={{width: '80%'}}*/
              style={{
                width: (onProgressVideoItem.loadedSeconds / onDurationVideoItem) * 100 + "%",
              }}
            ></div>
            <div
              className="progressBarAudioPlayed"
              /*style={{width: '50%'}}*/
              style={{
                width: (onProgressVideoItem.playedSeconds / onDurationVideoItem) * 100 + "%",
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
            {onDurationVideoItem.toFixed(0)}
          </div>
        </div>
      </div>
    );
  };

  const addMedia = andCreate => {
    let media = mediaArray[indexMediaSelected];

    media.fileShow = fileShow;
    media.file = file;

    const mArray = [...mediaArray];

    if (media && media.Title && media.Description && media.Symbol) {
      const acceptedChars = "^[a-zA-Z0-9]{1,100}$";
      if (!media.Symbol.match(acceptedChars)) {
        setStatus({
          msg: "Media Symbol can only contain letters and numbers",
          key: Math.random(),
          variant: "error",
        });
      } else {
        if (indexMediaSelected !== -1) {
          mArray[indexMediaSelected] = media;
        } else {
          mArray.push(media);
        }

        const pod = { ...props.pod, Media: [...mArray] };
        props.setPod(pod);

        if (andCreate) {
          if (props.openInvestment) {
            props.next();
          } else {
            props.handleOpenSignatureModal();
            // props.createPod(pod);
          }
        } else {
          mArray.push({
            SellingToken: "ETH",
            ReleaseDate: new Date(),
            Collabs: {},
            Title: "",
            Description: "",
            Symbol: "",
            TypeFile: typeFileList[1],
          });

          setIndexMediaSelected(indexMediaSelected + 1);
          setMediaArray(mArray);
        }
      }
    } else {
      setStatus({
        msg: "Complete all fields",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  //input component
  function renderInputCreateModal(p) {
    return (
      <div style={{ width: "100%" }}>
        <div className={classes.flexRowInputs}>
          <div className={classes.infoHeaderCreatePod}>{p.name}</div>
          {p.info && p.info.length > 0 ? (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className={classes.tooltipHeaderInfo}
              title={p.info}
            >
              <img src={infoIcon} alt={"info"} />
            </Tooltip>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <InputWithLabelAndTooltip
            overriedClasses={classes.textFieldCreatePod}
            style={
              p.width === -1
                ? { width: "100%" }
                : p.isCreator
                  ? { width: "calc(" + p.width + "px - 24px - 35px)" }
                  : { width: "calc(" + p.width + "px - 24px)" }
            }
            type={p.type}
            minValue={p.min}
            inputValue={mediaArray[indexMediaSelected][p.item]}
            onInputValueChange={elem => {
              if (isCreator) {
                const mArray = [...mediaArray];

                let mediaCopy: any = { ...mArray[indexMediaSelected] };
                mediaCopy[p.item] = elem.target.value;

                mArray[indexMediaSelected] = mediaCopy;

                setMediaArray(mArray);
              }
            }}
            placeHolder={p.placeholder}
            disabled={!isCreator}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.mediaTab}>
      <div className={classes.mediasOverview}>
        {mediaArray.map((m, index) => (
          <div
            className={classes.overviewMediaCardContainer}
            onClick={() => {
              if (isCreator) {
                setIndexMediaSelected(index);
              }
            }}
            key={index}
          >
            <h6>{`Media #${index + 1}`}</h6>
            {!!m.TypeFile && m.TypeFile !== "Choose Media Type" ? (
              <div
                className={classes.overviewMediaCard}
                style={{
                  background: index === indexMediaSelected ? "#949BAB" : "#F7F9FE",
                }}
              >
                <img
                  className={classes.overviewMediaCardImage}
                  src={
                    m.TypeFile === "Audio" || m.Type === "AUDIO_TYPE"
                      ? audioPhoto
                      : m.TypeFile === "Video" || m.Type === "VIDEO_TYPE"
                        ? videoPhoto
                        : m.TypeFile === "Blog" || m.Type === "BLOG_TYPE"
                          ? blogPhoto
                          : m.TypeFile === "Live Audio Streaming" || m.Type === "LIVE_AUDIO_TYPE"
                            ? audioLivePhoto
                            : m.TypeFile === "Live Video Streaming" || m.Type === "LIVE_VIDEO_TYPE"
                              ? videoLivePhoto
                              : m.TypeFile === "Blog Snaps" || m.Type === "BLOG_SNAP_TYPE"
                                ? blogSnapPhoto
                                : m.TypeFile === "Digital Art" || m.Type === "DIGITAL_ART_TYPE"
                                  ? digitalArtPhoto
                                  : workInProgress
                  }
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0px 10px",
                  }}
                >
                  {!!m.Title ? (
                    <div>
                      <div
                        className={classes.mediaNFTTitle}
                        style={{
                          color: index === indexMediaSelected ? "white" : "black",
                        }}
                      >
                        {m.Title}
                      </div>
                      <div
                        className={classes.mediaNFTSymbol}
                        style={{
                          color: index === indexMediaSelected ? "white" : "black",
                        }}
                      >
                        {m.Symbol}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 86,
                        height: 12,
                        background: "#EFF2F8",
                        borderRadius: 3,
                      }}
                    />
                  )}
                  {!!m.TypeFile && m.TypeFile !== "Choose Media Type" ? (
                    <div
                      style={{
                        position: "absolute",
                        right: 10,
                        width: 14,
                        height: 14,
                        backgroundImage:
                          m.TypeFile !== "Choose Media Type" && m.TypeFile !== ""
                            ? m.TypeFile === "Audio"
                              ? `url(${require(`assets/mediaIcons/small/audio.png`)})`
                              : m.TypeFile === "Video"
                                ? `url(${require(`assets/mediaIcons/small/video.png`)})`
                                : m.TypeFile === "Blog"
                                  ? `url(${require(`assets/mediaIcons/small/blog.png`)})`
                                  : m.TypeFile === "Live Audio Streaming"
                                    ? `url(${require(`assets/mediaIcons/small/audio_live.png`)})`
                                    : m.TypeFile === "Live Video Streaming"
                                      ? `url(${require(`assets/mediaIcons/small/video_live.png`)})`
                                      : m.TypeFile === "Blog Snaps"
                                        ? `url(${require(`assets/mediaIcons/small/blog_snap.png`)})`
                                        : `url(${require(`assets/mediaIcons/small/digital_art.png`)})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 7,
                          background: "#EFF2F8",
                          border: `1px solid ${index === indexMediaSelected ? "#949BAB" : "#F7F9FE"}`,
                        }}
                      />
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 7,
                          background: "#EFF2F8",
                          marginRight: -10,
                          border: " 1px solid #949BAB",
                        }}
                      />
                    </div>
                  )}
                </div>
                {!!m.Title ? null : (
                  <div
                    style={{
                      width: 63,
                      height: 8,
                      background: "#EFF2F8",
                      borderRadius: 3,
                      marginLeft: 10,
                    }}
                  />
                )}
              </div>
            ) : (
              <div className={classes.overviewMediaCardEmpty}>
                <img src={require("assets/icons/add_circle.png")} alt={"add"} style={{ marginBottom: 14 }} />
                Media Preview
              </div>
            )}
          </div>
        ))}
        <div className={classes.dummyCards}>
          <div className={classes.overviewMediaCardEmpty} />
          <div className={classes.overviewMediaCardEmpty} />
          <div className={classes.overviewMediaCardEmpty} />
        </div>
      </div>

      <div className={classes.flexRowInputs}>
        <div className={classes.infoHeaderCreatePod}>Media Type</div>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          className={classes.tooltipHeaderInfo}
          title={"Media type"}
        >
          <img src={infoIcon} alt={"info"} />
        </Tooltip>
      </div>
      <div className={classes.mediaSelector}>
        <div
          className={classes.mediaTypeIcon}
          style={{
            backgroundImage:
              mediaArray[indexMediaSelected].TypeFile !== "Choose Media Type" &&
                mediaArray[indexMediaSelected].TypeFile !== ""
                ? mediaArray[indexMediaSelected].TypeFile === "Audio"
                  ? `url(${require(`assets/mediaIcons/small/audio.png`)})`
                  : mediaArray[indexMediaSelected].TypeFile === "Video"
                    ? `url(${require(`assets/mediaIcons/small/video.png`)})`
                    : mediaArray[indexMediaSelected].TypeFile === "Blog"
                      ? `url(${require(`assets/mediaIcons/small/blog.png`)})`
                      : mediaArray[indexMediaSelected].TypeFile === "Live Audio Streaming"
                        ? `url(${require(`assets/mediaIcons/small/audio_live.png`)})`
                        : mediaArray[indexMediaSelected].TypeFile === "Live Video Streaming"
                          ? `url(${require(`assets/mediaIcons/small/video_live.png`)})`
                          : mediaArray[indexMediaSelected].TypeFile === "Blog Snaps"
                            ? `url(${require(`assets/mediaIcons/small/blog_snap.png`)})`
                            : `url(${require(`assets/mediaIcons/small/digital_art.png`)})`
                : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <FormControl style={{ width: "100%" }}>
          <StyledSelect
            disabled={!isCreator || fileShow}
            disableUnderline
            value={mediaArray[indexMediaSelected].TypeFile}
            className={classes.selectCreatePod}
            onChange={e => {
              const mArray = [...mediaArray];
              const selectedName: any = e.target.value;

              let mediaCopy: any = { ...mArray[indexMediaSelected] };
              mediaCopy.TypeFile = selectedName;

              mArray[indexMediaSelected] = mediaCopy;

              setMediaArray(mArray);
            }}
          >
            {typeFileList.map((item, i) => {
              return (
                <StyledMenuItem key={i} value={item} disabled={item === typeFileList[0]}>
                  {item}
                </StyledMenuItem>
              );
            })}
          </StyledSelect>
        </FormControl>
      </div>
      <div className={classes.mediaTabMarginTop}>
        {renderInputCreateModal({
          name: "Media Title",
          placeholder: "Enter media title...",
          type: "text",
          width: -1,
          item: "Title",
          info: "Title Media Tooltip",
        })}
      </div>
      <div className={classes.mediaTabMarginTop}>
        {renderInputCreateModal({
          name: "Media Symbol",
          placeholder: "Enter media symbol... (no spaces)",
          type: "text",
          width: -1,
          item: "Symbol",
          info: "Symbol Media Tooltip",
        })}
      </div>
      <div className={classes.mediaTabMarginTop}>
        <div className={classes.infoHeaderCreatePod}>Description</div>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          className={classes.tooltipHeaderInfo}
          title={""}
        >
          <img src={infoIcon} alt={"info"} />
        </Tooltip>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <textarea
          className={classes.textAreaCreatePod}
          style={{
            width: "100%",
          }}
          value={mediaArray[indexMediaSelected].Description}
          onChange={elem => {
            if (isCreator) {
              const mArray = [...mediaArray];

              let mediaCopy: any = { ...mArray[indexMediaSelected] };
              mediaCopy.Description = elem.target.value;

              mArray[indexMediaSelected] = mediaCopy;

              setMediaArray(mArray);
            }
          }}
          disabled={!isCreator || props.pod.TokenDescription}
          placeholder="Enter media description..."
        />
      </div>

      <div className={classes.buttons}>
        <SecondaryButton size="medium" onClick={props.back}>
          Back
        </SecondaryButton>
        <div className={classes.rightBtnSection}>
          <PrimaryButton
            size="medium"
            disabled={!isCreator}
            onClick={() => {
              addMedia(false);
            }}
          >
            {`Upload & Add New`}
          </PrimaryButton>
          <PrimaryButton
            size="medium"
            disabled={!isCreator}
            onClick={() => {
              addMedia(true);
            }}
          >
            {`Upload & ${props.openInvestment ? "Continue" : "Create Pod"}`}
          </PrimaryButton>
        </div>
      </div>

      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </div>
  );
};

export default MediaNFTMediaTab;
