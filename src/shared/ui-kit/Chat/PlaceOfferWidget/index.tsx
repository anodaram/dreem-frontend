import React, { useEffect, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography, CardActions } from "@material-ui/core";

import Box from 'shared/ui-kit/Box';
import { Media } from "../types";
import CounterOfferModal from "shared/ui-kit/Modal/Modals/CounterOfferModal";
import axios from "axios";
import URL from "../../../functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { PrimaryButton } from "../../Buttons";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";
import { Avatar } from "shared/ui-kit/display";
import { StyledDivider } from "shared/ui-kit/Divider";
import { Color } from "shared/constants/const";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
    mediaAvatar: {
      width: 72,
      height: 72,
      border: "2px solid #FFFFFF",
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
    },
    heading: {
      fontSize: "22px",
      color: "#181818",
      fontWeight: "bold",
      margin: "16px 0px 32px 0px",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
    label: {
      color: "#000000",
      fontSize: "14px",
      fontWeight: "bold",
      paddingBottom: "8px",
      borderBottom: "1px dashed rgba(24, 24, 24, 0.3)",
      marginRight: "16px",
    },
    value: {
      color: "#707582",
      fontSize: "22px",
      paddingBottom: "11px",
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      marginRight: "16px",
    },
    button1: {
      background: "#181818",
      borderRadius: 6,
      height: "40px",
      color: "#FFFFFF",
      fontSize: "16px",
      fontWeight: "bold",
      letterSpacing: "-0.02em",
      textTransform: "initial",
      "&:hover": {
        opacity: 0.8,
        background: "#181818",
      },
    },
    button2: {
      background: "transparent",
      border: "2px solid #707582",
      borderRadius: 6,
      boxSizing: "border-box",
      height: "40px",
      color: "#151414",
      fontSize: "16px",
      fontWeight: "bold",
      letterSpacing: "-0.02em",
      width: "50%",
      textTransform: "initial",
    },
    buttonLayout: {
      padding: "16px 0px",
    },
    closeBtn: {
      position: "absolute",
      top: 24,
      right: 24,
    },
    rootDark: {
      "& div:first-child": {
        wordBreak: "break-all",
      },
      "& span": {
        fontWeight: "800 !important",
        border: "none !important",
        margin: "0px !important",
        padding: "0px !important",
        color: "white !important",
        fontFamily: "Agrandir",
        fontSize: "18px !important",
      },
      "& p": {
        border: "none !important",
        margin: "0px !important",
        padding: "0px !important",
        color: "white !important",
        fontFamily: "Agrandir",
        fontSize: "18px !important",
      },
      "& > button": {
        margin: "0px !important",
        width: "100%",
        "& *": {
          width: "100%",
          margin: "0px !important",
        },
      },
    },
    buttonLayoutDark: {
      padding: "0px",
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      margin: "32px 0px",
      "& *": {
        wordBreak: "inherit !important",
      },
    },
  })
);

type PlaceOfferWidgetProps = {
  media: Media;
  medias: any[] | [];
  setMedia: any;
  refreshMediasOnCommunity: any | null;
  typeChat: string;
  closeWidget: () => void;
  theme?: "dark" | "light";
};

