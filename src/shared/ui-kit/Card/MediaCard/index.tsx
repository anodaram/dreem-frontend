import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { RootState } from "store/reducers/Reducer";
import "./MediaCard.css";
// import { useStreaming } from "shared/contexts/StreamingContext";
import MainPageContext from "shared/contexts/MediaPageContext";
import { useAuth } from "shared/contexts/AuthContext";
import CreateFraction from "./components/Fractionalise/CreateFraction";
import { PrimaryButton } from "shared/ui-kit";
import MediaDetailsModal from "shared/ui-kit/Modal/Modals/MediaDetailsModal";
import { parsePrice } from "shared/helpers/utils";
import { StreamingType } from "shared/services/API/StreamingAPI";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CircleSolid } from "assets/icons/circle-solid.svg";

const arePropsEqual = (prevProps, currProps) => prevProps.media === currProps.media;

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

type MediaCardProps = {
  media: any;
  triggerPlaylists?: boolean;
  dimensions?: {
    width: number;
    height: number;
  };
  showDetailsModal?: boolean;
};

const MediaCard: React.FunctionComponent<MediaCardProps> = React.memo(props => {
  const user = useSelector((state: RootState) => state.user);
  const history = useHistory();
  const location = useLocation();
  const { id }: { id: string } = useParams();
  //store
  const { isSignedin } = useAuth();
  // const { enterRoom } = useStreaming();
  const { selectedMedia, setSelectedMedia, setOpen } = useContext(MainPageContext);

  //hooks
  const [media, setMedia] = useState<any>(props.media);
  const [openFractionModal, setOpenFractionModal] = useState<boolean>(false);
  const [openMediaModal, setOpenMediaModal] = useState<boolean>(false);
  const handleOpenFractionModal = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenFractionModal(true);
  };
  const handleCloseFractionModal = () => {
    setOpenFractionModal(false);
  };

  const handleOpenMediaModal = e => {
    if (props.showDetailsModal) {
      setOpenMediaModal(true);
    } else {
      displayMediaInfo();
    }
  };
  const handleCloseMediaModal = () => {
    setOpenMediaModal(false);
  };

  // useEffect(() => {
  //   console.log('media', media);
  // }, [])

  const displayMediaInfo = () => {
    // if (media.Fraction) {
    //   history.push(`/fractionalisedMedia/${media.MediaSymbol.replace(/\s/g, "")}`);
    // }
    // if (!isSignedin || media.ownedMedia || media.likedMedia || media.curatedMedia) return;

    if (media && !media.eth) {
      // if (!props.media.mediaProfile && !props.media.link) {
      if ([MediaType.LiveVideo, MediaType.LiveAudio].includes(media.Type)) {
        // enterRoom({
        //   streamingId: props.media.id,
        //   type: media.Type === MediaType.LiveAudio ? StreamingType.Audio : StreamingType.Video,
        // });
        return;
      }
      if (media.Type === MediaType.Audio) {
        setSelectedMedia(media);
        setOpen(MediaType.Audio);
      } else if (media.Type === MediaType.Video) {
        setSelectedMedia(media);
        setOpen(MediaType.Video);
      } else if (media.Type === MediaType.DigitalArt) {
        setSelectedMedia(media);
        setOpen(MediaType.DigitalArt);
      } else if (media.Type === MediaType.BlogSnap) {
        setSelectedMedia(media);
        setOpen(MediaType.BlogSnap);
      } else if (media.Type === MediaType.Blog) {
        setSelectedMedia(media);
        setOpen(MediaType.Blog);
      } else {
        setOpen(null);
        if (selectedMedia !== media) {
          setSelectedMedia(media);
        }
      }
      if (media.MediaSymbol && !media.Fraction)
        history.push(`/media/${media.MediaSymbol.replace(/\s/g, "")}`);
    } else if (media && media.eth) {
      if (media.type === MediaType.Video) {
        setSelectedMedia(media);
        setOpen(MediaType.Video);
      } else if (media.type === MediaType.DigitalArt) {
        setSelectedMedia(media);
        setOpen(MediaType.DigitalArt);
      } else if (media.type === MediaType.Blog) {
        setSelectedMedia(media);
        setOpen(MediaType.Blog);
      } else if (media.type === MediaType.BlogSnap) {
        setSelectedMedia(media);
        setOpen(MediaType.BlogSnap);
      } else {
        setOpen(null);
        if (selectedMedia !== media) {
          setSelectedMedia(media);
        }
      }

      if (media.id)
        history.push({
          pathname: `/media/${media.id}`,
          state: { blockchainTag: media.tag },
        });
    }
  };

  const isFractionInOwnerProfile = React.useMemo(() => {
    if (!media.Fraction || isNaN(media.Fraction.Fraction)) return false;
    let routeName = location.pathname;
    if (!routeName || !routeName.includes("/profile")) return false;
    if (id && media.CreatorId === id) return true;
    if (media.CreatorId === user.id) return true;
    return false;
  }, [id, location.pathname, media.CreatorId, media.Fraction, user.id]);

  return (
    <React.Fragment>
      <div className="media-card" onClick={handleOpenMediaModal}>
        <div
          className="card-header cursor-pointer"
          style={
            props.dimensions
              ? {
                height: 0,
                paddingBottom: `${(props.dimensions.height / props.dimensions.width) * 100}%`,
              }
              : {
                height: "200px",
              }
          }
        >
          <div className={"aspect-ratio-wrapper"}>
            <div className="gradient">
              <div className="top-tags">
                {(media.Type === MediaType.LiveAudio &&
                  new Date(media.Date).getTime() - new Date().getTime() >= 0) ||
                  (media.Type === MediaType.LiveVideo &&
                    new Date(media.StartedTime).getTime() - new Date().getTime() >= 0) ? (
                  <div className="live">
                    <span>live now</span> <SvgIcon><CircleSolid /></SvgIcon>
                  </div>
                ) : null}

                {media.Private ? <div className="limited">Private</div> : null}
                {media.LimitedEdition ? <div className="limited">Exclusive edition</div> : null}
                {media.Fraction ? <div className="limited">Fractionalised</div> : null}
              </div>
            </div>
            {!media.eth ? (
              (media.Type === MediaType.Audio ||
                media.Type === MediaType.Video ||
                media.Type === MediaType.LiveAudio ||
                media.Type === MediaType.LiveVideo ||
                media.Type === MediaType.Blog ||
                media.Type === MediaType.BlogSnap) &&
                media.HasPhoto ? (
                <img src={`${media.UrlMainPhoto}`} alt={media.MediaSymbol} />
              ) : media.Type === MediaType.DigitalArt ? (
                <img src={`${media.Url}`} alt={media.MediaSymbol} />
              ) : null
            ) : null}
          </div>
        </div>

        {/*------------- CREATORS DATA -------------*/}
        <div className="content">
          <div className="artists-row">
            <div
              className="artists"
              style={{
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <div
                className="user-image"
                style={{
                  backgroundImage: !media.eth
                    ? media.Artist && media.Artist.imageURL && media.Artist.imageURL !== ""
                      ? `url(${media.Artist.imageURL})`
                      : "none"
                    : media.randomAvatar
                      ? `url(${media.randomAvatar})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!media.eth) {
                    if (media.Artist && media.Artist.id && media.Artist.id !== "") {
                      history.push(`/profile/${media.Artist.id}`);
                    }
                  } else if (media.owner && media.owner !== "" && media.owner !== "Error") {
                    history.push(
                      `/profile/${media.owner.includes("@") ? media.owner.replace("@", "") : media.owner}?eth`
                    );
                  }
                }}
              />
              {media.SavedCollabs && media.SavedCollabs.length > 0
                ? media.SavedCollabs.map((collaborator, index) =>
                  index < 2 ? (
                    <div
                      className="user-image"
                      style={{
                        backgroundImage:
                          collaborator.imageURL && collaborator.imageURL !== ""
                            ? `url(${collaborator.imageURL})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      onClick={() => {
                        if (!media.eth && collaborator.id && collaborator.id !== "") {
                          history.push(`/profile/${collaborator.id}`);
                        }
                      }}
                    />
                  ) : null
                )
                : null}
              {media.SavedCollabs && media.SavedCollabs.length > 2 ? (
                <div className="user-counter">+{media.SavedCollabs.length - 2}</div>
              ) : null}
            </div>
            {/*--------------- SOCIAL ACTIONS ----------------*/}
            {/* {isSignedin && (
              <BookmarkLikeShare
                hideBookmark={!(media.Type === MediaType.Audio || media.Type === MediaType.Video)}
                setSelectedMedia={setMedia}
                selectedMedia={media}
                bookmarkType="playlist"
              />
            )} */}
          </div>
          {/*------- MEDIA TITLE --------*/}
          <div style={{ overflow: "hidden" }}>
            <div className={"title"} onClick={handleOpenMediaModal}>
              {media.MediaName ?? media.MediaSymbol ?? media.title ?? ""}
            </div>
          </div>
          {/*------- TAGS: TYPE AND CHAIN --------*/}
          <div className={"tags"}>
            {media.Type && Object.values(MediaType).includes(media.Type) ? (
              <div className={"tag"}>
                <img
                  src={require(`assets/mediaIcons/small/${media.Type === MediaType.DigitalArt
                    ? `digital_art`
                    : media.Type === MediaType.Video
                      ? `video`
                      : media.Type === MediaType.LiveVideo
                        ? `video_live`
                        : media.Type === MediaType.Audio
                          ? `audio`
                          : media.Type === MediaType.LiveAudio
                            ? `audio_live`
                            : media.Type === MediaType.Blog
                              ? `blog`
                              : `blog_snap`
                    }.png`)}
                  alt={media.Type}
                />
                {media.Type === MediaType.DigitalArt
                  ? `Digital Art`
                  : media.Type === MediaType.Video
                    ? `Video`
                    : media.Type === MediaType.LiveVideo
                      ? `Live Video`
                      : media.Type === MediaType.Audio
                        ? `Audio`
                        : media.Type === MediaType.LiveAudio
                          ? `Live Audio`
                          : media.Type === MediaType.Blog
                            ? `Blog`
                            : `Blog snap`}
              </div>
            ) : null}
            {!media.eth || media.tag ? (
              <div className={"tag chain"}>
                <img
                  src={require(`assets/tokenImages/${!media.eth
                    ? "PRIVI"
                    : media.tag && media.tag.toUpperCase().includes("WAX")
                      ? "WAX"
                      : "ETH"
                    }.png`)}
                  alt={
                    !media.eth
                      ? "PRIVI"
                      : media.tag && media.tag.toUpperCase().includes("WAX")
                        ? "WAX"
                        : "ETH"
                  }
                />
                {!media.eth
                  ? "PRIVI"
                  : media.tag && media.tag.toUpperCase().includes("WAX")
                    ? "WAX"
                    : `Ethereum: ${media.tag}`}
              </div>
            ) : null}
            <div className="price-box">
              <div className="price">
                👓 Views
                <div>{media.TotalViews || 0}</div>
              </div>
            </div>
          </div>
          {/*------- FOOTER: REWARDS BADGES AND PRICE --------*/}
          <div className="footer">
            <div className="rewards-container">
              {media.Badges && (
                <div className="rewards">
                  <div className="reward">
                    <div className="reward-image-container">
                      <div
                        className="reward-image"
                        style={{
                          backgroundImage:
                            media.Badges && media.Badges > 0
                              ? `url(${require(`assets/priviIcons/badges.png`)})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                    <span>{media.Badges ?? 0}</span>
                  </div>
                </div>
              )}
              {media.Rewards && (
                <div className="rewards">
                  <div className="reward">
                    <div className="reward-image-container">
                      <div
                        className="reward-image"
                        style={{
                          backgroundImage:
                            media.Rewards && media.Rewards > 0
                              ? `url(${require(`assets/priviIcons/rewards.png`)})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                    <span>{media.Rewards ?? 0}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="price">
              {media.price &&
                media.price !== "Not Available" &&
                media.price !== "Not available" &&
                media.price !== "" &&
                media.price !== "0" &&
                media.price !== 0
                ? parsePrice(media.price)
                : ""}
              {media.usdPrice && media.usdPrice !== "" && (
                <span>
                  {media.eth === false ? `($${parsePrice(media.usdPrice)})` : parsePrice(media.usdPrice)}
                </span>
              )}
            </div>
          </div>
          {isSignedin && media.ownedMedia && !media.Fraction && (
            <div className="fractionalise">
              <PrimaryButton size={"small"} onClick={handleOpenFractionModal}>
                Fractionalise
              </PrimaryButton>
            </div>
          )}
          {isFractionInOwnerProfile && (
            <div className="fractionalise">
              <PrimaryButton size={"small"}>Share: {media.Fraction.Fraction * 100}%</PrimaryButton>
            </div>
          )}
        </div>
        {isSignedin && media.ownedMedia && (
          <CreateFraction open={openFractionModal} handleClose={handleCloseFractionModal} media={media} />
        )}
      </div>
      <MediaDetailsModal
        open={openMediaModal}
        handleClose={handleCloseMediaModal}
        media={media}
        showMedia={displayMediaInfo}
      />
    </React.Fragment>
  );
}, arePropsEqual);

export default MediaCard;
