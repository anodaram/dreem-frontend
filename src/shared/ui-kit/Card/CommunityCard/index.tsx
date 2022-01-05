import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import URL from "shared/functions/getURL";
import axios from "axios";
import { useTypedSelector } from "store/reducers/Reducer";
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  withStyles,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
// import { useShareMedia } from "shared/contexts/ShareMediaContext";
import "./CommunityCard.css";
import { PrimaryButton } from "shared/ui-kit";
import JoinUpCommunityModal from "shared/ui-kit/Modal/Modals/JoinUpCommunity";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import { FinalStepModal, WalletSignatureRequestModal } from "shared/ui-kit/display/elements";

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

const CommunityCard = React.memo((props: any) => {
  const history = useHistory();
  const classes = useStyles();

  const user = useTypedSelector(state => state.user);
  //const [comments, setComments] = useState<number>(0);
  const [openShareMenu, setOpenShareMenu] = useState(false);

  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);

  const [community, setCommunity] = React.useState<any>(props.community);

  // const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();
  const [openJoinUpModal, setOpenJoinUpModal] = useState<boolean>(false);
  const [openChooseWalletModal, setOpenChooseWalletModal] = useState(false);
  const [openFinalStepModal, setOpenFinalStepModal] = useState(false);
  const [openWalletSignatureRequestModal, setOpenWalletSignatureRequestModal] = useState(false);

  const isLike = () => {
    if (community.Likes) {
      if (community.Likes.some(like => like.userId === user.id)) {
        return true;
      }
    }

    return false;
  };

  const handleJoin = () => {
    if (community.EntryConditions) {
      if (community.EntryConditions !== "By request") {
        setOpenJoinUpModal(true);
      } else {
        requestJoin();
      }
    } else {
      joinToCommunity();
    }
  };

  const requestJoin = () => {
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };

    axios.post(`${URL()}/community/requestJoin`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setOpenJoinUpModal(true);
      } else {
      }
    });
  };

  const joinToCommunity = () => {
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };
    // join
    if (community.arrayMembersId && community.arrayMembersId.includes(user.id)) {
      axios.post(`${URL()}/community/leave`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          const itemCopy = { ...community };
          itemCopy.arrayMembersId = itemCopy.arrayMembersId
            ? itemCopy.arrayMembersId.filter(member => member.id !== user.id)
            : [];

          itemCopy.Members = itemCopy.Members.filer(item => item.id !== user.id);

          setCommunity(itemCopy);
          setOpenJoinUpModal(true);
        } else {
        }
      });
    }
    // unjoin
    else {
      axios.post(`${URL()}/community/join`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          const itemCopy = { ...community };
          itemCopy.arrayMembersId = itemCopy.arrayMembersId ?? [];
          itemCopy.arrayMembersId = [...itemCopy.arrayMembersId, user.id];

          itemCopy.Members = [...(itemCopy.Members || []), { date: new Date().getTime(), id: user.id }];

          setCommunity(itemCopy);
          setOpenJoinUpModal(true);
        } else {
        }
      });
    }
  };

  const handleLikeCard = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...community };
    itemCopy.userAddress = user.id;
    itemCopy.liked = !isLike();

    let path = `/community/like`;
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

          setCommunity(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const isBookmarked = () => {
    if (community.Bookmarks) {
      if (community.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
        return true;
      }
    }

    return false;
  };

  const handleBookmark = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...community };
    itemCopy.userAddress = user.id;
    itemCopy.bookmarked = !isBookmarked();

    let path = `/community/bookmark`;
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

          setCommunity(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenShareModal = e => {
    e.stopPropagation();
    e.preventDefault();

    // shareMediaToSocial(community.id, "Community");
  };

  const handleOpenQRCodeModal = () => {
    // shareMediaWithQrCode(community?.Name, `communities/${community.Name.replace(/\s/g, "")}`);
  };
  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const CustomMenuItem = withStyles({
    root: {
      fontSize: "14px",
      fontFamily: "Agrandir",
    },
  })(MenuItem);

  return (
    <>
      <div
        className={
          props.trending ? "community-card trending-community-card" : "community-card regular-community-card"
        }
      >
        <div
          className="community-card-cover"
          style={
            community.dimensions && !props.trending
              ? {
                height: 0,
                paddingBottom: `${(community.dimensions.height / community.dimensions.width) * 100}%`,
              }
              : {
                height: "200px",
              }
          }
          onClick={() => {
            history.push(`/communities/${community.CommunityAddress}`);
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          <div className={"aspect-ratio-wrapper"}>
            <img
              src={
                community.HasPhoto !== undefined && community.HasPhoto === true
                  ? `${community.Url}?${Date.now()}`
                  : "none"
              }
              alt="community card cover"
            />
            <div className="community-card-investing-button">Investing</div>
          </div>
        </div>
        <div className="community-card-content">
          <div className="community-card-user-box">
            <div className="community-card-members">
              {community.Members?.slice(0, 3).map((member, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      backgroundImage:
                        member.imageURL && member.imageURL.length > 0
                          ? `url(${member.imageURL})`
                          : `url(${require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="community-card-user-avatar"
                  />
                );
              })}
              {(!community.Members || community.Members?.length === 0) && (
                <div
                  style={{
                    backgroundImage:
                      community.userData && community.userData.imageURL.length > 0
                        ? `url(${community.userData.imageURL})`
                        : `url(${require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="community-card-user-avatar"
                />
              )}
              {community.Members?.length > 3 && (
                <span className="community-card-member-numbers">+{community.Members?.length - 3}</span>
              )}
            </div>
            <div className="community-favourite-buttons">
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
              <span onClick={handleLikeCard} className="clickable">
                <img
                  src={require(isLike()
                    ? "assets/priviIcons/heart_filled.png"
                    : "assets/priviIcons/heart.png")}
                  alt={"heart"}
                />
              </span>
            </div>
          </div>
          <div className="community-card-main-content">
            <div style={{ overflow: "hidden" }}>
              <div className="community-name">{community.Name}</div>
            </div>
            <div className="community-card-info">
              <div className="community-card-info-item">
                <div className="community-card-info-item-title">Members</div>
                <div className="community-card-info-item-value">
                  {community.arrayMembersId ? community.arrayMembersId.length : "0"}
                </div>
              </div>
              <div className="community-card-info-item">
                <div className="community-card-info-item-title">Views</div>
                <div className="community-card-info-item-value">
                  {community && community.TotalViews ? community.TotalViews : 0}
                </div>
              </div>
              <div className="community-card-info-item">
                <div className="community-card-info-item-title">Messages</div>
                <div className="community-card-info-item-value">
                  {community.conversationsMonth
                    ? `${community.conversationsMonth > 1000000
                      ? (community.conversationsMonth / 1000000).toFixed(1)
                      : community.conversationsMonth > 1000
                        ? (community.conversationsMonth / 1000).toFixed(1)
                        : community.conversationsMonth
                    } ${community.conversationsMonth > 1000000
                      ? "M"
                      : community.conversationsMonth > 1000
                        ? "K"
                        : ""
                    }`
                    : "0"}
                </div>
              </div>
            </div>
            <div className="community-card-info-item">
              <div className="community-card-info-item-title">Monthly Growth</div>
              <div className="community-card-info-item-value">
                {community.membersGrowth ? community.memberGrowth : "0"}
              </div>
            </div>
            {!(user && community.arrayMembersId && community.arrayMembersId.includes(user.id)) && (
              <div className="community-card-info-item">
                <div className="community-card-buttons">
                  <>
                    <PrimaryButton size="small" onClick={() => handleJoin()}>
                      Join up
                    </PrimaryButton>
                    <PrimaryButton size="small">Follow</PrimaryButton>
                  </>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {openJoinUpModal && (
        <JoinUpCommunityModal
          open={openJoinUpModal}
          joinType={
            community.EntryConditions
              ? community.EntryConditions === "By request"
                ? 1
                : community.arrayMembersId && community.arrayMembersId.includes(user.id)
                  ? 0
                  : 2
              : 0
          }
          onCloseDialog={() => {
            setOpenJoinUpModal(false);
            if (community.EntryConditions && community.EntryConditions !== "By request") {
              setOpenChooseWalletModal(true);
            }
          }}
        />
      )}
      {openChooseWalletModal && (
        <ChooseWalletModal
          isOpen={openChooseWalletModal}
          onClose={() => {
            setOpenChooseWalletModal(false);
          }}
          onAccept={() => {
            setOpenChooseWalletModal(false);
            setOpenFinalStepModal(true);
            setTimeout(() => {
              setOpenFinalStepModal(false);
              setOpenWalletSignatureRequestModal(true);
            }, 2000);
          }}
        />
      )}
      {openFinalStepModal && (
        <FinalStepModal
          isOpen={openFinalStepModal}
          onClose={() => {
            setOpenFinalStepModal(false);
          }}
        />
      )}
      {openWalletSignatureRequestModal && (
        <WalletSignatureRequestModal
          isOpen={openWalletSignatureRequestModal}
          onClose={() => {
            setOpenWalletSignatureRequestModal(false);
          }}
          onPostProcess={joinToCommunity}
        />
      )}
    </>
  );
});

export default CommunityCard;
