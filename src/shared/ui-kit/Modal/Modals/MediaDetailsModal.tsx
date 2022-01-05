import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Modal } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import { useAuth } from "shared/contexts/AuthContext";
import URL from "shared/functions/getURL";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors";
import MainPageContext from "shared/contexts/MediaPageContext";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

import { mediaDetailModalStyles } from "./MediaDetailsModal.styles";
import Box from 'shared/ui-kit/Box';

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const MediaDetailsModal = (props: any) => {
  const { isSignedin } = useAuth();
  const user = useTypedSelector(getUser);
  const users = useSelector((state: RootState) => state.usersInfoList);
  const classes = mediaDetailModalStyles();

  const { setSelectedMedia } = useContext(MainPageContext);
  const [media, setMedia] = React.useState<any>({});

  const [mediaRatings, setRatings] = React.useState([
    {
      key: "like",
      feedback: "I like it",
      myRate: 0,
      average: 0,
    },
    {
      key: "beautiful",
      feedback: "Beautiful",
      myRate: 0,
      average: 0,
    },
    {
      key: "buy",
      feedback: "A must buy",
      myRate: 0,
      average: 0,
    },
    {
      key: "priced",
      feedback: "Over priced",
      myRate: 0,
      average: 0,
    },
    {
      key: "dontLike",
      feedback: "Don't like it",
      myRate: 0,
      average: 0,
    },
    {
      key: "innovative",
      feedback: "Innovative",
      myRate: 0,
      average: 0,
    },
  ]);

  useEffect(() => {
    if (props.media) {
      let userFound = users.find(
        usr => usr.id === props.media.CreatorAddress || usr.address === props.media.CreatorAddress
      );

      let urlPhoto: string = "";

      if (userFound && userFound.url && userFound.url !== "") {
        urlPhoto = userFound.url;
      } else {
        urlPhoto = "";
      }

      setMedia({
        ...props.media,
        creatorUrl: urlPhoto,
      });
      if (props.media.Rating) {
        handleRatings(props.media.Rating);
      }

      //console.log(props.media, props.media.CreatorAddress);
    }
  }, [props.media]);

  const handleRatings = ratings => {
    let rates = [...mediaRatings];
    const count = ratings.length;

    const sumLike = ratings.reduce((prev, current) => (prev + current.like ? current.like : 0), 0);
    const sumBeautiful = ratings.reduce(
      (prev, current) => (prev + current.beautiful ? current.beautiful : 0),
      0
    );
    const sumBuy = ratings.reduce((prev, current) => (prev + current.buy ? current.buy : 0), 0);
    const sumPriced = ratings.reduce((prev, current) => (prev + current.priced ? current.priced : 0), 0);
    const sumDontLike = ratings.reduce(
      (prev, current) => (prev + current.dontLike ? current.dontLike : 0),
      0
    );
    const sumInnovative = ratings.reduce(
      (prev, current) => (prev + current.innovative ? current.innovative : 0),
      0
    );

    rates[0].average = sumLike / count;
    rates[1].average = sumBeautiful / count;
    rates[2].average = sumBuy / count;
    rates[3].average = sumPriced / count;
    rates[4].average = sumDontLike / count;
    rates[5].average = sumInnovative / count;

    // My rate
    const myRate = ratings.filter(item => item.userId === user.id)[0];
    if (myRate) {
      rates[0].myRate = myRate.like ? myRate.like : rates[0].myRate;
      rates[1].myRate = myRate.beautiful ? myRate.beautiful : rates[1].myRate;
      rates[2].myRate = myRate.buy ? myRate.buy : rates[2].myRate;
      rates[3].myRate = myRate.priced ? myRate.priced : rates[3].myRate;
      rates[4].myRate = myRate.dontLike ? myRate.dontLike : rates[4].myRate;
      rates[5].myRate = myRate.innovative ? myRate.innovative : rates[5].myRate;
    }
    setRatings([...rates]);
    setSelectedMedia({ ...media, Rating: rates });
  };

  const rateMedia = (rating, newValue) => {
    const ratingType = rating.key;
    if (newValue >= 0) {
      axios
        .post(`${URL()}/media/rateMedia`, {
          mediaId: props.media.MediaSymbol,
          mediaType: props.media.Type,
          mediaTag: props.media.tag ?? "privi",
          userId: user.id,
          ratingType,
          ratingValue: newValue,
        })
        .then(response => {
          if (response.data.ratings) {
            handleRatings(response.data.ratings);
          }
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <Modal open={props.open} onClose={props.handleClose} className={classes.mediaDetailsModalContainer}>
      <Box className={classes.modalContents}>
        <Box className={classes.header}>
          <Box>Media Details</Box>
          <Box className={classes.exit} onClick={props.handleClose}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </Box>
        </Box>
        <Box className={classes.userBox}>
          <Box>
            <Box>Creator</Box>
            <Box className={classes.creatorBox}>
              <Box
                className={classes.avatarBox}
                style={{
                  backgroundImage: !media.eth
                    ? media.creatorUrl
                      ? `url(${media.creatorUrl})`
                      : "none"
                    : media.randomAvatar
                    ? `url(${media.randomAvatar})`
                    : "none",
                  // media && media.CreatorId
                  // ? `url(${URL()}/user/getPhoto/${media.CreatorId})`
                  // : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
                }}
              />
              <Box ml={2}>
                <Box className={classes.name}>{media.creator}</Box>
                <Box className={classes.codeBox}>{media.creator}</Box>
              </Box>
            </Box>
          </Box>
          {media.owner && (
            <Box ml={4}>
              <Box>Owners</Box>
              <Box className={classes.creatorBox}>
                <Box className={classes.ownerBox}>
                  <Box
                    className={classes.avatarBox}
                    style={{
                      backgroundImage:
                        media.owner && media.owner.url
                          ? `url(${media.owner.url}?${Date.now()})`
                          : `url(${getRandomAvatar()})`,
                    }}
                  />
                </Box>
                <Box className={classes.name} ml={1}>
                  {media.owner}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box className={classes.descriptionBox}>
          <Box height={1}>
            {!media.eth ? (
              (media.Type === MediaType.Audio ||
                media.Type === MediaType.Video ||
                media.Type === MediaType.Blog ||
                media.Type === MediaType.BlogSnap) &&
              media.HasPhoto ? (
                <img
                  src={`${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")}`}
                  alt={media.MediaSymbol}
                />
              ) : media.Type === MediaType.LiveAudio ? (
                <img
                  src={
                    media.ImageUrl
                      ? media.ImageUrl
                      : new Date(media.Date).getTime() >= new Date().getTime()
                      ? `${require("assets/backgrounds/audio_live_started.png")}`
                      : `${require("assets/backgrounds/audio_live.png")}`
                  }
                  alt={""}
                />
              ) : media.Type === MediaType.LiveVideo ? (
                <img
                  src={
                    media.ImageUrl
                      ? media.ImageUrl
                      : new Date(media.StartedTime).getTime() >= new Date().getTime()
                      ? `${require("assets/backgrounds/video_live_started.png")}`
                      : `${require("assets/backgrounds/video_live.png")}`
                  }
                  alt={""}
                  className={"video-thumbnail"}
                />
              ) : media.Type === MediaType.Video ? (
                <img
                  src={
                    media.ImageUrl
                      ? media.ImageUrl
                      : new Date(media.StartedTime).getTime() >= new Date().getTime()
                      ? `${require("assets/backgrounds/video.png")}`
                      : `${require("assets/backgrounds/video.png")}`
                  }
                  alt={""}
                  className={"video-thumbnail"}
                />
              ) : media.Type === MediaType.Blog ? (
                <img
                  src={
                    media.ImageUrl
                      ? media.ImageUrl
                      : new Date(media.StartedTime).getTime() >= new Date().getTime()
                      ? `${require("assets/backgrounds/blog.png")}`
                      : `${require("assets/backgrounds/blog.png")}`
                  }
                  alt={""}
                  className={"video-thumbnail"}
                />
              ) : media.Type === MediaType.BlogSnap ? (
                <img
                  src={
                    media.ImageUrl
                      ? media.ImageUrl
                      : new Date(media.StartedTime).getTime() >= new Date().getTime()
                      ? `${require("assets/backgrounds/blog_snap.png")}`
                      : `${require("assets/backgrounds/blog_snap.png")}`
                  }
                  alt={""}
                  className={"video-thumbnail"}
                />
              ) : media.Type === MediaType.DigitalArt ? (
                <img
                  src={`${URL()}/media/getDigitalArt/${media.MediaSymbol.replace(/\s/g, "")}`}
                  alt={media.MediaSymbol}
                />
              ) : null
            ) : media.Url ? (
              media.Url.indexOf("mp4") === -1 ? (
                <img alt={media.MediaSymbol} src={media.Url} />
              ) : (
                <video src={media.Url} autoPlay loop muted />
              )
            ) : null}
          </Box>
          <Box ml={4}>
            <Box fontSize="h6.fontSize" my={2}>
              {media.title || ""}
            </Box>
            <Box fontSize="subtitle1.fontSize" className={classes.description}>
              {media.description || ""}
            </Box>
            <Box className={classes.tagContainer}>
              {media.tag && (
                <Box className={classes.tagBox} mr={1}>
                  {media.tag}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box className={classes.likeContainer}>
          <Box className={classes.likeBox}>
            <Box className={classes.likeItem}>
              <Box mb={2} className={classes.name}>
                💜 Likes
              </Box>
              <Box className={classes.valueBox}>{media.Likes ? media.Likes.length : 0}</Box>
            </Box>
            <Box className={classes.likeItemBorder}>
              <Box mb={2} className={classes.name}>
                🚀 Shares
              </Box>
              <Box className={classes.valueBox}>{media.Shares ? media.Shares.length : 0}</Box>
            </Box>
            <Box className={classes.likeItemBorder}>
              <Box mb={2} className={classes.name}>
                👓 Views
              </Box>
              <Box className={classes.valueBox}>{media.TotalViews || 0}</Box>
            </Box>
          </Box>
          <Box mt={2}>
            <Box mb={2} className={classes.name}>
              ⭐ Rating ({media.Rating ? media.Rating.length : 0})
            </Box>
            <Box className={classes.ratingBox}>
              {mediaRatings.map((rating, index) => (
                <Box width={1} key={`rating_${index}`}>
                  <Box className={classes.feedBack}>
                    <Box className={classes.valueBox}>{rating.average}</Box>
                    <span>{rating.feedback}</span>
                  </Box>
                  <Rating
                    disabled={!isSignedin}
                    name={`rating - ${index}`}
                    value={isSignedin ? rating.myRate : rating.average}
                    icon={<div className={classes.rateIcon} />}
                    emptyIcon={<div className={classes.emptyRateIcon} />}
                    onChange={(_, newValue) => {
                      if (isSignedin) {
                        rateMedia(rating, newValue);
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box className={classes.likeContainer}>
          <Box className={classes.ratingBox} mt={1}>
            <Box>
              <Box className={classes.name}>💰 Price</Box>
              <Box mt={2} className={classes.valueBox}>
                {media.RecordToken || "ETH"}
              </Box>
              <Box className={classes.name}>{media.price ? `(${media.price})` : ""}</Box>
            </Box>
            <Box ml={6} style={{ borderLeft: "1px solid #EFF2F8" }} pl={4}>
              <Box className={classes.name}>📈 Shares</Box>
              <Box className={classes.rolaytyBox}>
                <Box mr={4}>
                  <Box className={classes.valueBox}>{media.Royalty || 0}%</Box>
                  <Box className={classes.name}>Royalty</Box>
                </Box>
                <Box mr={4}>
                  <Box className={classes.valueBox}>0%</Box>
                  <Box className={classes.name}>Investor Share</Box>
                </Box>
                <Box>
                  <Box className={classes.valueBox}>0%</Box>
                  <Box className={classes.name}>Sharing Share</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={classes.buttonBox} onClick={props.showMedia}>
          View Media
        </Box>
      </Box>
    </Modal>
  );
};

export default MediaDetailsModal;
