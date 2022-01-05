import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Badge, MasnoryCard, Text } from "./AcquisitionCard.styles";
import Box from "shared/ui-kit/Box";
import { Avatar, Color, FontSize, Gradient, Header5, HeaderBold5, StyledDivider } from "shared/ui-kit";
import { getMedia } from "shared/services/API";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import URL from "shared/functions/getURL";

export enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const useAcquistitionCardStyles = makeStyles(() => ({
  container: {
    backgroundColor: "white",
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: 20,
    overflow: "hidden",
    minWidth: 180,
    height: "fit-content",
    cursor: "pointer",
  },
  badgeContainer: {
    background: Gradient.Magenta,
    padding: "4px 8px",
    color: Color.White,
    fontWeight: 800,
    fontSize: FontSize.S,
    borderRadius: 36,
    "& + &": {
      marginLeft: 8,
    },
  },
  userAvatarContainer: {
    "& img + img": {
      marginLeft: -12,
    },
  },
  typeContainer: {
    position: "relative",
    width: 24,
    height: 24,
    borderRadius: "100%",
    background: Color.White,
    boxShadow: "0px 2.04215px 8.16862px rgba(0, 0, 0, 0.12)",
    "& + &": {
      marginLeft: 8,
    },
  },
  badgeShadow: {
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },
}));

const AcquisitionCard = ({ data }) => {
  const { convertTokenToUSD } = useTokenConversion();

  const users = useSelector((state: RootState) => state.usersInfoList);
  const classes = useAcquistitionCardStyles();

  const [media, setMedia] = useState<any>({});
  const [creator, setCreator] = useState<any>({});

  useEffect(() => {
    if (data.Proposal?.MediaSymbol) {
      getMedia(data?.Proposal?.MediaSymbol, "privi").then(res => {
        if (res.success) {
          let m = res.data;
          setMedia(m);
        }
      });
    }
  }, [data]);

  useEffect(() => {
    if (data.ProposalCreator && users) {
      const foundUser = users.find(u => u.address === data.ProposalCreator);
      if (foundUser) setCreator(foundUser);
    }
  }, [data.ProposalCreator, users]);

  return (
    <MasnoryCard>
      <Box display="flex" flexDirection="column" className={classes.container}>
        <Box position="relative" minHeight={80} style={{ height: 0, paddingBottom: "66%" }}>
          <Box position="absolute" top={0} left={0} right={0} bottom={0} overflow="hidden">
            <img
              src={media?.Url ?? media?.url ?? ""}
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Box position="absolute" display="flex" flexDirection="row" right={16} top={16}>
            {media?.Private && <Box className={classes.badgeContainer}>Private</Box>}
            {media?.LimitedEdition && <Box className={classes.badgeContainer}>Limited Edition</Box>}
          </Box>
        </Box>
        <Box position="relative" display="flex" flexDirection="column" flex={1}>
          <Box
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            top={-16}
            paddingLeft={2}
            paddingRight={2}
          >
            <Box className={classes.userAvatarContainer}>
              {creator && (
                <Avatar
                  noBorder
                  size="small"
                  url={
                    creator?.imageURL ??
                    creator?.imageUrl ??
                    getRandomAvatarForUserIdWithMemoization(data.ProposalCreator)
                  }
                  alt="proposer"
                />
              )}
            </Box>
            <Box display="flex" flexDirection="row">
              {media?.Type && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={classes.typeContainer}
                >
                  <img
                    src={require(`assets/mediaIcons/small/${
                      media?.Type === MediaType.Video
                        ? "video"
                        : media?.Type === MediaType.Audio
                        ? "audio"
                        : media?.Type === MediaType.LiveAudio
                        ? "audio_live"
                        : media?.Type === MediaType.Blog
                        ? "blog"
                        : media?.Type === MediaType.BlogSnap
                        ? "blog_snap"
                        : media?.Type === MediaType.DigitalArt
                        ? "digital_art"
                        : "video_live"
                    }.png`)}
                    alt="type"
                    width="50%"
                    height="50%"
                  />
                </Box>
              )}{" "}
              {media?.BlockchainNetwork && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={classes.typeContainer}
                >
                  <img
                    src={require(`assets/tokenImages/${
                      media?.BlockchainNetwork.toUpperCase().includes("ETH")
                        ? "ETH"
                        : media?.BlockchainNetwork.toUpperCase().includes("SUBSTRATE")
                        ? "SUBSTRATE"
                        : "PRIVI"
                    }.png`)}
                    alt="type"
                    width="50%"
                    height="50%"
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Box padding={2} width="100%" height="100%">
            <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2}>
              <Header5 noMargin>❤️ {media?.TotalLikes ?? 0}</Header5>
              <Header5 noMargin>👀 {media?.TotalViews ?? 0}</Header5>
            </Box>
            <StyledDivider type="solid" margin={3} />
            <HeaderBold5>{media?.MediaName ?? ""}</HeaderBold5>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
              {media?.ViewConditions?.TokenReward && (
                <Box
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width={40}
                  height={40}
                  bgcolor={Color.Black}
                  borderRadius="100%"
                >
                  <img
                    src={`${URL()}/wallet/getTokenPhoto/${media.ViewConditions.TokenReward}`}
                    width="50%"
                    height="50%"
                  />
                  <Box position="absolute" right={-8}>
                    <Badge className={classes.badgeShadow} bgcolor={Color.White} color={Color.GrayDark}>
                      1
                    </Badge>
                  </Box>
                </Box>
              )}
              <Box
                display="flex"
                flexDirection="column"
                alignItems={media?.ViewConditions?.TokenReward ? "flex-end" : "flex-start"}
              >
                <Header5>{`${data?.Proposal?.TokenSymbol ?? "PRIVI"} ${
                  data?.Proposal?.Amount ?? 0
                }`}</Header5>
                <Text size={FontSize.M}>{`($${convertTokenToUSD(
                  data?.Proposal?.TokenSymbol ?? "PRIVI",
                  data?.Proposal?.Amount ?? 0
                )})`}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MasnoryCard>
  );
};

export default AcquisitionCard;
