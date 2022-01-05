import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, CardHeader } from "@material-ui/core";
import { Media } from "../types";
import Moment from "react-moment";
import Box from "shared/ui-kit/Box";
import { Skeleton } from "@material-ui/lab";

type StyleProps = {
  selected: boolean;
};

const useStyles = makeStyles({
  root: {
    padding: "16px 0px",
    cursor: "pointer",
    background: (props: StyleProps) => (props.selected ? "#EFF2F8" : "transparent"),
  },
  mediaAvatar: {
    width: 48,
    height: 48,
  },
  content: {
    width: "calc(100% - 64px)",
  },
  mediaTitle: {
    fontSize: "14px",
    color: "#181818",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  mediaUpdatedAt: {
    fontSize: "11px",
    color: "#707582",
  },
  rootDark: {
    background: "rgba(255, 255, 255, 0.12)",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    padding: "24px",
    "& *": {
      color: "white !important",
      fontFamily: "Agrandir",
    },
    "& span:first-child": {
      marginBottom: "8px",
      fontWeight: 800,
      fontSize: "18px",
    },
    "& span:last-child": {
      fontSize: "12px",
    },
  },
});

const MediaListItem: any = ({ media, selected, setSelectedMedia, openChat, typeChat, theme }) => {
  const classes = useStyles({ selected });

  const MomentFromNow = () => {
    return <Moment fromNow>{media.chat.lastMessageDate}</Moment>;
  };

  useEffect(() => {
    console.log(media);
  }, []);

  if (typeChat === "Media") {
    return (
      <CardHeader
        avatar={
          <Avatar className={classes.mediaAvatar} alt={media.CommunityName} src={`${media.communityUrl}`} />
        } //
        title={media.CommunityName}
        subheader={media.chat && media.chat.lastMessageDate ? <div>Last message: {MomentFromNow()}</div> : ""} //${diffTime(media.updatedAt)}
        classes={{
          root: theme && theme === "dark" ? classes.rootDark : classes.root,
          content: classes.content,
          title: classes.mediaTitle,
          subheader: classes.mediaUpdatedAt,
        }}
        onClick={openChat}
      />
    );
  } else if (typeChat === "Community") {
    if (theme && theme === "dark") {
      return (
        <Box display="flex" flexDirection="column" mb={3}>
          <Box color="white" fontSize="18px" mb={3}>
            {media.media}
          </Box>
          <CardHeader
            avatar={<Avatar className={classes.mediaAvatar} alt={media.media} src={media.mediaUrl} />}
            title={media?.chat?.admin?.name ?? <Skeleton width={120} animation="wave" />}
            subheader={
              media.chat && media.chat.lastMessageDate ? <div>Last message: {MomentFromNow()}</div> : ""
            } //${diffTime(media.updatedAt)}
            classes={{
              root: theme && theme === "dark" ? classes.rootDark : classes.root,
              content: classes.content,
              title: classes.mediaTitle,
              subheader: classes.mediaUpdatedAt,
            }}
            onClick={openChat}
          />
        </Box>
      );
    } else
      return (
        <CardHeader
          avatar={<Avatar className={classes.mediaAvatar} alt={media.media} src={media.mediaUrl} />}
          title={media.media}
          subheader={
            media.chat && media.chat.lastMessageDate ? <div>Last message: {MomentFromNow()}</div> : ""
          } //${diffTime(media.updatedAt)}
          classes={{
            root: theme && theme === "dark" ? classes.rootDark : classes.root,
            content: classes.content,
            title: classes.mediaTitle,
            subheader: classes.mediaUpdatedAt,
          }}
          onClick={openChat}
        />
      );
  }
};

export default MediaListItem;
