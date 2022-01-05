import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import SvgIcon from "@material-ui/core/SvgIcon";
import { TwitterShareButton, TwitterIcon } from 'react-share';

import { ReactComponent as ShareAltSolid } from "assets/icons/share-alt-solid.svg"
import { ReactComponent as HeartSolid } from "assets/icons/heart-solid.svg";
import { ReactComponent as EllipsisVSolid } from "assets/icons/ellipsis-v-solid.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    borderRadius: 15,
    background: '#e3e8ef',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    // backgroundSize: "auto",
    clipPath: 'polygon(50% 0%, 78% 25%, 78% 75%, 50% 100%, 22% 75%, 22% 25%)',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  header: {
    textAlign: 'center',
  },
  content: {
    marginInline: '30px',
  },
}));

export default function RecipeReviewCard(props: any) {
  const { icon, title, subtitle, image, imageTooltip, text } = props;
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.header}
        avatar={icon}
        action={
          <IconButton aria-label="settings">
            <SvgIcon>
              <EllipsisVSolid />
            </SvgIcon>
          </IconButton>
        }
        title={title}
        subheader={subtitle}
      />
      <CardMedia className={classes.media} image={image} title={imageTooltip} />
      <CardContent className={classes.content}>{text}</CardContent>
      <CardActions disableSpacing style={{ marginLeft: '50%' }}>
        <IconButton aria-label="add to favorites">
          <SvgIcon>
            <HeartSolid />
          </SvgIcon>
        </IconButton>
        <IconButton aria-label="share">
          <SvgIcon htmlColor={"white"}>
            <ShareAltSolid />
          </SvgIcon>
        </IconButton>
        <IconButton aria-label="twitter">
          <TwitterShareButton
            title={"Check out this PRIVI Badge!" + "\n\n" + title + "\n" + subtitle + "\n\n"}
            url={window.location.href}
            hashtags={["PRIVI"]}
          >
            <TwitterIcon size={32} style={{ marginRight: 3 }} round />
          </TwitterShareButton>
        </IconButton>
      </CardActions>
    </Card>
  );
}
