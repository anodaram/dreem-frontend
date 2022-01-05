import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import axios from "axios";
import { TwitterShareButton } from "react-share";

import { makeStyles } from "@material-ui/core/styles";

import "./WallItem.css";
import WallPostModal from "shared/ui-kit/Modal/Modals/WallPostModal";
import URL from "../../functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { LoadingWrapper } from "../Hocs";
import { SuperFollowerToggle } from "shared/ui-kit/Page-components/SuperFollowerToggle";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ThumbsUpSolid } from "assets/icons/thumbs-up-solid.svg";
import { ReactComponent as ThumbsDownSolid } from "assets/icons/thumbs-down-solid.svg";
import { ReactComponent as MoreHorizIcon } from "assets/icons/ellipsis-h-solid.svg";

const useStyles = makeStyles(() => ({
  shareButton: {
    height: "auto",
  },
  shareImg: {
    width: "50px !important",
    height: "50px !important",
    verticalAlign: "middle",
  },
}));
const arePropsEqual = (prevProps, currProps) => {
  return prevProps.item === currProps.item && prevProps.type === currProps.type;
};

const twitterIcon = require("assets/icons/socialTwitter.svg");

const WallItem = React.memo((props: any) => {
  const classes = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [item, setItem] = useState<any>({});
  const [url, setUrl] = useState<string>("");
  const [itemIdLabel, setItemIdLabel] = useState<string>("");
  const [wallPostIdLabel, setWallPostIdLabel] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const [ownUserWall, setOwnUserWall] = useState<any>(false);
  const [onlyTitle, setOnlyTitle] = useState<any>(false);
  const [readMore, setReadMore] = useState<any>(false);
  const descRef = useRef<HTMLHeadingElement>(null);
  const [descHeight, setDescHeight] = useState<number>(0);

  const cardRef = useRef<HTMLImageElement>(null);
  const [photoHeight, setPhotoHeight] = useState<number>(1);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    if (cardRef.current) {
      setPhotoHeight(cardRef.current.offsetHeight);
    }
  }, [props.item, props.item.dimensions, props.imageUrl]);

  const [openModalWallPost, setOpenModalWallPost] = useState<boolean>(false);

  const handleOpenModalWallPost = () => {
    setOpenModalWallPost(true);
  };
  const handleCloseModalWallPost = () => {
    props.handleRefresh();
    setOpenModalWallPost(false);
  };

  useEffect(() => {
    const creator = users.find(u => u.id === props.item.createdBy);
    let i = { ...props.item };
    if (creator) {
      i.urlSlug = creator.urlSlug;
      i.level = creator.level;
    }
    setItem(i);
    if (props.type && props.type === "PodPost") {
      setUrl(`${URL()}/pod/wall/`);
      setItemIdLabel("podId");
      setWallPostIdLabel("podWallPostId");
    } else if (props.type && props.type === "PodNFTPost") {
      setUrl(`${URL()}/pod/NFT/wall/`);
      setItemIdLabel("podId");
      setWallPostIdLabel("podNFTWallPostId");
    } else if (props.type && props.type === "MediaPodPost") {
      setUrl(`${URL()}/mediaPod/wall/`);
      setItemIdLabel("podId");
      setWallPostIdLabel("mediaPodWallPostId");
    } else if (props.type && props.type === "CreditPost") {
      setUrl(`${URL()}/priviCredit/wall/`);
      setItemIdLabel("creditPoolId");
      setWallPostIdLabel("creditWallPostId");
    } else if (props.type && props.type === "InsurancePost") {
      setUrl(`${URL()}/insurance/wall/`);
      setItemIdLabel("insuranceId");
      setWallPostIdLabel("insuranceWallPostId");
    } else if (props.type && props.type === "CommunityPost") {
      setUrl(`${URL()}/community/wall/`);
      setItemIdLabel("communityId");
      setWallPostIdLabel("communityWallPostId");
    } else if (props.type && props.type === "UserPost") {
      setUrl(`${URL()}/user/wall/`);
      setItemIdLabel("creatorId");
      setWallPostIdLabel("userWallPostId");
    }
    //eslint-disable react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (item && !item.userName && !item.userImageURL && item.createdBy) {
      if (users && users.length > 0) {
        users.forEach(user => {
          if (user.id === item.createdBy) {
            const newItem = { ...item };

            newItem.userImageURL = user.imageURL;
            newItem.userName = user.name;

            setItem(newItem);
            return;
          }
        });
      }
    }
    //eslint-disable react-hooks/exhaustive-deps
  }, [users, item]);

  useEffect(() => {
    if (props.type && props.type === "UserPost") {
      let pathName = window.location.href;
      let idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "" + localStorage.getItem("userId");
      if (idUrl) {
        axios
          .get(`${URL()}/user/getIdFromSlug/${idUrl}/user`)
          .then(response => {
            if (response.data.success) {
              const id = response.data.data.id;
              if (userSelector.id === id) {
                setOwnUserWall(true);
              } else {
                setOwnUserWall(false);
              }
            }
          })
          .catch(error => {
            console.log(error);
            setOwnUserWall(false);
          });
      }

      if (
        item &&
        item.name &&
        item.name !== "" &&
        item.name !== ` ` &&
        (!item.descriptionArray ||
          (item.descriptionArray &&
            (item.descriptionArray[0] === "" || item.descriptionArray[0] === undefined))) &&
        (item.textShort === "" || item.textShort === ` ` || !item.textShort) &&
        item.hasPhoto === false &&
        ((item.descriptionImages && item.descriptionImages.length === 0) || !item.descriptionImages)
      ) {
        setOnlyTitle(true);
      }
    }

    if (descRef.current && item) {
      setDescHeight(descRef.current.offsetHeight);
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, [item]);

  //resize desc
  useEffect(() => {
    const handleResize = () => {
      if (descRef.current && item) {
        setDescHeight(descRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    //eslint-disable react-hooks/exhaustive-deps
  }, [descRef, item]);

  const updatePinPost = bool => {
    setIsDataLoading(true);
    axios
      .post(`${url}pinPost`, {
        wallPostId: item.id,
        pinned: bool,
      })
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          setItem(resp.data);
          props.handleRefresh();
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
        // alert("Error update pin state");
      });
  };

  const removePost = () => {
    let data: any = {
      userId: userSelector.id,
      postId: props.item.id,
    };
    data[itemIdLabel] = props.itemTypeId;
    setIsDataLoading(true);
    axios
      .post(`${url}deletePost`, data)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          setItem(resp.data);
          props.handleRefresh();
        }
        setIsDataLoading(true);
      })
      .catch(error => {
        console.log(error);
        alert("Error update pin state");
        setIsDataLoading(true);
      });
  };

  const likePost = (item: any) => {
    //console.log(wallPostIdLabel);
    let data: any = {
      userId: userSelector.id,
      userName: userSelector.firstName,
    };
    data[wallPostIdLabel] = props.item.id;
    setIsDataLoading(true);
    axios
      .post(`${url}likePost`, data)
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let itemCopy = { ...item };
          itemCopy.likes = data.likes;
          itemCopy.dislikes = data.dislikes;
          itemCopy.numLikes = data.numLikes;
          itemCopy.numDislikes = data.numDislikes;
          setItem(itemCopy);
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
      });
  };

  const dislikePost = (item: any) => {
    let data: any = {
      userId: userSelector.id,
      userName: userSelector.firstName,
    };
    data[wallPostIdLabel] = props.item.id;
    setIsDataLoading(true);
    axios
      .post(`${url}dislikePost`, data)
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let itemCopy = { ...item };
          itemCopy.likes = data.likes;
          itemCopy.dislikes = data.dislikes;
          itemCopy.numLikes = data.numLikes;
          itemCopy.numDislikes = data.numDislikes;
          setItem(itemCopy);
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
      });
  };

  if (item)
    if (props.type && props.type !== "UserPost") {
      return (
        <div
          className={classnames(
            item.favourite || item.pinned
              ? "wall-item wall-item-favourite"
              : props.item.hasPhoto
                ? "wall-item wall-item-with-image"
                : "wall-item"
          )}
        >
          {props.imageUrl && props.item.hasPhoto ? (
            <div
              className="image"
              style={{
                backgroundImage: props.imageUrl && props.imageUrl !== "" ? `url(${props.imageUrl})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={handleOpenModalWallPost}
            />
          ) : null}

          {props.imageUrl && props.item.hasPhoto ? (
            <div
              className="user-image"
              style={{
                backgroundImage:
                  item.userImageURL && item.userImageURL.length > 0 ? `url(${item.userImageURL})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "30px",
              }}
            />
          ) : null}

          <LoadingWrapper loading={isDataLoading}>
            <>
              <div className="top-items" onClick={handleOpenModalWallPost}>
                {props.admin ? (
                  <div className="menuWallItem">
                    <div onMouseEnter={() => setShowMenu(true)}>
                      <MoreHorizIcon />
                    </div>
                  </div>
                ) : null}
                {showMenu ? (
                  <div
                    className="showMenuWallItem"
                    onMouseLeave={() => setShowMenu(false)}
                    style={
                      showMenu
                        ? {
                          opacity: 1,
                        }
                        : {
                          opacity: 0,
                        }
                    }
                  >
                    <div className="threeDotsMenuWallItem">
                      <MoreHorizIcon />
                    </div>

                    {item.pinned ? (
                      <div
                        className="labelMenuWallItem"
                        onClick={() => {
                          updatePinPost(false);
                        }}
                      >
                        Remove from pinned
                      </div>
                    ) : (
                      <div
                        className="labelMenuWallItem"
                        onClick={() => {
                          updatePinPost(true);
                        }}
                      >
                        Pin this post
                      </div>
                    )}
                    <div
                      className="labelMenuWallItem"
                      onClick={() => {
                        removePost();
                      }}
                    >
                      Delete
                    </div>
                  </div>
                ) : null}

                <h3 onClick={handleOpenModalWallPost}>{item.name ? item.name : ""}</h3>
                {item.textShort ? <p>{item.textShort}</p> : null}
              </div>
              <div className="bottom-items" onClick={handleOpenModalWallPost}>
                {!props.imageUrl || props.imageUrl === "" || !props.item.hasPhoto ? (
                  <div
                    className="user-image"
                    style={{
                      backgroundImage:
                        item.userImageURL && item.userImageURL.length > 0
                          ? `url(${item.userImageURL})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "30px",
                    }}
                  />
                ) : null}
                <span>
                  <img
                    src={
                      item.favourite || item.pinned
                        ? require("assets/icons/message_darkblue.png")
                        : require("assets/icons/message_gray.png")
                    }
                    alt={"responses"}
                  />
                  <p>
                    {item.responses && item.responses.length
                      ? `${item.responses.length} Responses`
                      : `0 Responses`}
                  </p>
                </span>
              </div>
            </>
          </LoadingWrapper>
          <WallPostModal
            open={openModalWallPost}
            onClose={handleCloseModalWallPost}
            wallPost={item}
            creatorImageURL={item.userImageURL || ``}
            creatorName={item.userName || ``}
            creatorSlug={item.urlSlug || ``}
            creatorLevel={item.level || ``}
            type={props.type}
            like={() => likePost(item)}
            dislike={() => dislikePost(item)}
          />
        </div>
      );
    } else
      return (
        <div
          style={{ zIndex: Math.trunc((1 / (props.index + 1)) * 100) }}
          className={classnames(
            props.imageUrl && props.imageUrl !== ""
              ? "wall-item wall-item-with-image profile-wall-item"
              : "wall-item profile-wall-item"
          )}
        >
          <LoadingWrapper loading={isDataLoading}>
            <>
              <div className="top-items">
                <div>
                  <div
                    className="user-image"
                    style={{
                      backgroundImage:
                        item.userImageURL && item.userImageURL.length > 0
                          ? `url(${item.userImageURL})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "30px",
                    }}
                  />
                  <p>
                    {userSelector.id !== item.createdBy ? <span>{item.userName}</span> : "You"}
                    {item.name === ` ` && item.textShort === ` `
                      ? userSelector.id !== item.createdBy
                        ? ` sent `
                        : ` posted `
                      : ` wrote on `}
                    {ownUserWall
                      ? item.name === ` ` && item.textShort === ` `
                        ? userSelector.id !== item.createdBy
                          ? "you"
                          : ""
                        : "your"
                      : ""}
                    <span>{!ownUserWall ? `${item.userName}` : ""}</span>
                    {item.name === ` ` && item.textShort === ` `
                      ? ` an image`
                      : `${!ownUserWall ? "'s" : ""} wall`}
                  </p>
                </div>

                {showMenu ? (
                  <div
                    className="showMenuWallItem"
                    onMouseLeave={() => setShowMenu(false)}
                    style={
                      showMenu
                        ? {
                          opacity: 1,
                          marginLeft: ownUserWall ? "calc(100% - 140px)" : "calc(100% - 100px)",
                        }
                        : {
                          opacity: 0,
                        }
                    }
                  >
                    <img
                      className="threeDotsMenuWallItem"
                      src={require(item.favourite
                        ? `assets/icons/three_dots_white.png`
                        : `assets/icons/three_dots_darkblue.png`)}
                      alt={"options"}
                    />

                    {ownUserWall ? (
                      item.pinned ? (
                        <div
                          className="labelMenuWallItem"
                          onClick={() => {
                            updatePinPost(false);
                          }}
                        >
                          Remove from pinned
                        </div>
                      ) : (
                        <div
                          className="labelMenuWallItem"
                          onClick={() => {
                            updatePinPost(true);
                          }}
                        >
                          Pin this post
                        </div>
                      )
                    ) : null}
                    <div
                      className="labelMenuWallItem"
                      onClick={() => {
                        removePost();
                      }}
                    >
                      Delete
                    </div>
                  </div>
                ) : null}
                {props.admin || ownUserWall ? (
                  <div className="menuWallItem">
                    <div onClick={() => setShowMenu(true)} className="cursor-pointer">
                      <div className="threeDotsMenuWallItem">
                        <img
                          src={require(item.favourite
                            ? `assets/icons/three_dots_white.png`
                            : `assets/icons/three_dots_darkblue.png`)}
                          alt={"options"}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {!onlyTitle ? (
                <div className="wall-item-content" onClick={handleOpenModalWallPost}>
                  {item.name && item.name !== ` ` ? <h3>{item.name}</h3> : null}
                  {item.textShort && item.textShort !== ` ` ? (
                    <div className="desc">
                      <p style={{ maxHeight: readMore ? "none" : "140px" }} ref={descRef}>
                        {item.textShort}
                      </p>
                      {descHeight >= 140 && !readMore ? (
                        <button
                          className="read-more"
                          onClick={() => {
                            setReadMore(true);
                          }}
                        >
                          ... Read More
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="only-title" onClick={handleOpenModalWallPost}>
                  <h3>{item.name}</h3>
                </div>
              )}

              <div
                className={props.item.dimensions ? "aspect-ratio-wrapper" : "wrapper"}
                style={{
                  height: props.item.dimensions ? 0 : "auto",
                  paddingBottom: props.item.dimensions ? `${photoHeight}px` : 0,
                }}
                onClick={handleOpenModalWallPost}
              >
                {!onlyTitle && props.imageUrl && props.imageUrl !== "" ? (
                  <img
                    ref={cardRef}
                    src={props.imageUrl}
                    className="image"
                    alt={"wall"}
                    style={props.item.dimensions ? { height: "auto" } : { height: "300px" }}
                  />
                ) : null}
              </div>

              <div className="bottom-items">
                <div>
                  <div className="post-type">
                    <img
                      src={
                        item.name === ` ` && item.textShort === ` `
                          ? require("assets/icons/camera_darkblue.png")
                          : require("assets/icons/paragraph_darkblue.png")
                      }
                      alt={item.description && item.description.length > 0 ? "text" : "picture"}
                    />
                  </div>
                  <div className="likesRowPostItem">
                    {item.likes && item.likes.findIndex(user => user === userSelector.id) !== -1 ? (
                      <div className="iconCenterFlex">
                        <SvgIcon htmlColor={"green"}>
                          <ThumbsUpSolid />
                        </SvgIcon>
                        &nbsp;{item.numLikes || 0}
                      </div>
                    ) : (
                      <div className="iconCenterFlex" onClick={() => likePost(item)}>
                        <SvgIcon>
                          <ThumbsUpSolid />
                        </SvgIcon>
                        &nbsp;{item.numLikes || 0}
                      </div>
                    )}
                    &nbsp;&nbsp;&nbsp;
                    {item.dislikes && item.dislikes.findIndex(user => user === userSelector.id) !== -1 ? (
                      <div className="iconCenterFlex">
                        <SvgIcon htmlColor={"red"}>
                          <ThumbsDownSolid />
                        </SvgIcon>
                        &nbsp;{item.numDislikes || 0}
                      </div>
                    ) : (
                      <div className="iconCenterFlex" onClick={() => dislikePost(item)}>
                        <SvgIcon>
                          <ThumbsDownSolid />
                        </SvgIcon>
                        &nbsp;{item.numDislikes || 0}
                      </div>
                    )}
                  </div>

                  <TwitterShareButton
                    className={classes.shareButton}
                    title={item.name + "\n" + item.textShort + "\n\n"}
                    url={window.location.href}
                  >
                    <img className={classes.shareImg} src={twitterIcon} alt="twitter" />
                  </TwitterShareButton>
                  <SuperFollowerToggle wallPostId={item.id} onlySuperFollowers={item.OnlySuperFollowers} />
                </div>

                <span>
                  {item.comments ? (
                    <p>
                      {item.responses && item.responses.length
                        ? `${item.responses.length} comment${item.responses.length > 1 ? "s" : ""}`
                        : `0 comments`}
                    </p>
                  ) : null}
                </span>
              </div>
            </>
          </LoadingWrapper>
          <WallPostModal
            open={openModalWallPost}
            onClose={handleCloseModalWallPost}
            pod={props.pod}
            wallPost={item}
            creatorImageURL={props.item.userImageURL || ``}
            creatorName={props.item.userName || ``}
            creatorSlug={userSelector.urlSlug || ``}
            creatorLevel={userSelector.level || ``}
            type={props.type}
            like={() => likePost(item)}
            dislike={() => dislikePost(item)}
          />
        </div>
      );
  else return null;
}, arePropsEqual);

export default WallItem;