const PlaceOfferWidget: React.FC<PlaceOfferWidgetProps> = ({
  media,
  setMedia,
  medias,
  refreshMediasOnCommunity,
  typeChat,
  closeWidget,
  theme,
}: PlaceOfferWidgetProps) => {
  const classes = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [mediaSelected, setMediaSelected] = useState<any>({});
  const [counterOfferModalOpen, setCounterOfferModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (media) {
      if (typeChat === "Community") {
        let selected = medias.find(mdia => media.media === mdia.media);
        setMediaSelected(selected);
        console.log(selected);
      } else {
        let selected = medias.find(mdia => media.media === mdia.id);
        setMediaSelected(selected);
        console.log(selected);
      }
    }
  }, [media]);

  const getLastCommunityOffer = () => {
    if (media && media.oldOffers && media.oldOffers.length > 0) {
      let i: number = media?.oldOffers.length || 1;
      let found: boolean = false;
      while (!found) {
        if (
          media.oldOffers[i] &&
          media.oldOffers[i].from &&
          media.oldOffers[i].from.toLowerCase() === "community"
        ) {
          found = true;
          return media.oldOffers[i].offer + "%";
        }
        if (i === 0) {
          found = true;
          return "---";
        } else {
          i--;
        }
      }
    } else {
      return "---";
    }
  };

  const getLastMediaOffer = () => {
    if (media && media.oldOffers && media.oldOffers.length > 0) {
      let i: number = media?.oldOffers.length || 1;
      let found: boolean = false;
      while (!found) {
        if (
          media.oldOffers[i] &&
          media.oldOffers[i].from &&
          media.oldOffers[i].from.toLowerCase() === "media"
        ) {
          found = true;
          return media.oldOffers[i].offer + "%";
        }
        if (i === 0) {
          found = true;
          return "---";
        } else {
          i--;
        }
      }
    } else {
      return "---";
    }
  };

  const declineOffer = typeOfChat => {
    axios
      .get(`${URL()}/mediaOnCommunity/decline/${media.id}/${typeOfChat}/${userSelector.id}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setMedia(resp.data);
        } else {
        }
      })
      .catch(error => {});
  };

  const acceptOffer = typeOfChat => {
    axios
      .get(`${URL()}/mediaOnCommunity/accept/${media.id}/${typeOfChat}/${userSelector.id}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setMedia(resp.data);
        } else {
        }
      })
      .catch(error => {});
  };

  if (!media || !mediaSelected) return null;
  return (
    <>
      <SvgIcon className={classes.closeBtn} onClick={closeWidget}>
        <CloseSolid />
      </SvgIcon>
      <div className={theme && theme === "dark" ? classes.rootDark : classes.root}>
        {typeChat === "Community" ? (
          <Box display="flex" alignItems="center">
            <Avatar className={classes.mediaAvatar} url={mediaSelected.mediaUrl} size="medium" />{" "}
            <Box ml={2} fontFamily="Agrandir GrandLight">
              {mediaSelected.media}
            </Box>
          </Box>
        ) : (
          <Typography variant="subtitle1" gutterBottom className={classes.heading}>
            {media.CommunityName}
          </Typography>
        )}

        {theme && theme === "dark" && (
          <Box width="100%">
            <StyledDivider color={Color.White} type="solid" margin={4} />
          </Box>
        )}
        <Box
          display="flex"
          flexDirection={theme && theme === "dark" ? "row" : "column"}
          width="100%"
          justifyContent={theme && theme === "dark" ? "space-between" : "flex-start"}
          mb={theme && theme === "dark" ? 4 : 0}
        >
          <Typography variant="caption" gutterBottom className={classes.label}>
            Your initial Offer
          </Typography>
          <Typography variant="body1" gutterBottom className={classes.value}>
            {media.oldOffers && media.oldOffers.length > 0 ? (
              <>{media.oldOffers[0].offer}%</>
            ) : media.currentOffer && media.currentOffer.offer ? (
              <>{media.currentOffer.offer}%</>
            ) : (
              "---"
            )}
          </Typography>
        </Box>

        {typeChat === "Media" ? (
          <>
            <Typography variant="caption" gutterBottom className={classes.label}>
              Community Offer
            </Typography>
            <Typography variant="body1" gutterBottom className={classes.value}>
              {media.currentOffer &&
              media.currentOffer.offer &&
              media.currentOffer.from &&
              media.currentOffer.from.toLowerCase() === "community" ? (
                <>{media.currentOffer.offer}%</>
              ) : (
                getLastCommunityOffer()
              )}
            </Typography>
          </>
        ) : (
          <Box
            display="flex"
            flexDirection={theme && theme === "dark" ? "row" : "column"}
            width="100%"
            justifyContent={theme && theme === "dark" ? "space-between" : "flex-start"}
            mb={theme && theme === "dark" ? 4 : 0}
          >
            <Typography variant="caption" gutterBottom className={classes.label}>
              Media Offer
            </Typography>
            <Typography variant="body1" gutterBottom className={classes.value}>
              {media.currentOffer &&
              media.currentOffer.offer &&
              media.currentOffer.from &&
              media.currentOffer.from.toLowerCase() === "media" ? (
                <>{media.currentOffer.offer}%</>
              ) : (
                getLastMediaOffer()
              )}
            </Typography>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection={theme && theme === "dark" ? "row" : "column"}
          width="100%"
          justifyContent={theme && theme === "dark" ? "space-between" : "flex-start"}
          mb={theme && theme === "dark" ? 4 : 0}
        >
          <Typography variant="caption" gutterBottom className={classes.label}>
            {media.currentOffer &&
            media.currentOffer.offer &&
            media.currentOffer.status &&
            media.currentOffer.status.toLowerCase() === "accepted"
              ? "Accepted"
              : "Current"}
            Offer
          </Typography>
          <Typography variant="body1" gutterBottom className={classes.value}>
            {media.currentOffer && media.currentOffer.offer ? <>{media.currentOffer.offer}%</> : "---"}
          </Typography>
        </Box>

        {(typeChat === "Community" &&
          media.currentOffer &&
          media.currentOffer.from === "Media" &&
          media.currentOffer.status &&
          media.currentOffer.status.toLowerCase() === "pending") ||
        (typeChat === "Media" &&
          media.currentOffer &&
          media.currentOffer.from === "Community" &&
          media.currentOffer.status &&
          media.currentOffer.status.toLowerCase() === "pending") ? (
          <CardActions
            className={theme && theme === "dark" ? classes.buttonLayoutDark : classes.buttonLayout}
          >
            {theme && theme === "dark" ? (
              <DAOButton onClick={() => declineOffer(typeChat)}>Decline </DAOButton>
            ) : (
              <PrimaryButton size="medium" onClick={() => declineOffer(typeChat)}>
                Decline
              </PrimaryButton>
            )}
            {theme && theme === "dark" ? (
              <DAOButton onClick={() => acceptOffer(typeChat)}>Accept</DAOButton>
            ) : (
              <PrimaryButton size="medium" onClick={() => acceptOffer(typeChat)}>
                Accept
              </PrimaryButton>
            )}
          </CardActions>
        ) : null}

        {(media && (!media.currentOffer || media.currentOffer === {})) ||
        (media && media.currentOffer && media.currentOffer.status === "Declined") ? (
          theme && theme === "dark" ? (
            <DAOButton onClick={() => setCounterOfferModalOpen(true)}>Place Counter offer</DAOButton>
          ) : (
            <PrimaryButton size="medium" onClick={() => setCounterOfferModalOpen(true)}>
              Place Counter offer
            </PrimaryButton>
          )
        ) : null}

        <CounterOfferModal
          open={counterOfferModalOpen}
          onClose={() => {
            setCounterOfferModalOpen(false);
            //select the media selected updated
          }}
          selectedMedia={media}
          fromType={typeChat}
          setMedia={mdia => setMedia(mdia)}
          theme={theme}
        />
      </div>
    </>
  );
};

export default PlaceOfferWidget;
