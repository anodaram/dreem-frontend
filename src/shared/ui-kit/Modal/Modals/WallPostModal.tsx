import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-elastic-carousel";
import { useHistory } from "react-router-dom";
import ReactPlayer from "react-player";

import SvgIcon from "@material-ui/core/SvgIcon";
import {
  Grid,
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
  withStyles,
  MenuItem,
} from "@material-ui/core";

import { wallPostModalStyles } from "./WallPostModal.styles";
import { setSelectedUser } from "store/actions/SelectedUser";
import { RootState } from "store/reducers/Reducer";
// import { useShareMedia } from "shared/contexts/ShareMediaContext";
import URL from "shared/functions/getURL";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { ReactComponent as ShareAltSolid } from "assets/icons/share-alt-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Modal } from "shared/ui-kit";

const chatGreyIcon = require("assets/icons/message_gray.png");

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const propsAreEqual = (prevProps, currProps) => {
  return (
    prevProps.wallPost === currProps.wallPost &&
    prevProps.creatorInfo === currProps.creatorInfo &&
    prevProps.type === currProps.type &&
    prevProps.like === currProps.like &&
    prevProps.dislike === currProps.dislike &&
    prevProps.isLike === currProps.isLike &&
    prevProps.isListed === currProps.isListed &&
    prevProps.handleList === currProps.handleList &&
    prevProps.creatorImageURL === currProps.creatorImageURL &&
    prevProps.creatorName === currProps.creatorName &&
    prevProps.creatorSlug === currProps.creatorSlug &&
    prevProps.creatorLevel === currProps.creatorLevel &&
    prevProps.imageUrl === currProps.imageUrl &&
    prevProps.wallPost === currProps.wallPost
  );
};

