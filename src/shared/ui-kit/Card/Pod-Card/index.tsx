import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
  Theme,
  makeStyles,
  createStyles,
  withStyles,
  MenuItem,
} from "@material-ui/core";
import { setSelectedUser } from "store/actions/SelectedUser";
import URL from "shared/functions/getURL";
import "./PodCard.css";
import FractionalizedTypeContent from "./components/FractionalizedType";
import NormalTypeContent from "./components/NormalType";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";
// import { useShareMedia } from "shared/contexts/ShareMediaContext";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    paper: {
      width: 267,
      marginRight: -267,
      marginLeft: -90,
      borderRadius: 10,
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
      position: "inherit",
    },
  })
);

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const PodCard = React.memo((props: any) => {
  // const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();
  const history = useHistory();
  const dispatch = useDispatch();
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const user = useTypedSelector(state => state.user);
  const [pod, setPod] = React.useState<any>(props.pod);

  const classes = useStyles();
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pod.HasPhoto && pod.HasPhoto && pod.Url && pod.Url !== '') {
      setPhotoUrl(`${pod.Url}`);
    } else {
      setPhotoUrl(getRandomImageUrl());
    }
  }, [pod, props.type]);

  const isLike = () => {
    if (pod.Likes) {
      if (pod.Likes.some(like => like.userId === user.id)) {
        return true;
      }
    }

    return false;
  };

  const isBookmarked = () => {
    if (pod.Bookmarks) {
      if (pod.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
        return true;
      }
    }

    return false;
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
    // shareMediaToSocial(pod.id || pod.urlSlug, 'Pod', props.type);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleLikeCard = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...pod };
    itemCopy.userAddress = user.id;
    itemCopy.liked = !isLike();

    let path = "/pod/like";
    if (props.type === "Digital-NFT") {
      path = "/mediaPod/like";
    }
    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.liked) {
            if (itemCopy.Likes) {
              if (!itemCopy.Likes.some(like => like.userId === user.id)) {
                itemCopy.Likes.push({ userId: user.id, date: new Date() });
              }
            } else itemCopy.Likes = [{ userId: user.id, date: new Date() }];
          } else {
            if (itemCopy.Likes) {
              itemCopy.Likes = itemCopy.Likes.filter(item => item.userId !== user.id);
            }
          }

          setPod(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleBookmark = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...pod };
    itemCopy.userAddress = user.id;
    itemCopy.bookmarked = !isBookmarked();

    let path = "/pod/bookmark";
    if (props.type === "Digital-NFT") {
      path = "/mediaPod/bookmark";
    }
    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.bookmarked) {
            if (itemCopy.Bookmarks) {
              if (!itemCopy.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
                itemCopy.Bookmarks.push({ userId: user.id, date: new Date() });
              }
            } else itemCopy.Bookmarks = [{ userId: user.id, date: new Date() }];
          } else {
            if (itemCopy.Bookmarks) {
              itemCopy.Bookmarks = itemCopy.Bookmarks.filter(item => item.userId !== user.id);
            }
          }

          setPod(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleOpenQRCodeModal = () => {
    const link = props.type.includes("NFT")
      ? `pods/MediaNFT/${pod.PodAddress}`
      : `pods/FT/${pod.PodAddress}`;
    // shareMediaWithQrCode(pod.id || pod.urlSlug, link);
  };

  return (
    <div className={`pod-card ${pod.Fractionalized ? "pod-fractionalized-card" : ""}`}>
      <div className="cursor-pointer">
        <div
          className="pod-card-image"
          style={
            pod.dimensions
              ? {
                height: 0,
                paddingBottom: `${(pod.dimensions.height / pod.dimensions.width) * 100}%`,
              }
              : {
                height: "180px",
              }
          }
        >
          <div
            className={"aspect-ratio-wrapper"}
            onClick={() => {
              if (!props.disableClick) {
                if (props.type === "Digital-NFT") {
                  history.push(`/pods/MediaNFT/${pod.PodAddress}`);
                } else {
                  if (props.type.includes("NFT")) {
                    history.push(`/pods/MediaNFT/${pod.PodAddress}`);
                  } else {
                    history.push(`/pods/FT/${pod.PodAddress}`);
                  }
                }
              }
            }}
          >
            {pod.HasPhoto && pod.HasPhoto === true ? (
              <img src={photoUrl}
                className="pod-photo"
                alt="pod_photo" />
            ) : (
              <div
                className="pod-photo"
                style={{
                  backgroundImage: "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}
          </div>
          {pod.CreatorImageURL ? (
            <div
              className="avatar"
              style={{
                backgroundImage: pod.CreatorImageURL ? `url(${pod.CreatorImageURL})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                if (pod.Creator) {
                  history.push(`/profile/${pod.Creator}`);
                  dispatch(setSelectedUser(pod.Creator));
                }
              }}
            />
          ) : (
            <div className="avatar"
              onClick={() => {
                if (pod.Creator) {
                  history.push(`/profile/${pod.Creator}`);
                  dispatch(setSelectedUser(pod.Creator));
                }
              }}><SvgIcon><UserSolid /></SvgIcon></div>
          )}
          <div className="social-actions">
            <span className="clickable" onClick={handleBookmark}>
              <img
                src={require(isBookmarked()
                  ? "assets/priviIcons/bookmark-filled.svg"
                  : "assets/priviIcons/bookmark.svg")}
                alt="bookmark"
              />
            </span>
            <span className="clickable" onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
              <img src={require("assets/icons/share.svg")} alt="share" />
            </span>
            {openShareMenu && (
              <Popper
                open={openShareMenu}
                anchorEl={anchorShareMenuRef.current}
                transition
                disablePortal={false}
                style={{ position: "inherit" }}
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
                          <CustomMenuItem onClick={handleOpenQRCodeModal}>
                            <img
                              src={require("assets/icons/qrcode_small.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share With QR Code
                          </CustomMenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
            <span onClick={handleLikeCard} className="clickable">
              <img
                src={require(isLike() ? "assets/priviIcons/heart_filled.png" : "assets/priviIcons/heart.png")}
                alt={"heart"}
              />
            </span>
          </div>
          <div className="pod-status">{pod.Status}</div>
        </div>
      </div>
      {pod.Fractionalized ? (
        <FractionalizedTypeContent pod={pod} />
      ) : (
        <NormalTypeContent pod={pod} disabledClick={props.disableClick} type={props.type} />
      )}
    </div>
  );
});

export default PodCard;

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
};