const WallPostModal = React.memo((props: any) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userSelector = useSelector((state: RootState) => state.user);
  // const { shareMediaToSocial } = useShareMedia();
  const classes = wallPostModalStyles();

  const [response, setResponse] = useState("");
  const [responseLoader, setResponseLoader] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);

  const [urlMainPhoto, setUrlMainPhoto] = useState<string>("");
  const [urlDescriptionPhotos, setUrlDescriptionPhotos] = useState<string>("");
  const [urlResponses, setUrlResponses] = useState<string>("");

  const [videoUrl, setVideoUrl] = useState<string>("");

  const [status, setStatus] = useState<any>("");
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] = useState<boolean>(false);
  const handleOpenModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(true);
  };
  const handleCloseModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(false);
  };

  useEffect(() => {
    if (props.wallPost.responses) setResponses(props.wallPost.responses);

    if (props.type && props.type === "Community") {
      setUrlMainPhoto(`url(${props.wallPost.url}?${Date.now()})`);
      setUrlDescriptionPhotos("/community/blog/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/community/blog/makeResponse`);
      props.wallPost.id &&
        props.wallPost.videosId &&
        props.wallPost.videosId[0] &&
        setVideoUrl(`${URL()}/community/blog/getVideo/${props.wallPost.id}/${props.wallPost.videosId[0]}`);
    } else if (props.type && props.type === "InsurancePost") {
      setUrlMainPhoto(`url(${props.wallPost.url}?${Date.now()})`);
      setUrlDescriptionPhotos("/insurance/wall/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/insurance/wall/makeResponse`);
    } else if (props.type && props.type === "PodPost") {
      setUrlMainPhoto(`url(${props.wallPost.url}?${Date.now()})`);
      setUrlDescriptionPhotos("/pod/wall/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/pod/wall/makeResponse`);
    } else if (props.type && props.type === "MediaPodPost") {
      setUrlMainPhoto(`url(${props.wallPost.url}?${Date.now()})`);
      setUrlDescriptionPhotos("/mediaPod/wall/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/mediaPod/wall/makeResponse`);
    } else if (props.type && props.type === "PodNFTPost") {
      setUrlMainPhoto(`url(${props.wallPost.url}?${Date.now()})`);
      setUrlDescriptionPhotos("/pod/NFT/wall/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/pod/NFT/wall/makeResponse`);
    } else if (props.type && props.type === "CreditPost") {
      setUrlMainPhoto(`url(${props.wallPost.url}?${Date.now()})`);
      setUrlDescriptionPhotos("/priviCredit/wall/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/priviCredit/wall/makeResponse`);
    } else if (props.type && props.type === "CommunityPost") {
      setUrlMainPhoto(`url(${props.wallPost.url}?${Date.now()})`);
      setUrlDescriptionPhotos("/community/wall/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/community/wall/makeResponse`);
    } else if (props.type && props.type === "UserPost") {
      setUrlMainPhoto(`url(${props.wallPost.url}?${Date.now()})`);
      setUrlDescriptionPhotos("/user/wall/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/user/wall/makeResponse`);
    } else if (props.imageUrl) {
      setUrlMainPhoto(`url(${props.imageUrl})`);
      setUrlDescriptionPhotos("/user/wall/getDescriptionPostPhoto");
      setUrlResponses(`${URL()}/user/wall/makeResponse`);
    }
    //eslint-disable react-hooks/exhaustive-deps
  }, [props.wallPost, props.type, props.imageUrl]);

  const makeResponse = () => {
    setResponseLoader(true);
    if (response) {
      let body = {
        blogPostId: props.wallPost.id,
        userId: userSelector.id,
        userName: userSelector.firstName,
        response: response,
      };
      axios
        .post(urlResponses, body)
        .then(response => {
          if (response.data.success) {
            let responses: any[] = [...response.data.data];
            setResponses(responses);
            setResponse("");
            setResponseLoader(false);
          } else {
            console.log(response.data.error);
            setResponseLoader(false);
            setStatus({
              msg: "Error making request",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setResponseLoader(false);
          setStatus({
            msg: "Error making request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      makeResponse();
    }
  };

  const handleShowAdditionalImages = () => {
    if (props.wallPost.descriptionImages.length > 0) {
      return "flex";
    } else {
      return "none";
    }
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleOpenShareModal = () => {
    // shareMediaToSocial(props.wallPost.id, "Community");
    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const ResponseWallPost = (propsFunction: any) => {
    return (
      <div>
        <div className={classes.modalWallPostContainer}>
          <div className={classes.wrapperComments}>
            <div className={classes.responsesWallPostComponent}>
              <div className={classes.firstRowResponseWallPost}>
                <div className={classes.leftColResponseWallPostComments}>
                  <div className={classes.userCardImageWallPost}>
                    <div
                      className={classes.authorPhotoWallPost}
                      style={{
                        backgroundImage:
                          propsFunction.response && propsFunction.response.url
                            ? `url(${propsFunction.response.url}?${Date.now()})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        history.push(`/profile/${propsFunction.response.userId}`);
                        dispatch(setSelectedUser(propsFunction.response.userId));
                      }}
                    ></div>
                  </div>
                  <div>
                    <div>
                      <div className={classes.authorNameWallPostComments}>
                        {propsFunction.response.userName}
                      </div>
                      <div className={classes.authorInfoWallPost}>
                        <div>@{props.creatorInfo?.urlSlug || props.creatorSlug}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.labelResponseWallPost}>
                <div className={classes.labelWrapperResponseWallPost}>{propsFunction.response.response}</div>
                <div className={classes.rightColResponseWallPostComment}>
                  <Moment fromNow>{propsFunction.response.date}</Moment>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal size="medium" className={classes.root} isOpen={props.open} onClose={props.onClose} showCloseIcon>
      <div className={classes.modalWallPostContent}>
        <div className={classes.modalWallPostContainer}>
          <div className={classes.dateOfPublished}>
            <Moment fromNow>{props.wallPost.createdAt}</Moment>
          </div>
          {props.wallPost.hasPhoto || props.imageUrl ? (
            <div
              className={classes.mainPhotoWallPost}
              style={{
                backgroundImage: props.wallPost.id ? urlMainPhoto : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : null}
          {props.type && props.type === "Community" && videoUrl ? (
            <>
              <ReactPlayer
                onClick={() => {
                  handleOpenModalDiscordVideoFullScreen();
                }}
                url={videoUrl}
                className={classes.reactPlayer}
                progressInterval={200}
              />
              <Modal
                size="small"
                className={classes.reactPlayerModal}
                isOpen={openModalDiscordVideoFullScreen}
                onClose={handleCloseModalDiscordVideoFullScreen}
                showCloseIcon
              >
                <DiscordVideoFullScreen
                  onCloseModal={handleCloseModalDiscordVideoFullScreen}
                  url={videoUrl}
                />
              </Modal>
            </>
          ) : null}
          {props.wallPost.descriptionImages && props.wallPost.descriptionImages.length > 0 ? (
            <div className={classes.imagesWallPost} style={{ display: handleShowAdditionalImages() }}>
              <Carousel isRTL={false} itemsToShow={3} pagination={false} showArrows={false}>
                {props.wallPost.descriptionImages.map((item, i) => {
                  return (
                    <div
                      className={classes.descriptionImageWallPost}
                      key={i}
                      style={{
                        backgroundImage: item ? `url(${URL()}${urlDescriptionPhotos}/${item})` : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  );
                })}
              </Carousel>
            </div>
          ) : null}
          <div className={classes.firstPartWallPost}>
            <Grid
              container
              spacing={2}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
              className={classes.hashtagsDate}
            >
              <Grid item xs={6} className={classes.userProfileWallPost}>
                <div className={classes.userCardWallPost}>
                  <div className={classes.userCardImageWallPost}>
                    <div
                      className={classes.authorPhotoWallPost}
                      onClick={() => {
                        history.push(`/profile/${props.wallPost.createdBy}`);
                        dispatch(setSelectedUser(props.wallPost.createdBy));
                      }}
                      style={{
                        backgroundImage:
                          props.creatorInfo?.imageURL && props.creatorInfo?.imageURL.length > 0
                            ? `url(${props.creatorInfo?.imageURL})`
                            : props.creatorImageURL && props.creatorImageURL.length > 0
                            ? `url(${props.creatorImageURL})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                      }}
                    />
                    {props.creatorOnline ? <div className={classes.userOnline} /> : null}
                  </div>
                  <div>
                    <div>
                      <div
                        className={classes.authorNameWallPost}
                        onClick={() => {
                          history.push(`/profile/${props.wallPost.createdBy}`);
                          dispatch(setSelectedUser(props.wallPost.createdBy));
                        }}
                      >
                        {props.creatorInfo?.name || props.creatorName || ""}
                      </div>
                      <div className={classes.authorInfoWallPost}>
                        <div
                          className={classes.authorSlugWallPost}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            history.push(`/profile/${props.wallPost.createdBy}`);
                            dispatch(setSelectedUser(props.wallPost.createdBy));
                          }}
                        >
                          @{props.creatorInfo?.urlSlug || props.creatorSlug || ""}
                        </div>
                        {props.creatorVerified ? (
                          <div className={classes.authorVerifiedWallPost}>
                            <img src={require("assets/icons/verified_outline.png")} alt={"check"} />
                          </div>
                        ) : null}
                        <div className={classes.authorLevelWallPost}>
                          <span>level {props.creatorInfo?.level || props.creatorLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} className={classes.hashtags}>
                {props.wallPost.hashtags && props.wallPost.hashtags.length > 0
                  ? props.wallPost.hashtags.map((hashtag, i) => {
                      return (
                        <div key={i} className={classes.hashtag}>
                          {hashtag}
                        </div>
                      );
                    })
                  : null}
              </Grid>
            </Grid>
            <div style={{ width: "100%" }}>
              <h3 className={classes.nameWallPost}>{props.wallPost.name}</h3>
            </div>

            {props.wallPost.textShort ? (
              <p className={classes.textShort}>{props.wallPost.textShort}</p>
            ) : null}
            {props.wallPost.descriptionArray && props.wallPost.descriptionArray !== [] ? <></> : null}

            <div className={classes.lastRowResponsesLikes}>
              {props.wallPost.comments ? (
                <div className={classes.numResponsesWallPost}>
                  <img src={chatGreyIcon} className={classes.responsesIconWallPost} alt={"chat bubble"} />
                  {props.wallPost.responses && props.wallPost.responses.length > 0
                    ? props.wallPost.responses.length || 0
                    : 0}{" "}
                  comments
                </div>
              ) : (
                <div />
              )}
              <div className={classes.socialsRowPostItem}>
                {props.isListed && (
                  <span onClick={props.handleList}>
                    <img
                      src={require(props.isListed()
                        ? "assets/priviIcons/bookmark-filled.svg"
                        : "assets/priviIcons/bookmark.svg")}
                      alt="bookmark"
                    />
                  </span>
                )}
                <span onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
                  <SvgIcon htmlColor={"white"}>
                    <ShareAltSolid />
                  </SvgIcon>
                </span>
                <Popper
                  open={openShareMenu}
                  anchorEl={anchorShareMenuRef.current}
                  transition
                  disablePortal={false}
                  style={{ position: "inherit", zIndex: 1400 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                        position: "inherit",
                      }}
                    >
                      <Paper className={classes.paper}>
                        <ClickAwayListener onClickAway={handleCloseShareMenu}>
                          <MenuList
                            autoFocusItem={openShareMenu}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDownShareMenu}
                          >
                            <CustomMenuItem onClick={handleOpenShareModal}>
                              <img
                                src={require("assets/icons/butterfly.png")}
                                alt={"spaceship"}
                                style={{ width: 20, height: 20, marginRight: 5 }}
                              />
                              Share on social media
                            </CustomMenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
                {props.isLike && (
                  <span
                    onClick={() => {
                      props.wallPost.likes && props.wallPost.likes.includes(userSelector.id) > 0
                        ? props.dislike()
                        : props.like();
                    }}
                  >
                    <img
                      src={require(props.isLike()
                        ? "assets/priviIcons/like-filled.svg"
                        : "assets/priviIcons/like.svg")}
                      alt={"heart"}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {responses && responses.length > 0 ? (
          <div className={classes.responsesWallPost}>
            {responses && responses.length > 0
              ? responses.map((item, i) => {
                  return <ResponseWallPost key={i} index={i} response={item} />;
                })
              : null}
          </div>
        ) : null}

        <div>
          <LoadingWrapper loading={responseLoader}>
            <div className={classes.addResponseWallPost}>
              <div className={classes.inputResponseWallPost}>
                <InputWithLabelAndTooltip
                  overriedClasses={classes.textFieldResponseWallPost}
                  type="text"
                  inputValue={response}
                  placeHolder="Write a message..."
                  onInputValueChange={e => {
                    let res = e.target.value;
                    setResponse(res);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className={classes.arrowRightBlueResponseWallPost} onClick={makeResponse}>
                <img
                  src={require("assets/icons/send_gray.png")}
                  className={classes.arrowRightBlueWallPost}
                  alt={"send"}
                />
              </div>
            </div>
          </LoadingWrapper>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}, propsAreEqual);

export default WallPostModal;
